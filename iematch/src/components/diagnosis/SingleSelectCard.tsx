"use client";

import { QuestionOption } from "@/types";

type Props = {
  readonly options: readonly QuestionOption[];
  readonly selected: string | undefined;
  readonly onSelect: (value: string) => void;
};

export function SingleSelectCard({ options, selected, onSelect }: Props) {
  return (
    <div className="flex flex-col gap-2.5">
      {options.map((option) => {
        const isSelected = selected === option.value;
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onSelect(option.value)}
            className={`flex items-center gap-3 rounded-xl border px-4 py-3.5 text-left text-sm transition-all ${
              isSelected
                ? "border-brand bg-brand-light font-medium text-brand-dark"
                : "border-black/10 bg-white hover:border-brand/30 hover:bg-brand-light/30"
            }`}
          >
            <span
              className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-all ${
                isSelected ? "border-brand bg-brand" : "border-gray-300"
              }`}
            >
              {isSelected && (
                <span className="h-2 w-2 rounded-full bg-white" />
              )}
            </span>
            <span>{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}
