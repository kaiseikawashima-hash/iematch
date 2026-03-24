import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

const FALLBACK_TEXT = `1. サービス概要

イエマッチAI（以下「当サービス」）は、住宅購入を検討されているお客様に対し、診断結果に基づいて住宅会社をご紹介する無料のマッチングサービスです。当サービスの利用にあたっては、本利用規約に同意いただく必要があります。

2. 利用条件

当サービスは、日本国内に居住する個人のお客様を対象としています。利用者は、正確かつ最新の情報を入力するものとし、虚偽の情報を提供してはなりません。

3. 禁止事項

利用者は、当サービスの利用にあたり、以下の行為を行ってはなりません。
・法令または公序良俗に反する行為
・当サービスの運営を妨害する行為
・他の利用者または第三者の権利を侵害する行為
・虚偽の情報を入力する行為
・当サービスを商業目的で不正に利用する行為
・その他、当サービスが不適切と判断する行為

4. 免責事項

当サービスは、診断結果および住宅会社の紹介について、その正確性・完全性・有用性を保証するものではありません。住宅会社との契約・取引に関する判断は、利用者ご自身の責任において行ってください。当サービスは、利用者と住宅会社との間で生じたトラブルについて一切の責任を負いません。

5. サービスの変更・中断

当サービスは、事前の通知なく、サービス内容の変更・一時中断・終了を行う場合があります。これにより利用者に生じた損害について、当サービスは一切の責任を負いません。

6. 知的財産権

当サービスに含まれるすべてのコンテンツ（テキスト、画像、デザイン、ロゴ等）の知的財産権は、当サービスまたは正当な権利者に帰属します。

7. 規約の変更

当サービスは、必要に応じて本利用規約を変更することがあります。変更後の利用規約は、当サービス上に掲載した時点で効力を生じるものとします。`;

async function getTermsOfService(): Promise<string> {
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
        .eq("key", "terms_of_service")
        .single();
      if (data?.value) return data.value;
    } catch {
      // Supabase未接続 → フォールバック
    }
  }
  return FALLBACK_TEXT;
}

export const revalidate = 60;

export default async function TermsPage() {
  const terms = await getTermsOfService();

  return (
    <div className="flex min-h-screen flex-col" style={{ background: "#F5F4F0" }}>
      <Header />
      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-8">
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <h1 className="text-lg font-bold" style={{ color: "#2E5240" }}>
            利用規約
          </h1>
          <div className="mt-6 whitespace-pre-wrap text-sm leading-relaxed text-gray-600">
            {terms}
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
