"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { DiagnosisResult, UserAnswers, Answer } from "@/types";
import { runDiagnosis } from "@/lib/diagnosis";
import { getRecommendations } from "@/lib/matching";
import { useBuilders } from "@/hooks/useBuilders";
import { typeDefinitions } from "@/data/types";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { RadarChart } from "@/components/result/RadarChart";
import { TypeBadge } from "@/components/result/TypeBadge";
import { PhotoCarousel } from "@/components/result/PhotoCarousel";

type Correction = {
  afterQuestion: string;
  text: string;
};

// 回答から診断理由ポイントを抽出
function extractReasonPoints(answers: Answer[]): string[] {
  const points: string[] = [];

  const q17 = answers.find((a) => a.questionId === "Q17");
  if (q17 && Array.isArray(q17.rank) && q17.rank.length > 0) {
    const topLabel = strengthLabel(q17.rank[0]);
    points.push(
      `住宅会社を選ぶとき最も重視すること → 「${topLabel}」`
    );
  }

  const q15 = answers.find((a) => a.questionId === "Q15");
  if (q15 && Array.isArray(q15.rank) && q15.rank.length > 0) {
    const specLabel = specName(q15.rank[0]);
    points.push(
      `住宅性能で特に重視 → 「${specLabel}」`
    );
  }

  const q11 = answers.find((a) => a.questionId === "Q11");
  if (q11 && Array.isArray(q11.value) && q11.value.length > 0) {
    const lifestyleLabel = lifestyleName(q11.value[0]);
    points.push(
      `暮らしで大切にしていること → 「${lifestyleLabel}」`
    );
  }

  return points.slice(0, 3);
}

function strengthLabel(value: string): string {
  const labels: Record<string, string> = {
    design: "デザイン力",
    cost: "コストパフォーマンス",
    performance: "住宅性能",
    personality: "担当者の人柄",
    after_service: "アフターサービス",
    track_record: "施工実績",
    land_support: "土地探しサポート",
    custom_design: "自由設計",
  };
  return labels[value] ?? value;
}

function specName(value: string): string {
  const labels: Record<string, string> = {
    insulation: "断熱性能",
    seismic: "耐震性能",
    airtight: "気密性能",
    energy: "省エネ性能",
    soundproof: "防音性能",
    natural_material: "自然素材",
    maintenance: "メンテナンス性",
    none: "特になし",
  };
  return labels[value] ?? value;
}

function lifestyleName(value: string): string {
  const labels: Record<string, string> = {
    cooking: "料理を楽しむ",
    family_living: "家族でリビングで過ごす",
    remote_work: "在宅ワーク",
    hobby_room: "趣味の部屋",
    outdoor_living: "アウトドアリビング",
    pet: "ペットと暮らす",
    storage: "収納をたっぷり",
    housework: "家事を効率化",
  };
  return labels[value] ?? value;
}

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

    // 初期選択状態: 初期表示の上位5社を選択
    const sorted = [...recommendations].sort(
      (a, b) => b.displayMatchRate - a.displayMatchRate
    );
    const filtered = sorted.filter((r) => r.displayMatchRate >= 40);
    const displayed = (filtered.length >= 10 ? filtered.slice(0, 10) : sorted.slice(0, 10));
    setSelectedIds(new Set(displayed.slice(0, 5).map((r) => r.builderId)));

    // Gemini比較セット説明文を取得
    fetchComparisonText(diagResult, userAnswers.answers, parsedCorrections);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router, builders, buildersLoading]);

  const fetchComparisonText = useCallback(
    async (diagResult: DiagnosisResult, userAnswers: Answer[], userCorrections: Correction[]) => {
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
        // フォールバック: 何も表示しない
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

  // 工務店の絞り込み: マッチ度40%以上、足りなければ上位10社まで補充
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

  if (!result) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-brand border-t-transparent" />
          <p className="mt-3 text-sm text-muted-foreground">
            診断結果を計算中...
          </p>
        </div>
      </div>
    );
  }

  const typeInfo = typeDefinitions[result.mainType];
  const reasonPoints = extractReasonPoints(answers);

  return (
    <div
      className="flex min-h-screen flex-col"
      style={{ background: "#F5F4F0" }}
    >
      <Header />

      <main className="mx-auto w-full max-w-lg flex-1 px-4 py-6">
        {/* ① あなたの家づくりタイプ */}
        <section className="rounded-2xl bg-white p-6 shadow-sm">
          <p className="text-center text-xs font-medium text-muted-foreground">
            あなたの家づくりタイプ
          </p>
          <div className="mt-3 text-center">
            <TypeBadge
              mainType={result.mainType}
              subType={result.subType}
              displayLabel={result.displayLabel}
            />
          </div>
          <p className="mt-2 text-center text-base font-bold text-brand-dark">
            {typeInfo.catchCopy}
          </p>
          <p className="mt-3 text-sm leading-relaxed text-gray-600">
            {typeInfo.description}
          </p>
        </section>

        {/* ② あなた専用の比較セット */}
        <section className="mt-6">
          <h3 className="mb-3 text-center text-sm font-bold">
            あなた専用の比較セット
          </h3>

          {/* Gemini比較セット説明文 */}
          {comparisonLoading ? (
            <div className="mb-4 flex justify-center">
              <div
                className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300"
                style={{ borderTopColor: "#2E5240" }}
              />
            </div>
          ) : comparisonText ? (
            <p className="mb-4 rounded-xl bg-white px-4 py-3 text-xs leading-relaxed text-gray-600 shadow-sm">
              {comparisonText}
            </p>
          ) : null}

          {/* CTAバナー */}
          <div
            className="mb-4 rounded-xl py-6 px-8 text-center"
            style={{ backgroundColor: "#E8F0EB" }}
          >
            <p className="text-sm font-bold" style={{ color: "#2E5240" }}>
              気になる会社は見つかりましたか？
            </p>
            <p className="mt-1 text-xs" style={{ color: "#2E5240" }}>
              資料請求は無料・営業電話なし。1分で完了します。
            </p>
            <button
              type="button"
              onClick={() => {
                document
                  .getElementById("cta-request")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
              className="mt-3 rounded-full px-8 py-3 text-sm font-bold text-white transition-colors"
              style={{ backgroundColor: "#2E5240" }}
            >
              まとめて資料請求する →
            </button>
          </div>

          <div className="space-y-4">
            {recs.map((rec, index) => {
              const builder = builders.find((b) => b.id === rec.builderId);
              if (!builder) return null;

              const isSelected = selectedIds.has(rec.builderId);

              // バッジ設定
              let badgeLabel = "";
              let badgeBg = "";
              if (index === 0) {
                badgeLabel = "ベストマッチ";
                badgeBg = "#2E5240";
              } else if (index === 2) {
                badgeLabel = "新しい発見";
                badgeBg = "#F59E0B";
              }

              // 2社目のラベル
              const q17 = answers.find((a) => a.questionId === "Q17");
              const topStrength =
                q17 && Array.isArray(q17.rank) && q17.rank[0]
                  ? strengthLabel(q17.rank[0])
                  : null;

              return (
                <div
                  key={rec.builderId}
                  className="overflow-hidden rounded-2xl bg-white shadow-sm"
                >
                  {/* 写真エリア */}
                  <div className="relative">
                    <PhotoCarousel photos={builder.photos} />

                    {/* バッジ */}
                    {badgeLabel && (
                      <div
                        className="absolute left-3 top-3 rounded-full px-3 py-1 text-xs font-bold text-white"
                        style={{ background: badgeBg }}
                      >
                        {badgeLabel}
                      </div>
                    )}

                    {/* 2社目ラベル */}
                    {index === 1 && topStrength && (
                      <div className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-brand backdrop-blur-sm">
                        あなたの最重要条件「{topStrength}」に最も強い
                      </div>
                    )}

                    {/* マッチ度 */}
                    <div className="absolute right-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-brand backdrop-blur-sm">
                      マッチ度 {rec.displayMatchRate}%
                    </div>
                  </div>

                  <div className="p-4">
                    <h4 className="text-base font-bold">{builder.name}</h4>
                    <p className="mt-1 text-xs leading-relaxed text-gray-500">
                      {rec.reasonText}
                    </p>

                    {/* 強みタグ */}
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {builder.b7_topStrengths.slice(0, 3).map((s) => (
                        <span
                          key={s}
                          className="rounded-full bg-brand-light px-2.5 py-0.5 text-[10px] font-medium text-brand-dark"
                        >
                          {builderStrengthLabel(s)}
                        </span>
                      ))}
                    </div>

                    {/* ボタン */}
                    <div className="mt-4 flex gap-2">
                      <button
                        type="button"
                        onClick={() => toggleBuilder(rec.builderId)}
                        className={`flex-1 rounded-full py-2.5 text-center text-xs font-bold transition-colors ${
                          isSelected
                            ? "bg-brand text-white"
                            : "border border-brand text-brand hover:bg-brand-light"
                        }`}
                      >
                        {isSelected ? "選択中" : "資料請求"}
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          router.push(`/builder/${builder.id}`)
                        }
                        className="flex-1 rounded-full border border-brand py-2.5 text-center text-xs font-bold text-brand transition-colors hover:bg-brand-light"
                      >
                        詳しく見る
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* さらに見るボタン */}
          {extraBuilders.length > 0 && (
            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={() => setShowMore((prev) => !prev)}
                className="inline-flex items-center gap-1.5 rounded-full border px-6 py-2.5 text-sm font-medium transition-colors hover:bg-white"
                style={{ borderColor: "#2E5240", color: "#2E5240" }}
              >
                {showMore
                  ? "閉じる \u2227"
                  : `さらに${extraBuilders.length}社を見る \u2228`}
              </button>
            </div>
          )}

          {/* 比較ヒント */}
          {recs.length >= 3 && (
            <div
              className="mt-4 rounded-xl border px-4 py-3"
              style={{ background: "#EFF6FF", borderColor: "#BFDBFE" }}
            >
              <p className="text-xs leading-relaxed text-blue-800">
                複数社の資料を見比べて、ここだけは譲れないと感じるポイントを見つけてください。それがあなたの本当の判断軸です。
              </p>
            </div>
          )}

          {recs.length === 0 && (
            <div className="rounded-2xl bg-white p-6 text-center shadow-sm">
              <p className="text-sm text-gray-500">
                条件に合う工務店が見つかりませんでした。
              </p>
              <button
                type="button"
                onClick={() => router.push("/diagnosis")}
                className="mt-4 rounded-full bg-brand px-6 py-2.5 text-sm font-medium text-white"
              >
                条件を変えてもう一度診断する
              </button>
            </div>
          )}
        </section>

        {/* ③ 診断詳細 */}
        <section className="mt-6 rounded-2xl bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-center text-sm font-bold">
            家づくり傾向
          </h3>
          <RadarChart values={result.radarValues} />

          {reasonPoints.length > 0 && (
            <div className="mt-6">
              <h4 className="mb-3 text-xs font-bold text-brand-dark">
                あなたがこのタイプになった理由
              </h4>
              <div className="space-y-2">
                {reasonPoints.map((point, i) => (
                  <div
                    key={i}
                    className="rounded-xl bg-gray-50 px-3 py-2.5 text-xs leading-relaxed text-gray-600"
                  >
                    {point}
                  </div>
                ))}
                <p className="mt-1 text-[10px] leading-relaxed text-muted-foreground">
                  これらの回答から「{typeInfo.label}」の傾向を強く示しています
                </p>
              </div>
            </div>
          )}
        </section>

        {/* ④ 家づくりアドバイス */}
        <section className="mt-4 rounded-2xl bg-white p-6 shadow-sm">
          <h3 className="mb-3 text-sm font-bold">家づくりアドバイス</h3>
          <div className="space-y-3">
            <div>
              <p className="text-xs font-medium text-brand-dark">
                あなたの強み
              </p>
              <ul className="mt-1 space-y-1">
                {typeInfo.strengths.map((s, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-xs text-gray-600"
                  >
                    <span className="mt-0.5 text-brand">●</span>
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs font-medium text-amber-700">
                注意ポイント
              </p>
              <ul className="mt-1 space-y-1">
                {typeInfo.cautions.map((c, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-xs text-gray-600"
                  >
                    <span className="mt-0.5 text-amber-500">▲</span>
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs font-medium text-blue-700">
                次のステップ
              </p>
              <ul className="mt-1 space-y-1">
                {typeInfo.nextSteps.map((n, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-xs text-gray-600"
                  >
                    <span className="mt-0.5 text-blue-500">{i + 1}.</span>
                    <span>{n}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {corrections.length > 0 && (
            <p className="mt-4 text-xs leading-relaxed text-gray-500">
              なお、診断中にご指摘いただいた点（
              {corrections.map((c) => c.text).join("、")}
              ）も考慮しておすすめを選んでいます。
            </p>
          )}
        </section>

        {/* ⑤ まとめて資料請求 */}
        {selectedIds.size > 0 && (
          <div id="cta-request" className="mt-6 text-center">
            <button
              type="button"
              onClick={() => {
                sessionStorage.setItem(
                  "iematch_request_builders",
                  JSON.stringify(Array.from(selectedIds))
                );
                router.push("/request");
              }}
              className="w-full rounded-full bg-brand py-4 text-base font-bold text-white shadow-lg transition-colors hover:bg-brand-dark"
            >
              まとめて資料請求する（{selectedIds.size}社）
            </button>
            <p className="mt-2 text-xs text-muted-foreground">
              無料・営業電話なし
            </p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
