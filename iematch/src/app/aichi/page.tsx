"use client";

import { useRouter } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default function AichiPage() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen flex-col" style={{ background: "#F5F4F0" }}>
      <Header />

      {/* ヒーローセクション */}
      <section className="px-4 pb-12 pt-16 text-center" style={{ background: "#F5F4F0" }}>
        <h1 className="text-2xl font-bold leading-relaxed tracking-tight sm:text-3xl">
          愛知県で家を建てるなら、
          <br />
          あなたに合った<span className="text-brand">工務店</span>を。
        </h1>
        <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed" style={{ color: "#666666" }}>
          愛知県内の優良工務店30社から、AIがあなただけの最適な会社をご提案。無料・3分で完了します。
        </p>
        <button
          type="button"
          onClick={() => router.push("/diagnosis")}
          className="mt-6 rounded-full px-8 py-4 text-base font-bold text-white shadow-lg transition-all hover:shadow-xl"
          style={{ background: "#2E5240" }}
        >
          無料で診断スタート
        </button>
        <p className="mt-2 text-xs text-muted-foreground">
          約5分 ・ 完全無料 ・ 営業電話なし
        </p>
      </section>

      {/* 愛知エリア地図 */}
      <div style={{textAlign: 'center', margin: '24px 0'}}>
        <svg
          viewBox="0 0 200 180"
          width="200"
          height="180"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* 愛知県の簡易シルエット（多角形で近似） */}
          <polygon
            points="60,10 140,10 170,40 175,80 160,120 130,150 100,160 70,150 40,120 25,80 30,40"
            fill="#E8F0EB"
            stroke="#2E5240"
            strokeWidth="2"
          />
          <text x="100" y="90" textAnchor="middle" fill="#2E5240" fontSize="14" fontWeight="bold">愛知県</text>
        </svg>
        <p style={{color: '#2E5240', fontSize: '14px', marginTop: '8px'}}>対応エリア：愛知県全域</p>
      </div>

      {/* 課題訴求セクション */}
      <section className="px-4 py-12">
        <div className="mx-auto max-w-lg">
          <h2 className="text-center text-base font-bold">
            こんなお悩み、ありませんか？
          </h2>
          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {[
              "愛知県の住宅会社が多すぎて選べない",
              "何から始めればいいかわからない",
              "自分に合う会社がわからない",
              "しつこい営業が心配",
            ].map((text) => (
              <div
                key={text}
                className="flex items-center rounded-xl bg-white px-4 py-3"
                style={{ borderLeft: "3px solid #2E5240", border: "1px solid #DEDBD4", borderLeftWidth: "3px", borderLeftColor: "#2E5240" }}
              >
                <span className="text-sm">{text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 使い方セクション */}
      <section className="px-4 py-12" style={{ background: "#EAF0EC" }}>
        <div className="mx-auto max-w-lg">
          <h2 className="text-center text-base font-bold">
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
                title: "愛知県のおすすめ会社を紹介",
                desc: "マッチ度の高い愛知の工務店を最大3社ご紹介",
              },
            ].map(({ step, title, desc }) => (
              <div
                key={step}
                className="flex items-start gap-4 rounded-xl bg-white p-4 shadow-sm"
                style={{ border: "1px solid #DEDBD4" }}
              >
                <span
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
                  style={{ background: "#2E5240" }}
                >
                  {step}
                </span>
                <div>
                  <p className="text-sm font-bold">{title}</p>
                  <p className="mt-0.5 text-xs" style={{ color: "#666666" }}>{desc}</p>
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
            { value: "30+", label: "愛知県の登録工務店数", unit: "社" },
            { value: "5", label: "診断時間", unit: "分" },
            { value: "0", label: "利用料金", unit: "円" },
            { value: "0", label: "営業電話", unit: "件" },
          ].map(({ value, label, unit }) => (
            <div key={label} className="text-center">
              <p className="text-3xl font-bold text-brand">
                {value}
                <span className="text-sm font-normal text-muted-foreground">
                  {unit}
                </span>
              </p>
              <p className="mt-1 text-xs text-muted-foreground">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 選ばれる理由セクション */}
      <section className="px-4 py-12" style={{ background: "#EAF0EC" }}>
        <div className="mx-auto max-w-lg">
          <h2 className="text-center text-base font-bold">選ばれる4つの理由</h2>
          <div className="mt-6 space-y-3">
            {[
              {
                title: "愛知県特化のマッチング",
                desc: "愛知県に根ざした工務店から、あなたの建築予定エリアに対応できる会社だけをご紹介します。",
              },
              {
                title: "プロ監修の診断ロジック",
                desc: "住宅業界のプロが設計した19問の質問で、あなたの家づくりスタイルを正確に診断します。",
              },
              {
                title: "幅広い選択肢",
                desc: "大手ハウスメーカーだけでなく、愛知県内の地域密着型の優良工務店も多数登録しています。",
              },
              {
                title: "完全無料・営業電話なし",
                desc: "診断から資料請求まで完全無料。しつこい営業電話は一切ありません。",
              },
            ].map(({ title, desc }) => (
              <div
                key={title}
                className="rounded-xl bg-white p-4 shadow-sm"
                style={{ border: "1px solid #DEDBD4" }}
              >
                <p className="text-sm font-bold text-brand-dark">{title}</p>
                <p className="mt-1 text-xs leading-relaxed" style={{ color: "#666666" }}>
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
          <h2 className="text-center text-base font-bold">よくある質問</h2>
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
                q: "愛知県以外でも利用できますか？",
                a: "現在は愛知県内の工務店を中心にご紹介しています。対応エリアは順次拡大予定です。",
              },
              {
                q: "個人情報は安全ですか？",
                a: "SSL暗号化通信で送信され、資料請求先への紹介目的のみに使用します。",
              },
            ].map(({ q, a }) => (
              <div
                key={q}
                className="rounded-xl p-4"
                style={{ border: "1px solid #DEDBD4", background: "#ffffff" }}
              >
                <p className="text-sm font-bold">Q. {q}</p>
                <p className="mt-1 text-xs leading-relaxed" style={{ color: "#666666" }}>
                  A. {a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* フッターCTA */}
      <section className="px-4 py-12 text-center" style={{ background: "#EAF0EC" }}>
        <h2 className="text-lg font-bold">
          愛知県であなたにぴったりの住宅会社を見つけよう
        </h2>
        <p className="mt-2 text-sm" style={{ color: "#666666" }}>
          19の質問に答えるだけ。約5分で完了します。
        </p>
        <button
          type="button"
          onClick={() => router.push("/diagnosis")}
          className="mt-5 rounded-full px-8 py-4 text-base font-bold text-white shadow-lg transition-all"
          style={{ background: "#2E5240" }}
        >
          無料で診断スタート
        </button>
      </section>

      <Footer />

      {/* スクロール追従CTA（スティッキーフッター） */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 px-4 py-3 backdrop-blur-sm" style={{ borderTop: "1px solid #DEDBD4" }}>
        <div className="mx-auto max-w-lg">
          <button
            type="button"
            onClick={() => router.push("/diagnosis")}
            className="w-full rounded-full py-3 text-sm font-bold text-white shadow-md transition-colors"
            style={{ background: "#2E5240" }}
          >
            無料で診断スタート
          </button>
        </div>
      </div>
    </div>
  );
}
