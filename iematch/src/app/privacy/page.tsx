import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

const FALLBACK_TEXT = `1. 個人情報の取扱いについて

イエマッチAI（以下「当サービス」）は、お客様の個人情報を適切に管理し、個人情報保護法その他の関連法令を遵守いたします。当サービスでは、資料請求・お問い合わせの際にお名前、メールアドレス、電話番号、住所等の個人情報をお預かりする場合があります。

2. 利用目的

お預かりした個人情報は、以下の目的で利用いたします。
・資料請求先の住宅会社へのご紹介
・お問い合わせへの回答・ご連絡
・サービス改善のための統計データ作成（個人を特定しない形式）
・当サービスに関する重要なお知らせの送付

3. 第三者提供について

当サービスは、お客様が資料請求を行った住宅会社に対して、お客様の同意のもとで個人情報を提供いたします。それ以外の第三者への提供は、法令に基づく場合を除き、お客様の同意なく行うことはありません。

4. 個人情報の管理

当サービスは、個人情報の漏洩・滅失・毀損を防止するため、適切なセキュリティ対策を講じます。SSL暗号化通信の使用、アクセス制限の実施等により、個人情報の安全管理に努めます。

5. 個人情報の開示・訂正・削除

お客様ご本人から個人情報の開示・訂正・削除のご請求があった場合、ご本人確認のうえ速やかに対応いたします。

6. お問い合わせ

個人情報の取扱いに関するお問い合わせは、下記までご連絡ください。

イエマッチAI 運営事務局
メール：info@iematch.ai`;

async function getPrivacyPolicy(): Promise<string> {
  if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
    try {
      const { createClient } = await import("@supabase/supabase-js");
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );
      const { data } = await supabase
        .from("settings")
        .select("value")
        .eq("key", "privacy_policy")
        .single();
      if (data?.value) return data.value;
    } catch {
      // Supabase未接続 → フォールバック
    }
  }
  return FALLBACK_TEXT;
}

export const revalidate = 60;

export default async function PrivacyPage() {
  const policy = await getPrivacyPolicy();

  return (
    <div className="flex min-h-screen flex-col" style={{ background: "#F5F4F0" }}>
      <Header />
      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-8">
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <h1 className="text-lg font-bold" style={{ color: "#2E5240" }}>
            プライバシーポリシー
          </h1>
          <div className="mt-6 whitespace-pre-wrap text-sm leading-relaxed text-gray-600">
            {policy}
          </div>
          <p className="mt-8 text-xs text-muted-foreground">
            制定日：2026年3月24日
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
