"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { DiagnosisResult, UserAnswers } from "@/types";
import { runDiagnosis } from "@/lib/diagnosis";
import { getRecommendations } from "@/lib/matching";
import { builders } from "@/data/builders";
import { typeDefinitions } from "@/data/types";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { RadarChart } from "@/components/result/RadarChart";
import { TypeBadge } from "@/components/result/TypeBadge";
import { BuilderCard } from "@/components/result/BuilderCard";

export default function ResultPage() {
  const router = useRouter();
  const [result, setResult] = useState<DiagnosisResult | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem("iematch_answers");
    if (!stored) {
      router.push("/diagnosis");
      return;
    }

    const userAnswers: UserAnswers = JSON.parse(stored);
    const diagnosisBase = runDiagnosis(userAnswers.answers);
    const recommendations = getRecommendations(userAnswers.answers, builders);

    setResult({ ...diagnosisBase, recommendations });
  }, [router]);

  if (!result) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-brand border-t-transparent" />
          <p className="mt-3 text-sm text-muted-foreground">診断結果を計算中...</p>
        </div>
      </div>
    );
  }

  const typeInfo = typeDefinitions[result.mainType];
  const selectedBuilderIds = result.recommendations.map((r) => r.builderId);

  return (
    <div className="flex min-h-screen flex-col" style={{ background: "#F5F4F0" }}>
      <Header />

      <main className="mx-auto w-full max-w-lg flex-1 px-4 py-6">
        {/* ① タイプ診断結果 */}
        <section className="rounded-2xl bg-white p-6 shadow-sm">
          <p className="text-center text-xs font-medium text-muted-foreground">
            あなたの家づくりタイプは...
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

        {/* ② レーダーチャート */}
        <section className="mt-4 rounded-2xl bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-center text-sm font-bold">あなたの家づくりバランス</h3>
          <RadarChart values={result.radarValues} />
        </section>

        {/* ③ 家づくりアドバイス */}
        <section className="mt-4 rounded-2xl bg-white p-6 shadow-sm">
          <h3 className="mb-3 text-sm font-bold">家づくりアドバイス</h3>
          <div className="space-y-3">
            <div>
              <p className="text-xs font-medium text-brand-dark">あなたの強み</p>
              <ul className="mt-1 space-y-1">
                {typeInfo.strengths.map((s, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-gray-600">
                    <span className="mt-0.5 text-brand">●</span>
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs font-medium text-amber-700">注意ポイント</p>
              <ul className="mt-1 space-y-1">
                {typeInfo.cautions.map((c, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-gray-600">
                    <span className="mt-0.5 text-amber-500">▲</span>
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs font-medium text-blue-700">次のステップ</p>
              <ul className="mt-1 space-y-1">
                {typeInfo.nextSteps.map((n, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-gray-600">
                    <span className="mt-0.5 text-blue-500">{i + 1}.</span>
                    <span>{n}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ④ おすすめ工務店 */}
        <section className="mt-6">
          <h3 className="mb-4 text-center text-sm font-bold">
            あなたにおすすめの住宅会社
          </h3>
          <div className="space-y-4">
            {result.recommendations.map((rec, index) => {
              const builder = builders.find((b) => b.id === rec.builderId);
              if (!builder) return null;
              return (
                <BuilderCard
                  key={rec.builderId}
                  builder={builder}
                  matchRate={rec.displayMatchRate}
                  reasonText={rec.reasonText}
                  rank={index + 1}
                />
              );
            })}
          </div>

          {result.recommendations.length === 0 && (
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

        {/* ⑤ まとめて資料請求 */}
        {result.recommendations.length > 0 && (
          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => {
                sessionStorage.setItem(
                  "iematch_request_builders",
                  JSON.stringify(selectedBuilderIds)
                );
                router.push("/request");
              }}
              className="w-full rounded-full bg-brand py-4 text-base font-bold text-white shadow-lg transition-colors hover:bg-brand-dark"
            >
              まとめて資料請求する（{result.recommendations.length}社）
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
