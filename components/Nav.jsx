"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ROLES = [
  { href: "/patient", label: "Patient", sub: "User" },
  { href: "/provider", label: "Provider", sub: "Client" },
  { href: "/admin", label: "Admin", sub: "Oversight" },
];

export default function Nav() {
  const path = usePathname();
  return (
    <header className="sticky top-0 z-20 border-b border-white/5 bg-base/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-3">
        <Link href="/" className="group flex items-center gap-2.5">
          <span className="grid h-8 w-8 place-items-center rounded-xl bg-gradient-to-br from-teal to-teal-deep font-display text-lg text-[#06231C] shadow-lg shadow-teal/20 transition group-hover:scale-105">
            C
          </span>
          <span className="font-display text-xl text-fg">CareCompass</span>
          <span className="ml-1 hidden rounded-full border border-teal/30 bg-teal/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-teal sm:inline">
            SDG&nbsp;3
          </span>
        </Link>
        <nav className="flex items-center gap-1 rounded-full border border-white/8 bg-white/[0.03] p-1">
          {ROLES.map((r) => {
            const active = path === r.href;
            return (
              <Link
                key={r.href}
                href={r.href}
                className={
                  "rounded-full px-3 py-1.5 text-sm transition " +
                  (active
                    ? "bg-fg text-base shadow"
                    : "text-muted hover:bg-white/5 hover:text-fg")
                }
              >
                {r.label}
                <span className="ml-1 hidden font-mono text-[10px] opacity-60 md:inline">
                  {r.sub}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
