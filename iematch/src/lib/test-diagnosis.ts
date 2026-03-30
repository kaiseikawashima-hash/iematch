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
  // ケースA: 性能エキスパート型
  {
    name: "ケースA",
    description: "性能エキスパート型（デザインも重視）",
    answers: [
      { questionId: "Q4", value: ["名古屋市"] },
      { questionId: "Q6", value: "searching" },
      { questionId: "Q9", value: "yes_please" },
      { questionId: "Q7", value: "5000_5500" },
      { questionId: "Q11", value: ["easy_housework", "family_relax", "pet"] },
      { questionId: "Q12", value: ["compact_laundry", "whole_house_ac_equip", "entrance_storage"] },
      { questionId: "Q13", value: ["exterior_modern_1", "exterior_natural_1"] },
      { questionId: "Q14", value: ["interior_natural_1", "interior_simple_1"] },
      { questionId: "Q15", value: ["insulation", "seismic", "airtight"], rank: ["insulation", "seismic", "airtight"] },
      { questionId: "Q16", value: ["zeh", "long_quality"] },
      { questionId: "Q17", value: ["design", "performance", "cost"], rank: ["design", "performance", "cost"] },
      { questionId: "Q18", value: "trust" },
      { questionId: "Q19", value: ["listening", "proposal"] },
    ],
    expect: {
      mainType: "performanceExpert",
      minRecommendations: 3,
    },
  },

  // ケースB: トータルバランス型（こだわり分散）
  {
    name: "ケースB",
    description: "こだわり分散（トータルバランス型エッジケース）",
    answers: [
      { questionId: "Q4", value: ["名古屋市"] },
      { questionId: "Q6", value: "has_land" },
      { questionId: "Q7", value: "3500_4000" },
      { questionId: "Q11", value: ["organized_storage"] },
      { questionId: "Q12", value: ["room_storage"] },
      { questionId: "Q13", value: ["exterior_modern_1", "exterior_natural_1", "exterior_japanese_1"] },
      { questionId: "Q14", value: ["interior_simple_1", "interior_natural_1", "interior_modern_1"] },
      { questionId: "Q15", value: ["maintenance"], rank: ["maintenance"] },
      { questionId: "Q16", value: ["none"] },
      { questionId: "Q17", value: ["performance", "personality", "land_support"], rank: ["performance", "personality", "land_support"] },
      { questionId: "Q18", value: "process_unknown" },
      { questionId: "Q19", value: ["response"] },
    ],
    expect: {
      mainType: "totalBalance",
      minRecommendations: 1,
    },
  },

  // ケースC: デザインファースト型
  {
    name: "ケースC",
    description: "デザインファースト型",
    answers: [
      { questionId: "Q4", value: ["名古屋市"] },
      { questionId: "Q6", value: "has_land" },
      { questionId: "Q7", value: "5000_6500" },
      { questionId: "Q11", value: ["gardening", "favorite_interior"] },
      { questionId: "Q12", value: ["high_ceiling", "garden_outdoor"] },
      { questionId: "Q13", value: ["exterior_luxury_1", "exterior_japanese_1"] },
      { questionId: "Q14", value: ["interior_natural_1", "interior_industrial_1"] },
      { questionId: "Q15", value: ["none"], rank: ["none"] },
      { questionId: "Q16", value: ["none"] },
      { questionId: "Q17", value: ["design", "lifestyle", "personality"], rank: ["design", "lifestyle", "personality"] },
      { questionId: "Q18", value: "design_fit" },
      { questionId: "Q19", value: ["proposal"] },
    ],
    expect: {
      mainType: "designFirst",
      minRecommendations: 1,
    },
  },

  // ケースD: エリア不一致（0社表示）
  {
    name: "ケースD",
    description: "エリア不一致（0社表示・エラーにならないことを確認）",
    answers: [
      { questionId: "Q4", value: ["豊根村"] },
      { questionId: "Q6", value: "has_land" },
      { questionId: "Q7", value: "3500_4000" },
      { questionId: "Q11", value: ["family_relax"] },
      { questionId: "Q12", value: ["whole_house_ac_equip"] },
      { questionId: "Q13", value: ["exterior_modern_1"] },
      { questionId: "Q14", value: ["interior_simple_1"] },
      { questionId: "Q15", value: ["insulation"], rank: ["insulation"] },
      { questionId: "Q16", value: ["zeh"] },
      { questionId: "Q17", value: ["design", "performance", "cost"], rank: ["design", "performance", "cost"] },
      { questionId: "Q18", value: "budget_over" },
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

  if (tc.expect.mainType !== undefined) {
    checks.push({
      name: "メインタイプ",
      actual: main,
      expected: tc.expect.mainType,
      pass: main === tc.expect.mainType,
    });
  }

  if (tc.expect.subType !== undefined) {
    checks.push({
      name: "サブタイプ",
      actual: sub,
      expected: tc.expect.subType,
      pass: sub === tc.expect.subType,
    });
  }

  if (tc.expect.displayLabel !== undefined) {
    checks.push({
      name: "表示ラベル",
      actual: displayLabel,
      expected: tc.expect.displayLabel,
      pass: displayLabel === tc.expect.displayLabel,
    });
  }

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

  if (tc.expect.minRecommendations !== undefined) {
    checks.push({
      name: `おすすめ${tc.expect.minRecommendations}社以上`,
      actual: recommendations.length,
      expected: `>=${tc.expect.minRecommendations}`,
      pass: recommendations.length >= tc.expect.minRecommendations,
    });
  }

  if (tc.expect.maxRecommendations !== undefined) {
    checks.push({
      name: `おすすめ${tc.expect.maxRecommendations}社以下`,
      actual: recommendations.length,
      expected: `<=${tc.expect.maxRecommendations}`,
      pass: recommendations.length <= tc.expect.maxRecommendations,
    });
  }

  const allPassed = checks.every((c) => c.pass);

  console.log(`\n${"=".repeat(56)}`);
  console.log(`  ${tc.name}: ${tc.description}`);
  console.log(`${"=".repeat(56)}`);

  const sortedScores = Object.entries(typeScores)
    .sort(([, a], [, b]) => (b as number) - (a as number)) as [TypeName, number][];
  console.log(`\n  タイプスコア一覧`);
  for (const [type, score] of sortedScores) {
    const marker = type === main ? " (メイン)" : type === sub ? " (サブ)" : "";
    console.log(`  ${type.padEnd(20)} ${String(score).padStart(3)}点${marker}`);
  }

  console.log(`\n  メインタイプ: ${main}`);
  console.log(`  サブタイプ:   ${sub}`);
  console.log(`  表示ラベル:   ${displayLabel}`);
  console.log(`  レーダー:     ${JSON.stringify(radar)}`);

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

console.log(`\n${"#".repeat(56)}`);
console.log(`  総合結果: ${totalPassed}/${testCases.length} ケース PASS`);
if (totalFailed > 0) {
  console.log(`  ${totalFailed} ケース FAILED`);
}
console.log(`${"#".repeat(56)}`);

process.exit(totalFailed > 0 ? 1 : 0);
