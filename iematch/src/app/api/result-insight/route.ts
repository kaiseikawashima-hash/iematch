import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

/**
 * POST /api/result-insight
 * 診断結果をもとに比較セット説明文を生成する
 */
export async function POST(request: Request) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { comparisonText: null, error: "GEMINI_API_KEY not configured" },
      { status: 200 }
    );
  }

  const { mainType, typeLabel, displayLabel, recommendations, answers, corrections } =
    await request.json();

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  // corrections がある場合のみ補正セクションを追加
  const correctionsSection =
    Array.isArray(corrections) && corrections.length > 0
      ? `\n## ユーザーの補正フィードバック\nユーザーは診断中に以下の補正を行いました：\n${corrections
          .map(
            (c: { afterQuestion: string; text: string }) =>
              `・${c.afterQuestion}のインサイトに対して「${c.text}」と回答`
          )
          .join("\n")}\nこれらの補正を優先してアドバイスや説明文をパーソナライズしてください。\n`
      : "";

  const prompt = `あなたは住宅カウンセラーです。
ユーザーの診断結果（タイプ・重視ポイント・回答）をもとに、
なぜこの3社を選んだかを説明する文章を生成してください。

## ユーザーのタイプ
${typeLabel}（${displayLabel}）

## おすすめ3社
1位: ${recommendations[0]?.builderName ?? "不明"} (マッチ度${recommendations[0]?.matchRate ?? 0}%)
2位: ${recommendations[1]?.builderName ?? "不明"} (マッチ度${recommendations[1]?.matchRate ?? 0}%)
3位: ${recommendations[2]?.builderName ?? "不明"} (マッチ度${recommendations[2]?.matchRate ?? 0}%)

## ユーザーの回答（抜粋）
${JSON.stringify(answers?.slice(0, 10) ?? [], null, 2)}
${correctionsSection}
## ルール
・ユーザーの最重要条件を明記する
・「本命」「発見枠」という言葉を使う
・2〜3文・80文字以内・絵文字なし`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    return NextResponse.json({ comparisonText: text });
  } catch (error) {
    console.error("[result-insight] Gemini API error:", error);
    return NextResponse.json({
      comparisonText: null,
      error: "Gemini API failed",
    });
  }
}
