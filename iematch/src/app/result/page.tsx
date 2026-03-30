"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { DiagnosisResult, UserAnswers, Answer } from "@/types";
import { runDiagnosis } from "@/lib/diagnosis";
import { getRecommendations } from "@/lib/matching";
import { useBuilders } from "@/hooks/useBuilders";
import { typeDefinitions } from "@/data/types";
import { RadarChart } from "@/components/result/RadarChart";

type Correction = {
  afterQuestion: string;
  text: string;
};

function builderStrengthLabel(value: string): string {
  const labels: Record<string, string> = {
    design: "デザイン力",
    cost: "コスパ",
    performance: "住宅性能",
    personality: "人柄",
    after_service: "アフターサービス",
    track_record: "施工実績",
    land_support: "土地探し",
    custom_design: "自由設計",
  };
  return labels[value] ?? value;
}

/** マッチ度(%)を星5段階に変換 */
function matchRateToStars(rate: number): number {
  if (rate >= 80) return 5;
  if (rate >= 60) return 4;
  if (rate >= 45) return 3;
  if (rate >= 30) return 2;
  return 1;
}

/** 工務店写真のグラデーション背景 */
const photoGradients = [
  "linear-gradient(135deg,#a8e6cf,#88d8b0)",
  "linear-gradient(135deg,#a8d8ea,#82c4d6)",
  "linear-gradient(135deg,#ffd3b6,#ffaaa5)",
  "linear-gradient(135deg,#d4a5ff,#b388eb)",
  "linear-gradient(135deg,#fce38a,#f9d56e)",
];

/** タグカラー */
const tagColors = [
  { bg: "#EBF5FB", color: "#2980B9" },
  { bg: "#EAFAF1", color: "#27AE60" },
  { bg: "#FEF5E7", color: "#E67E22" },
];

export default function ResultPage() {
  const router = useRouter();
  const { builders, loading: buildersLoading } = useBuilders();
  const [result, setResult] = useState<DiagnosisResult | null>(null);
  const [corrections, setCorrections] = useState<Correction[]>([]);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [comparisonText, setComparisonText] = useState<string | null>(null);
  const [comparisonLoading, setComparisonLoading] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [karteSubmitted, setKarteSubmitted] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem("iematch_karte_sent") === "true") {
      setKarteSubmitted(true);
    }
  }, []);

  useEffect(() => {
    if (buildersLoading) return;

    const stored = sessionStorage.getItem("iematch_answers");
    if (!stored) {
      router.push("/diagnosis");
      return;
    }

    const userAnswers: UserAnswers = JSON.parse(stored);
    setAnswers(userAnswers.answers);
    const diagnosisBase = runDiagnosis(userAnswers.answers);
    const recommendations = getRecommendations(userAnswers.answers, builders);

    const storedCorrections = sessionStorage.getItem("iematch_corrections");
    const parsedCorrections: Correction[] = storedCorrections
      ? JSON.parse(storedCorrections).filter((c: Correction) => c.text)
      : [];
    setCorrections(parsedCorrections);

    const diagResult = { ...diagnosisBase, recommendations };
    setResult(diagResult);

    const typeInfo = typeDefinitions[diagResult.mainType];
    sessionStorage.setItem(
      "iematch_diagnosis_type",
      typeInfo?.label ?? diagResult.displayLabel
    );

    const sorted = [...recommendations].sort(
      (a, b) => b.displayMatchRate - a.displayMatchRate
    );
    const filtered = sorted.filter((r) => r.displayMatchRate >= 40);
    const displayed =
      filtered.length >= 10 ? filtered.slice(0, 10) : sorted.slice(0, 10);
    setSelectedIds(new Set(displayed.slice(0, 5).map((r) => r.builderId)));

    fetchComparisonText(diagResult, userAnswers.answers, parsedCorrections);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router, builders, buildersLoading]);

  const fetchComparisonText = useCallback(
    async (
      diagResult: DiagnosisResult,
      userAnswers: Answer[],
      userCorrections: Correction[]
    ) => {
      setComparisonLoading(true);
      try {
        const typeInfo = typeDefinitions[diagResult.mainType];
        const recData = diagResult.recommendations.slice(0, 3).map((r) => {
          const b = builders.find((b) => b.id === r.builderId);
          return {
            builderName: b?.name ?? "不明",
            matchRate: r.displayMatchRate,
          };
        });

        const res = await fetch("/api/result-insight", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            mainType: diagResult.mainType,
            typeLabel: typeInfo.label,
            displayLabel: diagResult.displayLabel,
            recommendations: recData,
            answers: userAnswers,
            corrections: userCorrections,
          }),
        });
        const data = await res.json();
        if (data.comparisonText) {
          setComparisonText(data.comparisonText);
        }
      } catch {
        // フォールバック
      } finally {
        setComparisonLoading(false);
      }
    },
    [builders]
  );

  const toggleBuilder = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const displayedBuilders = useMemo(() => {
    if (!result) return [];
    const sorted = [...result.recommendations].sort(
      (a, b) => b.displayMatchRate - a.displayMatchRate
    );
    const filtered = sorted.filter((r) => r.displayMatchRate >= 40);
    if (filtered.length >= 10) return filtered.slice(0, 10);
    return sorted.slice(0, 10);
  }, [result]);

  const initialBuilders = displayedBuilders.slice(0, 5);
  const extraBuilders = displayedBuilders.slice(5);
  const recs = showMore ? displayedBuilders : initialBuilders;

  const scrollToForm = () => {
    document.getElementById("form-section")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleRequestSubmit = () => {
    sessionStorage.setItem(
      "iematch_request_builders",
      JSON.stringify(Array.from(selectedIds))
    );
    router.push("/request");
  };

  if (!result) {
    return (
      <div
        className="flex min-h-screen items-center justify-center"
        style={{ background: "var(--warm-white, #FEFCF9)" }}
      >
        <div className="text-center">
          <div
            className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-t-transparent"
            style={{ borderColor: "#2ABFA4", borderTopColor: "transparent" }}
          />
          <p className="mt-3 text-sm" style={{ color: "#4A5C5E" }}>
            診断結果を計算中...
          </p>
        </div>
      </div>
    );
  }

  const typeInfo = typeDefinitions[result.mainType];

  return (
    <div
      style={{
        fontFamily: "'Noto Sans JP', sans-serif",
        background: "#FEFCF9",
        color: "#1A2B2E",
        lineHeight: 1.7,
        minHeight: "100vh",
        paddingBottom: 72,
      }}
    >
      {/* ===== HERO HEADER ===== */}
      <div
        style={{
          background: "linear-gradient(160deg,#2ABFA4 0%,#1D9980 40%,#167A66 100%)",
          padding: "40px 24px 32px",
          color: "white",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -60,
            right: -40,
            width: 200,
            height: 200,
            background:
              "radial-gradient(circle,rgba(255,255,255,0.08) 0%,transparent 70%)",
            borderRadius: "50%",
          }}
        />
        <p
          style={{
            fontFamily: "'Zen Maru Gothic', sans-serif",
            fontSize: 13,
            fontWeight: 700,
            opacity: 0.8,
            letterSpacing: 0.5,
            marginBottom: 16,
          }}
        >
          🏠 イエマッチAI
        </p>
        <h1
          style={{
            fontFamily: "'Zen Maru Gothic', sans-serif",
            fontSize: 20,
            fontWeight: 900,
            lineHeight: 1.4,
            marginBottom: 4,
          }}
        >
          あなたにぴったりの
          <br />
          住宅会社が見つかりました
        </h1>
        <p style={{ fontSize: 12.5, opacity: 0.75, fontWeight: 400 }}>
          診断回答をもとにAIがマッチングしました
        </p>
      </div>

      {/* ===== PAGE CONTENT ===== */}
      <div style={{ padding: "0 16px", maxWidth: 393, margin: "0 auto" }}>
        {/* ===== TYPE RESULT CARD ===== */}
        <div
          style={{
            background: "white",
            borderRadius: 24,
            marginTop: -16,
            position: "relative",
            zIndex: 2,
            boxShadow: "0 8px 30px rgba(26,43,46,0.08), 0 2px 8px rgba(26,43,46,0.04)",
            overflow: "hidden",
            animation: "fadeUp 0.6s ease both",
          }}
        >
          <div style={{ padding: "28px 22px 24px" }}>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 5,
                background: "#E8FBF6",
                color: "#1D9980",
                fontSize: 11.5,
                fontWeight: 700,
                padding: "5px 13px",
                borderRadius: 20,
                marginBottom: 16,
                letterSpacing: 0.3,
              }}
            >
              ✨ あなたのタイプ
            </span>
            <h2
              style={{
                fontFamily: "'Zen Maru Gothic', sans-serif",
                fontSize: 27,
                fontWeight: 900,
                color: "#1A2B2E",
                lineHeight: 1.25,
                marginBottom: 4,
              }}
            >
              {typeInfo.label}
            </h2>
            <p
              style={{
                fontSize: 13.5,
                color: "#1D9980",
                fontWeight: 600,
                lineHeight: 1.5,
                marginBottom: 24,
              }}
            >
              {typeInfo.catchCopy}
            </p>

            {/* Illustration placeholder */}
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 24 }}>
              <div
                style={{
                  width: 180,
                  height: 180,
                  borderRadius: "50%",
                  background:
                    "linear-gradient(150deg,#F0FDF9 0%,#D9F5EE 50%,#C2EDE3 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    inset: -5,
                    borderRadius: "50%",
                    border: "1.5px dashed rgba(42,191,164,0.2)",
                  }}
                />
                <span style={{ fontSize: 64 }}>🏠</span>
              </div>
            </div>

            <p
              style={{
                fontSize: 13.5,
                lineHeight: 1.9,
                color: "#4A5C5E",
                marginBottom: 24,
              }}
            >
              {typeInfo.description}
            </p>

            {/* Chart with lock overlay */}
            <div
              style={{
                background: "#F2FDFB",
                borderRadius: 18,
                padding: "18px 18px 0",
                position: "relative",
                overflow: "hidden",
                border: "1px solid rgba(42,191,164,0.08)",
              }}
            >
              <p
                style={{
                  fontSize: 12.5,
                  fontWeight: 700,
                  color: "#1A2B2E",
                  marginBottom: 12,
                }}
              >
                📊 あなたの家づくりプロフィール
              </p>
              <div style={{ maxWidth: 200, margin: "0 auto" }}>
                <RadarChart values={result.radarValues} />
              </div>
              {/* Lock overlay */}
              {!karteSubmitted && (
                <div
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: "55%",
                    background:
                      "linear-gradient(0deg,#F2FDFB 30%,rgba(242,253,251,0.97) 65%,transparent 100%)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "flex-end",
                    paddingBottom: 18,
                    gap: 8,
                    backdropFilter: "blur(4px)",
                  }}
                >
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      background: "#FF9F43",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 18,
                      color: "white",
                      boxShadow: "0 4px 14px rgba(232,116,12,0.3)",
                    }}
                  >
                    🔒
                  </div>
                  <p
                    style={{
                      fontSize: 12.5,
                      fontWeight: 700,
                      color: "#1A2B2E",
                      textAlign: "center",
                      lineHeight: 1.5,
                    }}
                  >
                    詳しい分析結果は
                    <br />
                    <em style={{ fontStyle: "normal", color: "#E8740C" }}>
                      資料請求された方限定
                    </em>
                    でお届け
                  </p>
                  <p
                    style={{
                      fontSize: 13,
                      fontWeight: 700,
                      color: "#1D9980",
                      textAlign: "center",
                    }}
                  >
                    まずは気になる工務店を選んでみましょう
                  </p>
                  <span
                    style={{
                      fontSize: 20,
                      color: "#2ABFA4",
                      fontWeight: 800,
                      lineHeight: 1,
                      animation: "bounceDown 1.5s ease infinite",
                    }}
                  >
                    ↓
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ===== MATCHING COMPANIES SECTION ===== */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            margin: "36px 0 16px",
          }}
        >
          <h2
            style={{
              fontFamily: "'Zen Maru Gothic', sans-serif",
              fontSize: 18,
              fontWeight: 800,
              color: "#1A2B2E",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <span
              style={{
                width: 4,
                height: 20,
                background: "#2ABFA4",
                borderRadius: 2,
                flexShrink: 0,
                display: "inline-block",
              }}
            />
            あなたに合う工務店
          </h2>
          <span style={{ fontSize: 11.5, color: "#BFC9CA", fontWeight: 500 }}>
            全{displayedBuilders.length}社中 上位{recs.length}社
          </span>
        </div>

        {/* Gemini comparison text */}
        {comparisonLoading ? (
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 14 }}>
            <div
              className="h-5 w-5 animate-spin rounded-full border-2"
              style={{ borderColor: "#E8EDEF", borderTopColor: "#2ABFA4" }}
            />
          </div>
        ) : comparisonText ? (
          <p
            style={{
              fontSize: 12.5,
              lineHeight: 1.8,
              color: "#4A5C5E",
              background: "white",
              borderRadius: 14,
              padding: "12px 16px",
              marginBottom: 14,
              boxShadow:
                "0 2px 12px rgba(26,43,46,0.06), 0 1px 3px rgba(26,43,46,0.04)",
            }}
          >
            {comparisonText}
          </p>
        ) : null}

        {/* Company Cards */}
        {recs.map((rec, index) => {
          const builder = builders.find((b) => b.id === rec.builderId);
          if (!builder) return null;

          const isSelected = selectedIds.has(rec.builderId);
          const stars = matchRateToStars(rec.displayMatchRate);
          const firstReview =
            builder.reviews && builder.reviews.length > 0
              ? builder.reviews[0]
              : null;
          const currentYear = new Date().getFullYear();
          const yearsInBusiness = builder.foundedYear
            ? currentYear - builder.foundedYear
            : null;

          return (
            <div
              key={rec.builderId}
              style={{
                background: "white",
                borderRadius: 18,
                overflow: "hidden",
                boxShadow:
                  "0 2px 12px rgba(26,43,46,0.06), 0 1px 3px rgba(26,43,46,0.04)",
                marginBottom: 14,
                border: "1px solid #F2F5F6",
                animation: `fadeUp 0.5s ${0.1 * (index + 1)}s ease both`,
              }}
            >
              {/* Photo slider */}
              <PhotoSlider
                photos={builder.photos}
                builderName={builder.name}
                rank={index + 1}
                cardIndex={index}
              />

              {/* Body */}
              <div style={{ padding: "18px 20px 20px" }}>
                <h3
                  style={{
                    fontFamily: "'Zen Maru Gothic', sans-serif",
                    fontSize: 17,
                    fontWeight: 800,
                    color: "#1A2B2E",
                    marginBottom: 3,
                  }}
                >
                  {builder.name}
                </h3>
                <p
                  style={{
                    fontSize: 12,
                    color: "#8A9A9C",
                    fontWeight: 400,
                    marginBottom: 10,
                  }}
                >
                  📍 {builder.address}
                </p>

                {/* Stars */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    marginBottom: 12,
                  }}
                >
                  <span
                    style={{ fontSize: 11, fontWeight: 600, color: "#8A9A9C" }}
                  >
                    マッチ度
                  </span>
                  <div style={{ display: "flex", gap: 1 }}>
                    {[1, 2, 3, 4, 5].map((n) => (
                      <span
                        key={n}
                        style={{
                          color: n <= stars ? "#FFB923" : "#DFE6E9",
                          fontSize: 16,
                        }}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                </div>

                {/* Tags */}
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 5,
                    marginBottom: 14,
                  }}
                >
                  {builder.b7_topStrengths.slice(0, 3).map((s, i) => {
                    const tc = tagColors[i % tagColors.length];
                    return (
                      <span
                        key={s}
                        style={{
                          fontSize: 10.5,
                          fontWeight: 600,
                          padding: "4px 10px",
                          borderRadius: 6,
                          background: tc.bg,
                          color: tc.color,
                        }}
                      >
                        {builderStrengthLabel(s)}
                      </span>
                    );
                  })}
                </div>

                {/* Description / reason */}
                <p
                  style={{
                    fontSize: 13,
                    lineHeight: 1.8,
                    color: "#4A5C5E",
                    marginBottom: 14,
                  }}
                >
                  {rec.reasonText || builder.description}
                </p>

                {/* Customer voice */}
                {firstReview && (
                  <div
                    style={{
                      background: "#FFFDF8",
                      borderRadius: 12,
                      padding: "14px 16px",
                      borderLeft: "3px solid #2ABFA4",
                      marginBottom: 12,
                    }}
                  >
                    <p
                      style={{
                        fontSize: 10.5,
                        fontWeight: 700,
                        color: "#1D9980",
                        marginBottom: 5,
                      }}
                    >
                      👤 お客様の声
                    </p>
                    <p
                      style={{
                        fontSize: 12,
                        lineHeight: 1.7,
                        color: "#4A5C5E",
                        fontStyle: "italic",
                      }}
                    >
                      「{firstReview.text}」
                    </p>
                  </div>
                )}

                {/* Stats */}
                <div
                  style={{ display: "flex", gap: 16, marginBottom: 16 }}
                >
                  {builder.b5_annualBuilds > 0 && (
                    <span
                      style={{
                        fontSize: 11,
                        color: "#8A9A9C",
                        display: "flex",
                        alignItems: "center",
                        gap: 3,
                      }}
                    >
                      🏠{" "}
                      <b style={{ color: "#4A5C5E", fontWeight: 700 }}>
                        年間{builder.b5_annualBuilds}棟
                      </b>
                    </span>
                  )}
                  {builder.foundedYear != null && yearsInBusiness != null && yearsInBusiness > 0 && (
                    <span
                      style={{
                        fontSize: 11,
                        color: "#8A9A9C",
                        display: "flex",
                        alignItems: "center",
                        gap: 3,
                      }}
                    >
                      📅{" "}
                      <b style={{ color: "#4A5C5E", fontWeight: 700 }}>
                        創業{yearsInBusiness}年
                      </b>
                    </span>
                  )}
                </div>

                {/* Checkbox */}
                <div
                  onClick={() => toggleBuilder(rec.builderId)}
                  style={{
                    paddingTop: 14,
                    borderTop: "1px solid #F2F5F6",
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    cursor: "pointer",
                  }}
                >
                  <div
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: 7,
                      border: isSelected
                        ? "2px solid #2ABFA4"
                        : "2px solid #E8EDEF",
                      background: isSelected ? "#2ABFA4" : "transparent",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                      fontSize: 13,
                      fontWeight: 800,
                      flexShrink: 0,
                      transition: "all 0.2s",
                    }}
                  >
                    {isSelected ? "✓" : ""}
                  </div>
                  <span
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: isSelected ? "#1D9980" : "#8A9A9C",
                      transition: "color 0.2s",
                    }}
                  >
                    この会社に資料請求する
                  </span>
                </div>
              </div>
            </div>
          );
        })}

        {/* Inline CTA after cards */}
        {selectedIds.size > 0 && (
          <>
            <button
              type="button"
              onClick={scrollToForm}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                padding: "16px 20px",
                background: "linear-gradient(135deg,#FF9F43,#E8740C)",
                color: "white",
                borderRadius: 18,
                fontSize: 14.5,
                fontWeight: 700,
                border: "none",
                boxShadow: "0 6px 24px rgba(232,116,12,0.3)",
                margin: "18px 0 6px",
                width: "100%",
                cursor: "pointer",
                fontFamily: "'Noto Sans JP', sans-serif",
              }}
            >
              📩 選んだ会社に無料で資料請求する
            </button>
            <p
              style={{
                textAlign: "center",
                fontSize: 11,
                color: "#BFC9CA",
                marginBottom: 12,
              }}
            >
              {selectedIds.size}社以上選んで、下のフォームへ
            </p>
          </>
        )}

        {/* More button */}
        {extraBuilders.length > 0 && (
          <button
            type="button"
            onClick={() => setShowMore((prev) => !prev)}
            style={{
              width: "100%",
              padding: 15,
              background: "white",
              border: "1.5px dashed #E8EDEF",
              borderRadius: 18,
              fontSize: 13.5,
              fontWeight: 600,
              color: "#4A5C5E",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
              marginBottom: 8,
              fontFamily: "'Noto Sans JP', sans-serif",
            }}
          >
            {showMore
              ? "閉じる ∧"
              : `＋ 他の会社も見る（あと${extraBuilders.length}社）`}
          </button>
        )}

        {/* Selection summary bar */}
        <div
          style={{
            background: "white",
            borderRadius: 18,
            padding: "16px 20px",
            marginTop: 12,
            boxShadow:
              "0 2px 12px rgba(26,43,46,0.06), 0 1px 3px rgba(26,43,46,0.04)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            border:
              selectedIds.size > 0
                ? "2px solid #2ABFA4"
                : "2px solid #FF6B6B",
          }}
        >
          <span style={{ fontSize: 14, fontWeight: 700, color: "#1A2B2E" }}>
            選択中{" "}
            <span
              style={{
                fontSize: 22,
                color: selectedIds.size > 0 ? "#2ABFA4" : "#FF6B6B",
              }}
            >
              {selectedIds.size}
            </span>
            社{" "}
            {selectedIds.size > 0 ? "✅" : ""}
          </span>
          <span
            style={{
              fontSize: 11,
              fontWeight: 600,
              color: selectedIds.size > 0 ? "#BFC9CA" : "#FF6B6B",
            }}
          >
            最大10社まで選択可能
          </span>
        </div>

        {/* CTA after selection */}
        {selectedIds.size > 0 && (
          <button
            type="button"
            onClick={scrollToForm}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              padding: "16px 20px",
              background: "linear-gradient(135deg,#FF9F43,#E8740C)",
              color: "white",
              borderRadius: 18,
              fontSize: 14.5,
              fontWeight: 700,
              border: "none",
              boxShadow: "0 6px 24px rgba(232,116,12,0.3)",
              marginTop: 14,
              width: "100%",
              cursor: "pointer",
              fontFamily: "'Noto Sans JP', sans-serif",
            }}
          >
            📩 この{selectedIds.size}社に無料で資料請求する →
          </button>
        )}

        {/* ===== KARUTE MINI ===== */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 14,
            background: "#F2FDFB",
            borderRadius: 18,
            padding: "18px 18px 20px",
            marginTop: 14,
            border: "1px solid rgba(42,191,164,0.1)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                width: 34,
                height: 34,
                background: "white",
                borderRadius: 9,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 17,
                flexShrink: 0,
              }}
            >
              📋
            </div>
            <p
              style={{
                fontSize: 12,
                lineHeight: 1.55,
                color: "#4A5C5E",
              }}
            >
              先ほどの
              <strong style={{ color: "#1D9980", fontWeight: 700 }}>
                あなたの家づくりプロフィール
              </strong>
              の
              <br />
              完全版がカルテ（PDF）で届きます
            </p>
          </div>
          {/* Karute preview mock */}
          <div
            style={{
              background: "white",
              borderRadius: 12,
              overflow: "hidden",
              boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
              border: "1px solid #F2F5F6",
            }}
          >
            <div
              style={{
                width: "100%",
                aspectRatio: "210/148",
                background:
                  "linear-gradient(160deg,#F8FFFE,#EFF9F6,#E5F5F0)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: 16,
              }}
            >
              <div
                style={{
                  width: "82%",
                  maxWidth: 240,
                  background: "white",
                  borderRadius: 6,
                  boxShadow: "0 3px 14px rgba(0,0,0,0.07)",
                  padding: "12px 14px",
                  position: "relative",
                }}
              >
                <span
                  style={{
                    position: "absolute",
                    top: -5,
                    right: -5,
                    background: "#FF9F43",
                    color: "white",
                    fontSize: 6.5,
                    fontWeight: 700,
                    padding: "2px 5px",
                    borderRadius: 3,
                  }}
                >
                  SAMPLE
                </span>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    marginBottom: 8,
                    paddingBottom: 7,
                    borderBottom: "1.5px solid #E8FBF6",
                  }}
                >
                  <span
                    style={{
                      fontSize: 9,
                      fontWeight: 700,
                      color: "#1D9980",
                    }}
                  >
                    🏠 イエマッチAI
                  </span>
                  <span
                    style={{
                      fontFamily: "'Zen Maru Gothic', sans-serif",
                      fontSize: 8,
                      fontWeight: 700,
                      color: "#1A2B2E",
                    }}
                  >
                    家づくりカルテ
                  </span>
                </div>
                <div style={{ display: "flex", gap: 10 }}>
                  <div
                    style={{
                      width: 55,
                      height: 55,
                      borderRadius: "50%",
                      border: "2px solid #2ABFA4",
                      opacity: 0.5,
                      flexShrink: 0,
                    }}
                  />
                  <div
                    style={{
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                      gap: 4,
                      paddingTop: 3,
                    }}
                  >
                    {[100, 75, 90, 55, 80].map((w, i) => (
                      <div
                        key={i}
                        style={{
                          height: 4,
                          borderRadius: 3,
                          background: "#E8EDEF",
                          width: `${w}%`,
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div
              style={{
                padding: "9px 14px",
                background: "#FFFDF8",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
                fontSize: 10.5,
                fontWeight: 600,
                color: "#4A5C5E",
              }}
            >
              家づくりカルテが届きます
              <span
                style={{
                  fontSize: 9,
                  background: "#E8FBF6",
                  color: "#1D9980",
                  padding: "2px 7px",
                  borderRadius: 10,
                  fontWeight: 700,
                }}
              >
                資料請求後
              </span>
            </div>
          </div>
        </div>

        {/* ===== BENEFITS ===== */}
        <div
          style={{
            background: "linear-gradient(150deg,#FFFAF2,#FFF5E6)",
            borderRadius: 24,
            padding: "24px 20px",
            marginTop: 28,
            border: "1px solid rgba(232,116,12,0.08)",
          }}
        >
          <p
            style={{
              fontFamily: "'Zen Maru Gothic', sans-serif",
              fontSize: 15,
              fontWeight: 800,
              color: "#1A2B2E",
              textAlign: "center",
              marginBottom: 18,
            }}
          >
            イエマッチAIから資料請求すると…
          </p>

          {[
            {
              icon: "💬",
              iconBg: "#EBF5FB",
              title: "初回面談がすぐ本題に入れる",
              desc: "AIが聞き取った要望が届くので、展示場で一からヒアリングされる手間がなくなります",
              photoBg: "linear-gradient(135deg,#d4efdf,#a9dfbf)",
              photoNote: "※ イメージ：打合せ風景",
            },
            {
              icon: "👤",
              iconBg: "#EAFAF1",
              title: "ベテラン担当者が優先対応",
              desc: "各社のトップ営業・ベテランがあなたの担当につきます",
              photoBg: "linear-gradient(135deg,#d6eaf8,#aed6f1)",
              photoNote: "※ イメージ：営業担当者",
            },
            {
              icon: "💡",
              iconBg: "#FFF7EE",
              title: "AI厳選のおすすめ会社もプラス",
              desc: "マッチング結果に加え、注目工務店5社の情報も届きます",
              photoBg: "linear-gradient(135deg,#fdebd0,#f5cba7)",
              photoNote: "※ イメージ：おすすめ工務店",
            },
          ].map((item, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                gap: 12,
                alignItems: "flex-start",
                marginBottom: i < 2 ? 14 : 0,
              }}
            >
              <div
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 10,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 18,
                  flexShrink: 0,
                  background: item.iconBg,
                }}
              >
                {item.icon}
              </div>
              <div style={{ flex: 1 }}>
                <strong
                  style={{
                    display: "block",
                    fontSize: 13,
                    fontWeight: 700,
                    color: "#1A2B2E",
                    marginBottom: 2,
                  }}
                >
                  {item.title}
                </strong>
                <p
                  style={{
                    fontSize: 11.5,
                    lineHeight: 1.6,
                    color: "#4A5C5E",
                  }}
                >
                  {item.desc}
                </p>
                {/* Photo placeholder */}
                <div
                  style={{
                    width: "100%",
                    aspectRatio: "16/9",
                    borderRadius: 12,
                    overflow: "hidden",
                    marginTop: 10,
                    position: "relative",
                  }}
                >
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 11,
                      color: "rgba(255,255,255,0.55)",
                      fontWeight: 600,
                      letterSpacing: 0.5,
                      background: item.photoBg,
                    }}
                  >
                    写真エリア
                  </div>
                  <span
                    style={{
                      position: "absolute",
                      bottom: 6,
                      right: 6,
                      background: "rgba(0,0,0,0.4)",
                      backdropFilter: "blur(6px)",
                      color: "white",
                      fontSize: 9,
                      fontWeight: 600,
                      padding: "3px 8px",
                      borderRadius: 4,
                    }}
                  >
                    {item.photoNote}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ===== FORM SECTION ===== */}
        <div id="form-section" style={{ marginTop: 28 }}>
          <FormSection
            selectedIds={selectedIds}
            builders={builders}
            corrections={corrections}
            onSubmit={handleRequestSubmit}
          />
        </div>

        <div style={{ height: 80 }} />
      </div>

      {/* ===== STICKY CTA BAR ===== */}
      {selectedIds.size > 0 && (
        <div
          style={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            background: "white",
            padding: "10px 16px 12px",
            boxShadow: "0 -3px 16px rgba(0,0,0,0.07)",
            zIndex: 100,
            borderTop: "1px solid #F2F5F6",
          }}
        >
          <div
            style={{
              maxWidth: 393,
              margin: "0 auto",
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 13, fontWeight: 700, color: "#1A2B2E" }}>
                <span
                  style={{ color: "#2ABFA4", fontSize: 18, fontWeight: 800 }}
                >
                  {selectedIds.size}
                </span>
                社 選択中
              </p>
              <p style={{ fontSize: 10.5, color: "#8A9A9C" }}>
                選んだ会社に資料請求 →
              </p>
            </div>
            <button
              type="button"
              onClick={scrollToForm}
              style={{
                flexShrink: 0,
                padding: "12px 20px",
                background: "linear-gradient(135deg,#FF9F43,#E8740C)",
                color: "white",
                border: "none",
                borderRadius: 12,
                fontSize: 13,
                fontWeight: 700,
                fontFamily: "'Noto Sans JP', sans-serif",
                cursor: "pointer",
                boxShadow: "0 3px 12px rgba(232,116,12,0.25)",
              }}
            >
              無料で資料請求
            </button>
          </div>
        </div>
      )}

      {/* ===== ANIMATIONS ===== */}
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes bounceDown {
          0%, 100% { transform: translateY(0); opacity: 0.5; }
          50% { transform: translateY(6px); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

/** ===== PHOTO SLIDER ===== */
const placeholderGradients = [
  "linear-gradient(135deg,#a8e6cf,#88d8b0)",
  "linear-gradient(135deg,#a8d8ea,#82c4d6)",
  "linear-gradient(135deg,#ffd3b6,#ffaaa5)",
];

function PhotoSlider({
  photos,
  builderName,
  rank,
  cardIndex,
}: {
  photos: { url: string; tags: string[]; category: string }[];
  builderName: string;
  rank: number;
  cardIndex: number;
}) {
  const [current, setCurrent] = useState(0);

  // Build 3 slides: real photos or placeholders
  const slides = useMemo(() => {
    const realPhotos = photos.filter((p) => p.url);
    if (realPhotos.length >= 3) {
      return realPhotos.slice(0, 3).map((p) => ({ type: "image" as const, url: p.url }));
    }
    // Fill with placeholders
    const result: { type: "image" | "placeholder"; url: string; gradient?: string }[] = [];
    for (let i = 0; i < 3; i++) {
      if (i < realPhotos.length) {
        result.push({ type: "image", url: realPhotos[i].url });
      } else {
        result.push({
          type: "placeholder",
          url: "",
          gradient: placeholderGradients[(cardIndex + i) % placeholderGradients.length],
        });
      }
    }
    return result;
  }, [photos, cardIndex]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % 3);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div
      style={{
        width: "100%",
        height: 180,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          display: "flex",
          width: "300%",
          height: "100%",
          transform: `translateX(-${current * 33.333}%)`,
          transition: "transform 0.8s ease-in-out",
        }}
      >
        {slides.map((slide, i) => (
          <div key={i} style={{ width: "33.333%", height: "100%", flexShrink: 0 }}>
            {slide.type === "image" ? (
              <img
                src={slide.url}
                alt={`${builderName}の施工事例 ${i + 1}`}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                }}
              />
            ) : (
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  background: slide.gradient,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 11,
                  color: "rgba(255,255,255,0.5)",
                  fontWeight: 600,
                  letterSpacing: 1,
                }}
              >
                施工事例イメージ
              </div>
            )}
          </div>
        ))}
      </div>
      {/* Rank badge */}
      <span
        style={{
          position: "absolute",
          top: 12,
          left: 12,
          background: "rgba(26,43,46,0.7)",
          backdropFilter: "blur(10px)",
          color: "white",
          fontSize: 11,
          fontWeight: 700,
          padding: "5px 12px",
          borderRadius: 8,
          zIndex: 2,
        }}
      >
        {rank}位
      </span>
      {/* Dot indicators */}
      <div
        style={{
          position: "absolute",
          bottom: 10,
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          gap: 6,
          zIndex: 2,
        }}
      >
        {[0, 1, 2].map((i) => (
          <button
            key={i}
            type="button"
            onClick={() => setCurrent(i)}
            style={{
              width: current === i ? 16 : 7,
              height: 7,
              borderRadius: 4,
              background: current === i ? "white" : "rgba(255,255,255,0.5)",
              border: "none",
              cursor: "pointer",
              padding: 0,
              transition: "all 0.3s",
            }}
          />
        ))}
      </div>
    </div>
  );
}

/** ===== INLINE FORM SECTION ===== */
function FormSection({
  selectedIds,
  builders,
  corrections,
  onSubmit,
}: {
  selectedIds: Set<string>;
  builders: { id: string; name: string }[];
  corrections: Correction[];
  onSubmit: () => void;
}) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    postalCode: "",
    prefecture: "",
    city: "",
    addressDetail: "",
  });
  const [privacyAgreed, setPrivacyAgreed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const router = useRouter();

  const selectedBuilders = builders.filter((b) => selectedIds.has(b.id));

  const updateField = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const handleSubmit = async () => {
    const newErrors: Record<string, string> = {};
    if (!form.name.trim()) newErrors.name = "お名前を入力してください";
    if (!form.email.trim()) {
      newErrors.email = "メールアドレスを入力してください";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "正しいメールアドレスを入力してください";
    }
    if (!form.phone.trim()) {
      newErrors.phone = "電話番号を入力してください";
    } else if (!/^[\d\-+()]{10,}$/.test(form.phone.replace(/\s/g, ""))) {
      newErrors.phone = "正しい電話番号を入力してください";
    }
    if (!privacyAgreed) {
      newErrors.privacy = "利用規約への同意が必要です";
    }
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setSubmitting(true);
    try {
      const storedAnswers = sessionStorage.getItem("iematch_answers");
      const parsedAnswers = storedAnswers ? JSON.parse(storedAnswers) : {};
      const storedCorrections = sessionStorage.getItem("iematch_corrections");
      const parsedCorrections = storedCorrections
        ? JSON.parse(storedCorrections)
        : [];

      const address = [form.prefecture, form.city, form.addressDetail]
        .filter(Boolean)
        .join(" ");

      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          address,
          message: "",
          builderIds: Array.from(selectedIds),
          diagnosisType:
            sessionStorage.getItem("iematch_diagnosis_type") ?? null,
          answers: parsedAnswers.answers ?? null,
          corrections: parsedCorrections,
        }),
      });

      const result = await res.json();
      if (!res.ok) {
        setErrors({
          submit:
            result.error ?? "送信に失敗しました。もう一度お試しください。",
        });
        return;
      }

      sessionStorage.setItem(
        "iematch_request_form",
        JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          address,
          builderIds: Array.from(selectedIds),
        })
      );
      sessionStorage.setItem("iematch_karte_sent", "true");
      router.push("/request/complete");
    } catch {
      setErrors({
        submit: "通信エラーが発生しました。もう一度お試しください。",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const inputStyle = (hasError?: boolean): React.CSSProperties => ({
    width: "100%",
    padding: "13px 15px",
    border: `1.5px solid ${hasError ? "#FF6B6B" : "#E8EDEF"}`,
    borderRadius: 12,
    fontSize: 15,
    fontFamily: "'Noto Sans JP', sans-serif",
    background: "#FAFBFC",
    color: "#1A2B2E",
    outline: "none",
  });

  return (
    <div
      style={{
        background: "white",
        borderRadius: 24,
        padding: "28px 22px 32px",
        boxShadow:
          "0 8px 30px rgba(26,43,46,0.08), 0 2px 8px rgba(26,43,46,0.04)",
        border: "2px solid #FF9F43",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Top gradient bar */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 4,
          background: "linear-gradient(90deg,#FF9F43,#E8740C)",
        }}
      />

      <h2
        style={{
          fontFamily: "'Zen Maru Gothic', sans-serif",
          fontSize: 18,
          fontWeight: 800,
          textAlign: "center",
          marginTop: 4,
          marginBottom: 4,
        }}
      >
        選んだ会社に資料請求する
      </h2>
      <p
        style={{
          textAlign: "center",
          fontSize: 12.5,
          color: "#4A5C5E",
          marginBottom: 6,
        }}
      >
        選択した{selectedBuilders.length}社に、あなたの情報が届きます
      </p>
      <div style={{ textAlign: "center", marginBottom: 22 }}>
        <span
          style={{
            display: "inline-block",
            background: "#FFF0F0",
            color: "#E53935",
            fontSize: 11.5,
            fontWeight: 700,
            padding: "4px 16px",
            borderRadius: 20,
          }}
        >
          完全無料
        </span>
      </div>

      {/* Form fields */}
      <div style={{ marginBottom: 16 }}>
        <label
          style={{
            fontSize: 12,
            fontWeight: 600,
            color: "#4A5C5E",
            marginBottom: 5,
            display: "flex",
            alignItems: "center",
            gap: 4,
          }}
        >
          お名前 <span style={{ fontSize: 9.5, color: "#E53935", fontWeight: 700 }}>必須</span>
        </label>
        <input
          type="text"
          placeholder="山田 太郎"
          value={form.name}
          onChange={(e) => updateField("name", e.target.value)}
          style={inputStyle(!!errors.name)}
        />
        {errors.name && (
          <p style={{ fontSize: 10, color: "#E53935", marginTop: 4 }}>{errors.name}</p>
        )}
      </div>

      <div style={{ marginBottom: 16 }}>
        <label
          style={{
            fontSize: 12,
            fontWeight: 600,
            color: "#4A5C5E",
            marginBottom: 5,
            display: "flex",
            alignItems: "center",
            gap: 4,
          }}
        >
          メールアドレス <span style={{ fontSize: 9.5, color: "#E53935", fontWeight: 700 }}>必須</span>
        </label>
        <input
          type="email"
          placeholder="example@email.com"
          value={form.email}
          onChange={(e) => updateField("email", e.target.value)}
          style={inputStyle(!!errors.email)}
        />
        {errors.email && (
          <p style={{ fontSize: 10, color: "#E53935", marginTop: 4 }}>{errors.email}</p>
        )}
      </div>

      <div style={{ marginBottom: 16 }}>
        <label
          style={{
            fontSize: 12,
            fontWeight: 600,
            color: "#4A5C5E",
            marginBottom: 5,
            display: "flex",
            alignItems: "center",
            gap: 4,
          }}
        >
          電話番号 <span style={{ fontSize: 9.5, color: "#E53935", fontWeight: 700 }}>必須</span>
        </label>
        <input
          type="tel"
          placeholder="090-1234-5678"
          value={form.phone}
          onChange={(e) => updateField("phone", e.target.value)}
          style={inputStyle(!!errors.phone)}
        />
        {errors.phone && (
          <p style={{ fontSize: 10, color: "#E53935", marginTop: 4 }}>{errors.phone}</p>
        )}
      </div>

      <div style={{ marginBottom: 16 }}>
        <label
          style={{
            fontSize: 12,
            fontWeight: 600,
            color: "#4A5C5E",
            marginBottom: 5,
            display: "flex",
            alignItems: "center",
            gap: 4,
          }}
        >
          郵便番号 <span style={{ fontSize: 9.5, color: "#E53935", fontWeight: 700 }}>必須</span>
        </label>
        <input
          type="text"
          placeholder="460-0008"
          value={form.postalCode}
          onChange={(e) => updateField("postalCode", e.target.value)}
          style={inputStyle()}
        />
      </div>

      <div style={{ marginBottom: 16 }}>
        <label
          style={{
            fontSize: 12,
            fontWeight: 600,
            color: "#4A5C5E",
            marginBottom: 5,
            display: "flex",
            alignItems: "center",
            gap: 4,
          }}
        >
          都道府県 <span style={{ fontSize: 9.5, color: "#E53935", fontWeight: 700 }}>必須</span>
        </label>
        <input
          type="text"
          placeholder="愛知県"
          value={form.prefecture}
          onChange={(e) => updateField("prefecture", e.target.value)}
          style={inputStyle()}
        />
      </div>

      <div style={{ marginBottom: 16 }}>
        <label
          style={{
            fontSize: 12,
            fontWeight: 600,
            color: "#4A5C5E",
            marginBottom: 5,
            display: "flex",
            alignItems: "center",
            gap: 4,
          }}
        >
          市区町村 <span style={{ fontSize: 9.5, color: "#E53935", fontWeight: 700 }}>必須</span>
        </label>
        <input
          type="text"
          placeholder="名古屋市中区栄"
          value={form.city}
          onChange={(e) => updateField("city", e.target.value)}
          style={inputStyle()}
        />
      </div>

      <div style={{ marginBottom: 16 }}>
        <label
          style={{
            fontSize: 12,
            fontWeight: 600,
            color: "#4A5C5E",
            marginBottom: 5,
            display: "flex",
            alignItems: "center",
            gap: 4,
          }}
        >
          番地・建物名{" "}
          <span style={{ fontSize: 9.5, color: "#BFC9CA", fontWeight: 500 }}>
            任意
          </span>
        </label>
        <input
          type="text"
          placeholder="1-2-3 〇〇マンション101号室"
          value={form.addressDetail}
          onChange={(e) => updateField("addressDetail", e.target.value)}
          style={inputStyle()}
        />
      </div>

      {/* Privacy agree */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: 8,
          margin: "20px 0",
          cursor: "pointer",
        }}
        onClick={() => setPrivacyAgreed((prev) => !prev)}
      >
        <div
          style={{
            width: 20,
            height: 20,
            border: `2px solid ${privacyAgreed ? "#2ABFA4" : "#E8EDEF"}`,
            borderRadius: 5,
            flexShrink: 0,
            marginTop: 1,
            background: privacyAgreed ? "#2ABFA4" : "transparent",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontSize: 11,
            fontWeight: 800,
          }}
        >
          {privacyAgreed ? "✓" : ""}
        </div>
        <span
          style={{
            fontSize: 11.5,
            lineHeight: 1.5,
            color: "#4A5C5E",
          }}
        >
          <a
            href="/privacy"
            style={{ color: "#1D9980", textDecoration: "underline" }}
            onClick={(e) => e.stopPropagation()}
          >
            利用規約
          </a>
          ・
          <a
            href="/privacy"
            style={{ color: "#1D9980", textDecoration: "underline" }}
            onClick={(e) => e.stopPropagation()}
          >
            プライバシーポリシー
          </a>
          に同意する
        </span>
      </div>
      {errors.privacy && (
        <p style={{ fontSize: 10, color: "#E53935", marginBottom: 8 }}>
          {errors.privacy}
        </p>
      )}

      {errors.submit && (
        <p
          style={{
            fontSize: 12,
            color: "#E53935",
            background: "#FFF0F0",
            padding: "10px 14px",
            borderRadius: 12,
            marginBottom: 12,
          }}
        >
          {errors.submit}
        </p>
      )}

      {/* Submit button */}
      <button
        type="button"
        onClick={handleSubmit}
        disabled={submitting}
        style={{
          width: "100%",
          padding: 18,
          background: "linear-gradient(135deg,#FF9F43,#E8740C)",
          color: "white",
          border: "none",
          borderRadius: 18,
          fontSize: 16,
          fontWeight: 700,
          fontFamily: "'Noto Sans JP', sans-serif",
          cursor: submitting ? "not-allowed" : "pointer",
          boxShadow: "0 6px 24px rgba(232,116,12,0.3)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          opacity: submitting ? 0.7 : 1,
        }}
      >
        {submitting ? (
          <>
            <span
              className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"
            />
            送信中...
          </>
        ) : (
          <>📩 選んだ会社に無料で資料請求する</>
        )}
      </button>
      <p
        style={{
          textAlign: "center",
          fontSize: 11,
          color: "#BFC9CA",
          marginTop: 10,
        }}
      >
        ※ 30秒で完了。しつこい営業電話はありません。
      </p>
    </div>
  );
}
