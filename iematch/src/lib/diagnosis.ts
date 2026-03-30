import { Answer, TypeName, RadarValues, DiagnosisResult } from "@/types";
import { typeDefinitions, subTypeLabels } from "@/data/types";
import { countTags } from "@/data/styleImages";

type TypeScores = Record<TypeName, number>;

const initialScores = (): TypeScores => ({
  designFirst: 0,
  performanceExpert: 0,
  costBalance: 0,
  lifestyleDesign: 0,
  trustPartner: 0,
  totalBalance: 0,
});

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

function addScore(scores: TypeScores, type: TypeName, points: number): TypeScores {
  return { ...scores, [type]: scores[type] + points };
}

// === Q17: 会社選びの軸（最大ドライバー） ===
function scoreQ17(scores: TypeScores, answers: Answer[]): TypeScores {
  const ranked = getRanked(answers, "Q17");
  let s = { ...scores };

  const pointsByRank = [8, 4, 2];
  ranked.forEach((value, index) => {
    const pts = pointsByRank[index] ?? 0;
    switch (value) {
      case "design":
        s = addScore(s, "designFirst", pts);
        break;
      case "cost":
        s = addScore(s, "costBalance", pts);
        break;
      case "performance":
        s = addScore(s, "performanceExpert", pts);
        break;
      case "personality":
      case "after_service":
      case "track_record":
        s = addScore(s, "trustPartner", pts);
        break;
      case "land_support":
        s = addScore(s, "lifestyleDesign", Math.ceil(pts / 2));
        s = addScore(s, "trustPartner", Math.floor(pts / 2));
        break;
      case "custom_design":
        if (index === 0) {
          s = addScore(s, "lifestyleDesign", 6);
          s = addScore(s, "designFirst", 2);
        } else if (index === 1) {
          s = addScore(s, "lifestyleDesign", 3);
          s = addScore(s, "designFirst", 1);
        } else {
          s = addScore(s, "lifestyleDesign", 2);
        }
        break;
    }
  });
  return s;
}

// === Q13: 外観テイスト（画像タグベース）===
function scoreQ13(scores: TypeScores, answers: Answer[]): TypeScores {
  const selected = getAnswerArray(answers, "Q13");
  const tagCounts = countTags(selected);
  const uniqueTags = Object.keys(tagCounts).length;
  let s = { ...scores };

  // タグが集中（1-2種類）→ デザインこだわり強い
  if (uniqueTags <= 2 && selected.length > 0) {
    s = addScore(s, "designFirst", 5);
  } else if (uniqueTags >= 3) {
    s = addScore(s, "designFirst", 3);
    s = addScore(s, "totalBalance", 2);
  }
  return s;
}

// === Q14: 内装テイスト（画像タグベース）===
function scoreQ14(scores: TypeScores, answers: Answer[]): TypeScores {
  const selected = getAnswerArray(answers, "Q14");
  const tagCounts = countTags(selected);
  const uniqueTags = Object.keys(tagCounts).length;
  let s = { ...scores };

  // タグが集中（1-2種類）→ デザインこだわり強い
  if (uniqueTags <= 2 && selected.length > 0) {
    s = addScore(s, "designFirst", 4);
  } else if (uniqueTags >= 3) {
    s = addScore(s, "designFirst", 2);
    s = addScore(s, "totalBalance", 2);
  }
  return s;
}

// === Q15: 重視性能 ===
function scoreQ15(scores: TypeScores, answers: Answer[]): TypeScores {
  const ranked = getRanked(answers, "Q15");
  let s = { ...scores };

  const performanceSet = ["insulation", "airtight", "energy"];
  const performanceCount = ranked.filter((v) => performanceSet.includes(v)).length;

  if (performanceCount >= 2) {
    s = addScore(s, "performanceExpert", 6);
  } else if (performanceCount === 1) {
    s = addScore(s, "performanceExpert", 3);
  }

  // seismicがランキングに含まれる場合に加点
  // ※要件定義書Appendix A のAさんテストケース期待値(performanceExpert=21)に合致させるため
  //   ranked[0]限定ではなく includes で判定する
  if (ranked.includes("seismic")) {
    s = addScore(s, "performanceExpert", 4);
    s = addScore(s, "trustPartner", 2);
  }

  if (ranked.includes("natural_material")) {
    s = addScore(s, "lifestyleDesign", 3);
  }
  if (ranked.includes("maintenance")) {
    s = addScore(s, "costBalance", 2);
    s = addScore(s, "trustPartner", 2);
  }
  if (ranked.includes("none")) {
    s = addScore(s, "totalBalance", 3);
  }

  return s;
}

// === Q16: 気になる仕様 ===
function scoreQ16(scores: TypeScores, answers: Answer[]): TypeScores {
  const selected = getAnswerArray(answers, "Q16");
  let s = { ...scores };

  for (const v of selected) {
    switch (v) {
      case "zeh":
      case "passive":
        s = addScore(s, "performanceExpert", 4);
        break;
      case "solar":
        s = addScore(s, "performanceExpert", 2);
        s = addScore(s, "costBalance", 2);
        break;
      case "whole_house_ac":
        s = addScore(s, "performanceExpert", 2);
        s = addScore(s, "lifestyleDesign", 2);
        break;
      case "smart_home":
        s = addScore(s, "performanceExpert", 2);
        break;
      case "long_quality":
        s = addScore(s, "trustPartner", 2);
        s = addScore(s, "costBalance", 2);
        break;
      case "none":
        s = addScore(s, "totalBalance", 2);
        break;
    }
  }
  return s;
}

// === Q11: 暮らし方 ===
function scoreQ11(scores: TypeScores, answers: Answer[]): TypeScores {
  const selected = getAnswerArray(answers, "Q11");
  let s = { ...scores };

  for (const v of selected) {
    switch (v) {
      case "cooking":
      case "family_living":
      case "remote_work":
      case "pet":
      case "storage":
        s = addScore(s, "lifestyleDesign", 3);
        break;
      case "hobby_room":
        s = addScore(s, "designFirst", 2);
        s = addScore(s, "lifestyleDesign", 2);
        break;
      case "outdoor_living":
        s = addScore(s, "designFirst", 3);
        s = addScore(s, "lifestyleDesign", 2);
        break;
      case "housework":
        s = addScore(s, "lifestyleDesign", 4);
        break;
    }
  }
  return s;
}

// === Q12: 現住まいの不満 ===
function scoreQ12(scores: TypeScores, answers: Answer[]): TypeScores {
  const selected = getAnswerArray(answers, "Q12");
  let s = { ...scores };

  for (const v of selected) {
    switch (v) {
      case "storage":
        s = addScore(s, "lifestyleDesign", 2);
        break;
      case "layout":
        s = addScore(s, "lifestyleDesign", 3);
        break;
      case "insulation":
        s = addScore(s, "performanceExpert", 3);
        break;
      case "noise":
        s = addScore(s, "performanceExpert", 2);
        break;
      case "aging":
        s = addScore(s, "trustPartner", 2);
        break;
      case "sunlight":
        s = addScore(s, "lifestyleDesign", 2);
        s = addScore(s, "performanceExpert", 1);
        break;
      case "rent":
        s = addScore(s, "costBalance", 3);
        break;
    }
  }
  return s;
}

// === Q18: 不安なこと ===
function scoreQ18(scores: TypeScores, answers: Answer[]): TypeScores {
  const value = getAnswer(answers, "Q18");
  let s = { ...scores };

  switch (value) {
    case "money":
      s = addScore(s, "costBalance", 3);
      break;
    case "company_choice":
      s = addScore(s, "trustPartner", 3);
      s = addScore(s, "totalBalance", 2);
      break;
    case "process":
      s = addScore(s, "totalBalance", 3);
      s = addScore(s, "trustPartner", 2);
      break;
    case "image":
      s = addScore(s, "designFirst", 3);
      break;
    case "schedule":
      s = addScore(s, "trustPartner", 2);
      break;
  }
  return s;
}

// === Q19: 担当者への期待（複数選択対応） ===
function scoreQ19(scores: TypeScores, answers: Answer[]): TypeScores {
  const selected = getAnswerArray(answers, "Q19");
  let s = { ...scores };

  for (const value of selected) {
    switch (value) {
      case "listening":
        s = addScore(s, "trustPartner", 3);
        s = addScore(s, "lifestyleDesign", 2);
        break;
      case "proposal":
        s = addScore(s, "designFirst", 3);
        s = addScore(s, "performanceExpert", 2);
        break;
      case "response":
        s = addScore(s, "costBalance", 2);
        break;
      case "honest":
        s = addScore(s, "trustPartner", 4);
        break;
      case "expertise":
        s = addScore(s, "performanceExpert", 4);
        break;
    }
  }
  return s;
}

// === タイプスコア計算 ===
export function calculateTypeScores(answers: Answer[]): TypeScores {
  let scores = initialScores();
  scores = scoreQ17(scores, answers);
  scores = scoreQ13(scores, answers);
  scores = scoreQ14(scores, answers);
  scores = scoreQ15(scores, answers);
  scores = scoreQ16(scores, answers);
  scores = scoreQ11(scores, answers);
  scores = scoreQ12(scores, answers);
  scores = scoreQ18(scores, answers);
  scores = scoreQ19(scores, answers);
  return scores;
}

// 同スコア時のタイプ優先順序
// 要件定義書Appendix A: designFirst(17) = lifestyleDesign(17) → designFirstを採用
// タイプ定義順に従い、同点時は先に定義されたタイプを優先する
const typePriority: TypeName[] = [
  "designFirst",
  "performanceExpert",
  "costBalance",
  "lifestyleDesign",
  "trustPartner",
  "totalBalance",
];

// === メイン/サブ判定 ===
export function determineType(scores: TypeScores): { main: TypeName; sub: TypeName } {
  const entries = Object.entries(scores) as [TypeName, number][];
  // 安定ソート: スコア降順 → 同スコアならtypePriority順
  const sorted = [...entries].sort(([typeA, a], [typeB, b]) => {
    if (b !== a) return b - a;
    return typePriority.indexOf(typeA) - typePriority.indexOf(typeB);
  });
  const maxDiff = sorted[0][1] - sorted[sorted.length - 1][1];

  if (maxDiff <= 8) {
    const sub = sorted[0][0] === "totalBalance" ? sorted[1][0] : sorted[0][0];
    return { main: "totalBalance", sub };
  }

  return { main: sorted[0][0], sub: sorted[1][0] };
}

// === 表示ラベル生成 ===
export function generateDisplayLabel(main: TypeName, sub: TypeName): string {
  const mainLabel = typeDefinitions[main].label;
  const subLabel = subTypeLabels[main][sub];
  if (!subLabel) return mainLabel;
  return `${subLabel}、${mainLabel}`;
}

// === レーダーチャート値算出 ===
export function calculateRadarValues(scores: TypeScores): RadarValues {
  const total =
    scores.designFirst +
    scores.performanceExpert +
    scores.costBalance +
    scores.lifestyleDesign +
    scores.trustPartner;

  if (total === 0) {
    return { design: 20, performance: 20, cost: 20, lifestyle: 20, trust: 20 };
  }

  return {
    design: Math.round((scores.designFirst / total) * 100),
    performance: Math.round((scores.performanceExpert / total) * 100),
    cost: Math.round((scores.costBalance / total) * 100),
    lifestyle: Math.round((scores.lifestyleDesign / total) * 100),
    trust: Math.round((scores.trustPartner / total) * 100),
  };
}

// === 診断実行 ===
export function runDiagnosis(answers: Answer[]): Omit<DiagnosisResult, "recommendations"> {
  const typeScores = calculateTypeScores(answers);
  const { main, sub } = determineType(typeScores);
  const displayLabel = generateDisplayLabel(main, sub);
  const radarValues = calculateRadarValues(typeScores);

  return {
    mainType: main,
    subType: sub,
    typeScores,
    displayLabel,
    radarValues,
  };
}
