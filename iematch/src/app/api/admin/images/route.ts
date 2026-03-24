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

  const { data, error } = await supabase.from("images").select("id, url");
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data: data ?? [] });
}

export async function PUT(request: Request) {
  const { images } = await request.json();
  if (!Array.isArray(images)) return NextResponse.json({ error: "images array required" }, { status: 400 });

  const supabase = getSupabase();
  if (!supabase) return NextResponse.json({ ok: true });

  const rows = images.map((img: { id: string; url: string }) => ({
    id: img.id,
    url: img.url,
    updated_at: new Date().toISOString(),
  }));

  const { error } = await supabase.from("images").upsert(rows);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
