"use client";

import { useRouter } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen flex-col" style={{ background: "#FEFCF9" }}>
      <Header />

      {/* ヒーローセクション */}
      <section
        className="px-4 pb-12 pt-16 text-center text-white"
        style={{ background: "linear-gradient(135deg, #2ABFA4 0%, #167A66 100%)" }}
      >
        <h1
          className="text-2xl font-bold leading-relaxed tracking-tight sm:text-3xl"
          style={{ fontFamily: "'Zen Maru Gothic', sans-serif" }}
        >
          あなたに合った工務店を、
          <br />
          AIが見つける。
        </h1>
        <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-white/85">
          愛知県内30社から3分で診断。完全無料・営業電話なし。
        </p>
        <button
          type="button"
          onClick={() => router.push("/diagnosis")}
          className="mt-6 rounded-full px-8 py-4 text-base font-bold text-white shadow-lg transition-all hover:shadow-xl hover:brightness-110"
          style={{ background: "#FF9F43" }}
        >
          無料で診断スタート →
        </button>
        <p className="mt-2 text-xs text-white/70">
          約5分 ・ 完全無料 ・ 営業電話なし
        </p>
      </section>

      {/* 課題訴求セクション */}
      <section className="px-4 py-12">
        <div className="mx-auto max-w-lg">
          <h2 className="text-center text-base font-bold" style={{ color: "#1A2B2E" }}>
            こんなお悩み、ありませんか？
          </h2>
          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {[
              "住宅会社が多すぎて選べない",
              "何から始めればいいかわからない",
              "自分に合う会社がわからない",
              "しつこい営業が心配",
            ].map((text) => (
              <div
                key={text}
                className="flex items-center rounded-2xl bg-white px-4 py-3 shadow-sm"
                style={{ borderLeft: "3px solid #2ABFA4" }}
              >
                <span className="text-sm" style={{ color: "#1A2B2E" }}>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 使い方セクション */}
      <section className="px-4 py-12" style={{ background: "#E8FBF6" }}>
        <div className="mx-auto max-w-lg">
          <h2 className="text-center text-base font-bold" style={{ color: "#1A2B2E" }}>
            かんたん3ステップ
          </h2>
          <div className="mt-6 space-y-4">
            {[
              {
                step: "1",
                title: "19の質問に回答",
                desc: "選択式だから約5分でサクサク完了",
              },
              {
                step: "2",
                title: "家づくりタイプ診断",
                desc: "AIが6タイプからあなたに最適なタイプを判定",
              },
              {
                step: "3",
                title: "おすすめ会社を紹介",
                desc: "マッチ度の高い工務店を最大3社ご紹介",
              },
            ].map(({ step, title, desc }) => (
              <div
                key={step}
                className="flex items-start gap-4 rounded-2xl bg-white p-4 shadow-sm"
              >
                <span
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
                  style={{ background: "#2ABFA4" }}
                >
                  {step}
                </span>
                <div>
                  <p className="text-sm font-bold" style={{ color: "#1A2B2E" }}>{title}</p>
                  <p className="mt-0.5 text-xs" style={{ color: "#4A5C5E" }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 実績数値セクション */}
      <section className="px-4 py-12">
        <div className="mx-auto grid max-w-lg grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { value: "50+", label: "登録工務店数", unit: "社" },
            { value: "5", label: "診断時間", unit: "分" },
            { value: "0", label: "利用料金", unit: "円" },
            { value: "0", label: "営業電話", unit: "件" },
          ].map(({ value, label, unit }) => (
            <div key={label} className="text-center">
              <p className="text-3xl font-bold" style={{ color: "#2ABFA4" }}>
                {value}
                <span className="text-sm font-normal" style={{ color: "#4A5C5E" }}>
                  {unit}
                </span>
              </p>
              <p className="mt-1 text-xs" style={{ color: "#4A5C5E" }}>{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 選ばれる理由セクション */}
      <section className="px-4 py-12" style={{ background: "#E8FBF6" }}>
        <div className="mx-auto max-w-lg">
          <h2 className="text-center text-base font-bold" style={{ color: "#1A2B2E" }}>選ばれる4つの理由</h2>
          <div className="mt-6 space-y-3">
            {[
              {
                title: "エリア特化のマッチング",
                desc: "地域に根ざした工務店から、あなたの建築予定エリアに対応できる会社だけをご紹介します。",
              },
              {
                title: "プロ監修の診断ロジック",
                desc: "住宅業界のプロが設計した19問の質問で、あなたの家づくりスタイルを正確に診断します。",
              },
              {
                title: "幅広い選択肢",
                desc: "大手ハウスメーカーだけでなく、地域密着型の優良工務店も多数登録しています。",
              },
              {
                title: "完全無料・営業電話なし",
                desc: "診断から資料請求まで完全無料。しつこい営業電話は一切ありません。",
              },
            ].map(({ title, desc }) => (
              <div
                key={title}
                className="rounded-2xl bg-white p-4 shadow-sm"
              >
                <p className="text-sm font-bold" style={{ color: "#1D9980" }}>{title}</p>
                <p className="mt-1 text-xs leading-relaxed" style={{ color: "#4A5C5E" }}>
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ セクション */}
      <section className="px-4 py-12">
        <div className="mx-auto max-w-lg">
          <h2 className="text-center text-base font-bold" style={{ color: "#1A2B2E" }}>よくある質問</h2>
          <div className="mt-6 space-y-3">
            {[
              {
                q: "本当に無料ですか？",
                a: "はい、診断から資料請求まで完全無料です。費用は一切かかりません。",
              },
              {
                q: "営業電話がかかってきませんか？",
                a: "資料請求先の工務店からご連絡が届く場合がありますが、しつこい営業電話はありません。",
              },
              {
                q: "診断結果は正確ですか？",
                a: "住宅業界のプロが設計したロジックに基づいて診断しています。あくまで参考としてご活用ください。",
              },
              {
                q: "個人情報は安全ですか？",
                a: "SSL暗号化通信で送信され、資料請求先への紹介目的のみに使用します。",
              },
            ].map(({ q, a }) => (
              <div
                key={q}
                className="rounded-2xl bg-white p-4 shadow-sm"
              >
                <p className="text-sm font-bold" style={{ color: "#1A2B2E" }}>Q. {q}</p>
                <p className="mt-1 text-xs leading-relaxed" style={{ color: "#4A5C5E" }}>
                  A. {a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* フッターCTA */}
      <section
        className="px-4 py-12 text-center text-white"
        style={{ background: "linear-gradient(135deg, #2ABFA4 0%, #167A66 100%)" }}
      >
        <h2 className="text-lg font-bold" style={{ fontFamily: "'Zen Maru Gothic', sans-serif" }}>
          あなたにぴったりの住宅会社を見つけよう
        </h2>
        <p className="mt-2 text-sm text-white/80">
          19の質問に答えるだけ。約5分で完了します。
        </p>
        <button
          type="button"
          onClick={() => router.push("/diagnosis")}
          className="mt-5 rounded-full px-8 py-4 text-base font-bold text-white shadow-lg transition-all hover:brightness-110"
          style={{ background: "#FF9F43" }}
        >
          無料で診断スタート →
        </button>
      </section>

      <Footer />

      {/* スクロール追従CTA（スティッキーフッター） */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 px-4 py-3 backdrop-blur-sm" style={{ borderTop: "1px solid #E0E0E0" }}>
        <div className="mx-auto max-w-lg">
          <button
            type="button"
            onClick={() => router.push("/diagnosis")}
            className="w-full rounded-full py-3 text-sm font-bold text-white shadow-md transition-colors hover:brightness-110"
            style={{ background: "#FF9F43" }}
          >
            無料で診断スタート →
          </button>
        </div>
      </div>
    </div>
  );
}
