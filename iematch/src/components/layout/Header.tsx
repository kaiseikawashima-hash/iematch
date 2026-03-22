"use client";

import Link from "next/link";

export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm" style={{ borderBottom: "1px solid #DEDBD4" }}>
      <div className="mx-auto flex h-14 max-w-3xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-1.5">
          <span className="text-lg font-bold" style={{ color: "#2E5240" }}>イエマッチ</span>
          <span className="rounded-full px-1.5 py-0.5 text-[10px] font-bold text-white" style={{ background: "#2E5240" }}>
            AI
          </span>
        </Link>
        <span className="text-xs text-muted-foreground">約5分で完了</span>
      </div>
    </header>
  );
}
