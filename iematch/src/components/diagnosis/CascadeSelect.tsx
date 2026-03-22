"use client";

import { useEffect } from "react";
import { areaData, activeAreas, prefectures } from "@/data/areas";

type Props = {
  readonly selectedPrefecture: string;
  readonly selectedCity: string;
  readonly onPrefectureChange: (prefecture: string) => void;
  readonly onCityChange: (city: string) => void;
};

export function CascadeSelect({
  selectedPrefecture,
  selectedCity,
  onPrefectureChange,
  onCityChange,
}: Props) {
  // activeAreasが1県のみの場合は都道府県選択をスキップ
  const singlePrefecture = activeAreas.length === 1 ? activeAreas[0] : null;

  // 単一県モードなら自動選択
  const effectivePrefecture = singlePrefecture ?? selectedPrefecture;
  const cities = effectivePrefecture ? (areaData[effectivePrefecture] ?? []) : [];

  // 単一県モードで未セットなら自動的にセット
  useEffect(() => {
    if (singlePrefecture && selectedPrefecture !== singlePrefecture) {
      onPrefectureChange(singlePrefecture);
    }
  }, [singlePrefecture, selectedPrefecture, onPrefectureChange]);

  return (
    <div className="flex flex-col gap-4">
      {/* 複数県が有効な場合のみ都道府県セレクトを表示 */}
      {!singlePrefecture && (
        <div>
          <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
            都道府県
          </label>
          <select
            value={selectedPrefecture}
            onChange={(e) => {
              onPrefectureChange(e.target.value);
              onCityChange("");
            }}
            className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none focus:border-brand focus:ring-1 focus:ring-brand"
          >
            <option value="">選択してください</option>
            {prefectures.map((pref) => (
              <option key={pref} value={pref}>
                {pref}
              </option>
            ))}
          </select>
        </div>
      )}

      {effectivePrefecture && (
        <div>
          <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
            {singlePrefecture ? `${singlePrefecture}の市区町村` : "市区町村"}
          </label>
          <select
            value={selectedCity}
            onChange={(e) => onCityChange(e.target.value)}
            className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none focus:border-brand focus:ring-1 focus:ring-brand"
          >
            <option value="">選択してください</option>
            {cities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}
