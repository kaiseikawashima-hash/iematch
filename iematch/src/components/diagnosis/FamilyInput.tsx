"use client";

import { FamilyData } from "@/types";

type Props = {
  readonly family: FamilyData;
  readonly futurePlanOptions: readonly { value: string; label: string }[];
  readonly onChange: (family: FamilyData) => void;
};

export function FamilyInput({ family, futurePlanOptions, onChange }: Props) {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex gap-4">
        <div className="flex-1">
          <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
            大人
          </label>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() =>
                onChange({ ...family, adults: Math.max(1, family.adults - 1) })
              }
              className="flex h-10 w-10 items-center justify-center rounded-full border border-black/10 text-lg hover:bg-gray-50"
            >
              −
            </button>
            <span className="w-8 text-center text-lg font-medium">
              {family.adults}
            </span>
            <button
              type="button"
              onClick={() =>
                onChange({ ...family, adults: Math.min(6, family.adults + 1) })
              }
              className="flex h-10 w-10 items-center justify-center rounded-full border border-black/10 text-lg hover:bg-gray-50"
            >
              ＋
            </button>
            <span className="text-sm text-muted-foreground">人</span>
          </div>
        </div>

        <div className="flex-1">
          <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
            子ども
          </label>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() =>
                onChange({ ...family, children: Math.max(0, family.children - 1) })
              }
              className="flex h-10 w-10 items-center justify-center rounded-full border border-black/10 text-lg hover:bg-gray-50"
            >
              −
            </button>
            <span className="w-8 text-center text-lg font-medium">
              {family.children}
            </span>
            <button
              type="button"
              onClick={() =>
                onChange({ ...family, children: Math.min(6, family.children + 1) })
              }
              className="flex h-10 w-10 items-center justify-center rounded-full border border-black/10 text-lg hover:bg-gray-50"
            >
              ＋
            </button>
            <span className="text-sm text-muted-foreground">人</span>
          </div>
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
          今後の家族計画
        </label>
        <div className="flex flex-col gap-2">
          {futurePlanOptions.map((option) => {
            const isSelected = family.futurePlan === option.value;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => onChange({ ...family, futurePlan: option.value })}
                className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm transition-all ${
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
                  {isSelected && <span className="h-2 w-2 rounded-full bg-white" />}
                </span>
                <span>{option.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
