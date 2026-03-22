"use client";

type Props = {
  readonly categoryLabel: string;
  readonly categoryNumber: number;
  readonly totalCategories: number;
  readonly questionNumber: number;
  readonly totalQuestions: number;
};

export function ProgressBar({
  categoryLabel,
  categoryNumber,
  totalCategories,
  questionNumber,
  totalQuestions,
}: Props) {
  const progress = (questionNumber / totalQuestions) * 100;

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span className="font-medium text-brand-dark">{categoryLabel}</span>
        <span>
          Step {categoryNumber}/{totalCategories}　{questionNumber}/{totalQuestions}
        </span>
      </div>
      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
        <div
          className="h-full rounded-full bg-brand transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
