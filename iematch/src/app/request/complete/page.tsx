"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useBuilders } from "@/hooks/useBuilders";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default function RequestCompletePage() {
  const router = useRouter();
  const { builders } = useBuilders();
  const [builderIds, setBuilderIds] = useState<string[]>([]);

  useEffect(() => {
    const stored = sessionStorage.getItem("iematch_request_builders");
    if (stored) {
      setBuilderIds(JSON.parse(stored));
    }
  }, []);

  const selectedBuilders = builders.filter((b) => builderIds.includes(b.id));

  return (
    <div className="flex min-h-screen flex-col" style={{ background: "#F5F4F0" }}>
      <Header />

      <main className="mx-auto w-full max-w-lg flex-1 px-4 py-6">
        {/* 完了メッセージ */}
        <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-light">
            <svg
              className="h-8 w-8 text-brand"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          <h2 className="mt-4 text-xl font-bold">資料請求が完了しました！</h2>
          <p className="mt-2 text-sm text-gray-500">
            ご入力いただいたメールアドレスに確認メールをお送りしました。
            <br />
            各社から3営業日以内にご連絡いたします。
          </p>
        </div>

        {/* 請求先リスト */}
        {selectedBuilders.length > 0 && (
          <div className="mt-4 rounded-2xl bg-white p-5 shadow-sm">
            <h3 className="text-sm font-bold">
              資料請求した会社（{selectedBuilders.length}社）
            </h3>
            <div className="mt-3 space-y-2">
              {selectedBuilders.map((b) => (
                <div
                  key={b.id}
                  className="flex items-center gap-3 rounded-xl bg-gray-50 px-3 py-2"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand text-xs font-bold text-white">
                    {b.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{b.name}</p>
                    <p className="text-[10px] text-muted-foreground">
                      {b.address}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 次のステップ */}
        <div className="mt-4 rounded-2xl bg-white p-5 shadow-sm">
          <h3 className="text-sm font-bold">次のステップ</h3>
          <div className="mt-3 space-y-2">
            {[
              "届いた資料をじっくり比較してみましょう",
              "気になった会社にモデルハウス見学を予約してみましょう",
              "家族で優先順位を話し合ってみましょう",
            ].map((step, i) => (
              <div key={i} className="flex items-start gap-2 text-xs text-gray-600">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand text-[10px] font-bold text-white">
                  {i + 1}
                </span>
                <span>{step}</span>
              </div>
            ))}
          </div>
        </div>

        {/* アクションボタン */}
        <div className="mt-6 flex flex-col gap-3">
          <button
            type="button"
            onClick={() => router.push("/result")}
            className="w-full rounded-full bg-brand py-3.5 text-sm font-bold text-white transition-colors hover:bg-brand-dark"
          >
            診断結果をもう一度見る
          </button>
          <button
            type="button"
            onClick={() => {
              sessionStorage.clear();
              router.push("/diagnosis");
            }}
            className="w-full rounded-full border border-brand py-3.5 text-sm font-bold text-brand transition-colors hover:bg-brand-light"
          >
            もう一度診断する
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
}
