"use client";

import { useState, useCallback } from "react";

// ─── 選択肢定義 ─────────────────────────────────
const PRICE_RANGES = [
  { value: "under_2500", label: "2,500万円未満" },
  { value: "2500_3500", label: "2,500〜3,500万円" },
  { value: "3500_4500", label: "3,500〜4,500万円" },
  { value: "4500_5500", label: "4,500〜5,500万円" },
  { value: "over_5500", label: "5,500万円以上" },
] as const;

const EXTERIOR_STYLES = [
  { value: "simple_modern", label: "シンプルモダン" },
  { value: "natural_nordic", label: "ナチュラル・北欧風" },
  { value: "japanese_modern", label: "和モダン" },
  { value: "industrial", label: "インダストリアル・ブルックリン" },
  { value: "resort", label: "リゾート・南欧風" },
  { value: "hiraya", label: "平屋スタイル" },
  { value: "none", label: "その他・こだわりなし" },
] as const;

const INTERIOR_STYLES = [
  { value: "white_clean", label: "白基調シンプル&クリーン" },
  { value: "natural_wood", label: "無垢材ナチュラル" },
  { value: "monotone", label: "モノトーン・スタイリッシュ" },
  { value: "cafe_vintage", label: "カフェ風・ヴィンテージ" },
  { value: "japanese", label: "和テイスト" },
  { value: "colorful", label: "カラフル・個性的" },
  { value: "none", label: "その他・こだわりなし" },
] as const;

const ALL_STYLES = [
  ...EXTERIOR_STYLES.map((s) => (s.value === "none" ? { ...s, key: "exterior_none" } : s)),
  ...INTERIOR_STYLES.map((s) => (s.value === "none" ? { ...s, key: "interior_none" } : s)),
];

const PERFORMANCE_OPTIONS = [
  { value: "insulation", label: "断熱性能" },
  { value: "seismic", label: "耐震性能" },
  { value: "airtight", label: "気密性能" },
  { value: "energy", label: "省エネ性能" },
  { value: "soundproof", label: "防音性能" },
  { value: "natural_material", label: "自然素材" },
  { value: "maintenance", label: "メンテナンス性" },
] as const;

const SPEC_OPTIONS = [
  { value: "zeh", label: "ZEH" },
  { value: "long_quality", label: "長期優良住宅" },
  { value: "passive", label: "パッシブデザイン" },
  { value: "smart_home", label: "スマートホーム" },
  { value: "whole_house_ac", label: "全館空調" },
  { value: "solar", label: "太陽光発電" },
] as const;

const SERVICE_OPTIONS = [
  { value: "land_support", label: "土地探しサポート" },
  { value: "finance_support", label: "資金計画・住宅ローン相談" },
  { value: "renovation", label: "リフォーム・リノベーション対応" },
  { value: "shop_house", label: "店舗併用住宅対応" },
  { value: "pet_design", label: "ペット対応住宅実績あり" },
  { value: "hiraya", label: "平屋の実績あり" },
] as const;

const DESIGN_FREEDOM_OPTIONS = [
  { value: "full_custom", label: "完全自由設計" },
  { value: "semi_custom", label: "セミオーダー" },
  { value: "standard", label: "規格住宅" },
] as const;

const CONTACT_STYLE_OPTIONS = [
  { value: "nurturing", label: "じっくり寄り添い型" },
  { value: "proactive", label: "提案積極型" },
  { value: "speedy", label: "スピード対応型" },
  { value: "honest", label: "誠実・正直型" },
  { value: "expert", label: "専門知識重視型" },
] as const;

const SALES_FEATURE_OPTIONS = [
  { value: "online", label: "オンライン相談対応" },
  { value: "model_house", label: "モデルハウスあり" },
  { value: "showroom", label: "ショールーム・体感施設あり" },
] as const;

const STRENGTH_OPTIONS = [
  { value: "design", label: "デザイン力" },
  { value: "performance", label: "性能・技術力" },
  { value: "cost", label: "コストパフォーマンス" },
  { value: "lifestyle", label: "暮らし提案力" },
  { value: "personality", label: "担当者の人柄・相性" },
  { value: "after_service", label: "アフターサポート" },
  { value: "land_support", label: "土地探し力" },
  { value: "track_record", label: "実績・受賞歴" },
] as const;

// ─── フォーム型 ─────────────────────────────────
type FormData = {
  // A. 基本情報
  name: string;
  description: string;
  representative: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  logoUrl: string;
  // B1. エリア
  prefectures: string;
  cities: string;
  // B2. 価格帯
  priceRanges: string[];
  mainPriceRange: string;
  tsuboPrice: string;
  // B3. デザイン
  exteriorStyles: string[];
  interiorStyles: string[];
  bestStyle: string;
  // B4. 性能
  strengths: [string, string, string];
  specs: string[];
  uaValue: string;
  cValue: string;
  seismicGrade: string;
  zehCount: string;
  // B5. サービス
  services: string[];
  designFreedom: string;
  annualBuilds: string;
  foundedYear: string;
  // B6. 接客
  contactStyles: string[];
  salesFeatures: string[];
  // B7. 強み
  topStrengths: [string, string, string];
};

const initialForm: FormData = {
  name: "",
  description: "",
  representative: "",
  address: "",
  phone: "",
  email: "",
  website: "",
  logoUrl: "",
  prefectures: "",
  cities: "",
  priceRanges: [],
  mainPriceRange: "",
  tsuboPrice: "",
  exteriorStyles: [],
  interiorStyles: [],
  bestStyle: "",
  strengths: ["", "", ""],
  specs: [],
  uaValue: "",
  cValue: "",
  seismicGrade: "",
  zehCount: "",
  services: [],
  designFreedom: "",
  annualBuilds: "",
  foundedYear: "",
  contactStyles: [],
  salesFeatures: [],
  topStrengths: ["", "", ""],
};

// ─── メインコンポーネント ─────────────────────────
export default function AdminRegisterPage() {
  const [form, setForm] = useState<FormData>(initialForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  // テキスト入力更新
  const updateText = useCallback((field: keyof FormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }, []);

  // チェックボックストグル
  const toggleCheckbox = useCallback(
    (field: keyof FormData, value: string, max?: number) => {
      setForm((prev) => {
        const current = prev[field] as string[];
        if (current.includes(value)) {
          return { ...prev, [field]: current.filter((v) => v !== value) };
        }
        if (max && current.length >= max) return prev;
        return { ...prev, [field]: [...current, value] };
      });
    },
    []
  );

  // ドロップダウン配列更新（strengths / topStrengths）
  const updateDropdownAt = useCallback(
    (field: "strengths" | "topStrengths", index: number, value: string) => {
      setForm((prev) => {
        const arr = [...prev[field]] as [string, string, string];
        arr[index] = value;
        return { ...prev, [field]: arr };
      });
    },
    []
  );

  // バリデーション
  const validate = useCallback((): boolean => {
    const newErrors: Record<string, string> = {};
    if (!form.name.trim()) newErrors.name = "会社名を入力してください";
    if (!form.description.trim()) {
      newErrors.description = "会社紹介文を入力してください";
    } else if (form.description.length > 200) {
      newErrors.description = "200字以内で入力してください";
    }
    if (!form.email.trim()) {
      newErrors.email = "メールアドレスを入力してください";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "正しいメールアドレスを入力してください";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [form]);

  // 送信
  const handleSubmit = useCallback(async () => {
    if (!validate() || submitting) return;
    setSubmitting(true);
    setSubmitError("");

    try {
      const areas = form.cities
        .split(/[,、，\s]+/)
        .map((s) => s.trim())
        .filter(Boolean);

      const res = await fetch("/api/builders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          description: form.description,
          address: form.address,
          phone: form.phone,
          email: form.email,
          website: form.website,
          logoUrl: form.logoUrl,
          areas,
          priceRanges: form.priceRanges,
          mainPriceRange: form.mainPriceRange,
          exteriorStyles: form.exteriorStyles,
          interiorStyles: form.interiorStyles,
          bestStyle: form.bestStyle,
          strengths: form.strengths.filter(Boolean),
          specs: form.specs,
          uaValue: form.uaValue ? parseFloat(form.uaValue) : null,
          cValue: form.cValue ? parseFloat(form.cValue) : null,
          seismicGrade: form.seismicGrade ? parseInt(form.seismicGrade, 10) : null,
          zehCount: form.zehCount ? parseInt(form.zehCount, 10) : null,
          services: form.services,
          designFreedom: form.designFreedom,
          annualBuilds: form.annualBuilds ? parseInt(form.annualBuilds, 10) : null,
          foundedYear: form.foundedYear ? parseInt(form.foundedYear, 10) : null,
          // Supabase migration (後日実行):
          // ALTER TABLE builders ADD COLUMN founded_year integer;
          // ALTER TABLE builders ADD COLUMN annual_builds integer;
          contactStyles: form.contactStyles,
          salesFeatures: form.salesFeatures,
          topStrengths: form.topStrengths.filter(Boolean),
        }),
      });

      const result = await res.json();
      if (!res.ok) {
        setSubmitError(result.error ?? "登録に失敗しました。もう一度お試しください。");
        return;
      }
      setSubmitted(true);
    } catch {
      setSubmitError("通信エラーが発生しました。もう一度お試しください。");
    } finally {
      setSubmitting(false);
    }
  }, [validate, submitting, form]);

  // 完了画面
  if (submitted) {
    return (
      <div className="flex min-h-screen flex-col" style={{ background: "#F5F4F0" }}>
        <AdminHeader />
        <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-10">
          <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-light">
              <svg className="h-8 w-8 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="mt-4 text-xl font-bold">登録が完了しました</h2>
            <p className="mt-2 text-sm text-gray-500">
              工務店情報が正常に登録されました。<br />
              内容の確認・反映までしばらくお待ちください。
            </p>
            <button
              type="button"
              onClick={() => {
                setForm(initialForm);
                setSubmitted(false);
              }}
              className="mt-6 rounded-full bg-brand px-8 py-3 text-sm font-bold text-white transition-colors hover:bg-brand-dark"
            >
              続けて別の工務店を登録する
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col" style={{ background: "#F5F4F0" }}>
      <AdminHeader />

      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-6">
        {/* ── A. 基本情報 ── */}
        <Section title="A. 基本情報">
          <TextField label="会社名" required value={form.name} onChange={(v) => updateText("name", v)} error={errors.name} />
          <div>
            <FieldLabel label="会社紹介文" required />
            <textarea
              value={form.description}
              onChange={(e) => updateText("description", e.target.value)}
              placeholder="会社の特徴やこだわりを200字以内で入力してください"
              rows={4}
              className={`w-full rounded-xl border px-4 py-3 text-sm outline-none focus:ring-1 ${
                errors.description ? "border-red-300 focus:border-red-500 focus:ring-red-500" : "border-black/10 focus:border-brand focus:ring-brand"
              }`}
            />
            <div className="mt-1 flex justify-between">
              {errors.description && <p className="text-[10px] text-red-500">{errors.description}</p>}
              <p className={`ml-auto text-[10px] ${form.description.length > 200 ? "text-red-500" : "text-muted-foreground"}`}>
                {form.description.length}/200
              </p>
            </div>
          </div>
          <TextField label="代表者名" value={form.representative} onChange={(v) => updateText("representative", v)} />
          <TextField label="所在地" value={form.address} onChange={(v) => updateText("address", v)} placeholder="愛知県名古屋市..." />
          <TextField label="電話番号" value={form.phone} onChange={(v) => updateText("phone", v)} placeholder="052-XXX-XXXX" />
          <TextField label="メールアドレス" required value={form.email} onChange={(v) => updateText("email", v)} error={errors.email} placeholder="info@example.com" type="email" />
          <TextField label="WebサイトURL" value={form.website} onChange={(v) => updateText("website", v)} placeholder="https://..." />
          <TextField label="ロゴ画像URL" value={form.logoUrl} onChange={(v) => updateText("logoUrl", v)} placeholder="https://..." />
        </Section>

        {/* ── B1. 対応エリア ── */}
        <Section title="B1. 対応エリア">
          <TextField label="対応都道府県" value={form.prefectures} onChange={(v) => updateText("prefectures", v)} placeholder="愛知県, 岐阜県, 三重県" />
          <div>
            <FieldLabel label="対応市区町村" />
            <textarea
              value={form.cities}
              onChange={(e) => updateText("cities", e.target.value)}
              placeholder="名古屋市千種区, 名古屋市東区, 春日井市, 瀬戸市..."
              rows={3}
              className="w-full rounded-xl border border-black/10 px-4 py-3 text-sm outline-none focus:border-brand focus:ring-1 focus:ring-brand"
            />
            <p className="mt-1 text-[10px] text-muted-foreground">カンマ区切りで入力してください</p>
          </div>
        </Section>

        {/* ── B2. 価格帯 ── */}
        <Section title="B2. 価格帯">
          <CheckboxGroup
            label="対応可能な総額レンジ"
            options={PRICE_RANGES}
            selected={form.priceRanges}
            onToggle={(v) => toggleCheckbox("priceRanges", v)}
          />
          <RadioGroup
            label="最も実績の多い価格帯"
            options={PRICE_RANGES}
            selected={form.mainPriceRange}
            onChange={(v) => updateText("mainPriceRange", v)}
          />
          <TextField label="坪単価の目安" value={form.tsuboPrice} onChange={(v) => updateText("tsuboPrice", v)} placeholder="50〜70万円" />
        </Section>

        {/* ── B3. 得意デザイン ── */}
        <Section title="B3. 得意デザイン">
          <CheckboxGroup
            label="得意外観テイスト"
            hint="最大3つまで"
            options={EXTERIOR_STYLES}
            selected={form.exteriorStyles}
            onToggle={(v) => toggleCheckbox("exteriorStyles", v, 3)}
          />
          <CheckboxGroup
            label="得意内装テイスト"
            hint="最大3つまで"
            options={INTERIOR_STYLES}
            selected={form.interiorStyles}
            onToggle={(v) => toggleCheckbox("interiorStyles", v, 3)}
          />
          <RadioGroup
            label="最も得意なテイスト"
            options={ALL_STYLES}
            selected={form.bestStyle}
            onChange={(v) => updateText("bestStyle", v)}
          />
        </Section>

        {/* ── B4. 住宅性能 ── */}
        <Section title="B4. 住宅性能">
          <div>
            <FieldLabel label="強みとする性能 TOP3" />
            <div className="space-y-2">
              {[0, 1, 2].map((i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand text-[10px] font-bold text-white">
                    {i + 1}
                  </span>
                  <select
                    value={form.strengths[i]}
                    onChange={(e) => updateDropdownAt("strengths", i, e.target.value)}
                    className="flex-1 rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none focus:border-brand focus:ring-1 focus:ring-brand"
                  >
                    <option value="">選択してください</option>
                    {PERFORMANCE_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value} disabled={form.strengths.includes(opt.value) && form.strengths[i] !== opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          </div>
          <CheckboxGroup
            label="対応可能な仕様"
            options={SPEC_OPTIONS}
            selected={form.specs}
            onToggle={(v) => toggleCheckbox("specs", v)}
          />
          <div className="grid grid-cols-2 gap-3">
            <TextField label="UA値" value={form.uaValue} onChange={(v) => updateText("uaValue", v)} placeholder="0.46" type="number" />
            <TextField label="C値" value={form.cValue} onChange={(v) => updateText("cValue", v)} placeholder="0.5" type="number" />
            <TextField label="耐震等級" value={form.seismicGrade} onChange={(v) => updateText("seismicGrade", v)} placeholder="3" type="number" />
            <TextField label="ZEH実績棟数" value={form.zehCount} onChange={(v) => updateText("zehCount", v)} placeholder="15" type="number" />
          </div>
        </Section>

        {/* ── B5. 対応サービス ── */}
        <Section title="B5. 対応サービス">
          <CheckboxGroup
            label="対応サービス"
            options={SERVICE_OPTIONS}
            selected={form.services}
            onToggle={(v) => toggleCheckbox("services", v)}
          />
          <RadioGroup
            label="設計の自由度"
            options={DESIGN_FREEDOM_OPTIONS}
            selected={form.designFreedom}
            onChange={(v) => updateText("designFreedom", v)}
          />
          <TextField label="年間施工棟数" value={form.annualBuilds} onChange={(v) => updateText("annualBuilds", v)} placeholder="30" type="number" />
          <TextField label="創業年" value={form.foundedYear} onChange={(v) => updateText("foundedYear", v)} placeholder="2005" type="number" />
        </Section>

        {/* ── B6. 接客スタイル・営業 ── */}
        <Section title="B6. 接客スタイル・営業">
          <CheckboxGroup
            label="接客スタイル"
            hint="最大2つまで"
            options={CONTACT_STYLE_OPTIONS}
            selected={form.contactStyles}
            onToggle={(v) => toggleCheckbox("contactStyles", v, 2)}
          />
          <CheckboxGroup
            label="営業の特徴"
            options={SALES_FEATURE_OPTIONS}
            selected={form.salesFeatures}
            onToggle={(v) => toggleCheckbox("salesFeatures", v)}
          />
        </Section>

        {/* ── B7. 会社の強み ── */}
        <Section title="B7. 会社の強み">
          <div>
            <FieldLabel label="強み TOP3（順位付き）" />
            <div className="space-y-2">
              {[0, 1, 2].map((i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand text-[10px] font-bold text-white">
                    {i + 1}
                  </span>
                  <select
                    value={form.topStrengths[i]}
                    onChange={(e) => updateDropdownAt("topStrengths", i, e.target.value)}
                    className="flex-1 rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none focus:border-brand focus:ring-1 focus:ring-brand"
                  >
                    <option value="">選択してください</option>
                    {STRENGTH_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value} disabled={form.topStrengths.includes(opt.value) && form.topStrengths[i] !== opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          </div>
        </Section>

        {/* ── 送信 ── */}
        {submitError && (
          <p className="mt-4 rounded-xl bg-red-50 px-4 py-2.5 text-xs text-red-600">
            {submitError}
          </p>
        )}

        <div className="mt-6 mb-10">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting}
            className="flex h-14 w-full items-center justify-center rounded-full bg-brand text-base font-bold text-white shadow-lg transition-colors hover:bg-brand-dark disabled:opacity-70"
          >
            {submitting ? (
              <>
                <span className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                登録中...
              </>
            ) : (
              "登録する"
            )}
          </button>
          <p className="mt-2 text-center text-[10px] text-muted-foreground">
            入力内容は暗号化されて送信されます
          </p>
        </div>
      </main>
    </div>
  );
}

// ─── サブコンポーネント ──────────────────────────

function AdminHeader() {
  return (
    <header className="border-b bg-white px-4 py-3">
      <div className="mx-auto max-w-2xl">
        <p className="text-lg font-bold" style={{ color: "#2E5240" }}>
          イエマッチ 工務店登録
        </p>
        <p className="mt-0.5 text-[10px] text-muted-foreground">
          このページはSHO-SAN社内・加盟工務店専用です
        </p>
      </div>
    </header>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-4 rounded-2xl bg-white p-5 shadow-sm">
      <h3 className="mb-4 border-b border-black/5 pb-2 text-sm font-bold" style={{ color: "#2E5240" }}>
        {title}
      </h3>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

function FieldLabel({ label, required, hint }: { label: string; required?: boolean; hint?: string }) {
  return (
    <label className="mb-1.5 block text-xs font-medium">
      {label}
      {required && <span className="ml-1 text-red-500">*</span>}
      {hint && <span className="ml-2 text-muted-foreground">({hint})</span>}
    </label>
  );
}

function TextField({
  label,
  required,
  value,
  onChange,
  error,
  placeholder,
  type = "text",
}: {
  label: string;
  required?: boolean;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div>
      <FieldLabel label={label} required={required} />
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition-colors focus:ring-1 ${
          error ? "border-red-300 focus:border-red-500 focus:ring-red-500" : "border-black/10 focus:border-brand focus:ring-brand"
        }`}
      />
      {error && <p className="mt-1 text-[10px] text-red-500">{error}</p>}
    </div>
  );
}

function CheckboxGroup({
  label,
  hint,
  options,
  selected,
  onToggle,
}: {
  label: string;
  hint?: string;
  options: readonly { value: string; label: string; key?: string }[];
  selected: string[];
  onToggle: (value: string) => void;
}) {
  return (
    <div>
      <FieldLabel label={label} hint={hint} />
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const checked = selected.includes(opt.value);
          return (
            <button
              key={"key" in opt && opt.key ? opt.key : opt.value}
              type="button"
              onClick={() => onToggle(opt.value)}
              className={`rounded-full border px-3.5 py-2 text-xs transition-all ${
                checked
                  ? "border-brand bg-brand font-medium text-white"
                  : "border-black/10 bg-white text-gray-700 hover:border-brand/30 hover:bg-brand-light/30"
              }`}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function RadioGroup({
  label,
  options,
  selected,
  onChange,
}: {
  label: string;
  options: readonly { value: string; label: string; key?: string }[];
  selected: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <FieldLabel label={label} />
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const checked = selected === opt.value;
          return (
            <button
              key={"key" in opt && opt.key ? opt.key : opt.value}
              type="button"
              onClick={() => onChange(checked ? "" : opt.value)}
              className={`rounded-full border px-3.5 py-2 text-xs transition-all ${
                checked
                  ? "border-brand bg-brand-light font-medium text-brand-dark"
                  : "border-black/10 bg-white text-gray-700 hover:border-brand/30 hover:bg-brand-light/30"
              }`}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
