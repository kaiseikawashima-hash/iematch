# イエマッチAI 要件定義書

**バージョン**: 1.0  
**作成日**: 2026年3月  
**ステータス**: プロトタイプ開発用

---

## 目次

1. [プロジェクト概要](#1-プロジェクト概要)
2. [サービスの目的と設計方針](#2-サービスの目的と設計方針)
3. [ページ構成・画面仕様](#3-ページ構成画面仕様)
4. [機能要件](#4-機能要件)
5. [データモデル](#5-データモデル)
6. [ヒアリング項目（全19問）](#6-ヒアリング項目全19問)
7. [タイプ判定ロジック](#7-タイプ判定ロジック)
8. [マッチングスコアリング](#8-マッチングスコアリング)
9. [UIコンポーネント仕様](#9-uiコンポーネント仕様)
10. [技術構成](#10-技術構成)
11. [非機能要件](#11-非機能要件)
12. [プロトタイプ対象スコープ](#12-プロトタイプ対象スコープ)
13. [開発スケジュール](#13-開発スケジュール)

---

## 1. プロジェクト概要

### サービス概要

**イエマッチAI**は、注文住宅を検討するユーザーが19問のヒアリングに回答すると、AIが「家づくりタイプ」を診断し、マッチ度の高い工務店を最大3社おすすめするマッチングサービスである。

### ビジネスモデル

- **ユーザー側**: 完全無料（診断・資料請求）
- **収益源**: 工務店側からの掲載料・送客成果報酬
- **CVポイント**: 資料請求 / 来場予約

### プロトタイプのゴール

| # | ゴール | 完了条件 |
|---|--------|---------|
| 1 | ユーザーが19問に回答できる | 全問に回答でき、回答JSONが取得できる |
| 2 | 家づくりタイプ（6タイプ）が診断結果として表示される | Aさんテストケースが期待通りに動く |
| 3 | ダミー工務店5社とのマッチングスコアが算出される | 上位3社が正しく表示される |
| 4 | 資料請求ボタンが押せる | フォーム送信まで画面遷移できる（実際の送客は未実装） |

---

## 2. サービスの目的と設計方針

### 設計の3観点

すべての設計判断は、以下の3観点を同時に満たすことを基準とする。

| 観点 | ゴール |
|------|--------|
| **ユーザー** | 網羅的に好み・要望が引き出され、納得感のある診断を受け、信頼できるおすすめ会社に出会える |
| **工務店** | 営業第一次ヒアリング済みの質の高いリードを受け取り、ユーザーの期待値が醸成された状態で来場につなげる |
| **サービス** | ヒアリング完了 → 診断閲覧 → 資料請求 → 来場予約の各ステップのCVRを最大化する |

### ヒアリング設計方針

- 全19問 / 所要時間: 約5〜7分
- 回答形式は選択式を基本（離脱リスク最小化）
- 条件分岐はQ9のみ（実装コスト抑制）

#### 体験フロー設計

```
カテゴリ1（状況把握）     → 答えやすい導入で離脱防止
      ↓
カテゴリ2-3（予算・エリア） → マッチングの基本条件を確保
      ↓
カテゴリ4-5（暮らし・デザイン） → 感情的な没入を高める（楽しいゾーン）
      ↓
カテゴリ6（性能）         → 専門性を感じさせ信頼感を醸成
      ↓
カテゴリ7（会社選びの軸）  → 総仕上げ。「結果を見たい」心理のピーク
```

---

## 3. ページ構成・画面仕様

### ページ一覧

| ページ | URL | 概要 |
|--------|-----|------|
| P1. トップLP | `/` | サービス説明・診断開始CTA |
| P2. ヒアリング画面 | `/diagnosis` | 19問の質問回答フロー |
| P3. 診断結果画面 | `/result` | タイプ診断結果・おすすめ工務店3社 |
| P4. 工務店詳細画面 | `/builder/:id` | 工務店の詳細情報 |
| P5. 資料請求フォーム | `/request` | 資料請求フォーム |
| P6. 資料請求完了 | `/request/complete` | 資料請求完了画面 |

### ページ遷移

| From | To | トリガー | データ受け渡し |
|------|----|---------|---------------|
| P1 | P2 | 「無料で診断スタート」ボタン | なし |
| P2 | P3 | 19問完了 | 回答データ（JSON） |
| P3 | P4 | 「詳しく見る」ボタン | `builder_id` |
| P3 | P5 | 「資料請求」or「まとめて資料請求」ボタン | 選択した工務店ID配列 |
| P4 | P5 | 「資料請求する」ボタン | `builder_id` |
| P5 | P6 | フォーム送信 | フォームデータ |

### P1. トップLP

- ヒーローセクション：キャッチコピー + 無料診断CTAボタン
- 課題訴求セクション：ユーザーの悩みをカード形式で表示
- 使い方セクション：かんたん3ステップ
- 実績数値セクション：登録社数・診断時間・利用料0円・営業電話0件
- 選ばれる理由セクション：エリア特化・プロ監修・幅広い選択肢・安心
- FAQセクション
- フッターCTA
- スクロール追従CTA（スティッキーフッター）

### P2. ヒアリング画面

- ヘッダー：サービスロゴ + 所要時間表示
- プログレスバー：カテゴリ名 + 問番号 + バー（`Step X/7 　Y / 19`形式）
- 質問と選択肢（回答形式ごとにコンポーネントを切り替え）
- 「次へ進む」ボタン（複数選択の場合は選択数を表示）
- 「戻る」ボタン（Q1以外）

### P3. 診断結果画面

- ① あなたの家づくりタイプ：タイプ名 + キャッチコピー + 特徴説明（3〜4行）
- ② 5軸レーダーチャート：デザイン / 性能 / コスパ / 暮らし / 安心・信頼
- ③ 家づくりアドバイス：タイプ別の強み・注意点・次のステップ
- ④ おすすめの住宅会社（最大3社）：マッチ度(%) / おすすめ理由 / 施工事例写真 / [資料請求ボタン] [詳しく見るボタン]
- ⑤ まとめて資料請求ボタン

### P4. 工務店詳細画面

- 施工事例写真（ユーザーのデザイン選好に合う写真を優先表示）
- 会社基本情報（名前・所在地・年間施工棟数等）
- マッチ度 + おすすめ理由
- 性能数値カード（UA値・C値・耐震等級・ZEH施工数）
- 強みタグ
- お客様の声（レビュー）
- 資料請求ボタン

### P5. 資料請求フォーム

- 請求先工務店リスト表示（最大3社 + マッチ度）
- 入力フィールド：お名前（必須）/ メールアドレス（必須）/ 電話番号（必須）/ 住所（任意）/ メッセージ（任意）
- プライバシーポリシー同意文 + 送信ボタン
- SSL暗号化通信の表示

### P6. 資料請求完了画面

- 完了メッセージ + チェックアイコン
- 請求した会社のリスト表示
- 「次のステップ」アドバイス（タイプ別）
- 「診断結果を見る」ボタン / 「もう一度診断する」ボタン

---

## 4. 機能要件

### 4-1. ヒアリング機能

| 機能 | 要件 |
|------|------|
| 質問表示 | 全19問をカテゴリ順に1問ずつ表示する |
| 単一選択 | ラジオボタン型で1つのみ選択可能 |
| 複数選択 | チェックボックス型で最大N件まで選択可能 |
| 優先順位付き選択 | ドラッグまたは数字入力で順位を付けて選択 |
| 画像選択 | 画像 + テイスト名で2〜3つ選択可能 |
| 2段階選択 | 都道府県 → 市区町村の連動プルダウン（Q7） |
| 家族構成入力 | 大人・子どもの人数入力 + 将来計画の選択（Q10） |
| 条件分岐 | Q8の回答が「searching」or「not_started」の場合のみQ9を表示 |
| 進捗表示 | カテゴリ名・問番号・プログレスバーをリアルタイム更新 |
| 戻る機能 | 前の質問に戻れる（回答データを保持） |
| 回答データ保持 | 全回答をJSON形式で保持し、完了時にタイプ判定・マッチングに渡す |

### 4-2. タイプ判定機能

| 機能 | 要件 |
|------|------|
| タイプスコア加算 | 各質問の回答に応じて6タイプのスコアを加算する |
| メイン/サブ判定 | スコア上位2タイプをメイン・サブとして判定する |
| 全均等判定 | 最大差8点以内の場合はトータルバランス型と判定する |
| 表示ラベル生成 | 「{サブラベル}、{メインタイプ名}」形式で表示テキストを生成する |
| レーダーチャート値算出 | 5タイプのスコア比率から5軸の数値（0〜100）を算出する |

### 4-3. マッチングスコアリング機能

| 機能 | 要件 |
|------|------|
| 必須フィルタ | エリア・予算が不一致の工務店を除外する |
| 加重スコアリング | 100点満点でデザイン・価値観・性能・サービス・ボーナスの各スコアを算出する |
| 表示マッチ度変換 | 素点を表示マッチ度（60〜100%）に変換する |
| 上位3社選出 | 表示マッチ度70%以上の工務店から上位3社を表示する |
| おすすめ理由生成 | ユーザー回答と工務店特徴を紐付けてパーソナライズされた理由テキストを生成する |

### 4-4. 資料請求機能

| 機能 | 要件 |
|------|------|
| 対象工務店の確認 | 選択した工務店のリストと名前・マッチ度を表示する |
| フォーム入力 | 5項目（名前・メール・電話・住所・メッセージ）を入力できる |
| 送信処理 | フォームデータをバリデーションし、完了画面へ遷移する（プロトタイプでは実送客不要） |

---

## 5. データモデル

### 5-1. ユーザー回答データ（UserAnswers）

```typescript
type Answer = {
  questionId: string;       // "Q1" ~ "Q19"
  value: string | string[]; // 単一選択はstring、複数選択はstring[]
  rank?: number[];          // Q15, Q17の優先順位（1位=index[0]）
};

type UserAnswers = {
  answers: Answer[];
  completedAt: string; // ISO 8601
};
```

### 5-2. 工務店データ（Builder）

```typescript
type Builder = {
  id: string;
  // A. 基本情報
  name: string;
  description: string;     // 200字以内
  address: string;
  phone: string;
  email: string;
  website: string;
  logoUrl: string;
  // B. マッチング用タグ
  b1_areas: string[];              // 対応市区町村
  b2_priceRanges: string[];        // 対応総額レンジ
  b2_mainPriceRange: string;       // 最多実績帯
  b3_exteriorStyles: string[];     // 得意外観テイスト（最大3）
  b3_interiorStyles: string[];     // 得意内装テイスト（最大3）
  b3_bestStyle: string;            // 最得意テイスト
  b4_strengths: string[];          // 強み性能TOP3
  b4_specs: string[];              // 対応仕様
  b4_values: {                     // 性能数値（任意）
    ua?: number;
    c?: number;
    seismicGrade?: number;
    zehCount?: number;
  };
  b5_services: string[];           // 対応サービス
  b5_designFreedom: string;        // 設計自由度
  b5_annualBuilds: number;         // 年間施工棟数
  b6_styles: string[];             // 接客スタイル（最大2）
  b6_features: string[];           // 営業特徴
  b7_topStrengths: string[];       // 強み自己申告TOP3（順位付き）
  // C. 表示用
  photos: { url: string; tags: string[]; category: string }[];
  reviews: { text: string; author: string }[];
  awards: string[];
  campaign: string;
};
```

### 5-3. 診断結果データ（DiagnosisResult）

```typescript
type DiagnosisResult = {
  mainType: TypeName;
  subType: TypeName;
  typeScores: Record<TypeName, number>;
  displayLabel: string;  // 例: 「デザインにもこだわる、性能エキスパート型」
  radarValues: {
    design: number;      // 0-100
    performance: number;
    cost: number;
    lifestyle: number;
    trust: number;
  };
  recommendations: {
    builderId: string;
    rawScore: number;          // 0-100
    displayMatchRate: number;  // 60-100（変換後）
    reasonText: string;        // おすすめ理由
  }[];
};

type TypeName =
  | "designFirst"
  | "performanceExpert"
  | "costBalance"
  | "lifestyleDesign"
  | "trustPartner"
  | "totalBalance";
```

### 5-4. ダミー工務店データ（5社）

| ID | 社名 | 最多実績価格帯 | 最得意スタイル | 主な強み |
|----|------|--------------|--------------|---------|
| builder_001 | エコパフォーマンスホーム | 3500_4500 | simple_modern | insulation, airtight, energy |
| builder_002 | アーキデザイン工房 | 4500_5500 | simple_modern | insulation, seismic, natural_material |
| builder_003 | スマートバリューホーム | 2500_3500 | natural_nordic | insulation, energy, maintenance |
| builder_004 | くらし設計室 | 3500_4500 | natural_nordic | insulation, natural_material, energy |
| builder_005 | 信頼の家づくり工房 | 3500_4500 | japanese_modern | seismic, insulation, maintenance |

---

## 6. ヒアリング項目（全19問）

### 質問型定義

```typescript
type Question = {
  id: string;
  category: number;          // 1-7
  categoryLabel: string;
  text: string;
  subText?: string;
  type: "single" | "multi" | "ranked" | "image" | "cascade" | "family";
  maxSelect?: number;
  options: { value: string; label: string; imageUrl?: string }[];
  condition?: {
    dependsOn: string;
    showWhen: string[];
  };
};
```

### カテゴリ1: 現在の状況と検討度合い（Q1〜Q3）

> **用途**: Q1〜Q3はマッチングには不使用。工務店への送客情報（温度感・緊急度・競合状況）として利用。

| Q# | 質問 | 形式 | 選択肢 |
|----|------|------|--------|
| Q1 | 家づくりの検討段階を教えてください | single | info_gathering / researching / talking / land_searching / rebuild |
| Q2 | 新しい住まいへの入居希望時期は？ | single | within_6m / within_1y / 1_to_2y / over_2y |
| Q3 | 住宅会社は何社くらい検討していますか？ | single | none / 1_2 / 3_5 / over_6 |

### カテゴリ2: 予算・資金計画（Q4〜Q6）

> **用途**: Q4 → マッチング必須フィルタ（予算）、Q5・Q6 → 送客情報

| Q# | 質問 | 形式 | 選択肢 |
|----|------|------|--------|
| Q4 | 家づくりの総予算（土地＋建物）は？ | single | under_2500 / 2500_3500 / 3500_4500 / 4500_5500 / over_5500 / undecided |
| Q5 | 住宅ローンの現在の状況は？ | single | pre_approved / consulted / not_yet / no_loan |
| Q6 | 毎月の住居費の目安は？ | single | under_7 / 7_10 / 10_13 / 13_16 / over_16 / undecided |

### カテゴリ3: 土地・エリア（Q7〜Q9）

> **用途**: Q7 → マッチング必須フィルタ（エリア）、Q8・Q9 → マッチング加点＋送客情報

| Q# | 質問 | 形式 | 備考 |
|----|------|------|------|
| Q7 | 建築予定エリアはどちらですか？ | cascade（都道府県→市区町村） | — |
| Q8 | 土地の状況を教えてください | single（owned / contracted / searching / not_started） | — |
| Q9 | 土地探しのサポートも相談したいですか？ | single（yes_please / both / self_search） | Q8がsearching or not_startedの場合のみ表示 |

### カテゴリ4: 暮らし方・ライフスタイル（Q10〜Q12）

> **用途**: Q10 → 送客情報、Q11 → マッチング加点＋タイプ判定、Q12 → タイプ判定＋送客情報

| Q# | 質問 | 形式 | 選択肢 |
|----|------|------|--------|
| Q10 | 現在の家族構成を教えてください | family | 大人N人・子どもN人 + 将来計画（same / more_children / with_parents） |
| Q11 | 家での過ごし方で近いものを選択（3つまで） | multi(3) | cooking / family_living / remote_work / hobby_room / outdoor_living / pet / storage / housework |
| Q12 | 現住まいの不満・改善したいことは？（3つまで） | multi(3) | storage / layout / insulation / noise / aging / sunlight / rent / commute |

### カテゴリ5: デザイン・テイストの好み（Q13〜Q14）

> **用途**: マッチング（重み×3）＋タイプ判定

| Q# | 質問 | 形式 | 選択肢 |
|----|------|------|--------|
| Q13 | 好みの外観テイストを選択（2〜3つ） | image(2-3) | simple_modern / natural_nordic / japanese_modern / industrial / resort / hiraya / other |
| Q14 | 好みの内装の雰囲気を選択（2〜3つ） | image(2-3) | white_clean / natural_wood / monotone / cafe_vintage / japanese / colorful |

### カテゴリ6: 住宅性能・こだわりポイント（Q15〜Q16）

> **用途**: マッチング（重み×2）＋タイプ判定

| Q# | 質問 | 形式 | 選択肢 |
|----|------|------|--------|
| Q15 | 住宅性能で特に重視したいもの（上位3つ） | ranked(3) | insulation / seismic / airtight / energy / soundproof / natural_material / maintenance / none |
| Q16 | 気になる住宅の仕様・テーマは？（複数可） | multi | zeh / long_quality / solar / whole_house_ac / passive / smart_home / none |

### カテゴリ7: 会社選びで重視すること（Q17〜Q19）

> **用途**: Q17 → マッチング（重み×3）＋タイプ判定の最大ドライバー、Q18 → タイプ判定＋送客情報、Q19 → マッチング（重み×3）＋タイプ判定

| Q# | 質問 | 形式 | 選択肢 |
|----|------|------|--------|
| Q17 | 住宅会社を選ぶとき最も重視すること（上位3つ） | ranked(3) | design / cost / performance / personality / after_service / track_record / land_support / custom_design |
| Q18 | 家づくりで今、最も不安に感じていることは？ | single | money / company_choice / land / process / image / schedule |
| Q19 | 担当者に最も期待することは？ | single | listening / proposal / response / honest / expertise |

---

## 7. タイプ判定ロジック

### 6タイプ定義

| # | TypeName | タイプ名 | キャッチコピー |
|---|----------|---------|--------------|
| 1 | designFirst | デザインファースト型 | 暮らしを、美しく設計する人 |
| 2 | performanceExpert | 性能エキスパート型 | 数値で納得、快適を追求する人 |
| 3 | costBalance | コストバランス型 | 賢く選んで、満足度を最大化する人 |
| 4 | lifestyleDesign | 暮らしデザイン型 | 間取りと動線に、理想の毎日を描く人 |
| 5 | trustPartner | 安心パートナー型 | 信頼できるプロと、一緒につくりたい人 |
| 6 | totalBalance | トータルバランス型 | すべてを見渡して、最適解を見つける人 |

### 処理フロー

```
回答データ → タイプスコア加算 → 6タイプのスコア集計 → メイン/サブ判定
```

### タイプスコア加算テーブル

#### Q17（会社選びの軸）← 最大ドライバー

| 1位選択値 | 加算先 | 点数 |
|---------|--------|------|
| design | designFirst | +8 |
| cost | costBalance | +8 |
| performance | performanceExpert | +8 |
| personality | trustPartner | +8 |
| after_service | trustPartner | +8 |
| track_record | trustPartner | +8 |
| land_support | lifestyleDesign +4, trustPartner +4 | +4/+4 |
| custom_design | lifestyleDesign +6, designFirst +2 | +6/+2 |

> 2位: 上記と同じタイプに +4 / 3位: +2

#### Q13（外観テイスト）
- 明確に1〜2つ選択 → designFirst +5
- 3つ選択 → designFirst +3, totalBalance +2

#### Q14（内装テイスト）
- 明確に1〜2つ選択 → designFirst +4
- 3つ選択 → designFirst +2, totalBalance +2

#### Q15（重視性能）
- insulation/airtight/energyのうち2つ以上 → performanceExpert +6
- 上記のうち1つ → performanceExpert +3
- seismicを1位 → performanceExpert +4, trustPartner +2
- natural_material → lifestyleDesign +3
- maintenance → costBalance +2, trustPartner +2
- none → totalBalance +3

#### Q16（気になる仕様）
- zeh or passive → performanceExpert +4
- solar → performanceExpert +2, costBalance +2
- whole_house_ac → performanceExpert +2, lifestyleDesign +2
- smart_home → performanceExpert +2
- long_quality → trustPartner +2, costBalance +2
- none → totalBalance +2

#### Q11（暮らし方）

| 選択値 | 加算 |
|--------|------|
| cooking | lifestyleDesign +3 |
| family_living | lifestyleDesign +3 |
| remote_work | lifestyleDesign +3 |
| hobby_room | designFirst +2, lifestyleDesign +2 |
| outdoor_living | designFirst +3, lifestyleDesign +2 |
| pet | lifestyleDesign +3 |
| storage | lifestyleDesign +3 |
| housework | lifestyleDesign +4 |

#### Q12（現住まいの不満）

| 選択値 | 加算 |
|--------|------|
| storage | lifestyleDesign +2 |
| layout | lifestyleDesign +3 |
| insulation | performanceExpert +3 |
| noise | performanceExpert +2 |
| aging | trustPartner +2 |
| sunlight | lifestyleDesign +2, performanceExpert +1 |
| rent | costBalance +3 |

#### Q18（不安なこと）

| 選択値 | 加算 |
|--------|------|
| money | costBalance +3 |
| company_choice | trustPartner +3, totalBalance +2 |
| process | totalBalance +3, trustPartner +2 |
| image | designFirst +3 |
| schedule | trustPartner +2 |

#### Q19（担当者への期待）

| 選択値 | 加算 |
|--------|------|
| listening | trustPartner +3, lifestyleDesign +2 |
| proposal | designFirst +3, performanceExpert +2 |
| response | costBalance +2 |
| honest | trustPartner +4 |
| expertise | performanceExpert +4 |

### 判定ルール

```typescript
function determineType(scores: Record<TypeName, number>): { main: TypeName; sub: TypeName } {
  const sorted = Object.entries(scores).sort(([,a], [,b]) => b - a);
  const maxDiff = sorted[0][1] - sorted[sorted.length - 1][1];

  // 全タイプ均等（最大差8点以内）→ トータルバランス
  if (maxDiff <= 8) {
    return { main: "totalBalance", sub: sorted[1][0] as TypeName };
  }
  return { main: sorted[0][0] as TypeName, sub: sorted[1][0] as TypeName };
}
```

### 表示ラベル組み合わせテーブル

| メイン＼サブ | designFirst | performanceExpert | costBalance | lifestyleDesign | trustPartner | totalBalance |
|------------|-------------|------------------|-------------|----------------|-------------|-------------|
| designFirst | — | 性能にも妥協しない | コスパ意識も高い | 暮らしやすさも追求する | 信頼も大切にする | 総合力も求める |
| performanceExpert | デザインにもこだわる | — | コスパ意識も高い | 暮らしやすさも追求する | 信頼も大切にする | 総合力も求める |
| costBalance | デザインにもこだわる | 性能にも妥協しない | — | 暮らしやすさも追求する | 信頼も大切にする | 総合力も求める |
| lifestyleDesign | デザインにもこだわる | 性能にも妥協しない | コスパ意識も高い | — | 信頼も大切にする | 総合力も求める |
| trustPartner | デザインにもこだわる | 性能にも妥協しない | コスパ意識も高い | 暮らしやすさも追求する | — | 総合力も求める |
| totalBalance | デザイン寄りの | 性能重視寄りの | コスパ重視寄りの | 暮らし重視寄りの | 安心重視寄りの | — |

> **表示形式**: 「{サブラベル}、{メインタイプ名}」  
> **例**: 「デザインにもこだわる、性能エキスパート型」

### レーダーチャート値算出

```typescript
function calcRadar(scores: Record<TypeName, number>) {
  const total = scores.designFirst + scores.performanceExpert
    + scores.costBalance + scores.lifestyleDesign + scores.trustPartner;
  // totalBalanceはレーダーには含めない
  return {
    design:      Math.round(scores.designFirst / total * 100),
    performance: Math.round(scores.performanceExpert / total * 100),
    cost:        Math.round(scores.costBalance / total * 100),
    lifestyle:   Math.round(scores.lifestyleDesign / total * 100),
    trust:       Math.round(scores.trustPartner / total * 100),
  };
}
```

---

## 8. マッチングスコアリング

### 処理フロー

```
第1段階: 必須フィルタ（エリア・予算）→ Failは除外
      ↓
第2段階: 加重スコアリング（100点満点）
      ↓
第3段階: 表示マッチ度に変換（60〜100%）
      ↓
第4段階: 上位3社を選出（70%未満は非表示）
```

### 第1段階: 必須フィルタ

```typescript
function filterBuilders(answers: UserAnswers, builders: Builder[]): Builder[] {
  return builders.filter(b => {
    const userArea = getAnswer(answers, "Q7");
    if (!b.b1_areas.includes(userArea)) return false;
    const userBudget = getAnswer(answers, "Q4");
    if (userBudget === "undecided") return true;
    if (!b.b2_priceRanges.includes(userBudget)) return false;
    return true;
  });
}
```

### 第2段階: 加重スコアリング配点

| 項目 | 配点 | 内訳 |
|------|------|------|
| デザイン適合 | 30点 | 外観18点 + 内装12点 |
| 価値観適合 | 30点 | 会社選びの軸18点 + 接客スタイル12点 |
| 性能適合 | 20点 | 重視性能14点 + 仕様テーマ6点 |
| サービス適合 | 10点 | 土地サポート6点 + ライフスタイル4点 |
| ボーナス加点 | 10点 | 価格帯4点 + デザイン3点 + 強み1位一致3点 |
| **合計** | **100点** | |

#### デザイン適合 - 外観（18点満点）

```typescript
function calcExteriorScore(userStyles: string[], builder: Builder): number {
  let score = 0;
  if (userStyles[0] === builder.b3_bestStyle) score += 10; // 第1選択=最得意
  else if (builder.b3_exteriorStyles.includes(userStyles[0])) score += 7;
  for (let i = 1; i < userStyles.length; i++) {
    if (builder.b3_exteriorStyles.includes(userStyles[i])) score += 4;
  }
  return Math.min(score, 18);
}
```

#### デザイン適合 - 内装（12点満点）
- 一致数 × 4（上限12点）

#### 価値観適合 - 会社選びの軸（18点満点）

| 条件 | 点数 |
|------|------|
| ユーザー1位 = 工務店1位（完全一致） | 10点 |
| ユーザー1位 ∈ 工務店TOP3（順位ずれ） | 7点 |
| ユーザー2位 ∈ 工務店TOP3 | 5点 |
| ユーザー3位 ∈ 工務店TOP3 | 3点 |

#### 価値観適合 - 接客スタイル（12点満点）

| Q19値 | 対応するB6値 |
|-------|------------|
| listening | nurturing |
| proposal | proactive |
| response | speedy |
| honest | honest |
| expertise | expert |

> 一致ごとに6点（上限12点）

#### 性能適合 - 重視性能（14点満点）
- 1位∈強み → 6点 / 2位∈強み → 4点 / 3位∈強み → 4点
- 「none」→ 全社一律7点

#### 性能適合 - 仕様テーマ（6点満点）
- 一致数 × 2（上限6点） / 「none」→ 3点

#### サービス適合 - 土地サポート（6点）
- Q8=searching/not_started + Q9=yes_please + 工務店対応可 → 6点
- Q8=searching/not_started + Q9=both + 工務店対応可 → 4点
- それ以外 → 0点

#### サービス適合 - ライフスタイル（4点）
- pet∈サービス → +2 / hobby_room∈サービス → +2（上限4点）

#### ボーナス加点（10点満点）
- ユーザー予算 = 工務店最多帯 → +4
- ユーザーQ13第1選択 = 工務店最得意 → +3
- ユーザーQ17の1位 = 工務店B7の1位 → +3

### 第3段階: マッチ度変換

```typescript
function toDisplayRate(rawScore: number, hasLandQuestion: boolean): number {
  const maxScore = hasLandQuestion ? 100 : 94;
  const rawRate = rawScore / maxScore * 100;
  const displayRate = 60 + (rawRate * 0.4);
  return Math.round(displayRate);
}
```

| 素点 | 表示マッチ度 |
|------|------------|
| 100% | 100% |
| 80% | 92% |
| 60% | 84% |
| 40% | 76% |

### 第4段階: 上位3社選出

- 表示マッチ度70%未満の工務店は非表示
- 最大3社を表示（3社未満の場合は該当数のみ）

### エッジケース処理

| ケース | 処理 |
|--------|------|
| 「まだ決めていない」「こだわりなし」多数 | 該当項目に中間値付与、バランス型判定 |
| フィルタ後3社未満 | 該当数のみ表示。0社なら条件緩和で再検索提案 |
| 同スコア | ボーナスで差をつける → それでも同点なら最多実績価格帯が近い方優先 |
| 工務店のタグ登録不足 | 未登録は0点 |

### おすすめ理由テキスト生成

ユーザーの回答と工務店の特徴を紐付けてAI生成によりパーソナライズされたテキストを出力する。

**テンプレート**:
```
「あなたが重視する[ユーザーの重視ポイント]に強みを持つ会社です。
[工務店の具体的な特徴]が、あなたの[具体的な要望]にマッチしています。」
```

---

## 9. UIコンポーネント仕様

### デザイントークン

```css
/* ブランドカラー */
--brand-primary: #1D9E75;
--brand-light: #E1F5EE;
--brand-dark: #085041;

/* サブカラー（タグ色分け） */
--tag-performance: #E1F5EE;  /* 性能系（text: #085041） */
--tag-design: #EEEDFE;       /* デザイン系（text: #3C3489） */
--tag-lifestyle: #FAEEDA;    /* 暮らし系（text: #633806） */

/* ボタン */
--btn-radius: 50px;
--btn-height: 48px;
--btn-font: 15px / 500;

/* カード */
--card-radius: 12px;
--card-border: 0.5px solid rgba(0,0,0,0.1);

/* 書体 */
--font-primary: "Noto Sans JP", "Hiragino Sans", sans-serif;
--text-body: 13px;
--text-heading-lg: 22px;
--text-heading-md: 18px;
--text-heading-sm: 15px;
```

### 主要コンポーネント一覧

| コンポーネント | 使用ページ | 備考 |
|--------------|----------|------|
| ProgressBar | P2 | カテゴリ名＋問番号＋バー |
| SingleSelectCard | P2 | ラジオボタン型の選択カード |
| MultiSelectCard | P2 | チェックボックス型 |
| ImageSelectCard | P2 | 画像＋テイスト名＋チェックバッジ |
| RankedSelectCard | P2 | ドラッグ or 数字で順位付け |
| RadarChart | P3 | 5軸レーダー（Recharts） |
| TypeBadge | P3 | メインタイプ名＋サブタイプピル |
| BuilderCard | P3 | 施工写真＋マッチ度＋理由＋タグ＋CTA |
| SpecMetricCard | P4 | 性能数値の大きな数字表示 |
| ReviewCard | P4 | 星＋レビュー文＋ユーザー情報 |
| RequestForm | P5 | 5フィールド＋送信ボタン |

---

## 10. 技術構成

| 領域 | 技術 | 備考 |
|------|------|------|
| フロントエンド | Next.js + Tailwind CSS | — |
| チャート | Recharts | レーダーチャート |
| バックエンド | Next.js API Routes | — |
| DB（プロトタイプ） | JSONファイル | 工務店データをJSONで管理 |
| ホスティング | Vercel | — |

---

## 11. 非機能要件

| 項目 | 要件 |
|------|------|
| レスポンシブ対応 | スマートフォン（375px〜）を優先。タブレット・PCも表示崩れなく動作すること |
| パフォーマンス | ヒアリング画面の質問遷移は100ms以内に応答すること |
| セキュリティ | フォーム送信時はSSL暗号化通信を使用すること |
| プライバシー | 個人情報はマッチング先工務店への紹介目的のみに使用すること。第三者への無断提供は禁止 |
| ブラウザ対応 | 最新版のChrome / Safari / Firefox / Edge で動作すること |

---

## 12. プロトタイプ対象スコープ

### IN（プロトタイプで実装する）

- P1〜P6の全画面表示
- 全19問のヒアリングUI
- タイプ判定ロジック（6タイプ）
- マッチングスコアリング（ダミー工務店5社）
- 診断結果画面（レーダーチャート含む）
- 資料請求フォーム（画面遷移のみ）

### OUT（プロトタイプでは未実装）

- 実際の資料請求・工務店への送客
- ユーザー認証・ログイン機能
- 管理画面（工務店登録・編集）
- 来場予約機能
- おすすめ理由のAI生成（プロトタイプではテンプレート固定文でもよい）

---

## 13. 開発スケジュール

| 週 | タスク | 確認ポイント |
|----|--------|------------|
| Week 1 | プロジェクトセットアップ＋ヒアリングUI（全19問） | 全問に回答でき、回答JSONが取得できる |
| Week 2 | タイプ判定＋マッチングスコアリング＋ダミーデータ | Aさんテストケースが期待通りに動く |
| Week 3 | 診断結果画面＋工務店詳細＋資料請求フォーム | 全フロー通しで動作 |
| Week 4 | UI磨き込み＋レスポンシブ＋テスト＋社内レビュー | プロトタイプ完成 |

---

## Appendix A: テストケース

### Aさん（性能エキスパート型 × デザインファースト型）

**回答**:
```
Q4=3500_4500, Q7=横浜市青葉区, Q8=searching, Q9=yes_please
Q11=[housework, family_living, pet], Q12=[layout, insulation, storage]
Q13=[simple_modern, natural_nordic], Q14=[natural_wood, white_clean]
Q15=[insulation, seismic, airtight], Q16=[zeh, long_quality]
Q17=[design, performance, cost], Q18=company_choice, Q19=listening
```

**期待結果**:
- メインタイプ: performanceExpert（21点）
- サブタイプ: designFirst（17点）= lifestyleDesign（17点）→ designFirstを採用
- 表示: 「デザインにもこだわる、性能エキスパート型」
- 1位: エコパフォーマンスホーム（素点75 → 表示90%）
- 2位: アーキデザイン工房
- 3位: くらし設計室

---

## Appendix B: 関連ドキュメント一覧

| # | ドキュメント | 内容 |
|---|------------|------|
| 1 | 統合仕様書 | サービス全体像・3観点・全設計の統合版 |
| 2 | ヒアリング項目詳細設計 | 19問の質問文・選択肢・3観点での役割 |
| 3 | 診断タイプ詳細設計 | 6タイプの定義・判定ロジック・配点・組み合わせ表 |
| 4 | 工務店タグ設計 | 38項目の登録定義・ユーザー質問との対応マップ |
| 5 | スコアリング詳細設計 | 100点満点の計算式・具体例・エッジケース |
| 6 | ページ構成＋ワイヤーフレーム設計書 | 6ページの構成・遷移・デザイン仕様 |
| 7 | 高精度ワイヤーフレーム（ビジュアル） | P1〜P6のスマホ版デザインカンプ |
| 8 | プロトタイプ実装ロードマップ | 4週間のスケジュール・技術構成・スコープ |
