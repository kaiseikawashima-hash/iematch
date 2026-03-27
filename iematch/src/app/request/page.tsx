"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { RequestFormData } from "@/types";
import { useBuilders } from "@/hooks/useBuilders";
import { Header } from "@/components/layout/Header";

export default function RequestPage() {
  const router = useRouter();
  const { builders } = useBuilders();
  const [builderIds, setBuilderIds] = useState<string[]>([]);
  const [form, setForm] = useState<RequestFormData>({
    name: "",
    email: "",
    phone: "",
    address: "",
    message: "",
    builderIds: [],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [privacyAgreed, setPrivacyAgreed] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem("iematch_request_builders");
    if (!stored) {
      router.push("/result");
      return;
    }
    const ids: string[] = JSON.parse(stored);
    setBuilderIds(ids);
    setForm((prev) => ({ ...prev, builderIds: ids }));
  }, [router]);

  const selectedBuilders = builders.filter((b) => builderIds.includes(b.id));

  const updateField = useCallback(
    (field: keyof RequestFormData, value: string) => {
      setForm((prev) => ({ ...prev, [field]: value }));
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    },
    []
  );

  const validate = useCallback((): boolean => {
    const newErrors: Record<string, string> = {};

    if (!form.name.trim()) newErrors.name = "お名前を入力してください";
    if (!form.email.trim()) {
      newErrors.email = "メールアドレスを入力してください";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "正しいメールアドレスを入力してください";
    }
    if (!form.phone.trim()) {
      newErrors.phone = "電話番号を入力してください";
    } else if (!/^[\d\-+()]{10,}$/.test(form.phone.replace(/\s/g, ""))) {
      newErrors.phone = "正しい電話番号を入力してください";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [form]);

  const handleSubmit = useCallback(async () => {
    if (!validate() || submitting) return;

    setSubmitting(true);
    setSubmitError("");

    try {
      // sessionStorageから診断データを取得
      const storedAnswers = sessionStorage.getItem("iematch_answers");
      const parsedAnswers = storedAnswers ? JSON.parse(storedAnswers) : {};
      const storedCorrections = sessionStorage.getItem("iematch_corrections");
      const parsedCorrections = storedCorrections ? JSON.parse(storedCorrections) : [];

      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          address: form.address,
          message: form.message,
          builderIds: form.builderIds,
          diagnosisType: parsedAnswers.diagnosisType ?? null,
          answers: parsedAnswers.answers ?? null,
          corrections: parsedCorrections,
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        setSubmitError(result.error ?? "送信に失敗しました。もう一度お試しください。");
        return;
      }

      sessionStorage.setItem("iematch_request_form", JSON.stringify(form));
      router.push("/request/complete");
    } catch {
      setSubmitError("通信エラーが発生しました。もう一度お試しください。");
    } finally {
      setSubmitting(false);
    }
  }, [validate, submitting, form, router]);

  return (
    <div className="flex min-h-screen flex-col" style={{ background: "#F5F4F0" }}>
      <Header />

      <main className="mx-auto w-full max-w-lg flex-1 px-4 py-6">
        <h2 className="text-center text-lg font-bold">資料請求フォーム</h2>

        {/* 請求先工務店リスト */}
        <div className="mt-4 rounded-2xl bg-white p-4 shadow-sm">
          <p className="text-xs font-medium text-muted-foreground">
            資料請求先（{selectedBuilders.length}社）
          </p>
          <div className="mt-2 space-y-2">
            {selectedBuilders.map((b) => (
              <div
                key={b.id}
                className="flex items-center gap-3 rounded-xl bg-brand-light/30 px-3 py-2"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand text-xs font-bold text-white">
                  {b.name.charAt(0)}
                </div>
                <span className="text-sm font-medium">{b.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* フォーム */}
        <div className="mt-4 rounded-2xl bg-white p-5 shadow-sm">
          <div className="space-y-4">
            <FormField
              label="お名前"
              required
              value={form.name}
              onChange={(v) => updateField("name", v)}
              error={errors.name}
              placeholder="山田 太郎"
            />
            <FormField
              label="メールアドレス"
              required
              type="email"
              value={form.email}
              onChange={(v) => updateField("email", v)}
              error={errors.email}
              placeholder="example@mail.com"
            />
            <FormField
              label="電話番号"
              required
              type="tel"
              value={form.phone}
              onChange={(v) => updateField("phone", v)}
              error={errors.phone}
              placeholder="090-1234-5678"
            />
            <FormField
              label="住所"
              value={form.address ?? ""}
              onChange={(v) => updateField("address", v)}
              placeholder="神奈川県横浜市..."
            />
            <div>
              <label className="mb-1.5 block text-xs font-medium">
                メッセージ <span className="text-muted-foreground">（任意）</span>
              </label>
              <textarea
                value={form.message ?? ""}
                onChange={(e) => updateField("message", e.target.value)}
                placeholder="ご質問やご要望があればお書きください"
                rows={3}
                className="w-full rounded-xl border border-black/10 px-4 py-3 text-sm outline-none focus:border-brand focus:ring-1 focus:ring-brand"
              />
            </div>
          </div>

          {/* プライバシーポリシー同意 */}
          <label className="mt-4 flex cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              checked={privacyAgreed}
              onChange={(e) => setPrivacyAgreed(e.target.checked)}
              className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer rounded border-gray-300 accent-[#2E5240]"
            />
            <span className="text-xs leading-relaxed text-gray-700">
              <a
                href="/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium underline underline-offset-2"
                style={{ color: "#2E5240" }}
              >
                プライバシーポリシー
              </a>
              に同意する（必須）
            </span>
          </label>
          <p className="mt-1.5 pl-7 text-[10px] leading-relaxed text-muted-foreground">
            ご入力いただいた情報は、資料請求先の住宅会社への紹介目的のみに使用いたします。
          </p>

          {submitError && (
            <p className="mt-4 rounded-xl bg-red-50 px-4 py-2.5 text-xs text-red-600">
              {submitError}
            </p>
          )}

          <div className="mt-5 flex gap-3">
            <button
              type="button"
              onClick={() => router.push("/result")}
              disabled={submitting}
              className="flex h-14 flex-1 items-center justify-center rounded-full border border-black/10 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 disabled:opacity-50"
            >
              戻る
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting || !privacyAgreed}
              className={`flex h-14 flex-[2] items-center justify-center rounded-full text-base font-bold text-white shadow-lg transition-colors ${
                privacyAgreed
                  ? "bg-brand hover:bg-brand-dark"
                  : "cursor-not-allowed bg-gray-300"
              } disabled:opacity-70`}
            >
              {submitting ? (
                <>
                  <span className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  送信中...
                </>
              ) : (
                "送信する"
              )}
            </button>
          </div>

          <p className="mt-2 text-center text-[10px] text-muted-foreground">
            SSL暗号化通信で安全に送信されます
          </p>
        </div>
      </main>
    </div>
  );
}

function FormField({
  label,
  required,
  type = "text",
  value,
  onChange,
  error,
  placeholder,
}: {
  label: string;
  required?: boolean;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium">
        {label}{" "}
        {required ? (
          <span className="text-red-500">*</span>
        ) : (
          <span className="text-muted-foreground">（任意）</span>
        )}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition-colors focus:ring-1 ${
          error
            ? "border-red-300 focus:border-red-500 focus:ring-red-500"
            : "border-black/10 focus:border-brand focus:ring-brand"
        }`}
      />
      {error && <p className="mt-1 text-[10px] text-red-500">{error}</p>}
    </div>
  );
}
