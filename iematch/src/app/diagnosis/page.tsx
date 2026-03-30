"use client";

import { useState, useCallback, useMemo, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Answer, FamilyData } from "@/types";
import { questions as baseQuestions } from "@/data/questions";
import { getImages, applyImageOverrides } from "@/lib/getImages";
import { Header } from "@/components/layout/Header";
import { ProgressBar } from "@/components/diagnosis/ProgressBar";
import { SingleSelectCard } from "@/components/diagnosis/SingleSelectCard";
import { MultiSelectCard } from "@/components/diagnosis/MultiSelectCard";
import { ImageSelectCard } from "@/components/diagnosis/ImageSelectCard";
import { RankedSelectCard } from "@/components/diagnosis/RankedSelectCard";
import { CascadeSelect } from "@/components/diagnosis/CascadeSelect";
import { AreaMultiSelect } from "@/components/diagnosis/AreaMultiSelect";
import { FamilyInput } from "@/components/diagnosis/FamilyInput";
import { InsightCard } from "@/components/diagnosis/InsightCard";

// 配列シャッフル（Fisher-Yates）
function shuffle<T>(arr: readonly T[]): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

// Q13・Q14の画像optionsをシャッフルした質問リストを返す
function shuffleImageOptions<T extends { id: string; type: string; options: readonly U[] }, U>(questions: T[]): T[] {
  return questions.map((q) => {
    if ((q.id === "Q13" || q.id === "Q14") && q.type === "image") {
      return { ...q, options: shuffle(q.options) };
    }
    return q;
  });
}

// インサイト表示対象の質問ID
const INSIGHT_TRIGGER_IDS = new Set(["Q6", "Q14", "Q19"]);

// 先行呼び出しマップ: この質問の回答選択時に次のトリガーのinsightを先行取得
const PREFETCH_MAP: Record<string, { triggerId: string; category: string }> = {
  Q5:  { triggerId: "Q6",  category: "予算・資金計画" },
  Q13: { triggerId: "Q14", category: "デザインの好み" },
  Q18: { triggerId: "Q19", category: "会社選びの軸" },
};

// 条件分岐を考慮した表示質問リストを算出
function getVisibleQuestions(answers: Answer[], questions: typeof baseQuestions) {
  return questions.filter((q) => {
    if (!q.condition) return true;
    const dep = answers.find((a) => a.questionId === q.condition!.dependsOn);
    if (!dep) return false;
    const depValue = typeof dep.value === "string" ? dep.value : "";
    return q.condition.showWhen.includes(depValue);
  });
}

export default function DiagnosisPage() {
  const router = useRouter();
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // 初回レンダリング時にQ13・Q14の画像順をシャッフル
  const [questions, setQuestions] = useState(() => shuffleImageOptions(baseQuestions));

  // Supabaseから画像URLを取得してQ13・Q14を上書き（シャッフル済みの順序を維持）
  useEffect(() => {
    getImages().then((imageMap) => {
      if (imageMap) {
        setQuestions((prev) => applyImageOverrides(prev, imageMap));
      }
    });
  }, []);

  // インサイト表示用ステート
  const [showInsight, setShowInsight] = useState(false);
  const [insightText, setInsightText] = useState<string | null>(null);
  const [insightLoading, setInsightLoading] = useState(false);
  const [insightTriggerId, setInsightTriggerId] = useState<string | null>(null);

  // インサイト先行取得キャッシュ
  const insightCacheRef = useRef<{
    triggerId: string;
    promise: Promise<string | null>;
  } | null>(null);

  // 先行取得を開始する（回答選択時にバックグラウンドで呼ぶ）
  const prefetchInsight = useCallback(
    (currentAnswers: Answer[], category: string, triggerId: string) => {
      const promise = fetch("/api/insight", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          answers: currentAnswers,
          currentCategory: category,
        }),
      })
        .then((res) => res.json())
        .then((data) => (data.insight as string) ?? null)
        .catch(() => null);

      insightCacheRef.current = { triggerId, promise };
    },
    []
  );

  // ローディング画面用
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);

  const loadingMessages = useMemo(
    () => [
      "回答データを分析しています",
      "あなたのタイプを判定中",
      "最適な工務店をマッチング中",
      "パーソナライズされた結果を生成中",
    ],
    []
  );

  useEffect(() => {
    if (!isLoading) return;
    const timer = setInterval(() => {
      setLoadingMessageIndex((prev) => (prev + 1) % loadingMessages.length);
    }, 2000);
    return () => clearInterval(timer);
  }, [isLoading, loadingMessages]);

  // 修正フィードバック用
  const [corrections, setCorrections] = useState<
    { afterQuestion: string; text: string }[]
  >([]);

  // 家族構成用ステート
  const [family, setFamily] = useState<FamilyData>({
    adults: 2,
    children: 1,
    futurePlan: "same",
  });

  // エリア用ステート（複数選択）
  const [selectedAreas, setSelectedAreas] = useState<string[]>([]);
  // レガシー: cascade用（将来削除可）
  const [prefecture, setPrefecture] = useState("");
  const [city, setCity] = useState("");

  const visibleQuestions = useMemo(() => getVisibleQuestions(answers, questions), [answers, questions]);
  const currentQuestion = visibleQuestions[currentIndex];
  const totalCategories = 7;

  // 現在の回答を取得
  const currentAnswer = useMemo(
    () => answers.find((a) => a.questionId === currentQuestion?.id),
    [answers, currentQuestion]
  );

  // 回答を更新（イミュータブル）+ インサイト先行取得
  const updateAnswer = useCallback(
    (questionId: string, value: string | string[], rank?: string[]) => {
      setAnswers((prev) => {
        const updated = [
          ...prev.filter((a) => a.questionId !== questionId),
          { questionId, value, rank },
        ];

        // Q5/Q13/Q18 回答時 → 次のトリガーのinsightを先行取得
        const prefetchTarget = PREFETCH_MAP[questionId];
        if (prefetchTarget) {
          prefetchInsight(updated, prefetchTarget.category, prefetchTarget.triggerId);
        }

        // Q6/Q14/Q19 回答時 → 完全なデータでinsightを先行取得（上書き）
        if (INSIGHT_TRIGGER_IDS.has(questionId)) {
          const q = questions.find((qq) => qq.id === questionId);
          if (q) {
            prefetchInsight(updated, q.categoryLabel, questionId);
          }
        }

        return updated;
      });
    },
    [prefetchInsight, questions]
  );

  // 単一選択ハンドラ
  const handleSingleSelect = useCallback(
    (value: string) => {
      if (!currentQuestion) return;
      updateAnswer(currentQuestion.id, value);
    },
    [currentQuestion, updateAnswer]
  );

  // 複数選択トグルハンドラ
  const handleMultiToggle = useCallback(
    (value: string) => {
      if (!currentQuestion) return;
      const current = Array.isArray(currentAnswer?.value)
        ? currentAnswer.value
        : [];

      // "none" 系の排他処理
      if (value === "none") {
        updateAnswer(currentQuestion.id, ["none"]);
        return;
      }

      const withoutNone = current.filter((v) => v !== "none");
      const updated = withoutNone.includes(value)
        ? withoutNone.filter((v) => v !== value)
        : [...withoutNone, value];
      updateAnswer(currentQuestion.id, updated);
    },
    [currentQuestion, currentAnswer, updateAnswer]
  );

  // ランキング選択ハンドラ
  const handleRankedSelect = useCallback(
    (value: string) => {
      if (!currentQuestion) return;
      const currentRank = currentAnswer?.rank ?? [];

      // "none" の排他処理
      if (value === "none") {
        updateAnswer(currentQuestion.id, ["none"], ["none"]);
        return;
      }

      const withoutNone = currentRank.filter((v) => v !== "none");
      const updated = [...withoutNone, value];
      updateAnswer(currentQuestion.id, updated, updated);
    },
    [currentQuestion, currentAnswer, updateAnswer]
  );

  const handleRankedRemove = useCallback(
    (value: string) => {
      if (!currentQuestion) return;
      const currentRank = currentAnswer?.rank ?? [];
      const updated = currentRank.filter((v) => v !== value);
      updateAnswer(currentQuestion.id, updated, updated);
    },
    [currentQuestion, currentAnswer, updateAnswer]
  );

  // エリア選択トグルハンドラ
  const handleAreaToggle = useCallback(
    (area: string) => {
      setSelectedAreas((prev) =>
        prev.includes(area)
          ? prev.filter((a) => a !== area)
          : [...prev, area]
      );
    },
    []
  );

  // 「次へ」ボタンの有効判定
  const canProceed = useMemo(() => {
    if (!currentQuestion) return false;

    switch (currentQuestion.type) {
      case "single":
        return !!currentAnswer?.value;
      case "multi": {
        const selected = Array.isArray(currentAnswer?.value) ? currentAnswer.value : [];
        return selected.length > 0;
      }
      case "image": {
        const selected = Array.isArray(currentAnswer?.value) ? currentAnswer.value : [];
        const min = currentQuestion.minSelect ?? 1;
        return selected.length >= min;
      }
      case "ranked": {
        const ranked = currentAnswer?.rank ?? [];
        if (ranked.includes("none")) return true;
        return ranked.length >= (currentQuestion.maxSelect ?? 1);
      }
      case "area":
        return selectedAreas.length > 0;
      case "cascade":
        return !!city;
      case "family":
        return !!family.futurePlan;
      default:
        return false;
    }
  }, [currentQuestion, currentAnswer, selectedAreas, city, family]);

  // インサイトを取得（キャッシュがあれば即表示）
  const fetchInsight = useCallback(
    async (currentAnswers: Answer[], category: string, triggerId: string) => {
      setShowInsight(true);
      setInsightTriggerId(triggerId);

      // キャッシュされた先行取得結果があるか確認
      const cached = insightCacheRef.current;
      if (cached && cached.triggerId === triggerId) {
        insightCacheRef.current = null;
        setInsightLoading(true);
        setInsightText(null);
        try {
          const insight = await cached.promise;
          if (insight) {
            setInsightText(insight);
            setInsightLoading(false);
            return;
          }
        } catch {
          // キャッシュ失敗 → 通常フローにフォールバック
        }
      }

      // キャッシュなし or 失敗 → 通常のAPI呼び出し
      setInsightLoading(true);
      setInsightText(null);
      try {
        const res = await fetch("/api/insight", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            answers: currentAnswers,
            currentCategory: category,
          }),
        });
        const data = await res.json();
        if (data.insight) {
          setInsightText(data.insight);
        } else {
          // API未設定 or エラー → スキップして次へ
          setShowInsight(false);
          setCurrentIndex((prev) => prev + 1);
        }
      } catch {
        // ネットワークエラー → スキップして次へ
        setShowInsight(false);
        setCurrentIndex((prev) => prev + 1);
      } finally {
        setInsightLoading(false);
      }
    },
    []
  );

  // インサイト画面を閉じて次へ（最後の質問なら結果画面へ）
  const handleInsightDismiss = useCallback(() => {
    setShowInsight(false);
    setInsightText(null);
    setInsightTriggerId(null);

    const nextVisibleQuestions = getVisibleQuestions(answers, questions);
    if (currentIndex >= nextVisibleQuestions.length - 1) {
      sessionStorage.setItem(
        "iematch_answers",
        JSON.stringify({
          answers,
          completedAt: new Date().toISOString(),
        })
      );
      sessionStorage.setItem("iematch_corrections", JSON.stringify(corrections));
      setIsLoading(true);
      router.push("/result");
      return;
    }

    setCurrentIndex((prev) => prev + 1);
  }, [answers, currentIndex, router, corrections, questions]);

  // 「ちょっと違うかも」→ 修正テキストを受け取って次へ
  const handleInsightDeny = useCallback(
    (correctionText: string) => {
      if (correctionText.trim() && insightTriggerId) {
        setCorrections((prev) => [
          ...prev,
          { afterQuestion: insightTriggerId, text: correctionText.trim() },
        ]);
      }
      handleInsightDismiss();
    },
    [insightTriggerId, handleInsightDismiss]
  );

  // 次へ
  const handleNext = useCallback(() => {
    if (!currentQuestion || !canProceed) return;

    // area の場合、回答を保存（複数選択 → 配列）
    if (currentQuestion.type === "area" && selectedAreas.length > 0) {
      updateAnswer(currentQuestion.id, selectedAreas);
    }

    // cascade の場合、回答を保存
    if (currentQuestion.type === "cascade" && city) {
      updateAnswer(currentQuestion.id, city);
    }

    // family の場合、回答を保存
    if (currentQuestion.type === "family") {
      updateAnswer(currentQuestion.id, [
        `adults:${family.adults}`,
        `children:${family.children}`,
        `plan:${family.futurePlan}`,
      ]);
    }

    // 最後の質問なら結果画面へ
    const buildAnswersForNavigation = () => {
      if (currentQuestion.type === "area") {
        return [...answers.filter((a) => a.questionId !== currentQuestion.id), { questionId: currentQuestion.id, value: selectedAreas }];
      }
      if (currentQuestion.type === "cascade") {
        return [...answers.filter((a) => a.questionId !== currentQuestion.id), { questionId: currentQuestion.id, value: city }];
      }
      return answers;
    };

    // インサイト対象の質問ならGeminiに問い合わせ（最終質問でも表示）
    if (INSIGHT_TRIGGER_IDS.has(currentQuestion.id)) {
      fetchInsight(buildAnswersForNavigation(), currentQuestion.categoryLabel, currentQuestion.id);
      return;
    }

    const nextVisibleQuestions = getVisibleQuestions(buildAnswersForNavigation(), questions);

    if (currentIndex >= nextVisibleQuestions.length - 1) {
      // 回答データをsessionStorageに保存して結果画面へ
      const finalAnswers = currentQuestion.type === "area"
        ? [...answers.filter((a) => a.questionId !== currentQuestion.id), { questionId: currentQuestion.id, value: selectedAreas }]
        : currentQuestion.type === "cascade"
          ? [...answers.filter((a) => a.questionId !== currentQuestion.id), { questionId: currentQuestion.id, value: city }]
          : currentQuestion.type === "family"
            ? [...answers.filter((a) => a.questionId !== currentQuestion.id), {
                questionId: currentQuestion.id,
                value: [`adults:${family.adults}`, `children:${family.children}`, `plan:${family.futurePlan}`],
              }]
            : answers;

      sessionStorage.setItem(
        "iematch_answers",
        JSON.stringify({
          answers: finalAnswers,
          completedAt: new Date().toISOString(),
        })
      );
      sessionStorage.setItem("iematch_corrections", JSON.stringify(corrections));
      setIsLoading(true);
      router.push("/result");
      return;
    }

    setCurrentIndex((prev) => prev + 1);
  }, [currentQuestion, canProceed, currentIndex, answers, selectedAreas, city, family, updateAnswer, router, fetchInsight, corrections]);

  // 戻る
  const handleBack = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  }, [currentIndex]);

  if (!currentQuestion) return null;

  // インサイト画面表示中
  if (showInsight) {
    return (
      <div className="flex min-h-screen flex-col" style={{ background: "#FEFCF9" }}>
        <Header />
        <main className="mx-auto w-full max-w-lg flex-1 px-4 py-6">
          <InsightCard
            insight={insightText}
            loading={insightLoading}
            onConfirm={handleInsightDismiss}
            onDeny={handleInsightDeny}
            onSkip={handleInsightDismiss}
          />
        </main>
      </div>
    );
  }

  const selectedArray = Array.isArray(currentAnswer?.value)
    ? currentAnswer!.value
    : [];
  const selectedSingle =
    typeof currentAnswer?.value === "string" ? currentAnswer.value : undefined;
  const rankedValues = currentAnswer?.rank ?? [];

  if (isLoading) {
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center"
        style={{ background: "#FEFCF9" }}
      >
        <div className="text-center">
          <p className="text-sm font-medium" style={{ color: "#2ABFA4", fontFamily: "'Zen Maru Gothic', sans-serif" }}>
            イエマッチAI
          </p>
          <div
            className="mx-auto mt-6 h-12 w-12 rounded-full border-[3px] border-t-transparent"
            style={{
              borderColor: "#2ABFA4",
              borderTopColor: "transparent",
              animation: "spin 1s linear infinite",
            }}
          />
          <p className="mt-6 text-lg font-bold" style={{ color: "#1A2B2E", fontFamily: "'Zen Maru Gothic', sans-serif" }}>
            あなたに最適な工務店を診断中...
          </p>
          <p className="mt-2 text-sm" style={{ color: "#4A5C5E" }}>
            {loadingMessages[loadingMessageIndex]}
          </p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col" style={{ background: "#FEFCF9" }}>
      <Header />

      <main className="mx-auto w-full max-w-lg flex-1 px-4 py-6">
        <ProgressBar
          categoryLabel={currentQuestion.categoryLabel}
          categoryNumber={currentQuestion.category}
          totalCategories={totalCategories}
          questionNumber={currentIndex + 1}
          totalQuestions={visibleQuestions.length}
        />

        <div className="mb-6">
          <h2 className="text-lg font-bold leading-relaxed">
            {currentQuestion.text}
          </h2>
          {currentQuestion.subText && (
            <p className="mt-1 text-xs text-muted-foreground">
              {currentQuestion.subText}
            </p>
          )}
        </div>

        {/* 質問タイプごとのコンポーネント */}
        {currentQuestion.type === "single" && (
          <SingleSelectCard
            options={currentQuestion.options}
            selected={selectedSingle}
            onSelect={handleSingleSelect}
          />
        )}

        {currentQuestion.type === "multi" && (
          <MultiSelectCard
            options={currentQuestion.options}
            selected={selectedArray}
            maxSelect={currentQuestion.maxSelect}
            onToggle={handleMultiToggle}
          />
        )}

        {currentQuestion.type === "image" && (
          <ImageSelectCard
            options={currentQuestion.options}
            selected={selectedArray}
            minSelect={currentQuestion.minSelect}
            maxSelect={currentQuestion.maxSelect}
            onToggle={handleMultiToggle}
          />
        )}

        {currentQuestion.type === "ranked" && (
          <RankedSelectCard
            options={currentQuestion.options}
            ranked={rankedValues}
            maxSelect={currentQuestion.maxSelect ?? 3}
            onSelect={handleRankedSelect}
            onRemove={handleRankedRemove}
          />
        )}

        {currentQuestion.type === "area" && (
          <AreaMultiSelect
            selected={selectedAreas}
            onToggle={handleAreaToggle}
          />
        )}

        {currentQuestion.type === "cascade" && (
          <CascadeSelect
            selectedPrefecture={prefecture}
            selectedCity={city}
            onPrefectureChange={setPrefecture}
            onCityChange={setCity}
          />
        )}

        {currentQuestion.type === "family" && (
          <FamilyInput
            family={family}
            futurePlanOptions={currentQuestion.options}
            onChange={setFamily}
          />
        )}

        {/* ナビゲーションボタン */}
        <div className="mt-8 flex gap-3">
          {currentIndex > 0 && (
            <button
              type="button"
              onClick={handleBack}
              className="flex h-12 flex-1 items-center justify-center rounded-full border border-black/10 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50"
            >
              戻る
            </button>
          )}
          <button
            type="button"
            onClick={handleNext}
            disabled={!canProceed}
            className={`flex h-12 flex-[2] items-center justify-center rounded-full text-sm font-medium text-white transition-all ${
              canProceed
                ? "bg-brand hover:bg-brand-dark shadow-sm"
                : "cursor-not-allowed bg-gray-300"
            }`}
          >
            {currentIndex >= visibleQuestions.length - 1 ? "診断結果を見る" : "次へ進む"}
            {currentQuestion.type === "multi" && selectedArray.length > 0 && (
              <span className="ml-1">（{selectedArray.length}件選択中）</span>
            )}
            {currentQuestion.type === "image" && selectedArray.length > 0 && (
              <span className="ml-1">（{selectedArray.length}枚選択中）</span>
            )}
            {currentQuestion.type === "ranked" && rankedValues.length > 0 && !rankedValues.includes("none") && (
              <span className="ml-1">（{rankedValues.length}件選択中）</span>
            )}
            {currentQuestion.type === "area" && selectedAreas.length > 0 && (
              <span className="ml-1">（{selectedAreas.length}件選択中）</span>
            )}
          </button>
        </div>
      </main>
    </div>
  );
}
