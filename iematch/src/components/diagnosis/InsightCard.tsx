"use client";

import { useState } from "react";

interface InsightCardProps {
  readonly insight: string | null;
  readonly loading: boolean;
  readonly onConfirm: () => void;
  readonly onDeny: (correctionText: string) => void;
  readonly onSkip: () => void;
  readonly onBack?: () => void;
}

export function InsightCard({
  insight,
  loading,
  onConfirm,
  onDeny,
  onSkip,
  onBack,
}: InsightCardProps) {
  const [showCorrectionInput, setShowCorrectionInput] = useState(false);
  const [correctionText, setCorrectionText] = useState("");

  const handleDenyClick = () => {
    setShowCorrectionInput(true);
  };

  const handleSubmitCorrection = () => {
    onDeny(correctionText);
    setShowCorrectionInput(false);
    setCorrectionText("");
  };

  const handleBackFromCorrection = () => {
    setShowCorrectionInput(false);
    setCorrectionText("");
  };

  return (
    <div
      className="mx-auto w-full max-w-lg rounded-2xl p-6"
      style={{ background: "#E8FBF6", border: "1px solid #2ABFA4" }}
    >
      <p className="mb-4 text-xs font-semibold" style={{ color: "#2ABFA4" }}>
        あなたの回答から見えてきたこと
      </p>

      {loading ? (
        <div className="flex items-center justify-center py-8">
          <div
            className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300"
            style={{ borderTopColor: "#2ABFA4" }}
          />
        </div>
      ) : showCorrectionInput ? (
        <>
          <p className="mb-8 text-sm leading-relaxed" style={{ color: "#1A2B2E" }}>
            {insight}
          </p>

          <div className="flex flex-col gap-3">
            <label className="text-sm font-medium" style={{ color: "#1A2B2E" }}>
              どんなところが違いましたか？（短くてOKです）
            </label>
            <textarea
              value={correctionText}
              onChange={(e) => setCorrectionText(e.target.value)}
              placeholder="例：コストより、デザインの方が大事かも"
              className="w-full rounded-xl border px-4 py-3 text-sm leading-relaxed placeholder:text-gray-400 focus:outline-none focus:ring-1"
              style={{ borderColor: "#2ABFA4", color: "#1A2B2E" }}
            />
            <button
              type="button"
              onClick={handleSubmitCorrection}
              className="h-12 w-full rounded-full text-sm font-medium text-white transition-colors hover:opacity-90"
              style={{ background: "#2ABFA4" }}
            >
              送信して次へ
            </button>
            <button
              type="button"
              onClick={handleBackFromCorrection}
              className="h-12 w-full rounded-full border text-sm font-medium transition-colors hover:bg-white/60"
              style={{ borderColor: "#2ABFA4", color: "#2ABFA4", background: "white" }}
            >
              戻る
            </button>
          </div>
        </>
      ) : (
        <>
          <p className="mb-8 text-sm leading-relaxed" style={{ color: "#1A2B2E" }}>
            {insight}
          </p>

          <div className="flex flex-col gap-3">
            <button
              type="button"
              onClick={onConfirm}
              className="h-12 w-full rounded-full text-sm font-medium text-white transition-colors hover:opacity-90"
              style={{ background: "#2ABFA4" }}
            >
              そうそう、合ってます
            </button>
            <button
              type="button"
              onClick={handleDenyClick}
              className="h-12 w-full rounded-full border text-sm font-medium transition-colors hover:bg-white/60"
              style={{ borderColor: "#2ABFA4", color: "#2ABFA4", background: "white" }}
            >
              ちょっと違うかも
            </button>
            <button
              type="button"
              onClick={onSkip}
              className="mt-1 text-xs transition-colors hover:text-gray-600"
              style={{ color: "#4A5C5E" }}
            >
              スキップ
            </button>
          </div>
        </>
      )}
    </div>
  );
}
