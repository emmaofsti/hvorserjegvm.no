"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

export default function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-[var(--border)] bg-[var(--bg-page)]/85 backdrop-blur-lg">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-2.5 sm:py-3">
        <Link href="/" className="flex items-center gap-2 active:opacity-80 transition-opacity">
          <Image
            src="/logo.jpg"
            alt="hvorserjegvm.no logo"
            width={36}
            height={36}
            className="rounded-lg shadow-sm"
            priority
          />
          <span className="text-base font-bold tracking-tight text-slate-100 sm:text-lg">
            hvorserjegvm.no
          </span>
        </Link>
        <nav className="flex items-center gap-0.5 text-sm font-medium">
          <Link
            href="/"
            className="rounded-lg px-3 py-2 text-slate-200 transition-colors hover:bg-[var(--bg-surface)] active:bg-[var(--bg-surface)]"
          >
            Steder
          </Link>
          <Link
            href="/kamper"
            className="rounded-lg px-3 py-2 text-slate-200 transition-colors hover:bg-[var(--bg-surface)] active:bg-[var(--bg-surface)]"
          >
            Kamper
          </Link>
        </nav>
      </div>
    </header>
  );
}
