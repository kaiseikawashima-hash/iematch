"use client";

import { useEffect, useState } from "react";
import { Builder } from "@/types";
import { getBuilders } from "@/lib/getBuilders";

/**
 * クライアントコンポーネントで工務店データを取得するフック
 * Supabase接続時は非同期取得、未接続時はダミーデータを返す
 */
export function useBuilders(): { builders: Builder[]; loading: boolean } {
  const [builders, setBuilders] = useState<Builder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getBuilders()
      .then(setBuilders)
      .finally(() => setLoading(false));
  }, []);

  return { builders, loading };
}
