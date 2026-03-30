import Link from "next/link";

export function Footer() {
  return (
    <footer className="py-8" style={{ borderTop: "1px solid #E0E0E0", background: "#FEFCF9" }}>
      <div className="mx-auto max-w-3xl px-4 text-center">
        <p className="text-sm font-bold" style={{ color: "#2ABFA4", fontFamily: "'Zen Maru Gothic', sans-serif" }}>イエマッチAI</p>
        <p className="mt-2 text-xs" style={{ color: "#4A5C5E" }}>
          あなたにぴったりの住宅会社が見つかる無料診断サービス
        </p>
        <div className="mt-4 flex justify-center gap-4 text-xs" style={{ color: "#4A5C5E" }}>
          <Link href="/privacy" className="underline-offset-2 transition-colors hover:text-gray-700 hover:underline">
            プライバシーポリシー
          </Link>
          <Link href="/terms" className="underline-offset-2 transition-colors hover:text-gray-700 hover:underline">
            利用規約
          </Link>
          <span>運営会社</span>
        </div>
        <p className="mt-4 text-xs" style={{ color: "#4A5C5E" }}>
          &copy; 2026 イエマッチAI All rights reserved.
        </p>
      </div>
    </footer>
  );
}
