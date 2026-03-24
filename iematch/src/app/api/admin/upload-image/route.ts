import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("file") as File | null;
  const id = formData.get("id") as string | null;

  if (!file || !id) {
    return NextResponse.json(
      { error: "file and id are required" },
      { status: 400 }
    );
  }

  try {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const ext = file.name.split(".").pop() ?? "jpg";
    const filename = `${id}.${ext}`;
    const dir = join(process.cwd(), "public/images/styles");

    // ディレクトリがなければ作成
    await mkdir(dir, { recursive: true });

    const filePath = join(dir, filename);
    await writeFile(filePath, buffer);

    return NextResponse.json({
      ok: true,
      path: `/images/styles/${filename}`,
    });
  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json(
      { error: "ファイルの保存に失敗しました。ローカル環境でのみ使用可能です。" },
      { status: 500 }
    );
  }
}
