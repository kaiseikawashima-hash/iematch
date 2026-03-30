import { Answer, Builder, Recommendation } from "@/types";
import { nagoyaWards } from "@/data/areas";
import { countTags } from "@/data/styleImages";

// === ヘルパー関数 ===
function getAnswer(answers: Answer[], questionId: string): string | undefined {
  const a = answers.find((a) => a.questionId === questionId);
  if (!a) return undefined;
  return typeof a.value === "string" ? a.value : undefined;
}

function getAnswerArray(answers: Answer[], questionId: string): string[] {
  const a = answers.find((a) => a.questionId === questionId);
  if (!a) return [];
  return Array.isArray(a.value) ? a.value : [a.value];
}

function getRanked(answers: Answer[], questionId: string): string[] {
  const a = answers.find((a) => a.questionId === questionId);
  if (!a) return [];
  return a.rank ?? (Array.isArray(a.value) ? a.value : [a.value]);
}

// ユーザー選択エリアを工務店データの区単位に展開
function expandArea(area: string): readonly string[] {
  if (area === "名古屋市") return nagoyaWards;
  return [area];
}

// === 予算マッピング ===
// 新Q7の建物予算値 → 旧工務店データの価格帯にマッピング
const BUILDING_BUDGET_TO_RANGES: Record<string, string[]> = {
  under_2000: ["under_2500"],
  "2000_2500": ["under_2500"],
  "2500_3000": ["2500_3500"],
  "3000_3500": ["2500_3500", "3500_4500"],
  "3500_4000": ["3500_4500"],
  "4000_5000": ["3500_4500", "4500_5500"],
  "5000_6500": ["4500_5500", "over_5500"],
  over_6500: ["over_5500"],
};

// 新Q7の総予算値 → 旧工務店データの価格帯にマッピング（土地代を差し引いて推定）
const TOTAL_BUDGET_TO_RANGES: Record<string, string[]> = {
  under_4000: ["under_2500"],
  "4000_5000": ["under_2500", "2500_3500"],
  "5000_5500": ["2500_3500", "3500_4500"],
  "5500_6000": ["3500_4500"],
  "6000_7000": ["3500_4500", "4500_5500"],
  "7000_8000": ["4500_5500", "over_5500"],
  "8000_10000": ["over_5500"],
  over_10000: ["over_5500"],
};

// === 第1段階: 必須フィルタ ===
export function filterBuilders(answers: Answer[], builders: Builder[]): Builder[] {
  return builders.filter((b) => {
    // Q4: エリアフィルタ
    const userAreas = getAnswerArray(answers, "Q4");
    if (userAreas.length > 0) {
      const expandedAreas = userAreas.flatMap(expandArea);
      const hasMatch = expandedAreas.some((area) => b.b1_areas.includes(area));
      if (!hasMatch) return false;
    }

    // Q7: 予算フィルタ（Q6の土地状況に応じてマッピングを切り替え）
    const userBudget = getAnswer(answers, "Q7");
    if (userBudget) {
      const landStatus = getAnswer(answers, "Q6");
      const isTotal = landStatus === "searching" || landStatus === "not_started";
      const mapping = isTotal ? TOTAL_BUDGET_TO_RANGES : BUILDING_BUDGET_TO_RANGES;
      const matchRanges = mapping[userBudget] ?? [];
      if (matchRanges.length > 0 && !matchRanges.some((r) => b.b2_priceRanges.includes(r))) {
        return false;
      }
    }

    return true;
  });
}

/**
 * 画像タグ → 工務店スタイル値へのマッピング（1:1対応）
 */
const TAG_TO_BUILDER_STYLES: Record<string, string[]> = {
  industrial: ["industrial"],
  japanese: ["japanese"],
  luxury: ["luxury"],
  modern: ["modern"],
  natural: ["natural"],
  simple: ["simple"],
  other: ["other"],
};

function builderHasTag(builderStyles: string[], tag: string): boolean {
  const mapped = TAG_TO_BUILDER_STYLES[tag] ?? [tag];
  return mapped.some((s) => builderStyles.includes(s));
}

function builderBestMatchesTag(bestStyle: string, tag: string): boolean {
  const mapped = TAG_TO_BUILDER_STYLES[tag] ?? [tag];
  return mapped.includes(bestStyle);
}

// === デザイン適合: 外観（18点満点）===
function calcExteriorScore(userImageIds: string[], builder: Builder): number {
  const tagCounts = countTags(userImageIds);
  let score = 0;

  for (const [tag, count] of Object.entries(tagCounts)) {
    if (builderBestMatchesTag(builder.b3_bestStyle, tag)) {
      score += 5 * count;
    } else if (builderHasTag(builder.b3_exteriorStyles, tag)) {
      score += 3 * count;
    }
  }
  return Math.min(score, 18);
}

// === デザイン適合: 内装（12点満点）===
function calcInteriorScore(userImageIds: string[], builder: Builder): number {
  const tagCounts = countTags(userImageIds);
  let score = 0;

  for (const [tag, count] of Object.entries(tagCounts)) {
    if (builderHasTag(builder.b3_interiorStyles, tag)) {
      score += 3 * count;
    }
  }
  return Math.min(score, 12);
}

// === 価値観適合: 会社選びの軸（18点満点）===
function calcValuesAxisScore(userRanked: string[], builder: Builder): number {
  let score = 0;
  const bTop = builder.b7_topStrengths;

  if (userRanked.length > 0) {
    if (bTop.length > 0 && userRanked[0] === bTop[0]) {
      score += 10;
    } else if (bTop.includes(userRanked[0])) {
      score += 7;
    }
  }
  if (userRanked.length > 1 && bTop.includes(userRanked[1])) {
    score += 5;
  }
  if (userRanked.length > 2 && bTop.includes(userRanked[2])) {
    score += 3;
  }

  return Math.min(score, 18);
}

// === 価値観適合: 接客スタイル（12点満点）===
function calcStyleScore(q19Values: string[], builder: Builder): number {
  const mapping: Record<string, string> = {
    listening: "nurturing",
    proposal: "proactive",
    response: "speedy",
    honest: "honest",
    expertise: "expert",
  };

  let score = 0;
  for (const q19Value of q19Values) {
    const targetStyle = mapping[q19Value];
    if (!targetStyle) continue;
    if (builder.b6_styles.includes(targetStyle)) {
      score += 6;
    }
  }
  return Math.min(score, 12);
}

// === 性能適合: 重視性能（14点満点）===
function calcPerformanceScore(userRanked: string[], builder: Builder): number {
  if (userRanked.includes("none")) return 7;

  let score = 0;
  if (userRanked.length > 0 && builder.b4_strengths.includes(userRanked[0])) score += 6;
  if (userRanked.length > 1 && builder.b4_strengths.includes(userRanked[1])) score += 4;
  if (userRanked.length > 2 && builder.b4_strengths.includes(userRanked[2])) score += 4;

  return Math.min(score, 14);
}

// === 性能適合: 仕様テーマ（6点満点）===
function calcSpecScore(userSpecs: string[], builder: Builder): number {
  if (userSpecs.includes("none")) return 3;

  const matchCount = userSpecs.filter((s) => builder.b4_specs.includes(s)).length;
  return Math.min(matchCount * 2, 6);
}

// === サービス適合: 土地サポート（6点）===
function calcLandSupportScore(answers: Answer[], builder: Builder): number {
  const q6 = getAnswer(answers, "Q6");
  const q9 = getAnswer(answers, "Q9");

  if (q6 !== "searching" && q6 !== "not_started") return 0;
  if (!builder.b5_services.includes("land_support")) return 0;

  if (q9 === "yes_please") return 6;
  if (q9 === "info_wanted") return 4;
  return 0;
}

// === サービス適合: ライフスタイル（4点）===
function calcLifestyleServiceScore(answers: Answer[], builder: Builder): number {
  const q11 = getAnswerArray(answers, "Q11");
  let score = 0;

  if (q11.includes("pet") && builder.b5_services.includes("pet_design")) score += 2;
  if (
    (q11.includes("entertainment") || q11.includes("diy")) &&
    builder.b5_services.includes("hobby_room_design")
  )
    score += 2;

  return Math.min(score, 4);
}

// === ボーナス加点（10点満点）===
function calcBonusScore(answers: Answer[], builder: Builder): number {
  let score = 0;

  // 予算一致ボーナス (+4)
  const userBudget = getAnswer(answers, "Q7");
  const landStatus = getAnswer(answers, "Q6");
  if (userBudget) {
    const isTotal = landStatus === "searching" || landStatus === "not_started";
    const mapping = isTotal ? TOTAL_BUDGET_TO_RANGES : BUILDING_BUDGET_TO_RANGES;
    const matchRanges = mapping[userBudget] ?? [];
    if (matchRanges.includes(builder.b2_mainPriceRange)) {
      score += 4;
    }
  }

  // デザイン一致ボーナス (+3)
  const q13 = getAnswerArray(answers, "Q13");
  const q13Tags = countTags(q13);
  const topTag = Object.entries(q13Tags).sort((a, b) => b[1] - a[1])[0];
  if (topTag && builderBestMatchesTag(builder.b3_bestStyle, topTag[0])) {
    score += 3;
  }

  // 強み一致ボーナス (+3)
  const q17Ranked = getRanked(answers, "Q17");
  if (
    q17Ranked.length > 0 &&
    builder.b7_topStrengths.length > 0 &&
    q17Ranked[0] === builder.b7_topStrengths[0]
  ) {
    score += 3;
  }

  return Math.min(score, 10);
}

// === 第2段階: スコア算出（100点満点）===
export function calculateMatchScore(answers: Answer[], builder: Builder): number {
  const q13 = getAnswerArray(answers, "Q13");
  const q14 = getAnswerArray(answers, "Q14");
  const q15 = getRanked(answers, "Q15");
  const q16 = getAnswerArray(answers, "Q16");
  const q17 = getRanked(answers, "Q17");
  const q19 = getAnswerArray(answers, "Q19");

  const exterior = calcExteriorScore(q13, builder);
  const interior = calcInteriorScore(q14, builder);
  const valuesAxis = calcValuesAxisScore(q17, builder);
  const style = calcStyleScore(q19, builder);
  const performance = calcPerformanceScore(q15, builder);
  const spec = calcSpecScore(q16, builder);
  const landSupport = calcLandSupportScore(answers, builder);
  const lifestyleService = calcLifestyleServiceScore(answers, builder);
  const bonus = calcBonusScore(answers, builder);

  return exterior + interior + valuesAxis + style + performance + spec + landSupport + lifestyleService + bonus;
}

// === 第3段階: マッチ度変換 ===
export function toDisplayRate(rawScore: number, hasLandQuestion: boolean): number {
  const maxScore = hasLandQuestion ? 100 : 94;
  const rawRate = (rawScore / maxScore) * 100;
  const displayRate = 60 + rawRate * 0.4;
  return Math.round(displayRate);
}

// === おすすめ理由テキスト生成 ===
function generateReasonText(answers: Answer[], builder: Builder): string {
  const q17 = getRanked(answers, "Q17");
  const q13 = getAnswerArray(answers, "Q13");

  const strengthLabels: Record<string, string> = {
    design: "デザイン力",
    cost: "コストパフォーマンス",
    performance: "住宅性能",
    personality: "担当者の人柄",
    after_service: "アフターサービス",
    track_record: "施工実績",
    land_support: "土地探しサポート",
    lifestyle: "暮らし提案力",
  };

  const styleTagLabels: Record<string, string> = {
    industrial: "インダストリアル",
    japanese: "和テイスト",
    luxury: "ラグジュアリー",
    modern: "モダン",
    natural: "ナチュラル",
    simple: "シンプル",
  };

  const parts: string[] = [];

  // 会社選びの軸との一致
  if (q17.length > 0 && builder.b7_topStrengths.includes(q17[0])) {
    const label = strengthLabels[q17[0]] ?? q17[0];
    parts.push(`あなたが重視する「${label}」に強みを持つ会社です。`);
  }

  // デザインの一致（画像タグベース）
  const extTagCounts = countTags(q13);
  const topExtTag = Object.entries(extTagCounts).sort((a, b) => b[1] - a[1])[0];
  if (topExtTag && builderHasTag(builder.b3_exteriorStyles, topExtTag[0])) {
    const label = styleTagLabels[topExtTag[0]] ?? topExtTag[0];
    parts.push(`お好みの「${label}」テイストの施工実績が豊富です。`);
  }

  // 性能の特徴
  if (builder.b4_values.ua !== undefined && builder.b4_values.ua <= 0.4) {
    parts.push(`UA値${builder.b4_values.ua}の高断熱仕様で、快適な住環境を実現します。`);
  }

  if (parts.length === 0) {
    parts.push(`${builder.name}は、あなたのご要望にバランスよくマッチしている会社です。`);
  }

  return parts.join(" ");
}

// === 第4段階: 上位3社選出 ===
export function getRecommendations(answers: Answer[], builders: Builder[]): Recommendation[] {
  const filtered = filterBuilders(answers, builders);
  const q6 = getAnswer(answers, "Q6");
  const hasLandQuestion = q6 === "searching" || q6 === "not_started";

  const scored = filtered.map((builder) => {
    const rawScore = calculateMatchScore(answers, builder);
    const displayMatchRate = toDisplayRate(rawScore, hasLandQuestion);
    const reasonText = generateReasonText(answers, builder);

    return {
      builderId: builder.id,
      rawScore,
      displayMatchRate,
      reasonText,
    };
  });

  const sorted = scored.sort((a, b) => {
    if (b.displayMatchRate !== a.displayMatchRate) return b.displayMatchRate - a.displayMatchRate;
    return b.rawScore - a.rawScore;
  });

  return sorted;
}
