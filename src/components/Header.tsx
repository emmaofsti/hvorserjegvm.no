"use client";

import Link from "next/link";
import Image from "next/image";
import ThemeToggle from "./ThemeToggle";

export default function Header() {
  return (
    <header className="sticky top-0 z-30 lg-glass-heavy">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-2.5 sm:py-3">
        <Link href="/" className="flex items-center gap-2.5 lg-energize lg-capsule -mx-2 px-2 py-1">
          <Image
            src="/logo.jpg"
            alt="hvorserjegvm.no logo"
            width={36}
            height={36}
            className="rounded-xl shadow-sm shadow-black/40 ring-1 ring-white/10"
            priority
          />
          <span className="text-base font-bold tracking-tight text-slate-100 sm:text-lg">
            hvorserjegvm.no
          </span>
        </Link>
        <nav className="flex items-center gap-1 text-sm font-medium">
          <Link
            href="/"
            className="lg-capsule lg-energize px-3.5 py-2 text-slate-200 hover:bg-white/[0.08]"
          >
            Steder
          </Link>
          <Link
            href="/kamper"
            className="lg-capsule lg-energize px-3.5 py-2 text-slate-200 hover:bg-white/[0.08]"
          >
            Kamper
          </Link>
          <span className="ml-1.5">
            <ThemeToggle />
          </span>
        </nav>
      </div>
    </header>
  );
}
