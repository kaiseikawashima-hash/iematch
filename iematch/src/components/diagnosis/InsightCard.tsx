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
      style={{ background: "#EAF0EC" }}
    >
      <p className="mb-4 text-xs font-semibold" style={{ color: "#3A7D44" }}>
        あなたの回答から見えてきたこと
      </p>

      {loading ? (
        <div className="flex items-center justify-center py-8">
          <div
            className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300"
            style={{ borderTopColor: "#3A7D44" }}
          />
        </div>
      ) : showCorrectionInput ? (
        <>
          <p className="mb-8 text-sm leading-relaxed text-gray-800">
            {insight}
          </p>

          <div className="flex flex-col gap-3">
            <label className="text-sm font-medium text-gray-700">
              どんなところが違いましたか？（短くてOKです）
            </label>
            <textarea
              value={correctionText}
              onChange={(e) => setCorrectionText(e.target.value)}
              placeholder="例：コストより、デザインの方が大事かも"
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm leading-relaxed text-gray-800 placeholder:text-gray-400 focus:border-[#3A7D44] focus:outline-none focus:ring-1 focus:ring-[#3A7D44]"
              rows={3}
            />
            <button
              type="button"
              onClick={handleSubmitCorrection}
              className="h-12 w-full rounded-full text-sm font-medium text-white transition-colors hover:opacity-90"
              style={{ background: "#3A7D44" }}
            >
              送信して次へ
            </button>
            <button
              type="button"
              onClick={handleBackFromCorrection}
              className="h-12 w-full rounded-full border text-sm font-medium transition-colors hover:bg-white/60"
              style={{ borderColor: "#3A7D44", color: "#3A7D44", background: "white" }}
            >
              戻る
            </button>
          </div>
        </>
      ) : (
        <>
          <p className="mb-8 text-sm leading-relaxed text-gray-800">
            {insight}
          </p>

          <div className="flex flex-col gap-3">
            <button
              type="button"
              onClick={onConfirm}
              className="h-12 w-full rounded-full text-sm font-medium text-white transition-colors hover:opacity-90"
              style={{ background: "#3A7D44" }}
            >
              そうそう、合ってます
            </button>
            <button
              type="button"
              onClick={handleDenyClick}
              className="h-12 w-full rounded-full border text-sm font-medium transition-colors hover:bg-white/60"
              style={{ borderColor: "#3A7D44", color: "#3A7D44", background: "white" }}
            >
              ちょっと違うかも
            </button>
            <button
              type="button"
              onClick={onSkip}
              className="mt-1 text-xs text-gray-400 transition-colors hover:text-gray-600"
            >
              スキップ
            </button>
          </div>
        </>
      )}
    </div>
  );
}
