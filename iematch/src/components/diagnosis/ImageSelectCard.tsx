"use client";

import { useState } from "react";
import Image from "next/image";
import { QuestionOption } from "@/types";

type Props = {
  readonly options: readonly QuestionOption[];
  readonly selected: string[];
  readonly minSelect?: number;
  readonly maxSelect?: number;
  readonly onToggle: (value: string) => void;
};

function ThumbnailImage({ src, alt }: { readonly src: string; readonly alt: string }) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 text-xs text-gray-400">
        {alt}
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes="(max-width: 640px) 50vw, 33vw"
      className="object-cover"
      onError={() => setHasError(true)}
    />
  );
}

export function ImageSelectCard({ options, selected, maxSelect, onToggle }: Props) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
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
            className={`group relative flex flex-col overflow-hidden rounded-xl border-2 transition-all ${
              isSelected
                ? "border-brand shadow-md"
                : isDisabled
                  ? "cursor-not-allowed border-transparent opacity-50"
                  : "border-transparent hover:border-brand/30"
            }`}
          >
            {option.imageUrl ? (
              <div className="relative h-40 w-full bg-gray-100">
                <ThumbnailImage src={option.imageUrl} alt={option.label} />
                {isSelected && (
                  <div className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-brand text-white">
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </div>
            ) : null}
            <div
              className={`px-2 py-2 text-center text-xs font-medium ${
                isSelected ? "bg-brand-light text-brand-dark" : "bg-white text-gray-700"
              }`}
            >
              {option.label}
            </div>
          </button>
        );
      })}
    </div>
  );
}
