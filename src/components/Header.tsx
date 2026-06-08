import Link from "next/link";

export default function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-[var(--border)] bg-[var(--bg-page)]/85 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="flex items-center gap-2">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-red-600 font-bold text-white">
            VM
          </span>
          <span className="text-lg font-bold tracking-tight text-slate-100">hvorserjegvm.no</span>
        </Link>
        <nav className="flex items-center gap-1 text-sm font-medium">
          <Link href="/" className="rounded-md px-3 py-1.5 text-slate-200 hover:bg-[var(--bg-surface)]">
            Steder
          </Link>
          <Link href="/kamper" className="rounded-md px-3 py-1.5 text-slate-200 hover:bg-[var(--bg-surface)]">
            Kamper
          </Link>

        </nav>
      </div>
    </header>
  );
}
