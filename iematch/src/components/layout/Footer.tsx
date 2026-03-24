import Link from "next/link";

export function Footer() {
  return (
    <footer className="py-8" style={{ borderTop: "1px solid #DEDBD4", background: "#F5F4F0" }}>
      <div className="mx-auto max-w-3xl px-4 text-center">
        <p className="text-sm font-bold" style={{ color: "#2E5240" }}>イエマッチAI</p>
        <p className="mt-2 text-xs text-muted-foreground">
          あなたにぴったりの住宅会社が見つかる無料診断サービス
        </p>
        <div className="mt-4 flex justify-center gap-4 text-xs text-muted-foreground">
          <Link href="/privacy" className="underline-offset-2 transition-colors hover:text-gray-700 hover:underline">
            プライバシーポリシー
          </Link>
          <Link href="/terms" className="underline-offset-2 transition-colors hover:text-gray-700 hover:underline">
            利用規約
          </Link>
          <span>運営会社</span>
        </div>
        <p className="mt-4 text-xs text-muted-foreground">
          &copy; 2026 イエマッチAI All rights reserved.
        </p>
      </div>
    </footer>
  );
}
