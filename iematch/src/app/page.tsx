"use client";

import { useRouter } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

/* ===== 波形SVGコンポーネント群 ===== */
function WaveHeroToWhite() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1440 60"
      preserveAspectRatio="none"
      className="block w-full"
      style={{ background: "#167A66", marginBottom: "-1px" }}
    >
      <path
        fill="#ffffff"
        d="M0,30 C240,60 480,0 720,30 C960,60 1200,0 1440,30 L1440,60 L0,60 Z"
      />
    </svg>
  );
}

function WaveWhiteToMintPale() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1440 60"
      preserveAspectRatio="none"
      className="block w-full"
      style={{ background: "#ffffff", marginBottom: "-1px" }}
    >
      <path
        fill="#F0FDF9"
        d="M0,20 C360,60 1080,0 1440,40 L1440,60 L0,60 Z"
      />
    </svg>
  );
}

function WaveMintPaleToWhite() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1440 60"
      preserveAspectRatio="none"
      className="block w-full"
      style={{ background: "#F0FDF9", marginBottom: "-1px" }}
    >
      <path
        fill="#ffffff"
        d="M0,40 C180,0 360,60 540,20 C720,0 900,50 1080,20 C1260,0 1440,40 1440,40 L1440,60 L0,60 Z"
      />
    </svg>
  );
}

function WaveWhiteToMintLight() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1440 60"
      preserveAspectRatio="none"
      className="block w-full"
      style={{ background: "#ffffff", marginBottom: "-1px" }}
    >
      <path
        fill="#E8FBF6"
        d="M0,10 C480,70 960,0 1440,40 L1440,60 L0,60 Z"
      />
    </svg>
  );
}

function WaveStepsToSafety() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1440 60"
      preserveAspectRatio="none"
      className="block w-full"
      style={{ background: "#D0F5EE", marginBottom: "-1px" }}
    >
      <path
        fill="#2ABFA4"
        d="M0,30 C360,0 1080,60 1440,20 L1440,60 L0,60 Z"
      />
    </svg>
  );
}

/* ===== イラストプレースホルダー ===== */
function IllustPlaceholder({
  label,
  className = "",
  style = {},
}: {
  label: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={`flex items-center justify-center text-center text-[10px] font-semibold leading-tight ${className}`}
      style={{
        border: "2px dashed rgba(42,191,164,0.4)",
        color: "#1D9980",
        ...style,
      }}
    >
      {label}
    </div>
  );
}

export default function HomePage() {
  const router = useRouter();

  return (
    <div
      className="flex min-h-screen flex-col bg-white"
      style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
    >
      <Header />

      {/* ===== ② ヒーローセクション ===== */}
      {/* // ここの背景色を変更する場合はこのclassのstyleを編集 */}
      <section
        className="relative overflow-hidden px-6 pb-0 pt-[100px]"
        style={{
          background:
            "linear-gradient(160deg, #2ABFA4 0%, #1D9980 45%, #167A66 100%)",
          minHeight: "600px",
        }}
      >
        {/* 装飾円 */}
        <div
          className="pointer-events-none absolute right-[-60px] top-[-80px] h-[280px] w-[280px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%)",
          }}
        />
        <div
          className="pointer-events-none absolute bottom-[60px] left-[-40px] h-[200px] w-[200px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 70%)",
          }}
        />

        <div className="relative z-[2] mx-auto max-w-[430px] text-center">
          {/* バッジ */}
          <div
            className="mb-5 inline-flex items-center gap-1.5 rounded-[20px] px-3.5 py-1.5 text-xs font-bold text-white backdrop-blur-[4px]"
            style={{
              background: "rgba(255,255,255,0.2)",
              border: "1px solid rgba(255,255,255,0.3)",
            }}
          >
            🏠 愛知県特化の工務店マッチング
          </div>

          {/* キャッチ */}
          <h1
            className="mb-3.5 text-[30px] font-black leading-[1.35] text-white"
            style={{
              fontFamily: "'Zen Maru Gothic', sans-serif",
              letterSpacing: "-0.5px",
            }}
          >
            あなたにぴったりの工務店を、
            <br />
            <span
              style={{
                background: "linear-gradient(135deg, #FFD700, #FF9F43)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              AIが見つける。
            </span>
          </h1>

          {/* サブ */}
          <p className="mb-7 text-[13.5px] leading-[1.7] text-white/85">
            愛知県内30社から、3分の診断で最適な会社をご提案。
            <br />
            完全無料・営業電話なし。
          </p>

          {/* CTAボタン */}
          <button
            type="button"
            onClick={() => router.push("/diagnosis")}
            className="relative mb-3 w-full overflow-hidden rounded-full px-8 py-4 text-[17px] font-bold text-white"
            style={{
              fontFamily: "'Zen Maru Gothic', sans-serif",
              background: "linear-gradient(135deg, #FF9F43, #E8740C)",
              boxShadow: "0 6px 24px rgba(232,116,12,0.4)",
            }}
          >
            無料で診断スタート →
            {/* シャインエフェクト用 */}
            <span className="animate-shine absolute left-[-100%] top-0 h-full w-[60px] skew-x-[-20deg] bg-white/20" />
          </button>
          <p className="mb-8 text-[11.5px] text-white/70">
            約3分・完全無料・営業電話なし
          </p>

          <div className="mx-auto w-full max-w-[320px] pt-4">
            <img
              src="/images/top/hero_main.png"
              alt="イエマッチ メインイラスト"
              className="mx-auto w-full max-w-[320px]"
              style={{ display: "block" }}
            />
          </div>
        </div>
      </section>

      {/* ③ 波形区切り: Hero → White */}
      <WaveHeroToWhite />

      {/* ===== ④ 3特徴バナー ===== */}
      <section className="bg-white px-5 py-7">
        <div className="mx-auto grid max-w-[430px] grid-cols-3 gap-3">
          {[
            { icon: "間取り\n提案", label: "間取り\n提案" },
            { icon: "AI\n診断", label: "AI\n診断" },
            { icon: "工務店\n紹介", label: "工務店\nマッチング" },
          ].map(({ icon, label }) => (
            <div
              key={label}
              className="rounded-2xl p-4 text-center"
              style={{
                background: "#F0FDF9",
                border: "1px solid rgba(42,191,164,0.15)",
              }}
            >
              {/* TODO: イラスト差し替え → public/images/characters/ */}
              <IllustPlaceholder
                label={icon}
                className="mx-auto mb-2.5 h-14 w-14 rounded-[14px]"
                style={{
                  background: "rgba(255,255,255,0.8)",
                  boxShadow: "0 2px 8px rgba(42,191,164,0.15)",
                }}
              />
              <p
                className="whitespace-pre-line text-[11.5px] font-bold leading-tight"
                style={{ color: "#167A66" }}
              >
                {label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ⑤ 波形区切り: White → MintPale */}
      <WaveWhiteToMintPale />

      {/* ===== ⑥ Problemセクション ===== */}
      <section className="px-5 py-12" style={{ background: "#F0FDF9" }}>
        <div className="mx-auto max-w-[430px]">
          <p
            className="mb-2 text-center text-[11px] font-bold uppercase tracking-[2px]"
            style={{ color: "#2ABFA4" }}
          >
            Problem
          </p>
          <h2
            className="mb-7 text-center text-[22px] font-black leading-[1.4]"
            style={{
              fontFamily: "'Zen Maru Gothic', sans-serif",
              color: "#1A2B2E",
            }}
          >
            家づくりで、
            <br />
            こんなお悩みありませんか？
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              {
                placeholder: "イラスト①",
                text: "どの工務店に頼めばいいかわからない",
                file: "problem_company.png",
              },
              {
                placeholder: "イラスト②",
                text: "展示場に行ったら営業がしつこかった",
                file: "problem_sales.png",
              },
              {
                placeholder: "イラスト③",
                text: "予算内で建てられるか不安",
                file: "problem_budget.png",
              },
              {
                placeholder: "イラスト④",
                text: "何から始めればいいかわからない",
                file: "problem_planning.png",
              },
            ].map(({ placeholder, text, file }) => (
              <div
                key={text}
                className="rounded-[18px] bg-white px-3.5 py-5 text-center transition-all hover:-translate-y-[3px] hover:shadow-[0_8px_24px_rgba(42,191,164,0.15)]"
                style={{
                  boxShadow: "0 2px 12px rgba(26,43,46,0.08)",
                  border: "1px solid rgba(42,191,164,0.08)",
                }}
              >
                {/* TODO: イラスト差し替え → public/images/characters/{file} */}
                <IllustPlaceholder
                  label={placeholder}
                  className="mx-auto mb-3 h-20 w-20 rounded-full"
                  style={{ background: "#E8FBF6" }}
                />
                <p
                  className="text-[12.5px] font-bold leading-[1.5]"
                  style={{ color: "#1A2B2E" }}
                >
                  {text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ⑦ 波形区切り: MintPale → White */}
      <WaveMintPaleToWhite />

      {/* ===== ⑧ Solutionセクション ===== */}
      <section className="bg-white px-5 py-12">
        <div className="mx-auto max-w-[430px]">
          <p
            className="mb-2 text-center text-[11px] font-bold uppercase tracking-[2px]"
            style={{ color: "#2ABFA4" }}
          >
            Solution
          </p>
          <h2
            className="mb-7 text-center text-[22px] font-black leading-[1.4]"
            style={{
              fontFamily: "'Zen Maru Gothic', sans-serif",
              color: "#1A2B2E",
            }}
          >
            イエマッチAIなら、
            <br />
            全部解決できます
          </h2>
          <div className="mt-7 flex flex-col gap-6">
            {[
              {
                num: "POINT 01",
                title: "AIがあなたの回答を分析",
                desc: "19の質問に答えるだけで、AIがあなたの家づくりタイプを診断。パーソナライズされた工務店を提案します。",
                img: "/images/top/solution_ai.png",
                alt: "AI分析イラスト",
                reverse: false,
              },
              {
                num: "POINT 02",
                title: "愛知県の優良工務店30社から提案",
                desc: "地域密着の優良工務店のみを厳選。あなたの希望・予算・こだわりに合った会社を絞り込みます。",
                img: "/images/top/solution_matching.png",
                alt: "工務店マッチングイラスト",
                reverse: true,
              },
              {
                num: "POINT 03",
                title: "資料請求後にカルテをお届け",
                desc: "診断結果をもとにAIが作成した、あなただけの家づくりカルテをメールでお届けします。",
                img: "/images/top/solution_madori.png",
                alt: "間取りイラスト",
                reverse: false,
              },
            ].map(({ num, title, desc, img, alt, reverse }) => (
              <div
                key={num}
                className={`flex items-center gap-4 rounded-[20px] p-5 ${reverse ? "flex-row-reverse" : ""}`}
                style={{
                  background: "#F0FDF9",
                  border: "1px solid rgba(42,191,164,0.12)",
                }}
              >
                <div
                  className="flex h-[100px] w-[100px] shrink-0 items-center justify-center rounded-2xl"
                  style={{
                    background: "white",
                    boxShadow: "0 2px 8px rgba(42,191,164,0.12)",
                  }}
                >
                  <img
                    src={img}
                    alt={alt}
                    className="h-[100px] w-[100px]"
                    style={{ objectFit: "contain" }}
                  />
                </div>
                <div>
                  <p
                    className="mb-1 text-[11px] font-bold tracking-[1px]"
                    style={{ color: "#2ABFA4" }}
                  >
                    {num}
                  </p>
                  <p
                    className="mb-1.5 text-[15px] font-bold leading-[1.4]"
                    style={{
                      fontFamily: "'Zen Maru Gothic', sans-serif",
                      color: "#1A2B2E",
                    }}
                  >
                    {title}
                  </p>
                  <p
                    className="text-xs leading-[1.7]"
                    style={{ color: "#4A5C5E" }}
                  >
                    {desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ⑨ 波形区切り: White → MintLight */}
      <WaveWhiteToMintLight />

      {/* ===== ⑩ Stepsセクション ===== */}
      <section
        className="relative px-5 py-12"
        style={{
          background: "linear-gradient(180deg, #E8FBF6 0%, #D0F5EE 100%)",
        }}
      >
        <div className="mx-auto max-w-[430px]">
          <p
            className="mb-2 text-center text-[11px] font-bold uppercase tracking-[2px]"
            style={{ color: "#2ABFA4" }}
          >
            How it works
          </p>
          <h2
            className="mb-7 text-center text-[22px] font-black leading-[1.4]"
            style={{
              fontFamily: "'Zen Maru Gothic', sans-serif",
              color: "#1A2B2E",
            }}
          >
            3ステップで完了
          </h2>
          <div className="mt-7 flex flex-col">
            {[
              {
                step: "1",
                title: "質問に答える",
                desc: "選択式の19問に回答するだけ",
                badge: "📱 スマホで簡単に回答",
              },
              {
                step: "2",
                title: "AIが工務店を提案",
                desc: "あなたの回答をAIが分析し、最適な会社を選定",
                badge: "🤖 Gemini AIが分析",
              },
              {
                step: "3",
                title: "無料で資料請求",
                desc: "気になった工務店に無料で資料請求。カルテもお届け",
                badge: "📋 家づくりカルテ付き",
              },
            ].map(({ step, title, desc, badge }, i) => (
              <div
                key={step}
                className="relative flex items-start gap-4"
                style={{ paddingBottom: i < 2 ? "24px" : "0" }}
              >
                {/* 点線縦線 */}
                {i < 2 && (
                  <div
                    className="absolute bottom-0 left-[19px] top-[42px] w-0.5"
                    style={{
                      background:
                        "repeating-linear-gradient(to bottom, #2ABFA4 0px, #2ABFA4 6px, transparent 6px, transparent 12px)",
                    }}
                  />
                )}
                {/* ステップ番号 */}
                <div
                  className="relative z-[1] flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-base font-black text-white"
                  style={{
                    fontFamily: "'Zen Maru Gothic', sans-serif",
                    background: "#2ABFA4",
                    boxShadow: "0 4px 12px rgba(42,191,164,0.35)",
                  }}
                >
                  {step}
                </div>
                <div className="flex-1 pt-1.5">
                  <p
                    className="mb-1 text-base font-bold"
                    style={{
                      fontFamily: "'Zen Maru Gothic', sans-serif",
                      color: "#1A2B2E",
                    }}
                  >
                    {title}
                  </p>
                  <p
                    className="text-[12.5px] leading-[1.6]"
                    style={{ color: "#4A5C5E" }}
                  >
                    {desc}
                  </p>
                  <div
                    className="mt-1.5 inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-[11px] font-semibold"
                    style={{
                      background: "white",
                      color: "#1D9980",
                      border: "1px solid rgba(42,191,164,0.2)",
                    }}
                  >
                    {badge}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ⑪ 波形区切り: Steps → Safety */}
      <WaveStepsToSafety />

      {/* ===== 安心訴求セクション ===== */}
      <section className="px-5 py-10" style={{ background: "#2ABFA4" }}>
        <div className="mx-auto max-w-[430px] text-center">
          <p
            className="mb-5 text-base font-bold text-white opacity-90"
            style={{ fontFamily: "'Zen Maru Gothic', sans-serif" }}
          >
            安心してご利用いただけます
          </p>
          <div className="grid grid-cols-3 gap-2.5">
            {[
              { icon: "✅", label: "完全\n無料" },
              { icon: "📵", label: "営業電話\nなし" },
              { icon: "🔒", label: "個人情報は\n請求時のみ" },
            ].map(({ icon, label }) => (
              <div
                key={label}
                className="rounded-[14px] px-2 py-4 text-center backdrop-blur-[4px]"
                style={{
                  background: "rgba(255,255,255,0.15)",
                  border: "1px solid rgba(255,255,255,0.2)",
                }}
              >
                <div className="mb-1.5 text-2xl">{icon}</div>
                <p className="whitespace-pre-line text-[11px] font-bold leading-tight text-white">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== ⑫ 最終CTAセクション ===== */}
      <section
        className="relative overflow-hidden px-6 pb-20 pt-12 text-center"
        style={{
          background: "linear-gradient(160deg, #167A66 0%, #2ABFA4 100%)",
        }}
      >
        <div
          className="pointer-events-none absolute right-[-40px] top-[-60px] h-[200px] w-[200px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%)",
          }}
        />
        <div className="relative z-[2] mx-auto max-w-[430px]">
          <h2
            className="mb-2 text-[22px] font-black leading-[1.4] text-white"
            style={{ fontFamily: "'Zen Maru Gothic', sans-serif" }}
          >
            まずは無料診断から
            <br />
            始めてみませんか？
          </h2>
          <p className="mb-6 text-[13px] text-white/80">
            約3分で完了。しつこい営業電話は一切ありません。
          </p>
          <button
            type="button"
            onClick={() => router.push("/diagnosis")}
            className="mb-3 w-full rounded-full px-8 py-4 text-[17px] font-bold text-white"
            style={{
              fontFamily: "'Zen Maru Gothic', sans-serif",
              background: "linear-gradient(135deg, #FF9F43, #E8740C)",
              boxShadow: "0 6px 24px rgba(232,116,12,0.4)",
            }}
          >
            無料で診断スタート →
          </button>
          <p className="text-[11px] text-white/60">
            愛知県内30社・完全無料・営業電話なし
          </p>
        </div>
      </section>

      <Footer />

      {/* ===== スティッキーCTAバー ===== */}
      <div
        className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-center px-5 py-3.5"
        style={{
          background: "#2ABFA4",
          boxShadow: "0 -4px 20px rgba(42,191,164,0.3)",
        }}
      >
        <button
          type="button"
          onClick={() => router.push("/diagnosis")}
          className="text-base font-bold tracking-[0.5px] text-white"
          style={{ fontFamily: "'Zen Maru Gothic', sans-serif" }}
        >
          無料で診断スタート →
        </button>
      </div>
    </div>
  );
}
