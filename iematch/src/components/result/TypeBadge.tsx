"use client";

import { TypeName } from "@/types";
import { typeDefinitions } from "@/data/types";

type Props = {
  readonly mainType: TypeName;
  readonly subType: TypeName;
  readonly displayLabel: string;
};

export function TypeBadge({ mainType, displayLabel }: Props) {
  const typeInfo = typeDefinitions[mainType];

  return (
    <div>
      <span className="inline-block rounded-full bg-brand px-4 py-1.5 text-sm font-bold text-white">
        {typeInfo.label}
      </span>
      <p className="mt-2 text-xs text-muted-foreground">{displayLabel}</p>
    </div>
  );
}
