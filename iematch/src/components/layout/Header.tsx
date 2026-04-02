"use client";

import Link from "next/link";

export function Header() {
  return (
    <header
      className="fixed left-0 right-0 top-0 z-50 backdrop-blur-[10px]"
      style={{
        background: "rgba(255,255,255,0.95)",
        boxShadow: "0 1px 20px rgba(0,0,0,0.06)",
      }}
    >
      <div className="mx-auto flex h-12 max-w-[430px] items-center justify-between px-5">
        <Link href="/" className="flex items-center gap-1.5">
          <span
            className="text-lg font-black"
            style={{
              fontFamily: "'Zen Maru Gothic', sans-serif",
              color: "#2ABFA4",
            }}
          >
            イエマッチ
          </span>
          <span
            className="rounded-[10px] px-1.5 py-0.5 text-[10px] font-bold text-white"
            style={{ background: "#2ABFA4" }}
          >
            AI
          </span>
        </Link>
        <span className="text-xs font-medium" style={{ color: "#4A5C5E" }}>
          約5分で完了
        </span>
      </div>
    </header>
  );
}
