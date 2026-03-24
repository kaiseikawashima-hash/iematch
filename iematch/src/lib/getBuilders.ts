import { Builder } from "@/types";

/**
 * 工務店データ取得関数
 * Supabase接続の有無で自動的にデータソースを切り替える
 * - NEXT_PUBLIC_SUPABASE_URL が設定されている → Supabaseから取得
 * - 未設定 → src/data/builders.ts のダミーデータを返す
 */
export async function getBuilders(): Promise<Builder[]> {
  if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
    // Supabaseからデータ取得（接続後にここが動く）
    const { createClient } = await import("@supabase/supabase-js");
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { data, error } = await supabase
      .from("builders")
      .select("*, builder_photos(*), builder_reviews(*)");

    if (error) {
      console.error("Supabase fetch error:", error);
      // フォールバック: ダミーデータを返す
      const { builders } = await import("@/data/builders");
      return builders;
    }

    // Supabaseのスネークケース → Builder型のキャメルケースに変換
    return (data ?? []).map(toBuilder);
  }

  // Supabase未接続の場合はダミーデータを返す
  const { builders } = await import("@/data/builders");
  return builders;
}

// Supabaseレスポンス → Builder型への変換
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toBuilder(row: any): Builder {
  return {
    id: row.id,
    name: row.name,
    description: row.description ?? "",
    address: row.address ?? "",
    phone: row.phone ?? "",
    email: row.email ?? "",
    website: row.website ?? "",
    logoUrl: row.logo_url ?? "",
    b1_areas: row.areas ?? [],
    b2_priceRanges: row.price_ranges ?? [],
    b2_mainPriceRange: row.main_price_range ?? "",
    b3_exteriorStyles: row.exterior_styles ?? [],
    b3_interiorStyles: row.interior_styles ?? [],
    b3_bestStyle: row.best_style ?? "",
    b4_strengths: row.strengths ?? [],
    b4_specs: row.specs ?? [],
    b4_values: {
      ua: row.ua_value ?? undefined,
      c: row.c_value ?? undefined,
      seismicGrade: row.seismic_grade ?? undefined,
      zehCount: row.zeh_count ?? undefined,
    },
    b5_services: row.services ?? [],
    b5_designFreedom: row.design_freedom ?? "",
    b5_annualBuilds: row.annual_builds ?? 0,
    b6_styles: row.contact_styles ?? [],
    b6_features: row.sales_features ?? [],
    b7_topStrengths: row.top_strengths ?? [],
    photos: (row.builder_photos ?? []).map(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (p: any) => ({ url: p.url, tags: p.tags ?? [], category: p.category ?? "" })
    ),
    reviews: (row.builder_reviews ?? []).map(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (r: any) => ({ text: r.text, author: r.author ?? "" })
    ),
    awards: [],
    campaign: "",
  };
}
