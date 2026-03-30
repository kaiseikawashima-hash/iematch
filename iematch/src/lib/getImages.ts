import { exteriorImages, interiorImages } from "@/data/styleImages";

/**
 * テイスト画像URL取得（クライアントサイド）
 * /api/admin/images からSupabaseのimagesテーブルを取得
 * 取得できない場合はnullを返す（styleImages.tsのfallback URLをそのまま使う）
 */
export async function getImages(): Promise<Record<string, string> | null> {
  try {
    const res = await fetch("/api/admin/images");
    if (!res.ok) return null;

    const { data } = await res.json();
    if (!Array.isArray(data) || data.length === 0) return null;

    const imageMap: Record<string, string> = {};
    for (const row of data) {
      if (row.url) {
        imageMap[row.id] = row.url;
      }
    }

    return Object.keys(imageMap).length > 0 ? imageMap : null;
  } catch {
    return null;
  }
}

/** imagesテーブルのid → questions.tsのoption valueマッピング */
const ID_TO_VALUE: Record<string, { questionId: string; value: string }> = {};

// 外観画像: Q13
for (const img of exteriorImages) {
  ID_TO_VALUE[img.id] = { questionId: "Q13", value: img.id };
}

// 内装画像: Q14
for (const img of interiorImages) {
  ID_TO_VALUE[img.id] = { questionId: "Q14", value: img.id };
}

/**
 * Supabaseから取得した画像URLマップを使って、
 * questionsのQ13・Q14のimageUrlを上書きしたコピーを返す
 */
export function applyImageOverrides<
  T extends { id: string; options: { value: string; imageUrl?: string }[] }
>(questions: T[], imageMap: Record<string, string>): T[] {
  return questions.map((q) => {
    if (q.id !== "Q13" && q.id !== "Q14") return q;

    return {
      ...q,
      options: q.options.map((opt) => {
        // このoptionに対応するimagesテーブルのidを探す
        const entry = Object.entries(ID_TO_VALUE).find(
          ([, mapping]) =>
            mapping.questionId === q.id && mapping.value === opt.value
        );
        if (!entry) return opt;

        const imageId = entry[0];
        const url = imageMap[imageId];
        return url ? { ...opt, imageUrl: url } : opt;
      }),
    };
  });
}
