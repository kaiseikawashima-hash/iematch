"use client";

import { areaData, activeAreas } from "@/data/areas";

type Props = {
  readonly selected: string[];
  readonly onToggle: (area: string) => void;
};

export function AreaMultiSelect({ selected, onToggle }: Props) {
  // 現在有効な都道府県のエリアをすべてフラットに取得
  const allAreas = activeAreas.flatMap((pref) => areaData[pref] ?? []);

  return (
    <div className="flex flex-col gap-4">
      {/* 選択済みエリア（タグ表示） */}
      {selected.length > 0 && (
        <div className="rounded-xl border border-brand/20 bg-brand-light/30 p-3">
          <p className="mb-2 text-xs font-medium text-muted-foreground">
            選択中（{selected.length}件）
          </p>
          <div className="flex flex-wrap gap-2">
            {selected.map((area) => (
              <button
                key={area}
                type="button"
                onClick={() => onToggle(area)}
                className="inline-flex items-center gap-1 rounded-full border border-brand bg-white px-3 py-1.5 text-xs font-medium text-brand-dark transition-colors hover:bg-brand-light"
              >
                {area}
                <svg
                  className="h-3.5 w-3.5 text-brand"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* エリア選択ボタン一覧 */}
      <div className="flex flex-wrap gap-2">
        {allAreas.map((area) => {
          const isSelected = selected.includes(area);
          return (
            <button
              key={area}
              type="button"
              onClick={() => onToggle(area)}
              className={`rounded-full border px-3.5 py-2 text-sm transition-all ${
                isSelected
                  ? "border-brand bg-brand font-medium text-white"
                  : "border-black/10 bg-white text-gray-700 hover:border-brand/30 hover:bg-brand-light/30"
              }`}
            >
              {area}
            </button>
          );
        })}
      </div>
    </div>
  );
}
