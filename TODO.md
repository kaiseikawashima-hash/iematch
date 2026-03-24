# イエマッチAI 開発TODOリスト

**作成日**: 2026-03-18
**最終更新**: 2026-03-24

---

## Phase 1: プロジェクトセットアップ

- [x] 1-1. Next.js プロジェクト初期化（TypeScript + Tailwind CSS）
- [x] 1-2. ディレクトリ構成の整備（components, lib, data, types, app）
- [x] 1-3. デザイントークン設定（カラー・フォント・ボーダー等をTailwind configに反映）
- [x] 1-4. 共通レイアウト作成（ヘッダー・フッター）
- [x] 1-5. TypeScript型定義（Question, Answer, Builder, DiagnosisResult, TypeName）

## Phase 2: データ準備

- [x] 2-1. 全19問の質問データJSON作成（id, category, type, options, condition等）
- [x] 2-2. ダミー工務店30社のJSONデータ作成（愛知県対応・6タイプ×5社・全タグ・写真URL・レビュー含む）
- [x] 2-3. 6タイプ定義データ作成（タイプ名・キャッチコピー・特徴説明・アドバイス）
- [x] 2-4. 表示ラベル組み合わせテーブルのデータ作成

## Phase 3: ヒアリング機能（P2）

- [x] 3-1. ヒアリング画面の基本レイアウト（ProgressBar + 質問エリア + ボタン）
- [x] 3-2. ProgressBarコンポーネント（カテゴリ名 + Step X/7 + Y/19 + バー）
- [x] 3-3. SingleSelectCardコンポーネント（Q1〜Q6, Q8, Q9, Q18, Q19）
- [x] 3-4. MultiSelectCardコンポーネント（Q11, Q12, Q16）
- [x] 3-5. ImageSelectCardコンポーネント（Q13, Q14）
- [x] 3-6. RankedSelectCardコンポーネント（Q15, Q17）
- [x] 3-7. CascadeSelect（都道府県→市区町村）コンポーネント（Q7）
- [x] 3-8. FamilyInputコンポーネント（Q10）
- [x] 3-9. 条件分岐ロジック実装（Q8→Q9の表示制御）
- [x] 3-10. 戻る/次へのナビゲーション + 回答データ保持（useState / useReducer）
- [x] 3-11. 全問回答完了時のJSON生成 + 結果画面への遷移

## Phase 4: タイプ判定ロジック

- [x] 4-1. タイプスコア加算関数の実装（Q11, Q12, Q13〜Q19の全ルール）
- [x] 4-2. メイン/サブタイプ判定関数（均等判定含む）
- [x] 4-3. 表示ラベル生成関数
- [x] 4-4. レーダーチャート値算出関数
- [x] 4-5. Aさんテストケースでの検証
- [x] 4-6. 診断ロジック修正（Q15 seismic判定をincludes化、同スコア時タイプ優先順序の安定化）
- [x] 4-7. 追加テストケース実装（B:トータルバランス型、C:デザインファースト型、D:エリア不一致0社）

## Phase 5: マッチングスコアリング

- [x] 5-1. 必須フィルタ関数（エリア・予算）
- [x] 5-2. デザイン適合スコア計算（外観18点 + 内装12点）
- [x] 5-3. 価値観適合スコア計算（会社選びの軸18点 + 接客スタイル12点）
- [x] 5-4. 性能適合スコア計算（重視性能14点 + 仕様テーマ6点）
- [x] 5-5. サービス適合スコア計算（土地サポート6点 + ライフスタイル4点）
- [x] 5-6. ボーナス加点計算（価格帯4点 + デザイン3点 + 強み一致3点）
- [x] 5-7. 表示マッチ度変換関数（60〜100%）
- [x] 5-8. 上位3社選出 + エッジケース処理
- [x] 5-9. おすすめ理由テキスト生成（テンプレート版）
- [x] 5-10. Aさんテストケースでの検証（愛知県30社対応版: 1位 尾張モダン設計室 84%）

## Phase 6: トップLP（P1）

- [x] 6-1. ヒーローセクション（キャッチコピー + CTA）
- [x] 6-2. 課題訴求セクション（悩みカード）
- [x] 6-3. 使い方セクション（3ステップ）
- [x] 6-4. 実績数値セクション
- [x] 6-5. 選ばれる理由セクション
- [x] 6-6. FAQセクション
- [x] 6-7. フッターCTA + スクロール追従CTA（スティッキーフッター）

## Phase 7: 診断結果画面（P3）

- [x] 7-1. タイプ診断結果表示（TypeBadge + キャッチコピー + 特徴説明）
- [x] 7-2. RadarChart（Recharts 5軸レーダー）
- [x] 7-3. 家づくりアドバイスセクション
- [x] 7-4. BuilderCard（マッチ度 + おすすめ理由 + 施工写真 + CTAボタン）
- [x] 7-5. まとめて資料請求ボタン

## Phase 8: 工務店詳細画面（P4）

- [x] 8-1. 施工事例写真ギャラリー
- [x] 8-2. 会社基本情報セクション
- [x] 8-3. マッチ度 + おすすめ理由表示
- [x] 8-4. SpecMetricCard（UA値・C値・耐震等級・ZEH施工数）
- [x] 8-5. 強みタグ + ReviewCard
- [x] 8-6. 資料請求ボタン

## Phase 9: 資料請求フォーム（P5）+ 完了画面（P6）

- [x] 9-1. 請求先工務店リスト表示
- [x] 9-2. RequestFormコンポーネント（5フィールド + バリデーション）
- [x] 9-3. 送信処理 + 完了画面遷移
- [x] 9-4. 完了画面（完了メッセージ + 請求先リスト + 次のステップ + ボタン）

## Phase 10: デザインリニューアル（B案: オフホワイト×ダークグリーン）

- [x] 10-1. globals.css カラー変数をB案パレットに更新
  - メイン: #2E5240 / ライト: #EAF0EC / ダーク: #1E3A2C
  - 背景: #F5F4F0 / テキスト: #1A1A1A / サブ: #666666 / ボーダー: #DEDBD4
- [x] 10-2. 全ページの絵文字を削除（😟📍🏠🏆🔒）
- [x] 10-3. トップLP（page.tsx）デザイン更新
  - ヒーロー背景をオフホワイトに変更
  - CTAボタンを #2E5240 に変更
  - お悩みカードの絵文字を削除し、左端に緑の縦線（border-left: 3px solid #2E5240）に置換
  - セクション背景を #EAF0EC / #F5F4F0 に統一
  - カードに border: #DEDBD4 を追加
- [x] 10-4. Header / Footer のアクセントカラーを #2E5240 に統一、ボーダーを #DEDBD4 に
- [x] 10-5. RadarChart のハードコード色 #1D9E75 → #2E5240 に変更
- [x] 10-6. 各ページの背景色を bg-white / bg-gray-50 → #F5F4F0（オフホワイト）に統一
  - diagnosis/page.tsx, result/page.tsx, builder/[id]/page.tsx, request/page.tsx, request/complete/page.tsx

### 未変更（意図的にスキップ）
- diagnosis/ 配下のコンポーネント: 絵文字なし、アクティブ状態のボーダーは既に `border-brand` で CSS変数経由で #2E5240 に反映済み
- result/ 配下のコンポーネント: 絵文字なし、バッジ・タグカラーは既に `bg-brand` / `text-brand` で CSS変数経由で反映済み
- data/, lib/, types/ フォルダ: ロジック・データは一切未変更

## Phase 10.5: 愛知県対応 + データ拡充 + ロジック検証

- [x] 10.5-1. エリア選択を愛知県対応に変更（src/data/areas.ts）
  - areaData / activeAreas / areas の3段構造で将来の全国展開に対応
  - 愛知県の全市区町村（名古屋市16区 + 38市 + 14町村）
- [x] 10.5-2. CascadeSelect を単一県モード対応（activeAreas=1県時は都道府県セレクトをスキップ）
- [x] 10.5-3. ImageSelectCard を next/image 対応（画像ファイルがない場合はグレーplaceholderにフォールバック）
- [x] 10.5-4. ダミー工務店を神奈川5社 → 愛知県30社に完全置き換え
  - 6タイプ×5社: デザイン系・性能系・コスパ系・暮らし系・信頼系・バランス系
  - 価格帯分布: 2500_3500(6社), 3500_4500(12社), 4500_5500(8社), over_5500(4社)
- [x] 10.5-5. 診断ロジック修正
  - Q15 seismic判定: ranked[0]限定 → includes判定に変更（Appendix A期待値に合致）
  - 同スコア時タイプ優先順序: typePriority配列による安定ソート追加
- [x] 10.5-6. テストケース4件作成・全件PASS（src/lib/test-diagnosis.ts）
  - A: 性能エキスパート型（Appendix A準拠）
  - B: トータルバランス型（maxDiff≤8エッジケース）
  - C: デザインファースト型
  - D: エリア不一致0社（エラーなし確認）
- [x] 10.5-7. Q14に「その他・こだわりなし」選択肢を追加（Q13と同形式）

## Phase 10.6: 質問・エリア・フォーム改善

- [x] 10.6-1. エリア選択を複数選択対応に変更
  - 名古屋市16区 → 「名古屋市」1つに統合（マッチング時に内部で16区に展開）
  - CascadeSelect（単一ドロップダウン）→ AreaMultiSelect（タグ選択UI）に変更
  - 選んだエリアが上部にタグとして蓄積、×ボタンで解除可能
  - 質問タイプを "cascade" → "area" に変更（types/index.ts にも追加）
- [x] 10.6-2. Q19（担当者への期待）を複数選択化
  - type: "single" → "multi"（上限なし）
  - diagnosis.ts: getAnswerArray でループ加点に変更
  - matching.ts: calcStyleScore を配列対応（1一致→6点, 2一致→12点, 上限12点維持）
- [x] 10.6-3. Q15のサブテキスト改善
  - 「上位3つを選んでください」→「3つまで選べます」に変更
  - ranked型にも「次へ進む」ボタンに選択件数表示を追加
- [x] 10.6-4. 資料請求フォームに「戻る」ボタン追加（/result に戻る）
- [x] 10.6-5. Q13・Q14の選択肢ラベルをスプレッドシート定義に統一
  - Q13: ナチュラル・北欧→北欧風、和モダン→Japanese Modern、other→none 等
  - Q14: ホワイト・クリーン→白基調シンプル&クリーン 等
  - imageUrlを空文字に変更（画像未設定状態に統一）
- [x] 10.6-6. テストケース全件更新・全PASS
  - Q7を配列形式（複数エリア対応）に更新
  - Q19を配列形式に更新
  - ケースA〜D 全4件PASS

## Phase 10.7: Supabase連携準備

- [x] 10.7-1. 初期テーブル定義SQL作成（supabase/migrations/001_initial.sql）
  - builders（工務店マスタ）
  - builder_photos（施工事例写真）
  - builder_reviews（お客様の声）
  - leads（資料請求データ）
  - updated_at自動更新トリガー
  - RLS は本番前に設定（現状無効）
- [x] 10.7-2. データ取得の抽象化（Supabase/ダミーデータ自動切り替え）
  - src/lib/getBuilders.ts: 環境変数でSupabase接続を判定、スネークケース→キャメルケース変換付き
  - src/hooks/useBuilders.ts: クライアントコンポーネント用フック
  - 4ページ（result, builder/[id], request, request/complete）を useBuilders() に切り替え
  - @supabase/supabase-js パッケージインストール済み
- [x] 10.7-3. .env.local.example 作成（Supabase接続情報テンプレート）
- [x] 10.7-4. 資料請求API作成（src/app/api/leads/route.ts）
  - POST /api/leads でフォームデータ + 診断結果を受信
  - Supabase接続時 → leadsテーブルにINSERT / 未接続時 → ログ出力+OK
  - request/page.tsx の送信処理をfetch経由に変更
  - 送信中ローディング表示・エラーメッセージ対応
- [x] 10.7-5. 工務店登録フォーム作成（src/app/admin/register/page.tsx）
  - A.基本情報 〜 B7.会社の強み までカテゴリ別セクション
  - チェックボックス・ラジオ・ドロップダウン（重複防止）・テキストエリア
  - src/app/api/builders/route.ts: POST API（Supabase/ログ切り替え）
  - 「SHO-SAN社内・加盟工務店専用」注記
  - 選択肢をquestions.tsと統一済み

## Phase 11: デプロイ・Supabase接続・Gemini連携

- [x] 11-1. GitHubプッシュ + Vercelデプロイ準備
  - GitHub: kaiseikawashima-hash/iematch にプッシュ済み
  - Vercelデプロイ時の Root Directory は `iematch` に設定
- [x] 11-2. Gemini API「聞いてくる」機能（インサイト生成）
  - @google/generative-ai パッケージインストール
  - POST /api/insight: Gemini 2.0 Flashでこれまでの回答を分析、共感的メッセージ生成
  - InsightCardコンポーネント: 薄いグリーンカード + 確認/違う/スキップボタン
  - Q6・Q14・Q19の回答後にインタースティシャル表示
  - Q19（最終質問）後はInsightCard → 結果画面に遷移
  - GEMINI_API_KEY未設定 or APIエラー時は自動スキップ
  - .env.local に GEMINI_API_KEY 設定済み
- [x] 11-3. Q13・Q14の画像素材設定
  - Unsplashのフリー画像URLを設定（外観6種 + 内装6種）
  - next.config.ts に images.remotePatterns で images.unsplash.com を許可
- [x] 11-4. Supabaseプロジェクト作成・テーブル作成・データ投入
  - プロジェクト名: iematch（リージョン: ap-northeast-1）
  - テーブル: builders, builder_photos, builder_reviews, leads, settings, images
  - builders テーブルにダミー30社データINSERT済み
  - settings テーブルにプライバシーポリシー・利用規約の初期値INSERT済み
  - .env.local に NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY 設定済み
- [x] 11-5. 管理画面の実装（/admin）
  - パスワード保護（パスワード: iematch2024、sessionStorage認証）
  - タブ①: 工務店管理（一覧表示・削除・新規登録リンク）
  - タブ②: テイスト画像管理（Q13/Q14の画像URL編集・プレビュー付き）
  - タブ③: プライバシーポリシー・利用規約（テキスト編集→Supabase保存）
  - タブ④: リード一覧（資料請求データ表示・削除）
  - 管理用API: /api/admin/builders, /api/admin/leads, /api/admin/settings, /api/admin/images
  - 既存の /admin/register は維持
- [x] 11-6. プライバシーポリシーページ（/privacy）
  - Supabase settings テーブルから privacy_policy を取得して表示
- [x] 11-7. メール送信設定（資料請求時の確認メール・工務店への通知メール）
  - Resend（resend.com）によるメール送信をAPIに組み込み
  - メールA: 工務店へのリード通知（BUILDER_NOTIFICATION_EMAIL宛）
    - ユーザー情報・診断結果・主な希望（Q4/Q7/Q15/Q17のラベル変換）
  - メールB: ユーザーへの完了確認（ユーザーのメールアドレス宛）
    - 請求先一覧（箇条書き）・次のステップ案内
  - RESEND_API_KEY未設定時はコンソールログのみ（Supabase未接続時と同方式）
  - メール送信失敗時もリード保存は成功扱い
  - builderIds→会社名: Supabase優先、未接続時はbuilders.tsからフォールバック
  - .env.local.example にRESEND_API_KEY/RESEND_FROM_EMAIL/BUILDER_NOTIFICATION_EMAIL/GEMINI_API_KEY追記

## Phase 11.5: InsightCard改善・フィードバック機能

- [x] 11.5-1. InsightCard「ちょっと違うかも」の追加入力機能
  - 「ちょっと違うかも」押下で追加入力欄を表示（テキストエリア + 送信して次へ/戻るボタン）
  - 入力は任意（空でも送信して次へ可能）
  - onDenyの型をstring引数付きに変更
- [x] 11.5-2. corrections（修正フィードバック）のsessionStorage保存
  - 型: { afterQuestion: "Q6"|"Q13"|"Q19", text: string }[]
  - diagnosis/page.tsxにcorrections state・insightTriggerId追跡を追加
  - 結果画面遷移時に "iematch_corrections" として保存
- [x] 11.5-3. 結果画面のアドバイス文にcorrections反映
  - sessionStorageからcorrections取得
  - 1件以上の場合「なお、診断中にご指摘いただいた点（...）も考慮しておすすめを選んでいます。」を表示

## Phase 11.6: プライバシーポリシー・利用規約・フッター改善

- [x] 11.6-1. フッターのリンク有効化
  - プライバシーポリシー・利用規約をNext.js Linkに変更（/privacy, /terms）
  - ホバー時にunderline表示
- [x] 11.6-2. プライバシーポリシーページ（/privacy）の正式文言化
  - 6セクション構成（個人情報の取扱い・利用目的・第三者提供・管理・開示/訂正/削除・お問い合わせ）
- [x] 11.6-3. 利用規約ページ（/terms）の新規作成
  - 7セクション構成（サービス概要・利用条件・禁止事項・免責事項・変更/中断・知的財産権・規約の変更）
- [x] 11.6-4. 資料請求フォームのプライバシーポリシー同意をチェックボックスに変更
  - みなし同意テキスト → チェックボックス + /privacyリンク（別タブ）に変更
  - 未チェック時は送信ボタンをグレーアウト（disabled + bg-gray-300）
  - チェック後にブランドカラーで有効化

## Phase 11.7: Supabaseでのポリシー管理

- [x] 11.7-1. settingsテーブルの初期データ更新
  - privacy_policy / terms_of_service の value を正式文言に UPDATE
- [x] 11.7-2. /privacy と /terms をSupabase対応に変更
  - async サーバーコンポーネント化（Supabaseから settings テーブルの該当キーを取得）
  - Supabase未接続時は FALLBACK_TEXT（静的テキスト）を表示
  - revalidate = 60（ISR: 60秒ごとに再生成）
- [x] 11.7-3. admin管理画面との連携確認
  - 既存の /api/admin/settings（GET/PUT）がupsertでそのまま動作
  - admin で保存 → Supabase更新 → ISR再生成で /privacy, /terms に自動反映

## Phase 11.8: 施工事例・お客様の声・ダミーデータ拡充

- [x] 11.8-1. 施工事例カルーセルの実装
  - BuilderCard.tsx: 静的placeholder → 横スクロールsnap式カルーセル（h-[200px]）
  - builder/[id]/page.tsx: グリッドギャラリー → 横スクロールカルーセル + ドットインジケーター
  - globals.css: .scrollbar-hide ユーティリティ追加
  - 画像URLあり → img表示、空 → グレーplaceholder「施工事例写真」
- [x] 11.8-2. 全30社のreviews（お客様の声）をタイプ別パターンに更新
  - デザイン系（001-005）: デザイン系レビュー2〜3件
  - 性能系（006-010）: 性能系レビュー2〜3件
  - コスパ系（011-015）: コスパ系レビュー2〜3件
  - 暮らし系（016-020）: 暮らし系レビュー2〜3件
  - 信頼系（021-025）: 信頼系レビュー2〜3件
  - バランス系（026-030）: バランス系レビュー2〜3件
- [x] 11.8-3. 全30社のphotosをダミーデータに統一
  - url: ""（空文字）、exterior x1 + interior x2 の3件構成
- [x] 11.8-4. Supabaseにreviews・photos反映
  - builder_photos: 90件INSERT（30社 x 3枚）
  - builder_reviews: 72件INSERT（30社 x 2〜3件）

## Phase 11.9: Geminiプロンプト改善・結果ページ刷新

- [x] 11.9-1. InsightCard Geminiプロンプト改善（/api/insight）
  - 「数字をそのまま使わない」「機械的な表現禁止」のネガティブルール追加
  - 「気持ち・価値観・不安を読み取る」「感情ワードを使う」のポジティブルール追加
  - 80文字以内に短縮
- [x] 11.9-2. 結果ページを4セクション構成に刷新
  - セクション①: あなたの家づくりタイプ（バッジ + キャッチコピー + 説明）
  - セクション②: あなた専用の比較セット
    - Gemini生成の比較説明文（/api/result-insight 新規作成）
    - 1社目「ベストマッチ」バッジ（#2E5240）
    - 2社目「あなたの最重要条件〇〇に最も強い」ラベル
    - 3社目「新しい発見」バッジ（#F59E0B）
    - カード: 写真カルーセル + マッチ度 + 強みタグ + トグル式「選択中/資料請求」ボタン
    - 比較ヒントカード（#EFF6FF / #BFDBFE）
  - セクション③: 診断詳細（レーダーチャート + 「このタイプになった理由」3ポイント抽出）
  - セクション④: 家づくりアドバイス（強み/注意/次のステップ + corrections反映）
- [x] 11.9-3. 比較セット説明文API（/api/result-insight）新規作成
  - Gemini 2.0 Flashで「本命」「発見枠」を使った説明文を生成
  - API未接続時はフォールバック（非表示）
- [x] 11.9-4. まとめて資料請求ボタンをトグル選択連動に変更
  - 各カードの「選択中/資料請求」ボタンで選択状態を切り替え
  - 選択中の社数を「まとめて資料請求する（N社）」に反映

## Phase 12: 仕上げ（未着手）

- [ ] 12-1. レスポンシブ対応（375px〜スマホ優先）
- [ ] 12-2. ページ遷移アニメーション
- [ ] 12-3. 全フロー通しテスト（P1→P2→P3→P4→P5→P6）
- [ ] 12-4. Vercelデプロイ実行
- [ ] 12-5. RLSポリシー設定（本番前に先輩と相談）
- [ ] 12-6. Vercel環境変数設定（GEMINI_API_KEY, RESEND_API_KEY等）

---

## 更新履歴

| 日付 | 内容 |
|------|------|
| 2026-03-18 | TODOリスト初版作成（全10フェーズ・50タスク） |
| 2026-03-20 | Phase 1〜9 実装完了（46/50タスク完了） |
| 2026-03-21 | Phase 10 デザインリニューアル完了（B案: オフホワイト×ダークグリーン、絵文字全削除） |
| 2026-03-22 | Phase 10.5 愛知県対応・工務店30社化・診断ロジック修正＆検証・Q14選択肢追加 |
| 2026-03-22 | Phase 10.6 エリア複数選択・Q19複数選択・Q15改善・戻るボタン・選択肢統一 |
| 2026-03-22 | Phase 10.7 Supabaseテーブル定義・データ取得抽象化・API作成・工務店登録フォーム |
| 2026-03-24 | Phase 11 デプロイ準備・Geminiインサイト機能・Unsplash画像設定・Supabase接続・管理画面・プライバシーページ |
| 2026-03-24 | Phase 11.5 InsightCard改善・修正フィードバック機能（corrections）・結果画面反映 |
| 2026-03-24 | Phase 11.6 フッターリンク有効化・プライバシーポリシー正式文言・利用規約新規作成・同意チェックボックス化 |
| 2026-03-24 | Phase 11.7 Supabaseでのポリシー管理（settings→ISR反映）・admin管理画面連携確認 |
| 2026-03-24 | Phase 11.8 施工事例カルーセル・全30社reviews/photosダミーデータ・Supabase反映 |
| 2026-03-24 | Phase 11.9 Geminiプロンプト改善・結果ページ4セクション刷新・比較セットAPI・トグル式資料請求 |
