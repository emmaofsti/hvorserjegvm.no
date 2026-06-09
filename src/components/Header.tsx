"use client";

import Link from "next/link";
import Image from "next/image";
import ThemeToggle from "./ThemeToggle";
import { Icon } from "./icons";
import { useFavorites } from "@/lib/useFavorites";

export default function Header() {
  const { favoritesCount } = useFavorites();

  return (
    <header
      className="sticky top-0 z-30 lg-glass-heavy"
      style={{ paddingTop: "env(safe-area-inset-top)" }}
    >
      <div className="mx-auto flex max-w-[1800px] items-center justify-between gap-3 px-4 py-2.5 sm:py-3">
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
            className="lg-capsule lg-energize hidden sm:inline-flex px-3.5 py-2 text-slate-200 hover:bg-white/[0.08]"
          >
            Steder
          </Link>
          <Link
            href="/kamper"
            className="lg-capsule lg-energize hidden sm:inline-flex px-3.5 py-2 text-slate-200 hover:bg-white/[0.08]"
          >
            Kamper
          </Link>
          <Link
            href="/favoritter"
            className="lg-capsule lg-energize relative hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 text-slate-200 hover:bg-white/[0.08]"
          >
            <Icon.Heart size={16} strokeWidth={2} />
            {favoritesCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white tnum">
                {favoritesCount}
              </span>
            )}
          </Link>
          <span className="ml-1.5">
            <ThemeToggle />
          </span>
        </nav>
      </div>
    </header>
  );
}
