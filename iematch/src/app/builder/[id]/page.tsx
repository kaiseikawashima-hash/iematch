"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { useBuilders } from "@/hooks/useBuilders";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

type Props = {
  params: Promise<{ id: string }>;
};

export default function BuilderDetailPage({ params }: Props) {
  const { id } = use(params);
  const router = useRouter();
  const { builders, loading } = useBuilders();
  const builder = builders.find((b) => b.id === id);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-brand border-t-transparent" />
      </div>
    );
  }

  if (!builder) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-sm text-gray-500">工務店が見つかりません。</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col" style={{ background: "#F5F4F0" }}>
      <Header />

      <main className="mx-auto w-full max-w-lg flex-1 px-4 py-6">
        {/* 施工事例写真ギャラリー */}
        <div className="grid grid-cols-2 gap-2 overflow-hidden rounded-2xl">
          {builder.photos.map((photo, i) => (
            <div
              key={i}
              className={`bg-gradient-to-br from-gray-100 to-gray-200 ${
                i === 0 ? "col-span-2 h-48" : "h-32"
              } flex items-center justify-center text-xs text-gray-400`}
            >
              {photo.category === "exterior" ? "外観写真" : "内装写真"}
            </div>
          ))}
        </div>

        {/* 会社基本情報 */}
        <section className="mt-4 rounded-2xl bg-white p-5 shadow-sm">
          <h2 className="text-lg font-bold">{builder.name}</h2>
          <p className="mt-2 text-sm leading-relaxed text-gray-600">
            {builder.description}
          </p>
          <div className="mt-3 space-y-1 text-xs text-muted-foreground">
            <p>{builder.address}</p>
            <p>年間施工棟数: {builder.b5_annualBuilds}棟</p>
            {builder.awards.length > 0 && <p>{builder.awards.join(", ")}</p>}
          </div>
        </section>

        {/* 性能数値カード */}
        <section className="mt-4 rounded-2xl bg-white p-5 shadow-sm">
          <h3 className="mb-3 text-sm font-bold">住宅性能</h3>
          <div className="grid grid-cols-2 gap-3">
            {builder.b4_values.ua !== undefined && (
              <SpecCard label="UA値" value={`${builder.b4_values.ua}`} unit="W/(m²·K)" />
            )}
            {builder.b4_values.c !== undefined && (
              <SpecCard label="C値" value={`${builder.b4_values.c}`} unit="cm²/m²" />
            )}
            {builder.b4_values.seismicGrade !== undefined && (
              <SpecCard label="耐震等級" value={`${builder.b4_values.seismicGrade}`} unit="" />
            )}
            {builder.b4_values.zehCount !== undefined && (
              <SpecCard label="ZEH実績" value={`${builder.b4_values.zehCount}`} unit="棟/年" />
            )}
          </div>
        </section>

        {/* 強みタグ */}
        <section className="mt-4 rounded-2xl bg-white p-5 shadow-sm">
          <h3 className="mb-3 text-sm font-bold">この会社の強み</h3>
          <div className="flex flex-wrap gap-2">
            {builder.b7_topStrengths.map((s) => (
              <span
                key={s}
                className="rounded-full bg-brand-light px-3 py-1 text-xs font-medium text-brand-dark"
              >
                {strengthLabel(s)}
              </span>
            ))}
          </div>
        </section>

        {/* お客様の声 */}
        <section className="mt-4 rounded-2xl bg-white p-5 shadow-sm">
          <h3 className="mb-3 text-sm font-bold">お客様の声</h3>
          <div className="space-y-3">
            {builder.reviews.map((review, i) => (
              <div key={i} className="rounded-xl bg-gray-50 p-3">
                <p className="text-xs leading-relaxed text-gray-600">
                  &ldquo;{review.text}&rdquo;
                </p>
                <p className="mt-1 text-right text-[10px] text-muted-foreground">
                  — {review.author}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* 資料請求ボタン */}
        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => {
              sessionStorage.setItem(
                "iematch_request_builders",
                JSON.stringify([builder.id])
              );
              router.push("/request");
            }}
            className="w-full rounded-full bg-brand py-4 text-base font-bold text-white shadow-lg transition-colors hover:bg-brand-dark"
          >
            この会社に資料請求する
          </button>
          <p className="mt-2 text-xs text-muted-foreground">無料・営業電話なし</p>
        </div>

        <button
          type="button"
          onClick={() => router.back()}
          className="mt-4 w-full text-center text-xs text-muted-foreground underline"
        >
          診断結果に戻る
        </button>
      </main>

      <Footer />
    </div>
  );
}

function SpecCard({
  label,
  value,
  unit,
}: {
  label: string;
  value: string;
  unit: string;
}) {
  return (
    <div className="rounded-xl bg-brand-light/50 p-3 text-center">
      <p className="text-[10px] font-medium text-brand-dark">{label}</p>
      <p className="mt-1 text-2xl font-bold text-brand-dark">{value}</p>
      {unit && <p className="text-[10px] text-brand-dark/70">{unit}</p>}
    </div>
  );
}

function strengthLabel(value: string): string {
  const labels: Record<string, string> = {
    design: "デザイン力",
    cost: "コスパ",
    performance: "住宅性能",
    personality: "人柄",
    after_service: "アフターサービス",
    track_record: "施工実績",
    land_support: "土地探し",
    custom_design: "自由設計",
  };
  return labels[value] ?? value;
}
