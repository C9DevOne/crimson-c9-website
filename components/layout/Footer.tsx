import Link from "next/link";

const links = [
  { name: "Contact", href: "/contact" },
  { name: "Imprint", href: "/imprint" },
  { name: "Support", href: "/support" },
  { name: "Terms", href: "/terms" },
];

export function Footer() {
  return (
    <footer className="mt-auto py-8 border-t border-white/5">
      <div className="container mx-auto px-6 flex justify-center">
        <div className="flex gap-8">
          {links.map((link) => (
            <Link 
              key={link.name} 
              href={link.href} 
              className="text-[10px] font-bold uppercase tracking-[0.3em] text-white hover:text-[#DC143C] transition-colors"
            >
              {link.name}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
