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
    <div>
      {/* 選択カウンター */}
      <div className="mb-3 text-center">
        <span className="text-sm font-medium" style={{ color: "#1A2B2E" }}>
          <span className="font-bold" style={{ color: "#2ABFA4" }}>{selected.length}</span>
          /{maxSelect ?? 4} 選択中
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3">
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
              className={`group relative overflow-hidden rounded-xl transition-all ${
                isSelected
                  ? "ring-2 shadow-md"
                  : isDisabled
                    ? "cursor-not-allowed opacity-40"
                    : "ring-1 ring-gray-200 hover:ring-2"
              }`}
              style={{
                aspectRatio: "1",
                ...(isSelected ? { ringColor: "#2ABFA4", borderColor: "#2ABFA4" } : {}),
              }}
            >
              {/* 画像 */}
              {option.imageUrl ? (
                <div className="relative h-full w-full">
                  <ThumbnailImage src={option.imageUrl} alt={option.label} />

                  {/* ミントオーバーレイ（選択時） */}
                  {isSelected && (
                    <div
                      className="absolute inset-0"
                      style={{ background: "rgba(42, 191, 164, 0.15)" }}
                    />
                  )}

                  {/* チェックバッジ（右上） */}
                  {isSelected && (
                    <div
                      className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full text-white shadow-sm"
                      style={{ background: "#2ABFA4" }}
                    >
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}

                </div>
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gray-50 text-sm text-gray-500">
                  {option.label}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
