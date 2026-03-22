"use client";

import { QuestionOption } from "@/types";

type Props = {
  readonly options: readonly QuestionOption[];
  readonly ranked: string[];
  readonly maxSelect: number;
  readonly onSelect: (value: string) => void;
  readonly onRemove: (value: string) => void;
};

export function RankedSelectCard({ options, ranked, maxSelect, onSelect, onRemove }: Props) {
  const isFull = ranked.length >= maxSelect;

  return (
    <div className="space-y-4">
      {/* 選択済みの順位表示 */}
      {ranked.length > 0 && (
        <div className="flex flex-col gap-2 rounded-xl bg-brand-light/50 p-3">
          <p className="text-xs font-medium text-brand-dark">選択した順位:</p>
          {ranked.map((value, index) => {
            const option = options.find((o) => o.value === value);
            return (
              <div
                key={value}
                className="flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-sm"
              >
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand text-xs font-bold text-white">
                  {index + 1}
                </span>
                <span className="flex-1 font-medium">{option?.label ?? value}</span>
                <button
                  type="button"
                  onClick={() => onRemove(value)}
                  className="text-gray-400 hover:text-red-500"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* 選択肢 */}
      <div className="flex flex-col gap-2.5">
        {options.map((option) => {
          const rankIndex = ranked.indexOf(option.value);
          const isSelected = rankIndex >= 0;
          const isDisabled = !isSelected && isFull;

          // "none"を選んだ場合は他を無効に、他を選んだ場合は"none"を無効に
          const isNoneSelected = ranked.includes("none");
          const isNoneOption = option.value === "none";
          const isExcluded =
            (!isSelected && isNoneSelected && !isNoneOption) ||
            (!isSelected && !isNoneSelected && isNoneOption && ranked.length > 0);

          const disabled = isDisabled || isExcluded;

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                if (isSelected) {
                  onRemove(option.value);
                } else if (!disabled) {
                  onSelect(option.value);
                }
              }}
              disabled={disabled && !isSelected}
              className={`flex items-center gap-3 rounded-xl border px-4 py-3.5 text-left text-sm transition-all ${
                isSelected
                  ? "border-brand bg-brand-light font-medium text-brand-dark"
                  : disabled
                    ? "cursor-not-allowed border-black/5 bg-gray-50 text-gray-400"
                    : "border-black/10 bg-white hover:border-brand/30 hover:bg-brand-light/30"
              }`}
            >
              {isSelected ? (
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand text-xs font-bold text-white">
                  {rankIndex + 1}
                </span>
              ) : (
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 border-gray-300 text-xs text-gray-400">
                  {!disabled ? ranked.length + 1 : ""}
                </span>
              )}
              <span>{option.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
