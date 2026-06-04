"use client";

import { useEffect, useState, useRef, useMemo, useCallback } from "react";
import { motion, HTMLMotionProps } from "motion/react";

interface DecryptedTextProps extends HTMLMotionProps<"span"> {
  text: string;
  speed?: number;
  maxIterations?: number;
  sequential?: boolean;
  revealDirection?: "start" | "end" | "center";
  useOriginalCharsOnly?: boolean;
  characters?: string;
  className?: string;
  parentClassName?: string;
  encryptedClassName?: string;
  animateOn?: "view" | "hover" | "inViewHover" | "click";
  clickMode?: "once" | "toggle";
}

const DEFAULT_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*()_+";

function getShuffledText(
  originalText: string,
  revealedIndices: Set<number>,
  availableChars: string[],
) {
  return originalText
    .split("")
    .map((char, i) => {
      if (char === " ") return " ";
      if (revealedIndices.has(i)) return originalText[i];
      return availableChars[Math.floor(Math.random() * availableChars.length)];
    })
    .join("");
}

/**
 * A component that renders text with a decryption/scramble animation effect.
 *
 * @param text - The final text to display
 * @param speed - Animation speed in ms (default: 50)
 * @param maxIterations - Number of scramble iterations (default: 10)
 * @param sequential - Whether to reveal characters one by one (default: false)
 * @param revealDirection - Direction of revelation (default: "start")
 * @param useOriginalCharsOnly - Only use characters from the original text for scrambling (default: false)
 * @param characters - Set of characters to use for scrambling (default: alphanumeric + symbols)
 * @param className - Classes for revealed characters
 * @param parentClassName - Classes for the wrapper element
 * @param encryptedClassName - Classes for scrambled characters
 * @param animateOn - Trigger for the animation (default: "hover")
 * @param clickMode - Behavior when animateOn is "click" (default: "once")
 */
export default function DecryptedText({
  text,
  speed = 50,
  maxIterations = 10,
  sequential = false,
  revealDirection = "start",
  useOriginalCharsOnly = false,
  characters = DEFAULT_CHARS,
  className = "",
  parentClassName = "",
  encryptedClassName = "",
  animateOn = "hover",
  clickMode = "once",
  ...props
}: DecryptedTextProps) {
  const availableChars = useMemo(() => {
    return useOriginalCharsOnly
      ? Array.from(new Set(text.split(""))).filter((char) => char !== " ")
      : characters.split("");
  }, [useOriginalCharsOnly, text, characters]);

  const [isAnimating, setIsAnimating] = useState(false);
  const [isDecrypted, setIsDecrypted] = useState(animateOn !== "click");
  const [revealedIndices, setRevealedIndices] = useState<Set<number>>(new Set());
  const [displayText, setDisplayText] = useState(() =>
    animateOn === "click" ? getShuffledText(text, new Set(), availableChars) : text,
  );
  const [direction, setDirection] = useState<"forward" | "reverse">("forward");

  // Track previous props to reset state when they change (modern React pattern)
  const [prevProps, setPrevProps] = useState({ text, animateOn });

  if (text !== prevProps.text || animateOn !== prevProps.animateOn) {
    setPrevProps({ text, animateOn });
    setRevealedIndices(new Set());
    setDirection("forward");
    setIsAnimating(false);

    if (animateOn === "click") {
      setIsDecrypted(false);
      setDisplayText(getShuffledText(text, new Set(), availableChars));
    } else {
      setIsDecrypted(true);
      setDisplayText(text);
    }
  }

  const [hasAnimated, setHasAnimated] = useState(false);

  const containerRef = useRef<HTMLSpanElement>(null);
  const orderRef = useRef<number[]>([]);
  const pointerRef = useRef(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const computeOrder = useCallback(
    (len: number) => {
      const order: number[] = [];
      if (len <= 0) return order;
      if (revealDirection === "start") {
        for (let i = 0; i < len; i++) order.push(i);
        return order;
      }
      if (revealDirection === "end") {
        for (let i = len - 1; i >= 0; i--) order.push(i);
        return order;
      }
      // center
      const middle = Math.floor(len / 2);
      let offset = 0;
      while (order.length < len) {
        if (offset % 2 === 0) {
          const idx = middle + offset / 2;
          if (idx >= 0 && idx < len) order.push(idx);
        } else {
          const idx = middle - Math.ceil(offset / 2);
          if (idx >= 0 && idx < len) order.push(idx);
        }
        offset++;
      }
      return order.slice(0, len);
    },
    [revealDirection],
  );

  const fillAllIndices = useCallback(() => {
    const s = new Set<number>();
    for (let i = 0; i < text.length; i++) s.add(i);
    return s;
  }, [text]);

  const removeRandomIndices = useCallback((set: Set<number>, count: number) => {
    const arr = Array.from(set);
    for (let i = 0; i < count && arr.length > 0; i++) {
      const idx = Math.floor(Math.random() * arr.length);
      arr.splice(idx, 1);
    }
    return new Set(arr);
  }, []);

  const triggerDecrypt = useCallback(() => {
    if (sequential) {
      orderRef.current = computeOrder(text.length);
      pointerRef.current = 0;
      setRevealedIndices(new Set());
    } else {
      setRevealedIndices(new Set());
    }
    setDirection("forward");
    setIsAnimating(true);
  }, [sequential, computeOrder, text.length]);

  const triggerReverse = useCallback(() => {
    const allIndices = fillAllIndices();
    if (sequential) {
      orderRef.current = computeOrder(text.length).slice().reverse();
      pointerRef.current = 0;
      setRevealedIndices(allIndices);
      setDisplayText(getShuffledText(text, allIndices, availableChars));
    } else {
      setRevealedIndices(allIndices);
      setDisplayText(getShuffledText(text, allIndices, availableChars));
    }
    setDirection("reverse");
    setIsAnimating(true);
  }, [sequential, computeOrder, fillAllIndices, availableChars, text]);

  useEffect(() => {
    if (!isAnimating) return;

    let currentIteration = 0;

    const getNextIndex = (revealedSet: Set<number>) => {
      const textLength = text.length;
      switch (revealDirection) {
        case "start":
          return revealedSet.size;
        case "end":
          return textLength - 1 - revealedSet.size;
        case "center": {
          const middle = Math.floor(textLength / 2);
          const offset = Math.floor(revealedSet.size / 2);
          const nextIndex = revealedSet.size % 2 === 0 ? middle + offset : middle - offset - 1;

          if (nextIndex >= 0 && nextIndex < textLength && !revealedSet.has(nextIndex)) {
            return nextIndex;
          }

          for (let i = 0; i < textLength; i++) {
            if (!revealedSet.has(i)) return i;
          }
          return 0;
        }
        default:
          return revealedSet.size;
      }
    };

    intervalRef.current = setInterval(() => {
      setRevealedIndices((prevRevealed) => {
        if (sequential) {
          if (direction === "forward") {
            if (prevRevealed.size < text.length) {
              const nextIndex = getNextIndex(prevRevealed);
              const newRevealed = new Set(prevRevealed);
              newRevealed.add(nextIndex);
              setDisplayText(getShuffledText(text, newRevealed, availableChars));
              return newRevealed;
            } else {
              if (intervalRef.current) clearInterval(intervalRef.current);
              setIsAnimating(false);
              setIsDecrypted(true);
              return prevRevealed;
            }
          }
          if (direction === "reverse") {
            if (pointerRef.current < orderRef.current.length) {
              const idxToRemove = orderRef.current[pointerRef.current++];
              const newRevealed = new Set(prevRevealed);
              newRevealed.delete(idxToRemove);
              setDisplayText(getShuffledText(text, newRevealed, availableChars));
              if (newRevealed.size === 0) {
                if (intervalRef.current) clearInterval(intervalRef.current);
                setIsAnimating(false);
                setIsDecrypted(false);
              }
              return newRevealed;
            } else {
              if (intervalRef.current) clearInterval(intervalRef.current);
              setIsAnimating(false);
              setIsDecrypted(false);
              return prevRevealed;
            }
          }
        } else {
          if (direction === "forward") {
            setDisplayText(getShuffledText(text, prevRevealed, availableChars));
            currentIteration++;
            if (currentIteration >= maxIterations) {
              if (intervalRef.current) clearInterval(intervalRef.current);
              setIsAnimating(false);
              setDisplayText(text);
              setIsDecrypted(true);
            }
            return prevRevealed;
          }

          if (direction === "reverse") {
            let currentSet = prevRevealed;
            if (currentSet.size === 0) {
              currentSet = fillAllIndices();
            }
            const removeCount = Math.max(1, Math.ceil(text.length / Math.max(1, maxIterations)));
            const nextSet = removeRandomIndices(currentSet, removeCount);
            setDisplayText(getShuffledText(text, nextSet, availableChars));
            currentIteration++;
            if (nextSet.size === 0 || currentIteration >= maxIterations) {
              if (intervalRef.current) clearInterval(intervalRef.current);
              setIsAnimating(false);
              setIsDecrypted(false);
              setDisplayText(getShuffledText(text, new Set(), availableChars));
              return new Set();
            }
            return nextSet;
          }
        }
        return prevRevealed;
      });
    }, speed);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [
    isAnimating,
    text,
    speed,
    maxIterations,
    sequential,
    revealDirection,
    availableChars,
    direction,
    fillAllIndices,
    removeRandomIndices,
  ]);

  const handleClick = () => {
    if (animateOn !== "click") return;

    if (clickMode === "once") {
      if (isDecrypted) return;
      setDirection("forward");
      triggerDecrypt();
    }

    if (clickMode === "toggle") {
      if (isDecrypted) {
        triggerReverse();
      } else {
        setDirection("forward");
        triggerDecrypt();
      }
    }
  };

  const triggerHoverDecrypt = useCallback(() => {
    if (isAnimating) return;
    setRevealedIndices(new Set());
    setIsDecrypted(false);
    setDisplayText(text);
    setDirection("forward");
    setIsAnimating(true);
  }, [isAnimating, text]);

  const resetToPlainText = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setIsAnimating(false);
    setRevealedIndices(new Set());
    setDisplayText(text);
    setIsDecrypted(true);
    setDirection("forward");
  }, [text]);

  useEffect(() => {
    if (animateOn !== "view" && animateOn !== "inViewHover") return;

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !hasAnimated) {
          triggerDecrypt();
          setHasAnimated(true);
        }
      });
    };

    const observerOptions = {
      root: null,
      rootMargin: "0px",
      threshold: 0.1,
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    const currentRef = containerRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [animateOn, hasAnimated, triggerDecrypt]);

  const animateProps =
    animateOn === "hover" || animateOn === "inViewHover"
      ? {
          onMouseEnter: triggerHoverDecrypt,
          onMouseLeave: resetToPlainText,
        }
      : animateOn === "click"
        ? {
            onClick: handleClick,
          }
        : {};

  return (
    <motion.span
      ref={containerRef}
      className={`inline-block whitespace-pre-wrap ${parentClassName}`}
      {...animateProps}
      {...props}
    >
      <span className="sr-only">{text}</span>

      <span aria-hidden="true">
        {displayText.split("").map((char, index) => {
          const isRevealedOrDone = revealedIndices.has(index) || (!isAnimating && isDecrypted);

          return (
            <span key={index} className={isRevealedOrDone ? className : encryptedClassName}>
              {char}
            </span>
          );
        })}
      </span>
    </motion.span>
  );
}

