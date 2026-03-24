"use client";

import { useState, useEffect, useCallback } from "react";

const ADMIN_PASSWORD = "iematch2024";
const BRAND = "#2E5240";

type Tab = "builders" | "images" | "policy" | "leads";

// テイスト画像定義
const TASTE_IMAGES = [
  { id: "ext_simple_modern", group: "外観", label: "シンプルモダン" },
  { id: "ext_natural_nordic", group: "外観", label: "ナチュラル・北欧風" },
  { id: "ext_japanese_modern", group: "外観", label: "和モダン" },
  { id: "ext_industrial", group: "外観", label: "インダストリアル" },
  { id: "ext_resort", group: "外観", label: "リゾート・南欧風" },
  { id: "ext_hiraya", group: "外観", label: "平屋スタイル" },
  { id: "int_white_clean", group: "内装", label: "白基調シンプル&クリーン" },
  { id: "int_natural_wood", group: "内装", label: "無垢材ナチュラル" },
  { id: "int_monotone", group: "内装", label: "モノトーン" },
  { id: "int_cafe_vintage", group: "内装", label: "カフェ風・ヴィンテージ" },
  { id: "int_japanese", group: "内装", label: "和テイスト" },
  { id: "int_colorful", group: "内装", label: "カラフル・個性的" },
];

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [pwError, setPwError] = useState("");

  useEffect(() => {
    if (sessionStorage.getItem("admin_authed") === "true") {
      setAuthed(true);
    }
  }, []);

  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem("admin_authed", "true");
      setAuthed(true);
      setPwError("");
    } else {
      setPwError("パスワードが正しくありません");
    }
  };

  if (!authed) {
    return (
      <div className="flex min-h-screen items-center justify-center" style={{ background: "#F5F4F0" }}>
        <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-sm">
          <h1 className="text-center text-xl font-bold" style={{ color: BRAND }}>
            管理画面
          </h1>
          <p className="mt-1 text-center text-xs text-gray-500">パスワードを入力してください</p>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            placeholder="パスワード"
            className="mt-6 w-full rounded-xl border border-black/10 px-4 py-3 text-sm outline-none focus:border-brand focus:ring-1 focus:ring-brand"
          />
          {pwError && <p className="mt-2 text-xs text-red-500">{pwError}</p>}
          <button
            type="button"
            onClick={handleLogin}
            className="mt-4 w-full rounded-full py-3 text-sm font-bold text-white"
            style={{ background: BRAND }}
          >
            ログイン
          </button>
        </div>
      </div>
    );
  }

  return <AdminDashboard />;
}

function AdminDashboard() {
  const [tab, setTab] = useState<Tab>("builders");

  const tabs: { key: Tab; label: string }[] = [
    { key: "builders", label: "工務店管理" },
    { key: "images", label: "テイスト画像" },
    { key: "policy", label: "ポリシー" },
    { key: "leads", label: "リード一覧" },
  ];

  return (
    <div className="flex min-h-screen flex-col" style={{ background: "#F5F4F0" }}>
      <header className="border-b bg-white px-4 py-3">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-lg font-bold" style={{ color: BRAND }}>イエマッチ 管理画面</h1>
        </div>
      </header>

      <div className="mx-auto w-full max-w-4xl px-4 pt-4">
        <div className="flex gap-2 overflow-x-auto">
          {tabs.map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => setTab(t.key)}
              className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                tab === t.key
                  ? "text-white"
                  : "border border-black/10 bg-white text-gray-600 hover:bg-gray-50"
              }`}
              style={tab === t.key ? { background: BRAND } : undefined}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-4">
        {tab === "builders" && <BuildersTab />}
        {tab === "images" && <ImagesTab />}
        {tab === "policy" && <PolicyTab />}
        {tab === "leads" && <LeadsTab />}
      </main>
    </div>
  );
}

// ─── タブ① 工務店管理 ───
type BuilderRow = {
  id: string;
  name: string;
  address: string;
  main_price_range: string;
  best_style: string;
  design_freedom: string;
  created_at: string;
};

function BuildersTab() {
  const [builders, setBuilders] = useState<BuilderRow[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBuilders = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/builders");
      const data = await res.json();
      setBuilders(data.data ?? []);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchBuilders(); }, [fetchBuilders]);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`「${name}」を削除しますか？この操作は取り消せません。`)) return;
    await fetch("/api/admin/builders", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    fetchBuilders();
  };

  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold" style={{ color: BRAND }}>工務店一覧（{builders.length}社）</h2>
        <a
          href="/admin/register"
          className="rounded-full px-4 py-2 text-xs font-bold text-white"
          style={{ background: BRAND }}
        >
          新規登録
        </a>
      </div>

      {loading ? (
        <p className="mt-4 text-center text-sm text-gray-400">読み込み中...</p>
      ) : (
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b text-gray-500">
                <th className="pb-2 pr-4">ID</th>
                <th className="pb-2 pr-4">会社名</th>
                <th className="pb-2 pr-4">所在地</th>
                <th className="pb-2 pr-4">価格帯</th>
                <th className="pb-2">操作</th>
              </tr>
            </thead>
            <tbody>
              {builders.map((b) => (
                <tr key={b.id} className="border-b last:border-0">
                  <td className="py-2 pr-4 font-mono text-[10px] text-gray-400">{b.id}</td>
                  <td className="py-2 pr-4 font-medium">{b.name}</td>
                  <td className="py-2 pr-4 text-gray-500">{b.address?.slice(0, 15) ?? ""}</td>
                  <td className="py-2 pr-4 text-gray-500">{b.main_price_range}</td>
                  <td className="py-2">
                    <button
                      type="button"
                      onClick={() => handleDelete(b.id, b.name)}
                      className="rounded-full border border-red-200 px-3 py-1 text-[10px] text-red-500 hover:bg-red-50"
                    >
                      削除
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ─── タブ② テイスト画像管理 ───
function ImagesTab() {
  const [urls, setUrls] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [uploading, setUploading] = useState<Record<string, boolean>>({});
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/admin/images");
        const data = await res.json();
        const map: Record<string, string> = {};
        for (const row of data.data ?? []) {
          map[row.id] = row.url;
        }
        setUrls(map);
      } catch {
        // ignore
      }
    })();
  }, []);

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 2500);
  };

  const handleUpload = async (imageId: string, file: File) => {
    setUploading((prev) => ({ ...prev, [imageId]: true }));
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("id", imageId);

      const res = await fetch("/api/admin/upload-image", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (!res.ok) {
        showToast(data.error ?? "アップロードに失敗しました");
        return;
      }

      // URLを更新（ブラウザキャッシュ回避のためタイムスタンプ付与）
      const newUrl = `${data.path}?t=${Date.now()}`;
      setUrls((prev) => ({ ...prev, [imageId]: newUrl }));

      // Supabaseにも保存
      await fetch("/api/admin/images", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          images: [{ id: imageId, url: data.path }],
        }),
      });

      showToast("保存しました");
    } catch {
      showToast("アップロードに失敗しました");
    } finally {
      setUploading((prev) => ({ ...prev, [imageId]: false }));
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    const images = TASTE_IMAGES.map((img) => ({
      id: img.id,
      url: (urls[img.id] ?? "").split("?")[0], // キャッシュバスター除去
    }));
    await fetch("/api/admin/images", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ images }),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const groups = ["外観", "内装"];

  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm">
      <h2 className="text-sm font-bold" style={{ color: BRAND }}>テイスト画像管理</h2>
      <p className="mt-1 text-[10px] text-gray-400">Q13・Q14で表示される画像のURLを管理します</p>

      <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2">
        <p className="text-[10px] leading-relaxed text-amber-700">
          画像のアップロードはローカル環境でのみ有効です。アップロード後はgit pushで本番に反映してください。
        </p>
      </div>

      {groups.map((group) => (
        <div key={group} className="mt-4">
          <h3 className="mb-2 text-xs font-bold text-gray-700">{group}テイスト</h3>
          <div className="space-y-3">
            {TASTE_IMAGES.filter((img) => img.group === group).map((img) => (
              <div key={img.id} className="flex items-start gap-3">
                <div className="h-[60px] w-[60px] shrink-0 overflow-hidden rounded-lg border bg-gray-100">
                  {urls[img.id] ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={urls[img.id]} alt={img.label} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-[8px] text-gray-400">No image</div>
                  )}
                </div>
                <div className="flex-1">
                  <label className="text-[10px] font-medium text-gray-600">{img.label}</label>
                  <input
                    type="text"
                    value={urls[img.id] ?? ""}
                    onChange={(e) => setUrls((prev) => ({ ...prev, [img.id]: e.target.value }))}
                    placeholder="https://images.unsplash.com/..."
                    className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2 text-[11px] outline-none focus:border-brand focus:ring-1 focus:ring-brand"
                  />
                  <label
                    className={`mt-1 inline-flex cursor-pointer items-center gap-1 rounded-lg border border-black/10 px-3 py-1.5 text-[10px] font-medium text-gray-600 transition-colors hover:bg-gray-50 ${
                      uploading[img.id] ? "pointer-events-none opacity-50" : ""
                    }`}
                  >
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleUpload(img.id, file);
                        e.target.value = "";
                      }}
                    />
                    {uploading[img.id] ? "アップロード中..." : "ファイルを選択"}
                  </label>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="mt-6 flex items-center gap-3">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="rounded-full px-6 py-2 text-sm font-bold text-white disabled:opacity-60"
          style={{ background: BRAND }}
        >
          {saving ? "保存中..." : "URL一括保存"}
        </button>
        {saved && <span className="text-xs text-green-600">保存しました</span>}
      </div>

      {toast && (
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full bg-gray-800 px-5 py-2.5 text-xs font-medium text-white shadow-lg">
          {toast}
        </div>
      )}
    </div>
  );
}

// ─── タブ③ プライバシーポリシー・利用規約 ───
function PolicyTab() {
  const [privacy, setPrivacy] = useState("");
  const [terms, setTerms] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/admin/settings");
        const data = await res.json();
        setPrivacy(data.data?.privacy_policy ?? "");
        setTerms(data.data?.terms_of_service ?? "");
      } catch {
        // ignore
      }
    })();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    await Promise.all([
      fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "privacy_policy", value: privacy }),
      }),
      fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "terms_of_service", value: terms }),
      }),
    ]);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-4">
      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <h2 className="text-sm font-bold" style={{ color: BRAND }}>プライバシーポリシー</h2>
        <textarea
          value={privacy}
          onChange={(e) => setPrivacy(e.target.value)}
          rows={10}
          className="mt-3 w-full rounded-xl border border-black/10 px-4 py-3 text-sm outline-none focus:border-brand focus:ring-1 focus:ring-brand"
          placeholder="プライバシーポリシーの文言を入力..."
        />
      </div>

      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <h2 className="text-sm font-bold" style={{ color: BRAND }}>利用規約</h2>
        <textarea
          value={terms}
          onChange={(e) => setTerms(e.target.value)}
          rows={10}
          className="mt-3 w-full rounded-xl border border-black/10 px-4 py-3 text-sm outline-none focus:border-brand focus:ring-1 focus:ring-brand"
          placeholder="利用規約の文言を入力..."
        />
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="rounded-full px-6 py-2 text-sm font-bold text-white disabled:opacity-60"
          style={{ background: BRAND }}
        >
          {saving ? "保存中..." : "保存"}
        </button>
        {saved && <span className="text-xs text-green-600">保存しました</span>}
      </div>
    </div>
  );
}

// ─── タブ④ リード一覧 ───
type LeadRow = {
  id: number;
  name: string;
  email: string;
  phone: string;
  diagnosis_type: string | null;
  builder_ids: string[] | null;
  created_at: string;
};

function LeadsTab() {
  const [leads, setLeads] = useState<LeadRow[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/leads");
      const data = await res.json();
      setLeads(data.data ?? []);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchLeads(); }, [fetchLeads]);

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`「${name}」のリードを削除しますか？`)) return;
    await fetch("/api/admin/leads", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    fetchLeads();
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, "0")}/${String(d.getDate()).padStart(2, "0")} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
  };

  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm">
      <h2 className="text-sm font-bold" style={{ color: BRAND }}>リード一覧（{leads.length}件）</h2>

      {loading ? (
        <p className="mt-4 text-center text-sm text-gray-400">読み込み中...</p>
      ) : leads.length === 0 ? (
        <p className="mt-4 text-center text-sm text-gray-400">リードはまだありません</p>
      ) : (
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b text-gray-500">
                <th className="pb-2 pr-4">名前</th>
                <th className="pb-2 pr-4">メール</th>
                <th className="pb-2 pr-4">診断タイプ</th>
                <th className="pb-2 pr-4">請求先</th>
                <th className="pb-2 pr-4">日時</th>
                <th className="pb-2">操作</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((l) => (
                <tr key={l.id} className="border-b last:border-0">
                  <td className="py-2 pr-4 font-medium">{l.name}</td>
                  <td className="py-2 pr-4 text-gray-500">{l.email}</td>
                  <td className="py-2 pr-4 text-gray-500">{l.diagnosis_type ?? "-"}</td>
                  <td className="py-2 pr-4 text-gray-500">{l.builder_ids?.length ?? 0}社</td>
                  <td className="py-2 pr-4 text-gray-400">{formatDate(l.created_at)}</td>
                  <td className="py-2">
                    <button
                      type="button"
                      onClick={() => handleDelete(l.id, l.name)}
                      className="rounded-full border border-red-200 px-3 py-1 text-[10px] text-red-500 hover:bg-red-50"
                    >
                      削除
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
