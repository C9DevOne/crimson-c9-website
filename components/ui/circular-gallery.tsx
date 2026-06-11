"use client";

import {
  Camera,
  Mesh,
  OGLRenderingContext,
  Plane,
  Program,
  Renderer,
  Texture,
  Transform,
} from "ogl";
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Link, Music } from "lucide-react";

const debounce = <Args extends unknown[]>(func: (...args: Args) => void, wait: number) => {
  let timeout: ReturnType<typeof setTimeout>;
  return (...args: Args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

const lerp = (p1: number, p2: number, t: number) => p1 + (p2 - p1) * t;

export interface GalleryItem {
  image: string;
  text: string;
  subtitle?: string;
  description?: string;
  instagram?: string;
  soundcloud?: string;
}

interface MediaParams {
  geometry: Plane;
  gl: OGLRenderingContext;
  image: string;
  index: number;
  length: number;
  renderer: Renderer;
  scene: Transform;
  screen: { width: number; height: number };
  text: string;
  viewport: { width: number; height: number };
  bend: number;
  textColor: string;
  borderRadius?: number;
}

class Media {
  extra = 0;
  scale = 1;
  padding = 2;
  width = 0;
  widthTotal = 0;
  x = 0;
  speed = 0;
  isBefore = false;
  isAfter = false;
  plane!: Mesh;
  program!: Program;

  geometry: Plane;
  gl: OGLRenderingContext;
  image: string;
  index: number;
  length: number;
  scene: Transform;
  screen: { width: number; height: number };
  text: string;
  viewport: { width: number; height: number };
  bend: number;
  textColor: string;
  borderRadius: number;

  constructor(p: MediaParams) {
    this.geometry = p.geometry;
    this.gl = p.gl;
    this.image = p.image;
    this.index = p.index;
    this.length = p.length;
    this.scene = p.scene;
    this.screen = p.screen;
    this.text = p.text;
    this.viewport = p.viewport;
    this.bend = p.bend;
    this.textColor = p.textColor;
    this.borderRadius = p.borderRadius ?? 0;

    this.createShader();
    this.createMesh();
    this.onResize();
  }

  createShader() {
    const texture = new Texture(this.gl, { generateMipmaps: true });
    this.program = new Program(this.gl, {
      depthTest: false,
      depthWrite: false,
      vertex: `
        precision highp float;
        attribute vec3 position;
        attribute vec2 uv;
        uniform mat4 modelViewMatrix;
        uniform mat4 projectionMatrix;
        uniform float uTime;
        uniform float uSpeed;
        varying vec2 vUv;
        void main() {
          vUv = uv;
          vec3 p = position;
          p.z = (sin(p.x * 4.0 + uTime) * 1.5 + cos(p.y * 2.0 + uTime) * 1.5) * (abs(uSpeed) * 0.5);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
        }
      `,
      fragment: `
        precision highp float;
        uniform vec2 uImageSizes;
        uniform vec2 uPlaneSizes;
        uniform sampler2D tMap;
        uniform float uBorderRadius;
        varying vec2 vUv;
        float roundedBoxSDF(vec2 p, vec2 b, float r) {
          vec2 d = abs(p) - b;
          return length(max(d, vec2(0.0))) + min(max(d.x, d.y), 0.0) - r;
        }
        void main() {
          vec2 ratio = vec2(
            min((uPlaneSizes.x / uPlaneSizes.y) / (uImageSizes.x / uImageSizes.y), 1.0),
            min((uPlaneSizes.y / uPlaneSizes.x) / (uImageSizes.y / uImageSizes.x), 1.0)
          );
          vec2 uv = vUv * ratio + (1.0 - ratio) * 0.5;
          vec4 color = texture2D(tMap, uv);
          float d = roundedBoxSDF(vUv - 0.5, vec2(0.5 - uBorderRadius), uBorderRadius);
          float alpha = 1.0 - smoothstep(-0.002, 0.002, d);
          gl_FragColor = vec4(color.rgb, alpha);
        }
      `,
      uniforms: {
        tMap: { value: texture },
        uPlaneSizes: { value: [0, 0] },
        uImageSizes: { value: [0, 0] },
        uSpeed: { value: 0 },
        uTime: { value: 100 * Math.random() },
        uBorderRadius: { value: this.borderRadius },
      },
      transparent: true,
    });

    if (typeof window !== "undefined") {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = this.image;
      img.onload = () => {
        texture.image = img;
        this.program.uniforms.uImageSizes.value = [img.naturalWidth, img.naturalHeight];
      };
    }
  }

  createMesh() {
    this.plane = new Mesh(this.gl, { geometry: this.geometry, program: this.program });
    this.plane.setParent(this.scene);
  }

  update(scroll: { current: number; last: number }, direction: "left" | "right") {
    this.plane.position.x = this.x - scroll.current - this.extra;
    const x = this.plane.position.x;
    const H = this.viewport.width / 2;

    if (this.bend === 0) {
      this.plane.position.y = 0;
      this.plane.rotation.z = 0;
    } else {
      const B_abs = Math.abs(this.bend);
      const R = (H * H + B_abs * B_abs) / (2 * B_abs);
      const effectiveX = Math.min(Math.abs(x), H);
      const arc = R - Math.sqrt(R * R - effectiveX * effectiveX);
      const angle = Math.sign(x) * Math.asin(effectiveX / R);
      this.plane.position.y = this.bend > 0 ? -arc : arc;
      this.plane.rotation.z = this.bend > 0 ? -angle : angle;
    }

    this.speed = scroll.current - scroll.last;
    this.program.uniforms.uTime.value += 0.04;
    this.program.uniforms.uSpeed.value = this.speed;

    const planeOffset = this.plane.scale.x / 2;
    const viewportOffset = this.viewport.width / 2;
    this.isBefore = this.plane.position.x + planeOffset < -viewportOffset;
    this.isAfter = this.plane.position.x - planeOffset > viewportOffset;

    if (direction === "right" && this.isBefore) {
      this.extra -= this.widthTotal;
      this.isBefore = this.isAfter = false;
    }
    if (direction === "left" && this.isAfter) {
      this.extra += this.widthTotal;
      this.isBefore = this.isAfter = false;
    }
  }

  onResize(sizes?: {
    screen?: { width: number; height: number };
    viewport?: { width: number; height: number };
  }) {
    if (sizes) {
      if (sizes.screen) this.screen = sizes.screen;
      if (sizes.viewport) {
        this.viewport = sizes.viewport;
        if (this.plane.program.uniforms.uViewportSizes) {
          this.plane.program.uniforms.uViewportSizes.value = [
            this.viewport.width,
            this.viewport.height,
          ];
        }
      }
    }
    this.scale = this.screen.height / 1500;
    this.plane.scale.y = (this.viewport.height * (1300 * this.scale)) / this.screen.height;
    this.plane.scale.x = (this.viewport.width * (1100 * this.scale)) / this.screen.width;
    this.plane.program.uniforms.uPlaneSizes.value = [this.plane.scale.x, this.plane.scale.y];
    this.padding = 3.0;
    this.width = this.plane.scale.x + this.padding;
    this.widthTotal = this.width * this.length;
    this.x = this.width * this.index;
  }
}

interface AppOptions {
  items: GalleryItem[];
  bend: number;
  textColor?: string;
  borderRadius?: number;
  scrollSpeed?: number;
  scrollEase?: number;
  onActiveIndexChange?: (index: number) => void;
}

class App {
  container: HTMLElement;
  scrollSpeed: number;
  scroll: { ease: number; current: number; target: number; last: number; position?: number };
  onCheckDebounce: (...args: unknown[]) => void;
  renderer: Renderer;
  gl: OGLRenderingContext;
  camera: Camera;
  scene: Transform;
  planeGeometry: Plane;
  mediasImages!: GalleryItem[];
  medias!: Media[];
  screen!: { width: number; height: number };
  viewport!: { width: number; height: number };
  isDown = false;
  start = 0;
  raf = 0;
  lastActiveIndex = -1;
  onActiveIndexChange?: (index: number) => void;

  boundOnResize!: () => void;
  boundOnWheel!: (e: WheelEvent & { wheelDelta?: number }) => void;
  boundOnTouchDown!: (e: TouchEvent | MouseEvent) => void;
  boundOnTouchMove!: (e: TouchEvent | MouseEvent) => void;
  boundOnTouchUp!: () => void;
  boundOnKeyDown!: (e: KeyboardEvent) => void;

  constructor(container: HTMLElement, opts: AppOptions) {
    if (typeof document !== "undefined") {
      document.documentElement.classList.remove("no-js");
    }
    this.container = container;
    this.scrollSpeed = opts.scrollSpeed ?? 2;
    this.scroll = { ease: opts.scrollEase ?? 0.05, current: 0, target: 0, last: 0 };
    this.onCheckDebounce = debounce(this.onCheck.bind(this), 200);
    this.onActiveIndexChange = opts.onActiveIndexChange;

    this.renderer = new Renderer({
      alpha: true,
      antialias: true,
      dpr: Math.min(typeof window !== "undefined" ? window.devicePixelRatio : 1, 2),
    });
    this.gl = this.renderer.gl;
    this.gl.clearColor(0, 0, 0, 0);
    this.container.appendChild(this.gl.canvas);

    this.camera = new Camera(this.gl);
    this.camera.fov = 45;
    this.camera.position.z = 20;

    this.scene = new Transform();
    this.onResize();

    this.planeGeometry = new Plane(this.gl, { heightSegments: 50, widthSegments: 100 });
    this.createMedias(opts.items, opts.bend, opts.textColor ?? "#ffffff", opts.borderRadius ?? 0);
    this.update();
    this.addEventListeners();
  }

  createMedias(items: GalleryItem[], bend = 1, textColor: string, borderRadius: number) {
    this.mediasImages = items.concat(items);
    this.medias = this.mediasImages.map(
      (data, index) =>
        new Media({
          geometry: this.planeGeometry,
          gl: this.gl,
          image: data.image,
          index,
          length: this.mediasImages.length,
          renderer: this.renderer,
          scene: this.scene,
          screen: this.screen,
          text: data.text || "",
          viewport: this.viewport,
          bend,
          textColor,
          borderRadius,
        }),
    );
  }

  onTouchDown(e: TouchEvent | MouseEvent) {
    this.isDown = true;
    this.scroll.position = this.scroll.current;
    this.start = "touches" in e ? e.touches[0].clientX : e.clientX;
  }

  onTouchMove(e: TouchEvent | MouseEvent) {
    if (!this.isDown) return;
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const distance = (this.start - clientX) * (this.scrollSpeed * 0.025);
    this.scroll.target = (this.scroll.position || 0) + distance;
  }

  onTouchUp() {
    this.isDown = false;
    this.onCheck();
  }

  step(direction: number) {
    if (!this.medias?.[0]) return;
    const width = this.medias[0].width;
    const currentSnapped = Math.round(this.scroll.target / width) * width;
    this.scroll.target = currentSnapped + direction * width;
  }

  onWheel(e: WheelEvent & { wheelDelta?: number }) {
    const delta = e.deltaY || e.wheelDelta || e.detail || 0;
    this.scroll.target += (delta > 0 ? this.scrollSpeed : -this.scrollSpeed) * 0.2;
    this.onCheckDebounce();
  }

  onCheck() {
    if (!this.medias?.[0]) return;
    const width = this.medias[0].width;
    const itemIndex = Math.round(Math.abs(this.scroll.target) / width);
    const item = width * itemIndex;
    this.scroll.target = this.scroll.target < 0 ? -item : item;
  }

  getActiveIndex() {
    if (!this.medias || this.medias.length === 0) return 0;
    let minDistance = Infinity;
    let activeIndex = 0;
    this.medias.forEach((media) => {
      const distance = Math.abs(media.plane.position.x);
      if (distance < minDistance) {
        minDistance = distance;
        activeIndex = media.index;
      }
    });
    const originalLength = this.mediasImages.length / 2;
    return activeIndex % originalLength;
  }

  onResize() {
    if (!this.container) return;
    this.screen = { width: this.container.clientWidth, height: this.container.clientHeight };
    this.renderer.setSize(this.screen.width, this.screen.height);
    this.camera.perspective({ aspect: this.screen.width / this.screen.height });
    const fov = (this.camera.fov * Math.PI) / 180;
    const height = 2 * Math.tan(fov / 2) * this.camera.position.z;
    this.viewport = { width: height * this.camera.aspect, height };
    if (this.medias) {
      this.medias.forEach((media) =>
        media.onResize({ screen: this.screen, viewport: this.viewport }),
      );
    }
  }

  update() {
    this.scroll.current = lerp(this.scroll.current, this.scroll.target, this.scroll.ease);
    const direction = this.scroll.current > this.scroll.last ? "right" : "left";
    if (this.medias) {
      this.medias.forEach((media) => media.update(this.scroll, direction));
    }
    this.renderer.render({ scene: this.scene, camera: this.camera });

    const activeIndex = this.getActiveIndex();
    if (activeIndex !== this.lastActiveIndex) {
      this.lastActiveIndex = activeIndex;
      this.onActiveIndexChange?.(activeIndex);
    }

    this.scroll.last = this.scroll.current;
    this.raf = window.requestAnimationFrame(this.update.bind(this));
  }

  addEventListeners() {
    this.boundOnResize = this.onResize.bind(this);
    this.boundOnWheel = this.onWheel.bind(this);
    this.boundOnTouchDown = this.onTouchDown.bind(this);
    this.boundOnTouchMove = this.onTouchMove.bind(this);
    this.boundOnTouchUp = this.onTouchUp.bind(this);
    this.boundOnKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        this.step(1);
      } else if (e.key === "ArrowLeft") {
        this.step(-1);
      }
    };

    if (typeof window !== "undefined") {
      window.addEventListener("resize", this.boundOnResize);
      window.addEventListener("wheel", this.boundOnWheel as EventListener, { passive: true });
      window.addEventListener("mousedown", this.boundOnTouchDown as EventListener);
      window.addEventListener("mousemove", this.boundOnTouchMove as EventListener);
      window.addEventListener("mouseup", this.boundOnTouchUp);
      window.addEventListener("touchstart", this.boundOnTouchDown as EventListener, {
        passive: true,
      });
      window.addEventListener("touchmove", this.boundOnTouchMove as EventListener, {
        passive: true,
      });
      window.addEventListener("touchend", this.boundOnTouchUp);
      window.addEventListener("keydown", this.boundOnKeyDown);
    }
  }

  destroy() {
    if (typeof window !== "undefined") {
      window.cancelAnimationFrame(this.raf);
      window.removeEventListener("resize", this.boundOnResize);
      window.removeEventListener("wheel", this.boundOnWheel as EventListener);
      window.removeEventListener("mousedown", this.boundOnTouchDown as EventListener);
      window.removeEventListener("mousemove", this.boundOnTouchMove as EventListener);
      window.removeEventListener("mouseup", this.boundOnTouchUp);
      window.removeEventListener("touchstart", this.boundOnTouchDown as EventListener);
      window.removeEventListener("touchmove", this.boundOnTouchMove as EventListener);
      window.removeEventListener("touchend", this.boundOnTouchUp);
      window.removeEventListener("keydown", this.boundOnKeyDown);
    }
    if (this.renderer?.gl?.canvas?.parentNode) {
      this.renderer.gl.canvas.parentNode.removeChild(this.renderer.gl.canvas);
    }
  }
}

interface CircularGalleryProps {
  items: GalleryItem[];
  bend?: number;
  textColor?: string;
  borderRadius?: number;
  scrollSpeed?: number;
  scrollEase?: number;
}

export default function CircularGallery({
  items,
  bend = 3,
  textColor = "#ffffff",
  borderRadius = 0.05,
  scrollSpeed = 2,
  scrollEase = 0.05,
}: CircularGalleryProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<App | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (!containerRef.current) return;

    const app = new App(containerRef.current, {
      items,
      bend,
      textColor,
      borderRadius,
      scrollSpeed,
      scrollEase,
      onActiveIndexChange: (idx) => {
        setActiveIndex(idx);
      },
    });

    appRef.current = app;

    return () => {
      app.destroy();
      appRef.current = null;
    };
  }, [items, bend, textColor, borderRadius, scrollSpeed, scrollEase]);

  const activeItem = items[activeIndex];

  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden">
      <div className="relative w-full flex-1">
        <div
          className="h-full w-full cursor-grab overflow-hidden active:cursor-grabbing"
          ref={containerRef}
        />
        <button
          onClick={() => appRef.current?.step(-1)}
          className="absolute top-1/2 left-4 z-10 flex h-12 w-12 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-white/10 bg-black/40 text-white backdrop-blur-md transition-all hover:scale-110 hover:bg-black/60 active:scale-95"
          aria-label="Previous image"
        >
          <ChevronLeft size={24} />
        </button>
        <button
          onClick={() => appRef.current?.step(1)}
          className="absolute top-1/2 right-4 z-10 flex h-12 w-12 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-white/10 bg-black/40 text-white backdrop-blur-md transition-all hover:scale-110 hover:bg-black/60 active:scale-95"
          aria-label="Next image"
        >
          <ChevronRight size={24} />
        </button>
      </div>
      {activeItem && <ActiveItemInfo activeItem={activeItem} />}
    </div>
  );
}

interface ActiveItemInfoProps {
  activeItem: GalleryItem;
}

export function ActiveItemInfo({ activeItem }: ActiveItemInfoProps) {
  return (
    <div className="w-full flex-shrink-0 border-t border-white/10 bg-black/40 py-6 backdrop-blur-md transition-all duration-500">
      <div className="mx-auto max-w-md px-6 text-center">
        <h2 className="text-xl font-bold tracking-widest text-white uppercase md:text-2xl">
          {activeItem.text}
        </h2>
        {activeItem.subtitle && (
          <p className="mt-1 text-xs font-bold tracking-widest text-red-500 uppercase">
            {activeItem.subtitle}
          </p>
        )}
        {activeItem.description && (
          <p className="mx-auto mt-2 max-w-xs text-xs leading-relaxed text-neutral-400">
            {activeItem.description}
          </p>
        )}
        {(activeItem.instagram || activeItem.soundcloud) && (
          <div className="mt-3 flex justify-center gap-3">
            {activeItem.instagram && (
              <a
                href={activeItem.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-400 transition-colors hover:text-white"
              >
                <Link size={14} />
              </a>
            )}
            {activeItem.soundcloud && (
              <a
                href={activeItem.soundcloud}
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-400 transition-colors hover:text-white"
              >
                <Music size={14} />
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
