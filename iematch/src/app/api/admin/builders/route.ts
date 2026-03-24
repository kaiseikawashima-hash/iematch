import { NextResponse } from "next/server";

function getSupabase() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return null;
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { createClient } = require("@supabase/supabase-js");
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

export async function GET() {
  const supabase = getSupabase();
  if (!supabase) return NextResponse.json({ data: [] });

  const { data, error } = await supabase
    .from("builders")
    .select("id, name, address, main_price_range, best_style, design_freedom, created_at")
    .order("created_at", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data: data ?? [] });
}

export async function DELETE(request: Request) {
  const { id } = await request.json();
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  const supabase = getSupabase();
  if (!supabase) return NextResponse.json({ ok: true });

  const { error } = await supabase.from("builders").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
