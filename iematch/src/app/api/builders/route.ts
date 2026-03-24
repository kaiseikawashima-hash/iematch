import { NextResponse } from "next/server";

/**
 * POST /api/builders
 * 工務店登録データを受け取ってSupabaseのbuildersテーブルに保存する
 */
export async function POST(request: Request) {
  const body = await request.json();

  // 必須項目チェック
  if (!body.name?.trim() || !body.description?.trim() || !body.email?.trim()) {
    return NextResponse.json(
      { ok: false, error: "必須項目（会社名・会社紹介文・メールアドレス）を入力してください" },
      { status: 400 }
    );
  }

  if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
    const { createClient } = await import("@supabase/supabase-js");
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // IDを生成（builder_XXX 形式）
    const id = `builder_${Date.now()}`;

    const { error } = await supabase.from("builders").insert({
      id,
      name: body.name,
      description: body.description,
      address: body.address ?? null,
      phone: body.phone ?? null,
      email: body.email,
      website: body.website ?? null,
      logo_url: body.logoUrl ?? null,
      areas: body.areas ?? [],
      price_ranges: body.priceRanges ?? [],
      main_price_range: body.mainPriceRange ?? null,
      exterior_styles: body.exteriorStyles ?? [],
      interior_styles: body.interiorStyles ?? [],
      best_style: body.bestStyle ?? null,
      strengths: body.strengths ?? [],
      specs: body.specs ?? [],
      ua_value: body.uaValue ?? null,
      c_value: body.cValue ?? null,
      seismic_grade: body.seismicGrade ?? null,
      zeh_count: body.zehCount ?? null,
      services: body.services ?? [],
      design_freedom: body.designFreedom ?? null,
      annual_builds: body.annualBuilds ?? null,
      contact_styles: body.contactStyles ?? [],
      sales_features: body.salesFeatures ?? [],
      top_strengths: body.topStrengths ?? [],
    });

    if (error) {
      console.error("[builders] Supabase insert error:", error);
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: 500 }
      );
    }
  } else {
    console.log("[builders] Supabase未接続のため保存をスキップ:", body);
  }

  return NextResponse.json({ ok: true });
}
