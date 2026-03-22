import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "イエマッチAI | あなたにぴったりの住宅会社が見つかる",
  description:
    "19問の質問に答えるだけで、AIがあなたの「家づくりタイプ」を診断。マッチ度の高い工務店を最大3社おすすめします。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className="antialiased">{children}</body>
    </html>
  );
}
