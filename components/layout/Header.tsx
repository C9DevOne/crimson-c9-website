import Link from "next/link";

const navLinks = [
  { name: "Artists", href: "/artists" },
  { name: "Events", href: "/events" },
  { name: "Music", href: "/music" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full bg-[#0a0a0a]/50 backdrop-blur-sm">
      <div className="container mx-auto flex h-14 items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="h-2 w-2 rounded-full bg-[#DC143C] group-hover:scale-125 transition-transform" />
          <span className="text-xs font-bold tracking-[0.2em] uppercase text-white">
            CRIMSONC9
          </span>
        </Link>

        <nav className="flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-[10px] font-bold uppercase tracking-widest text-white transition-colors hover:text-[#DC143C]"
            >
              {link.name}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
