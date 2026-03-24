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
  if (!supabase) {
    return NextResponse.json({
      data: {
        privacy_policy: "プライバシーポリシーの文言をここに入力してください。",
        terms_of_service: "利用規約の文言をここに入力してください。",
      },
    });
  }

  const { data, error } = await supabase.from("settings").select("key, value");
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const settings: Record<string, string> = {};
  for (const row of data ?? []) {
    settings[row.key] = row.value;
  }
  return NextResponse.json({ data: settings });
}

export async function PUT(request: Request) {
  const { key, value } = await request.json();
  if (!key) return NextResponse.json({ error: "key required" }, { status: 400 });

  const supabase = getSupabase();
  if (!supabase) return NextResponse.json({ ok: true });

  const { error } = await supabase
    .from("settings")
    .upsert({ key, value, updated_at: new Date().toISOString() });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
