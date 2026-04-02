"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

function CharacterImage({
  src,
  alt,
  width,
  height,
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
}) {
  return (
    <div style={{ width, height, position: "relative" }}>
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className="object-contain"
        onError={(e) => {
          const target = e.currentTarget;
          target.style.display = "none";
          const parent = target.parentElement;
          if (parent && !parent.querySelector(".placeholder")) {
            const placeholder = document.createElement("div");
            placeholder.className = "placeholder";
            placeholder.style.cssText = `width:${width}px;height:${height}px;background:#d1d5db;border-radius:16px;display:flex;align-items:center;justify-content:center;color:#9ca3af;font-size:12px;`;
            placeholder.textContent = alt;
            parent.appendChild(placeholder);
          }
        }}
      />
    </div>
  );
}

function WaveDivider({ fillColor }: { fillColor: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1440 60"
      className="block w-full"
      style={{ marginBottom: "-1px" }}
    >
      <path
        fill={fillColor}
        d="M0,30 C360,60 1080,0 1440,30 L1440,60 L0,60 Z"
      />
    </svg>
  );
}

export default function AichiPage() {
  const router = useRouter();

  return (
    <div
      className="flex min-h-screen flex-col"
      style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
    >
      <Header />

      {/* ① ヒーローセクション */}
      <section
        className="relative px-4 pb-16 pt-10 text-center text-white"
        style={{
          background: "linear-gradient(135deg, #2ABFA4 0%, #167A66 100%)",
        }}
      >
        <p className="text-sm font-bold tracking-wider opacity-90">
          イエマッチAI
        </p>
        <h1
          className="mx-auto mt-4 max-w-[430px] text-2xl font-bold leading-relaxed tracking-tight"
          style={{ fontFamily: "'Zen Maru Gothic', sans-serif" }}
        >
          あなたにぴったりの工務店を、
          <br />
          AIが見つける。
        </h1>
        <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-white/85">
          愛知県内30社から、3分の診断で最適な会社をご提案。
          <br />
          完全無料・営業電話なし。
        </p>
        <div className="mt-6 flex justify-center">
          <CharacterImage
            src="/images/characters/hero_man.png"
            alt="家づくりイメージ"
            width={200}
            height={200}
          />
        </div>
        <button
          type="button"
          onClick={() => router.push("/diagnosis")}
          className="mt-6 rounded-full px-10 py-4 text-lg font-bold text-white shadow-lg transition-all hover:shadow-xl hover:brightness-110"
          style={{ background: "#FF9F43" }}
        >
          無料で診断スタート →
        </button>
        <p className="mt-2 text-xs text-white/70">
          約3分・完全無料・営業電話なし
        </p>
      </section>
      <WaveDivider fillColor="#ffffff" />

      {/* ② 3つの特徴バナー */}
      <section className="bg-white px-4 py-8">
        <div className="mx-auto flex max-w-[430px] justify-around">
          {[
            { src: "/images/characters/madori.png", label: "間取り提案" },
            { src: "/images/characters/smartphone.png", label: "AI診断" },
            { src: "/images/characters/data.png", label: "工務店マッチング" },
          ].map(({ src, label }) => (
            <div key={label} className="flex flex-col items-center gap-2">
              <CharacterImage src={src} alt={label} width={60} height={60} />
              <span
                className="text-xs font-bold"
                style={{ color: "#1A2B2E" }}
              >
                {label}
              </span>
            </div>
          ))}
        </div>
      </section>
      <WaveDivider fillColor="#E8FBF6" />

      {/* ③ Problemセクション */}
      <section className="px-4 py-12" style={{ background: "#E8FBF6" }}>
        <div className="mx-auto max-w-[430px]">
          <h2
            className="text-center text-lg font-bold"
            style={{
              fontFamily: "'Zen Maru Gothic', sans-serif",
              color: "#1A2B2E",
            }}
          >
            家づくりで、こんなお悩みありませんか？
          </h2>
          <div className="mt-6 grid grid-cols-2 gap-4">
            {[
              { src: "/images/characters/problem_company.png", text: "どの工務店に頼めばいいかわからない" },
              { src: "/images/characters/problem_sales.png", text: "展示場に行ったら営業がしつこかった" },
              { src: "/images/characters/problem_budget.png", text: "予算内で建てられるか不安" },
              { src: "/images/characters/problem_planning.png", text: "何から始めればいいかわからない" },
            ].map(({ src, text }) => (
              <div
                key={text}
                className="flex flex-col items-center justify-center rounded-2xl bg-white p-5 text-center shadow-md transition-shadow hover:shadow-lg"
                style={{ minHeight: "160px" }}
              >
                <CharacterImage src={src} alt={text} width={100} height={100} />
                <span
                  className="mb-0 mt-3 text-sm font-bold leading-relaxed"
                  style={{ color: "#1A2B2E" }}
                >
                  {text}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
      <WaveDivider fillColor="#ffffff" />

      {/* ④ 解決策セクション */}
      <section className="bg-white px-4 py-12">
        <div className="mx-auto max-w-[430px]">
          <h2
            className="text-center text-lg font-bold"
            style={{
              fontFamily: "'Zen Maru Gothic', sans-serif",
              color: "#2ABFA4",
            }}
          >
            イエマッチAIなら、全部解決できます
          </h2>
          <div className="mt-8 space-y-8">
            {/* 1 */}
            <div className="flex items-start gap-4">
              <CharacterImage
                src="/images/characters/data.png"
                alt="AIがあなたの回答を分析"
                width={100}
                height={100}
              />
              <div className="flex-1">
                <h3
                  className="text-sm font-bold"
                  style={{ color: "#1A2B2E" }}
                >
                  AIがあなたの回答を分析
                </h3>
                <p
                  className="mt-1 text-xs leading-relaxed"
                  style={{ color: "#4A5C5E" }}
                >
                  19の質問に答えるだけで、AIがあなたの家づくりタイプを診断。パーソナライズされた工務店を提案します。
                </p>
              </div>
            </div>
            {/* 2 */}
            <div className="flex flex-row-reverse items-start gap-4">
              <CharacterImage
                src="/images/characters/design.png"
                alt="愛知県の優良工務店30社から提案"
                width={100}
                height={100}
              />
              <div className="flex-1">
                <h3
                  className="text-sm font-bold"
                  style={{ color: "#1A2B2E" }}
                >
                  愛知県の優良工務店30社から提案
                </h3>
                <p
                  className="mt-1 text-xs leading-relaxed"
                  style={{ color: "#4A5C5E" }}
                >
                  地域密着の優良工務店のみを厳選。あなたの希望・予算・こだわりに合った会社を絞り込みます。
                </p>
              </div>
            </div>
            {/* 3 */}
            <div className="flex items-start gap-4">
              <CharacterImage
                src="/images/characters/consult.png"
                alt="資料請求後にカルテをお届け"
                width={100}
                height={100}
              />
              <div className="flex-1">
                <h3
                  className="text-sm font-bold"
                  style={{ color: "#1A2B2E" }}
                >
                  資料請求後にカルテをお届け
                </h3>
                <p
                  className="mt-1 text-xs leading-relaxed"
                  style={{ color: "#4A5C5E" }}
                >
                  診断結果をもとにGemini
                  AIが作成した、あなただけの家づくりカルテをメールでお届けします。
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <WaveDivider fillColor="#E8FBF6" />

      {/* ⑤ 診断の流れセクション */}
      <section className="px-4 py-12" style={{ background: "#E8FBF6" }}>
        <div className="mx-auto max-w-[430px]">
          <h2
            className="text-center text-lg font-bold"
            style={{
              fontFamily: "'Zen Maru Gothic', sans-serif",
              color: "#1A2B2E",
            }}
          >
            3ステップで完了
          </h2>
          <div className="mt-8 space-y-6">
            {[
              {
                step: "1",
                title: "質問に答える",
                desc: "選択式の19問に回答するだけ",
                showImage: true,
              },
              {
                step: "2",
                title: "AIが工務店を提案",
                desc: "あなたの回答をAIが分析し、最適な会社を選定",
                showImage: false,
              },
              {
                step: "3",
                title: "無料で資料請求",
                desc: "気になった工務店に無料で資料請求",
                showImage: false,
              },
            ].map(({ step, title, desc, showImage }) => (
              <div key={step} className="flex items-start gap-4">
                <div className="flex flex-col items-center">
                  <span
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-base font-bold text-white"
                    style={{ background: "#2ABFA4" }}
                  >
                    {step}
                  </span>
                  {step !== "3" && (
                    <div
                      className="mt-1 h-8 w-0.5"
                      style={{ background: "#2ABFA4", opacity: 0.3 }}
                    />
                  )}
                </div>
                <div className="flex flex-1 items-center gap-3">
                  <div>
                    <p
                      className="text-sm font-bold"
                      style={{ color: "#1A2B2E" }}
                    >
                      STEP {step}：{title}
                    </p>
                    <p
                      className="mt-0.5 text-xs"
                      style={{ color: "#4A5C5E" }}
                    >
                      {desc}
                    </p>
                  </div>
                  {showImage && (
                    <CharacterImage
                      src="/images/characters/smartphone.png"
                      alt="スマホで質問に回答"
                      width={60}
                      height={60}
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <WaveDivider fillColor="#ffffff" />

      {/* ⑥ 安心訴求セクション */}
      <section className="bg-white px-4 py-10">
        <div className="mx-auto flex max-w-[430px] justify-around">
          {[
            { emoji: "✅", text: "完全無料" },
            { emoji: "📵", text: "営業電話なし" },
            { emoji: "🔒", text: "個人情報は\n資料請求時のみ" },
          ].map(({ emoji, text }) => (
            <div key={text} className="flex flex-col items-center text-center">
              <span className="text-3xl">{emoji}</span>
              <span
                className="mt-2 whitespace-pre-line text-xs font-bold"
                style={{ color: "#1A2B2E" }}
              >
                {text}
              </span>
            </div>
          ))}
        </div>
      </section>
      <WaveDivider fillColor="#167A66" />

      {/* ⑦ 最終CTAセクション */}
      <section
        className="px-4 py-14 text-center text-white"
        style={{
          background: "linear-gradient(135deg, #2ABFA4 0%, #167A66 100%)",
        }}
      >
        <h2
          className="text-lg font-bold leading-relaxed"
          style={{ fontFamily: "'Zen Maru Gothic', sans-serif" }}
        >
          まずは無料診断から
          <br />
          始めてみませんか？
        </h2>
        <button
          type="button"
          onClick={() => router.push("/diagnosis")}
          className="mt-6 rounded-full px-10 py-4 text-lg font-bold text-white shadow-lg transition-all hover:brightness-110"
          style={{ background: "#FF9F43" }}
        >
          無料で診断スタート →
        </button>
      </section>

      <Footer />

      {/* ⑧ スティッキーCTAバー */}
      <div
        className="fixed bottom-0 left-0 right-0 z-50 px-4 py-3"
        style={{ background: "#2ABFA4" }}
      >
        <div className="mx-auto max-w-[430px]">
          <button
            type="button"
            onClick={() => router.push("/diagnosis")}
            className="w-full rounded-full py-3 text-base font-bold text-white shadow-md transition-colors hover:brightness-110"
            style={{ background: "#FF9F43" }}
          >
            無料で診断スタート →
          </button>
        </div>
      </div>
    </div>
  );
}
