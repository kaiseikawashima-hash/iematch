import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

/**
 * POST /api/insight
 * これまでの回答を受け取りGeminiで洞察テキストを生成する
 */
export async function POST(request: Request) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { insight: null, error: "GEMINI_API_KEY not configured" },
      { status: 200 }
    );
  }

  const { answers, currentCategory } = await request.json();

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const prompt = `あなたは経験豊富な住宅カウンセラーです。
ユーザーの回答から「数字・事実」ではなく「その人の気持ち・価値観・不安」を読み取って共感的に言葉にしてください。

## 絶対にやってはいけないこと
- 回答の数字をそのまま使う（例：「3500〜4500万円」「7〜10年」は使わない）
- 回答内容をただ要約する
- 「〜とのことですね」のような機械的な表現

## やってほしいこと
- その人が家づくりで「何を大切にしているか」を読み取る
- 「不安」「期待」「こだわり」などの感情ワードを使う
- 温かく・人間らしい言葉で表現する

## これまでの回答
${JSON.stringify(answers, null, 2)}

## 現在のカテゴリ
${currentCategory}

## 出力形式
・2〜3文の日本語
・感情・価値観ベースの表現
・最後は「合っていますか？」で終わる
・絵文字なし
・80文字以内`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    return NextResponse.json({ insight: text });
  } catch (error) {
    console.error("[insight] Gemini API error:", error);
    return NextResponse.json({ insight: null, error: "Gemini API failed" });
  }
}
