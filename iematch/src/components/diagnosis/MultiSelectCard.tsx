"use client";

import { QuestionOption } from "@/types";

type Props = {
  readonly options: readonly QuestionOption[];
  readonly selected: string[];
  readonly maxSelect?: number;
  readonly onToggle: (value: string) => void;
};

export function MultiSelectCard({ options, selected, maxSelect, onToggle }: Props) {
  return (
    <div className="flex flex-col gap-2.5">
      {options.map((option) => {
        const isSelected = selected.includes(option.value);
        const isDisabled =
          !isSelected && maxSelect !== undefined && selected.length >= maxSelect;

        return (
          <button
            key={option.value}
            type="button"
            onClick={() => {
              if (!isDisabled || isSelected) onToggle(option.value);
            }}
            disabled={isDisabled && !isSelected}
            className={`flex items-center gap-3 rounded-xl border px-4 py-3.5 text-left text-sm transition-all ${
              isSelected
                ? "border-brand bg-brand-light font-medium text-brand-dark"
                : isDisabled
                  ? "cursor-not-allowed border-black/5 bg-gray-50 text-gray-400"
                  : "border-black/10 bg-white hover:border-brand/30 hover:bg-brand-light/30"
            }`}
          >
            <span
              className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 transition-all ${
                isSelected
                  ? "border-brand bg-brand"
                  : isDisabled
                    ? "border-gray-200"
                    : "border-gray-300"
              }`}
            >
              {isSelected && (
                <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </span>
            <span>{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}
