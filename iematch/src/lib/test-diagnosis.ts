/**
 * 診断ロジック検証スクリプト（全テストケース一括実行）
 * 実行: npx tsx src/lib/test-diagnosis.ts
 */

import { Answer, TypeName } from "../types";
import { calculateTypeScores, determineType, generateDisplayLabel, calculateRadarValues } from "./diagnosis";
import { filterBuilders, calculateMatchScore, toDisplayRate, getRecommendations } from "./matching";
import { builders } from "../data/builders";

// =============================================
// テストケース定義
// =============================================

type TestCase = {
  readonly name: string;
  readonly description: string;
  readonly answers: Answer[];
  readonly expect: {
    readonly mainType?: TypeName;
    readonly subType?: TypeName;
    readonly displayLabel?: string;
    readonly scores?: Partial<Record<TypeName, number>>;
    readonly minRecommendations?: number;
    readonly maxRecommendations?: number;
  };
};

const testCases: readonly TestCase[] = [
  // ケースA: Aさん — 性能エキスパート型（Appendix A準拠）
  {
    name: "ケースA",
    description: "Aさん（性能エキスパート型 × デザインファースト型）",
    answers: [
      { questionId: "Q4", value: "3500_4500" },
      { questionId: "Q7", value: ["名古屋市"] },
      { questionId: "Q8", value: "searching" },
      { questionId: "Q9", value: "yes_please" },
      { questionId: "Q11", value: ["housework", "family_living", "pet"] },
      { questionId: "Q12", value: ["layout", "insulation", "storage"] },
      { questionId: "Q13", value: ["simple_modern", "natural_nordic"] },
      { questionId: "Q14", value: ["natural_wood", "white_clean"] },
      { questionId: "Q15", value: ["insulation", "seismic", "airtight"], rank: ["insulation", "seismic", "airtight"] },
      { questionId: "Q16", value: ["zeh", "long_quality"] },
      { questionId: "Q17", value: ["design", "performance", "cost"], rank: ["design", "performance", "cost"] },
      { questionId: "Q18", value: "company_choice" },
      { questionId: "Q19", value: ["listening", "proposal"] },
    ],
    expect: {
      mainType: "performanceExpert",
      minRecommendations: 3,
    },
  },

  // ケースB: 全部「こだわりなし」系 — トータルバランス型になるか確認
  // Q8=owned → Q9スキップ、Q13/Q14を3つずつ選択で分散、Q15=[maintenance], Q16=[none]
  // Q17=[performance, personality, land_support] で各タイプに分散
  // Q18=process, Q19=response でさらにtotalBalance/costBalance加点
  // 結果: maxDiff=5 ≤ 8 → totalBalance判定
  {
    name: "ケースB",
    description: "全部「こだわりなし」系（トータルバランス型エッジケース）",
    answers: [
      { questionId: "Q4", value: "undecided" },
      { questionId: "Q7", value: ["名古屋市"] },
      { questionId: "Q8", value: "owned" },
      { questionId: "Q11", value: ["storage"] },
      { questionId: "Q12", value: ["rent"] },
      { questionId: "Q13", value: ["simple_modern", "natural_nordic", "japanese_modern"] },
      { questionId: "Q14", value: ["white_clean", "natural_wood", "monotone"] },
      { questionId: "Q15", value: ["maintenance"], rank: ["maintenance"] },
      { questionId: "Q16", value: ["none"] },
      { questionId: "Q17", value: ["performance", "personality", "land_support"], rank: ["performance", "personality", "land_support"] },
      { questionId: "Q18", value: "process" },
      { questionId: "Q19", value: ["response"] },
    ],
    expect: {
      mainType: "totalBalance",
      minRecommendations: 1,
    },
  },

  // ケースC: デザインファースト型
  // ※ 要件定義の選択肢に存在する値のみ使用
  //   - Q11: hobby_room(designFirst+2), outdoor_living(designFirst+3) でデザイン加点を積む
  //   - Q12: sunlight(lifestyleDesign+2,performanceExpert+1) を使用
  //   - Q13: [resort, japanese_modern] → designFirst+5（2つ選択）
  //   - Q14: [natural_wood, cafe_vintage] → designFirst+4（2つ選択）
  //   - Q15: [none] → totalBalance+3（性能こだわりなし）
  //   - Q16: [none] → totalBalance+2
  //   - Q17: [design(+8), custom_design(lifestyleDesign+3,designFirst+1), personality(trustPartner+2)]
  //   - Q18: image → designFirst+3
  //   - Q19: proposal → designFirst+3, performanceExpert+2
  {
    name: "ケースC",
    description: "デザインファースト型",
    answers: [
      { questionId: "Q4", value: "4500_5500" },
      { questionId: "Q7", value: ["名古屋市"] },
      { questionId: "Q8", value: "owned" },
      // Q9はスキップ
      { questionId: "Q11", value: ["hobby_room", "outdoor_living"] },
      { questionId: "Q12", value: ["layout", "sunlight"] },
      { questionId: "Q13", value: ["resort", "japanese_modern"] },
      { questionId: "Q14", value: ["natural_wood", "cafe_vintage"] },
      { questionId: "Q15", value: ["none"], rank: ["none"] },
      { questionId: "Q16", value: ["none"] },
      { questionId: "Q17", value: ["design", "custom_design", "personality"], rank: ["design", "custom_design", "personality"] },
      { questionId: "Q18", value: "image" },
      { questionId: "Q19", value: ["proposal"] },
    ],
    expect: {
      mainType: "designFirst",
      minRecommendations: 1,
    },
  },

  // ケースD: エリア不一致（0社表示）
  // ※ Q7=豊根村 → 30社のどのb1_areasにも含まれていないため全社フィルタ落ち
  // ※ エラーにならず0社で正常終了することを確認
  {
    name: "ケースD",
    description: "エリア不一致（0社表示・エラーにならないことを確認）",
    answers: [
      { questionId: "Q4", value: "3500_4500" },
      { questionId: "Q7", value: ["豊根村"] },
      { questionId: "Q8", value: "owned" },
      { questionId: "Q11", value: ["family_living"] },
      { questionId: "Q12", value: ["insulation"] },
      { questionId: "Q13", value: ["simple_modern"] },
      { questionId: "Q14", value: ["white_clean"] },
      { questionId: "Q15", value: ["insulation"], rank: ["insulation"] },
      { questionId: "Q16", value: ["zeh"] },
      { questionId: "Q17", value: ["design", "performance", "cost"], rank: ["design", "performance", "cost"] },
      { questionId: "Q18", value: "money" },
      { questionId: "Q19", value: ["listening"] },
    ],
    expect: {
      maxRecommendations: 0,
    },
  },
];

// =============================================
// テスト実行エンジン
// =============================================

type CheckResult = {
  readonly name: string;
  readonly actual: unknown;
  readonly expected: unknown;
  readonly pass: boolean;
};

function runTestCase(tc: TestCase): { checks: CheckResult[]; allPassed: boolean } {
  const typeScores = calculateTypeScores(tc.answers);
  const { main, sub } = determineType(typeScores);
  const displayLabel = generateDisplayLabel(main, sub);
  const radar = calculateRadarValues(typeScores);
  const recommendations = getRecommendations(tc.answers, builders);
  const filtered = filterBuilders(tc.answers, builders);

  const checks: CheckResult[] = [];

  // メインタイプ
  if (tc.expect.mainType !== undefined) {
    checks.push({
      name: "メインタイプ",
      actual: main,
      expected: tc.expect.mainType,
      pass: main === tc.expect.mainType,
    });
  }

  // サブタイプ
  if (tc.expect.subType !== undefined) {
    checks.push({
      name: "サブタイプ",
      actual: sub,
      expected: tc.expect.subType,
      pass: sub === tc.expect.subType,
    });
  }

  // 表示ラベル
  if (tc.expect.displayLabel !== undefined) {
    checks.push({
      name: "表示ラベル",
      actual: displayLabel,
      expected: tc.expect.displayLabel,
      pass: displayLabel === tc.expect.displayLabel,
    });
  }

  // 個別スコア
  if (tc.expect.scores) {
    for (const [type, expectedScore] of Object.entries(tc.expect.scores)) {
      checks.push({
        name: `${type}スコア`,
        actual: typeScores[type as TypeName],
        expected: expectedScore,
        pass: typeScores[type as TypeName] === expectedScore,
      });
    }
  }

  // 最小おすすめ数
  if (tc.expect.minRecommendations !== undefined) {
    checks.push({
      name: `おすすめ${tc.expect.minRecommendations}社以上`,
      actual: recommendations.length,
      expected: `>=${tc.expect.minRecommendations}`,
      pass: recommendations.length >= tc.expect.minRecommendations,
    });
  }

  // 最大おすすめ数
  if (tc.expect.maxRecommendations !== undefined) {
    checks.push({
      name: `おすすめ${tc.expect.maxRecommendations}社以下`,
      actual: recommendations.length,
      expected: `<=${tc.expect.maxRecommendations}`,
      pass: recommendations.length <= tc.expect.maxRecommendations,
    });
  }

  const allPassed = checks.every((c) => c.pass);

  // --- 出力 ---
  console.log(`\n${"=".repeat(56)}`);
  console.log(`  ${tc.name}: ${tc.description}`);
  console.log(`${"=".repeat(56)}`);

  // タイプスコア一覧
  const sortedScores = Object.entries(typeScores)
    .sort(([, a], [, b]) => (b as number) - (a as number)) as [TypeName, number][];
  console.log(`\n  タイプスコア一覧`);
  for (const [type, score] of sortedScores) {
    const marker = type === main ? " (メイン)" : type === sub ? " (サブ)" : "";
    console.log(`  ${type.padEnd(20)} ${String(score).padStart(3)}点${marker}`);
  }

  // メイン/サブ/ラベル
  console.log(`\n  メインタイプ: ${main}`);
  console.log(`  サブタイプ:   ${sub}`);
  console.log(`  表示ラベル:   ${displayLabel}`);
  console.log(`  レーダー:     ${JSON.stringify(radar)}`);

  // マッチング
  console.log(`\n  フィルタ通過: ${filtered.length}社 / 全${builders.length}社`);
  if (recommendations.length === 0) {
    console.log(`  マッチング:   該当0社`);
  } else {
    console.log(`  マッチング上位:`);
    for (let i = 0; i < recommendations.length; i++) {
      const r = recommendations[i];
      const b = builders.find((b) => b.id === r.builderId);
      console.log(`    ${i + 1}位: ${b?.name ?? r.builderId} (${r.displayMatchRate}%)`);
    }
  }

  // 照合結果
  console.log(`\n  照合結果:`);
  for (const c of checks) {
    const icon = c.pass ? "\u2705" : "\u274C";
    console.log(`    ${icon} ${c.name}: ${JSON.stringify(c.actual)} (期待: ${JSON.stringify(c.expected)})`);
  }

  const summaryIcon = allPassed ? "\u2705" : "\u274C";
  console.log(`\n  ${summaryIcon} ${tc.name}: ${allPassed ? "ALL PASS" : "SOME FAILED"}`);

  return { checks, allPassed };
}

// =============================================
// メイン実行
// =============================================

console.log("########################################################");
console.log("  イエマッチAI 診断ロジック検証 — 全テストケース一括実行");
console.log("########################################################");

let totalPassed = 0;
let totalFailed = 0;

for (const tc of testCases) {
  const { allPassed } = runTestCase(tc);
  if (allPassed) {
    totalPassed++;
  } else {
    totalFailed++;
  }
}

// サマリー
console.log(`\n${"#".repeat(56)}`);
console.log(`  総合結果: ${totalPassed}/${testCases.length} ケース PASS`);
if (totalFailed > 0) {
  console.log(`  ${totalFailed} ケース FAILED`);
}
console.log(`${"#".repeat(56)}`);

process.exit(totalFailed > 0 ? 1 : 0);
