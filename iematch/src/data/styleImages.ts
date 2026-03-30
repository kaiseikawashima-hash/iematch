export type ExteriorStyleTag = "simple_modern" | "natural" | "japanese" | "industrial" | "resort" | "hiraya" | "other";
export type InteriorStyleTag = "simple_clean" | "natural_wood" | "monotone" | "cafe_vintage" | "japanese" | "colorful" | "other";
export type StyleTag = ExteriorStyleTag | InteriorStyleTag;

export interface StyleImage {
  readonly id: string;
  readonly tag: StyleTag;
  readonly label: string;
  readonly src: string;
  readonly fallback: string;
}

export const exteriorImages: readonly StyleImage[] = [
  {
    id: "exterior_simple_modern_1",
    tag: "simple_modern",
    label: "シンプルモダン",
    src: "/images/styles/exterior_simple_modern_1.jpg",
    fallback: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=400",
  },
  {
    id: "exterior_simple_modern_2",
    tag: "simple_modern",
    label: "シンプルモダン",
    src: "/images/styles/exterior_simple_modern_2.jpg",
    fallback: "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=400",
  },
  {
    id: "exterior_natural_1",
    tag: "natural",
    label: "ナチュラル",
    src: "/images/styles/exterior_natural_1.jpg",
    fallback: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400",
  },
  {
    id: "exterior_natural_2",
    tag: "natural",
    label: "ナチュラル",
    src: "/images/styles/exterior_natural_2.jpg",
    fallback: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=400",
  },
  {
    id: "exterior_japanese_1",
    tag: "japanese",
    label: "和テイスト",
    src: "/images/styles/exterior_japanese_1.jpg",
    fallback: "https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=400",
  },
  {
    id: "exterior_japanese_2",
    tag: "japanese",
    label: "和テイスト",
    src: "/images/styles/exterior_japanese_2.jpg",
    fallback: "https://images.unsplash.com/photo-1480796927426-f609979314bd?w=400",
  },
  {
    id: "exterior_industrial_1",
    tag: "industrial",
    label: "インダストリアル",
    src: "/images/styles/exterior_industrial_1.jpg",
    fallback: "https://images.unsplash.com/photo-1513584684374-8bab748fbf90?w=400",
  },
  {
    id: "exterior_industrial_2",
    tag: "industrial",
    label: "インダストリアル",
    src: "/images/styles/exterior_industrial_2.jpg",
    fallback: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400",
  },
  {
    id: "exterior_resort_1",
    tag: "resort",
    label: "リゾート",
    src: "/images/styles/exterior_resort_1.jpg",
    fallback: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400",
  },
  {
    id: "exterior_resort_2",
    tag: "resort",
    label: "リゾート",
    src: "/images/styles/exterior_resort_2.jpg",
    fallback: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400",
  },
  {
    id: "exterior_hiraya_1",
    tag: "hiraya",
    label: "平屋",
    src: "/images/styles/exterior_hiraya_1.jpg",
    fallback: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400",
  },
  {
    id: "exterior_hiraya_2",
    tag: "hiraya",
    label: "平屋",
    src: "/images/styles/exterior_hiraya_2.jpg",
    fallback: "https://images.unsplash.com/photo-1575517111839-3a3843ee7f5d?w=400",
  },
  {
    id: "exterior_other_1",
    tag: "other",
    label: "その他",
    src: "/images/styles/exterior_other_1.jpg",
    fallback: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=400",
  },
  {
    id: "exterior_other_2",
    tag: "other",
    label: "その他",
    src: "/images/styles/exterior_other_2.jpg",
    fallback: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400",
  },
];

export const interiorImages: readonly StyleImage[] = [
  {
    id: "interior_simple_clean_1",
    tag: "simple_clean",
    label: "シンプルクリーン",
    src: "/images/styles/interior_simple_clean_1.jpg",
    fallback: "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=400",
  },
  {
    id: "interior_simple_clean_2",
    tag: "simple_clean",
    label: "シンプルクリーン",
    src: "/images/styles/interior_simple_clean_2.jpg",
    fallback: "https://images.unsplash.com/photo-1631679706909-1844bbd07221?w=400",
  },
  {
    id: "interior_natural_wood_1",
    tag: "natural_wood",
    label: "ナチュラルウッド",
    src: "/images/styles/interior_natural_wood_1.jpg",
    fallback: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400",
  },
  {
    id: "interior_natural_wood_2",
    tag: "natural_wood",
    label: "ナチュラルウッド",
    src: "/images/styles/interior_natural_wood_2.jpg",
    fallback: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400",
  },
  {
    id: "interior_monotone_1",
    tag: "monotone",
    label: "モノトーン",
    src: "/images/styles/interior_monotone_1.jpg",
    fallback: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=400",
  },
  {
    id: "interior_monotone_2",
    tag: "monotone",
    label: "モノトーン",
    src: "/images/styles/interior_monotone_2.jpg",
    fallback: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=400",
  },
  {
    id: "interior_cafe_vintage_1",
    tag: "cafe_vintage",
    label: "カフェヴィンテージ",
    src: "/images/styles/interior_cafe_vintage_1.jpg",
    fallback: "https://images.unsplash.com/photo-1505409859467-3a796fd5798e?w=400",
  },
  {
    id: "interior_cafe_vintage_2",
    tag: "cafe_vintage",
    label: "カフェヴィンテージ",
    src: "/images/styles/interior_cafe_vintage_2.jpg",
    fallback: "https://images.unsplash.com/photo-1564540574859-0dfb63985953?w=400",
  },
  {
    id: "interior_japanese_1",
    tag: "japanese",
    label: "和テイスト",
    src: "/images/styles/interior_japanese_1.jpg",
    fallback: "https://images.unsplash.com/photo-1545315003-c5ad6226c272?w=400",
  },
  {
    id: "interior_japanese_2",
    tag: "japanese",
    label: "和テイスト",
    src: "/images/styles/interior_japanese_2.jpg",
    fallback: "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=400",
  },
  {
    id: "interior_colorful_1",
    tag: "colorful",
    label: "カラフル",
    src: "/images/styles/interior_colorful_1.jpg",
    fallback: "https://images.unsplash.com/photo-1600210492493-0946911123ea?w=400",
  },
  {
    id: "interior_colorful_2",
    tag: "colorful",
    label: "カラフル",
    src: "/images/styles/interior_colorful_2.jpg",
    fallback: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400",
  },
  {
    id: "interior_other_1",
    tag: "other",
    label: "その他",
    src: "/images/styles/interior_other_1.jpg",
    fallback: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400",
  },
  {
    id: "interior_other_2",
    tag: "other",
    label: "その他",
    src: "/images/styles/interior_other_2.jpg",
    fallback: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400",
  },
];

/** タグ → 日本語ラベル */
export const tagLabels: Record<string, string> = {
  simple_modern: "シンプルモダン",
  natural: "ナチュラル",
  japanese: "和テイスト",
  industrial: "インダストリアル",
  resort: "リゾート",
  hiraya: "平屋",
  other: "その他",
  simple_clean: "シンプルクリーン",
  natural_wood: "ナチュラルウッド",
  monotone: "モノトーン",
  cafe_vintage: "カフェヴィンテージ",
  colorful: "カラフル",
};

/**
 * 画像IDからタグを引くマップ（スコアリング用）
 */
export function getTagFromImageId(imageId: string): StyleTag | undefined {
  const all = [...interiorImages, ...exteriorImages];
  return all.find((img) => img.id === imageId)?.tag;
}

/**
 * 選択された画像IDリストからタグの出現回数を集計
 */
export function countTags(selectedIds: string[]): Record<string, number> {
  const all = [...interiorImages, ...exteriorImages];
  const counts: Record<string, number> = {};
  for (const id of selectedIds) {
    const img = all.find((i) => i.id === id);
    if (img) {
      counts[img.tag] = (counts[img.tag] || 0) + 1;
    }
  }
  return counts;
}
