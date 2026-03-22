"use client";

import { useRouter } from "next/navigation";
import { Builder } from "@/types";

type Props = {
  readonly builder: Builder;
  readonly matchRate: number;
  readonly reasonText: string;
  readonly rank: number;
};

export function BuilderCard({ builder, matchRate, reasonText, rank }: Props) {
  const router = useRouter();

  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
      {/* 写真プレースホルダー */}
      <div className="relative h-40 bg-gradient-to-br from-gray-100 to-gray-200">
        <div className="flex h-full items-center justify-center text-sm text-gray-400">
          施工事例写真
        </div>
        <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1 text-xs font-bold backdrop-blur-sm">
          <span className="text-brand">{rank}位</span>
          <span className="text-gray-300">|</span>
          <span className="text-brand">マッチ度 {matchRate}%</span>
        </div>
      </div>

      <div className="p-4">
        <h4 className="text-base font-bold">{builder.name}</h4>
        <p className="mt-1 text-xs leading-relaxed text-gray-500">
          {reasonText}
        </p>

        {/* 強みタグ */}
        <div className="mt-3 flex flex-wrap gap-1.5">
          {builder.b7_topStrengths.slice(0, 3).map((strength) => (
            <span
              key={strength}
              className="rounded-full bg-brand-light px-2.5 py-0.5 text-[10px] font-medium text-brand-dark"
            >
              {strengthLabel(strength)}
            </span>
          ))}
        </div>

        {/* ボタン */}
        <div className="mt-4 flex gap-2">
          <button
            type="button"
            onClick={() => {
              sessionStorage.setItem(
                "iematch_request_builders",
                JSON.stringify([builder.id])
              );
              router.push("/request");
            }}
            className="flex-1 rounded-full bg-brand py-2.5 text-center text-xs font-bold text-white transition-colors hover:bg-brand-dark"
          >
            資料請求
          </button>
          <button
            type="button"
            onClick={() => router.push(`/builder/${builder.id}`)}
            className="flex-1 rounded-full border border-brand py-2.5 text-center text-xs font-bold text-brand transition-colors hover:bg-brand-light"
          >
            詳しく見る
          </button>
        </div>
      </div>
    </div>
  );
}

function strengthLabel(value: string): string {
  const labels: Record<string, string> = {
    design: "デザイン力",
    cost: "コスパ",
    performance: "住宅性能",
    personality: "人柄",
    after_service: "アフターサービス",
    track_record: "施工実績",
    land_support: "土地探し",
    custom_design: "自由設計",
  };
  return labels[value] ?? value;
}
