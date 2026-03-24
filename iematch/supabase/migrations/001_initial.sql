-- ============================================================
-- イエマッチ 初期テーブル定義
-- 作成日: 2026-03-22
-- ============================================================

-- ────────────────────────────────────────────
-- 1. 工務店データ（builders）
-- ────────────────────────────────────────────
CREATE TABLE builders (
  -- 基本情報
  id              TEXT PRIMARY KEY,
  name            TEXT NOT NULL,
  description     TEXT,
  address         TEXT,
  phone           TEXT,
  email           TEXT,
  website         TEXT,
  logo_url        TEXT,

  -- B1. 対応エリア（市区町村単位の配列）
  areas           TEXT[],

  -- B2. 価格帯
  price_ranges    TEXT[],   -- 対応している総額レンジの配列
  main_price_range TEXT,    -- 最も施工実績が多い価格帯

  -- B3. 得意デザイン
  exterior_styles TEXT[],   -- 得意な外観テイスト
  interior_styles TEXT[],   -- 得意な内装テイスト
  best_style      TEXT,     -- 最も得意なテイスト（1つ）

  -- B4. 住宅性能
  strengths       TEXT[],   -- 強みとする性能 TOP3
  specs           TEXT[],   -- 対応可能な仕様（ZEH、長期優良住宅 等）
  ua_value        NUMERIC,  -- UA値（断熱性能指標、任意）
  c_value         NUMERIC,  -- C値（気密性能指標、任意）
  seismic_grade   INTEGER,  -- 耐震等級（1〜3、任意）
  zeh_count       INTEGER,  -- ZEH実績棟数（任意）

  -- B5. 対応サービス
  services        TEXT[],   -- 対応サービス（土地探し、ペット対応 等）
  design_freedom  TEXT,     -- 設計の自由度（full_custom / semi_custom 等）
  annual_builds   INTEGER,  -- 年間施工棟数

  -- B6. 接客スタイル・営業
  contact_styles  TEXT[],   -- 接客スタイル（最大2つ: nurturing, proactive 等）
  sales_features  TEXT[],   -- 営業の特徴

  -- B7. 会社の強み
  top_strengths   TEXT[],   -- 強み自己申告 TOP3（順位付き配列）

  -- メタ情報
  created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

COMMENT ON TABLE builders IS '工務店マスタ。診断マッチングの対象となる住宅会社データ';

-- ────────────────────────────────────────────
-- 2. 施工事例写真（builder_photos）
-- ────────────────────────────────────────────
CREATE TABLE builder_photos (
  id          SERIAL PRIMARY KEY,
  builder_id  TEXT NOT NULL REFERENCES builders(id) ON DELETE CASCADE,
  url         TEXT NOT NULL,
  tags        TEXT[],      -- タグ（exterior, interior, living 等）
  category    TEXT,        -- カテゴリ（exterior / interior / other）
  created_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

COMMENT ON TABLE builder_photos IS '工務店の施工事例写真。builders と 1:N の関係';

-- builder_id で検索するためのインデックス
CREATE INDEX idx_builder_photos_builder_id ON builder_photos(builder_id);

-- ────────────────────────────────────────────
-- 3. お客様の声（builder_reviews）
-- ────────────────────────────────────────────
CREATE TABLE builder_reviews (
  id          SERIAL PRIMARY KEY,
  builder_id  TEXT NOT NULL REFERENCES builders(id) ON DELETE CASCADE,
  text        TEXT NOT NULL,
  author      TEXT,        -- 投稿者名（匿名可）
  created_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

COMMENT ON TABLE builder_reviews IS 'お客様の声・口コミ。builders と 1:N の関係';

CREATE INDEX idx_builder_reviews_builder_id ON builder_reviews(builder_id);

-- ────────────────────────────────────────────
-- 4. 資料請求データ（leads）
-- ────────────────────────────────────────────
CREATE TABLE leads (
  id              SERIAL PRIMARY KEY,
  name            TEXT NOT NULL,
  email           TEXT NOT NULL,
  phone           TEXT NOT NULL,
  address         TEXT,
  message         TEXT,
  builder_ids     TEXT[],   -- 資料請求先の工務店ID配列
  diagnosis_type  TEXT,     -- 診断結果タイプ（designFirst 等）
  answers         JSONB,   -- ユーザーの全回答データ（診断再現用）
  created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

COMMENT ON TABLE leads IS '資料請求フォームの送信データ。ユーザー情報と診断結果を保存';

-- メールアドレスで重複確認しやすいようにインデックス
CREATE INDEX idx_leads_email ON leads(email);
-- 日付で検索しやすいようにインデックス
CREATE INDEX idx_leads_created_at ON leads(created_at);

-- ────────────────────────────────────────────
-- 5. updated_at 自動更新トリガー
-- ────────────────────────────────────────────
-- updated_at カラムを持つテーブルで UPDATE 時に自動的に現在時刻をセットする
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- builders テーブルに適用
CREATE TRIGGER trg_builders_updated_at
  BEFORE UPDATE ON builders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- ────────────────────────────────────────────
-- 6. RLS（Row Level Security）
-- ────────────────────────────────────────────
-- 本番前に先輩と相談して適切なポリシーを設定する
-- 現段階では無効のまま（Supabase のデフォルト: 無効）
-- ALTER TABLE builders ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE builder_photos ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE builder_reviews ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
