"use client";

import Link from "next/link";

export function Header() {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-sm" style={{ background: "rgba(42,191,164,0.95)", borderBottom: "1px solid #1D9980" }}>
      <div className="mx-auto flex h-14 max-w-3xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-1.5">
          <span className="text-lg font-bold text-white" style={{ fontFamily: "'Zen Maru Gothic', sans-serif" }}>イエマッチ</span>
          <span className="rounded-full bg-white px-1.5 py-0.5 text-[10px] font-bold" style={{ color: "#2ABFA4" }}>
            AI
          </span>
        </Link>
        <span className="text-xs text-white/80">約5分で完了</span>
      </div>
    </header>
  );
}
