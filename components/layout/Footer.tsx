import Link from "next/link";

const links = [
  { name: "Contact", href: "/contact" },
  { name: "Imprint", href: "/imprint" },
  { name: "Support", href: "/support" },
  { name: "Terms", href: "/terms" },
];

export function Footer() {
  return (
    <footer className="mt-auto border-t border-white/5 py-12">
      <div className="container mx-auto flex flex-col items-center gap-8 px-6">
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
          {links.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="hover:text-brand-crimson text-[10px] font-bold tracking-[0.3em] text-white/50 uppercase transition-colors"
            >
              {link.name}
            </Link>
          ))}
          <span className="cursor-default text-[10px] font-bold tracking-[0.3em] text-white/30 uppercase select-none">
            Crimson C9 © {new Date().getFullYear()}
          </span>
        </div>
      </div>
    </footer>
  );
}
