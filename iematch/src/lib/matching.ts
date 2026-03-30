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

// === 第1段階: 必須フィルタ ===
export function filterBuilders(answers: Answer[], builders: Builder[]): Builder[] {
  return builders.filter((b) => {
    // Q7は配列（複数エリア）または文字列（レガシー）
    const userAreas = getAnswerArray(answers, "Q7");
    if (userAreas.length > 0) {
      // 選択エリアを展開して、いずれかに工務店が対応しているかチェック
      const expandedAreas = userAreas.flatMap(expandArea);
      const hasMatch = expandedAreas.some((area) => b.b1_areas.includes(area));
      if (!hasMatch) return false;
    }

    const userBudget = getAnswer(answers, "Q4");
    if (userBudget && userBudget !== "undecided" && !b.b2_priceRanges.includes(userBudget)) {
      return false;
    }

    return true;
  });
}

/**
 * 新しい画像タグ → 工務店データの旧スタイル値へのマッピング
 * 1つのタグが複数の旧スタイルに対応する場合がある
 */
const TAG_TO_BUILDER_STYLES: Record<string, string[]> = {
  natural: ["natural_nordic", "natural_wood"],
  modern: ["simple_modern", "monotone"],
  simple: ["simple_modern", "white_clean", "hiraya"],
  japanese: ["japanese_modern", "japanese"],
  industrial: ["industrial", "cafe_vintage"],
  luxury: ["resort", "colorful"],
};

function builderHasTag(builderStyles: string[], tag: string): boolean {
  const mapped = TAG_TO_BUILDER_STYLES[tag] ?? [];
  return mapped.some((s) => builderStyles.includes(s));
}

function builderBestMatchesTag(bestStyle: string, tag: string): boolean {
  const mapped = TAG_TO_BUILDER_STYLES[tag] ?? [];
  return mapped.includes(bestStyle);
}

// === デザイン適合: 外観（18点満点）===
// 画像選択から集計したタグカウントと工務店の得意タグを掛け合わせて加点
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
// 画像選択から集計したタグカウントと工務店の得意タグを掛け合わせて加点
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
  const q8 = getAnswer(answers, "Q8");
  const q9 = getAnswer(answers, "Q9");

  if (q8 !== "searching" && q8 !== "not_started") return 0;
  if (!builder.b5_services.includes("land_support")) return 0;

  if (q9 === "yes_please") return 6;
  if (q9 === "both") return 4;
  return 0;
}

// === サービス適合: ライフスタイル（4点）===
function calcLifestyleServiceScore(answers: Answer[], builder: Builder): number {
  const q11 = getAnswerArray(answers, "Q11");
  let score = 0;

  if (q11.includes("pet") && builder.b5_services.includes("pet_design")) score += 2;
  if (q11.includes("hobby_room") && builder.b5_services.includes("hobby_room_design")) score += 2;

  return Math.min(score, 4);
}

// === ボーナス加点（10点満点）===
function calcBonusScore(answers: Answer[], builder: Builder): number {
  let score = 0;

  // 予算一致ボーナス (+4)
  const userBudget = getAnswer(answers, "Q4");
  if (userBudget && userBudget !== "undecided" && userBudget === builder.b2_mainPriceRange) {
    score += 4;
  }

  // デザイン一致ボーナス (+3)
  // 選択画像のタグで最も多いものがbestStyleと一致すれば加点
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
    custom_design: "自由設計",
  };

  const styleTagLabels: Record<string, string> = {
    natural: "ナチュラル",
    modern: "モダン",
    simple: "シンプル",
    japanese: "和テイスト",
    industrial: "インダストリアル",
    luxury: "ラグジュアリー",
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
  const q8 = getAnswer(answers, "Q8");
  const hasLandQuestion = q8 === "searching" || q8 === "not_started";

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

  // ソート: マッチ度降順 → 同率なら素点降順
  const sorted = scored.sort((a, b) => {
    if (b.displayMatchRate !== a.displayMatchRate) return b.displayMatchRate - a.displayMatchRate;
    return b.rawScore - a.rawScore;
  });

  // スコア降順で全件返す（絞り込みは呼び出し側で行う）
  return sorted;
}
