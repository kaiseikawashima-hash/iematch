import { NextResponse } from "next/server";
import { questions } from "@/data/questions";
import { builders as localBuilders } from "@/data/builders";

/**
 * 回答値から表示ラベルを引く
 */
function getAnswerLabel(questionId: string, answerValue: unknown): string {
  if (answerValue == null) return "未回答";
  const question = questions.find((q) => q.id === questionId);
  if (!question) return String(answerValue);

  if (Array.isArray(answerValue)) {
    return answerValue
      .map((v) => question.options.find((o) => o.value === v)?.label ?? v)
      .join("、");
  }
  return question.options.find((o) => o.value === answerValue)?.label ?? String(answerValue);
}

/**
 * builderIds → 会社名リストを返す
 */
async function resolveBuilderNames(builderIds: string[]): Promise<string[]> {
  if (!builderIds.length) return [];

  if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
    try {
      const { createClient } = await import("@supabase/supabase-js");
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );
      const { data } = await supabase
        .from("builders")
        .select("id, name")
        .in("id", builderIds);
      if (data?.length) {
        return builderIds.map(
          (id) => data.find((b: { id: string; name: string }) => b.id === id)?.name ?? id
        );
      }
    } catch {
      // フォールバック
    }
  }

  return builderIds.map(
    (id) => localBuilders.find((b) => b.id === id)?.name ?? id
  );
}

/**
 * メール送信処理
 */
async function sendEmails(body: {
  name: string;
  email: string;
  phone: string;
  address?: string;
  message?: string;
  builderIds?: string[];
  diagnosisType?: string;
  answers?: Record<string, unknown>;
}): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.log("[leads] RESEND_API_KEY未設定のためメール送信をスキップ");
    return;
  }

  const { Resend } = await import("resend");
  const resend = new Resend(apiKey);
  const from = process.env.RESEND_FROM_EMAIL ?? "noreply@iematch.jp";
  const notifyTo = process.env.BUILDER_NOTIFICATION_EMAIL ?? "info@sho-san.co.jp";

  const builderNames = await resolveBuilderNames(body.builderIds ?? []);
  const answers = body.answers ?? {};

  const budgetLabel = getAnswerLabel("Q4", answers["Q4"]);
  const areaLabel = getAnswerLabel("Q7", answers["Q7"]);
  const performanceLabel = getAnswerLabel("Q15", answers["Q15"]);
  const companyLabel = getAnswerLabel("Q17", answers["Q17"]);

  // メールA: 工務店へのリード通知
  const builderHtml = `
<div style="font-family: sans-serif; line-height: 1.8; color: #333;">
  <p>イエマッチAIより新しい資料請求が届きました。</p>

  <h3 style="border-bottom: 1px solid #ccc; padding-bottom: 4px;">■ ユーザー情報</h3>
  <p>
    お名前：${escapeHtml(body.name)}<br>
    メールアドレス：${escapeHtml(body.email)}<br>
    電話番号：${escapeHtml(body.phone)}<br>
    住所：${escapeHtml(body.address?.trim() || "未記入")}<br>
    メッセージ：${escapeHtml(body.message?.trim() || "なし")}
  </p>

  <h3 style="border-bottom: 1px solid #ccc; padding-bottom: 4px;">■ 診断結果</h3>
  <p>
    家づくりタイプ：${escapeHtml(body.diagnosisType ?? "未診断")}<br>
    請求先会社：${escapeHtml(builderNames.join("、") || "なし")}
  </p>

  <h3 style="border-bottom: 1px solid #ccc; padding-bottom: 4px;">■ 主な希望</h3>
  <p>
    予算：${escapeHtml(budgetLabel)}<br>
    エリア：${escapeHtml(areaLabel)}<br>
    重視する性能：${escapeHtml(performanceLabel)}<br>
    会社選びで重視すること：${escapeHtml(companyLabel)}
  </p>

  <hr style="border: none; border-top: 1px solid #eee; margin-top: 24px;">
  <p style="font-size: 12px; color: #999;">
    ※ このメールはイエマッチAIから自動送信されています。
  </p>
</div>`;

  // メールB: ユーザーへの完了確認
  const builderListHtml = builderNames.length
    ? `<ul>${builderNames.map((n) => `<li>${escapeHtml(n)}</li>`).join("")}</ul>`
    : "<p>なし</p>";

  const userHtml = `
<div style="font-family: sans-serif; line-height: 1.8; color: #333;">
  <p>${escapeHtml(body.name)} 様</p>

  <p>資料請求を受け付けました。<br>
  以下の住宅会社より3営業日以内にご連絡いたします。</p>

  <h3 style="border-bottom: 1px solid #ccc; padding-bottom: 4px;">■ 資料請求先</h3>
  ${builderListHtml}

  <h3 style="border-bottom: 1px solid #ccc; padding-bottom: 4px;">■ 次のステップ</h3>
  <ul>
    <li>届いた資料をじっくり比較してみましょう。</li>
    <li>気になった会社にモデルハウス見学を予約してみましょう。</li>
    <li>家族で優先順位を話し合ってみましょう。</li>
  </ul>

  <p>ご不明な点はお気軽にお問い合わせください。</p>

  <p>イエマッチAI運営事務局</p>
</div>`;

  const results = await Promise.allSettled([
    resend.emails.send({
      from,
      to: notifyTo,
      subject: "【イエマッチAI】新しい資料請求が届きました",
      html: builderHtml,
    }),
    resend.emails.send({
      from,
      to: body.email,
      subject: "【イエマッチAI】資料請求を受け付けました",
      html: userHtml,
    }),
  ]);

  for (const [i, result] of results.entries()) {
    const label = i === 0 ? "工務店通知" : "ユーザー確認";
    if (result.status === "rejected") {
      console.error(`[leads] ${label}メール送信失敗:`, result.reason);
    } else if (result.value && "error" in result.value && result.value.error) {
      console.error(`[leads] ${label}メール送信エラー:`, result.value.error);
    } else {
      console.log(`[leads] ${label}メール送信成功`);
    }
  }
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * POST /api/leads
 * 資料請求データを受け取ってSupabaseのleadsテーブルに保存する
 */
export async function POST(request: Request) {
  const body = await request.json();

  // 必須項目チェック
  if (!body.name?.trim() || !body.email?.trim() || !body.phone?.trim()) {
    return NextResponse.json(
      { ok: false, error: "必須項目が入力されていません" },
      { status: 400 }
    );
  }

  if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
    // Supabase接続済みの場合は保存
    const { createClient } = await import("@supabase/supabase-js");
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { error } = await supabase.from("leads").insert({
      name: body.name,
      email: body.email,
      phone: body.phone,
      address: body.address ?? null,
      message: body.message ?? null,
      builder_ids: body.builderIds ?? [],
      diagnosis_type: body.diagnosisType ?? null,
      answers: body.answers ?? null,
    });

    if (error) {
      console.error("[leads] Supabase insert error:", error);
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: 500 }
      );
    }
  } else {
    // 未接続の場合はログだけ出す
    console.log("[leads] Supabase未接続のため保存をスキップ:", body);
  }

  // メール送信（失敗してもリード保存は成功扱い）
  try {
    await sendEmails(body);
  } catch (err) {
    console.error("[leads] メール送信で予期しないエラー:", err);
  }

  return NextResponse.json({ ok: true });
}
