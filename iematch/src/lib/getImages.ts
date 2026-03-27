/**
 * テイスト画像URL取得（クライアントサイド）
 * /api/admin/images からSupabaseのimagesテーブルを取得
 * 取得できない場合はnullを返す（questions.tsのデフォルトURLをそのまま使う）
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
const ID_TO_VALUE: Record<string, { questionId: string; value: string }> = {
  ext_simple_modern: { questionId: "Q13", value: "simple_modern" },
  ext_natural_nordic: { questionId: "Q13", value: "natural_nordic" },
  ext_japanese_modern: { questionId: "Q13", value: "japanese_modern" },
  ext_industrial: { questionId: "Q13", value: "industrial" },
  ext_resort: { questionId: "Q13", value: "resort" },
  ext_hiraya: { questionId: "Q13", value: "hiraya" },
  int_white_clean: { questionId: "Q14", value: "white_clean" },
  int_natural_wood: { questionId: "Q14", value: "natural_wood" },
  int_monotone: { questionId: "Q14", value: "monotone" },
  int_cafe_vintage: { questionId: "Q14", value: "cafe_vintage" },
  int_japanese: { questionId: "Q14", value: "japanese" },
  int_colorful: { questionId: "Q14", value: "colorful" },
};

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
