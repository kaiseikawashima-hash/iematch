import { TypeName } from "@/types";

export type TypeInfo = {
  readonly name: TypeName;
  readonly label: string;
  readonly catchCopy: string;
  readonly description: string;
  readonly strengths: readonly string[];
  readonly cautions: readonly string[];
  readonly nextSteps: readonly string[];
};

export const typeDefinitions: Record<TypeName, TypeInfo> = {
  designFirst: {
    name: "designFirst",
    label: "デザインファースト型",
    catchCopy: "暮らしを、美しく設計する人",
    description:
      "外観・内装のデザインにこだわりがあり、建築家やデザイナーとの共創を楽しめるタイプ。空間の美しさが暮らしの質を高めると考えています。",
    strengths: [
      "デザインへの感度が高く、理想のイメージが明確",
      "空間づくりを楽しめるクリエイティブな感性",
      "細部までこだわり抜く姿勢",
    ],
    cautions: [
      "デザイン優先で性能や予算が後回しにならないよう注意",
      "施工写真だけでなく、住み心地も確認しましょう",
    ],
    nextSteps: [
      "気になる工務店の施工事例を実際に見学する",
      "建築家との相性を確認するための面談を予約する",
      "デザインと性能のバランスについて相談する",
    ],
  },
  performanceExpert: {
    name: "performanceExpert",
    label: "性能エキスパート型",
    catchCopy: "数値で納得、快適を追求する人",
    description:
      "断熱・気密・耐震などの住宅性能を重視し、データに基づいた家づくりを志向するタイプ。快適さと省エネを両立する合理的な判断ができます。",
    strengths: [
      "性能値を理解し、適切な判断ができる知識",
      "長期的な光熱費やメンテナンスコストまで考慮する視野",
      "エビデンスに基づいた意思決定力",
    ],
    cautions: [
      "数値にこだわりすぎて、住み心地の感覚面を見逃さないように",
      "オーバースペックにならないよう、コストとのバランスも大切",
    ],
    nextSteps: [
      "各社のUA値・C値を比較して候補を絞る",
      "モデルハウスで体感温度を実際に確認する",
      "光熱費シミュレーションを依頼する",
    ],
  },
  costBalance: {
    name: "costBalance",
    label: "コストバランス型",
    catchCopy: "賢く選んで、満足度を最大化する人",
    description:
      "限られた予算の中で最大の価値を引き出すことを重視するタイプ。価格と品質のバランスを見極め、無駄のない家づくりを実現します。",
    strengths: [
      "予算管理能力が高く、計画的に進められる",
      "コストと品質のトレードオフを冷静に判断できる",
      "ランニングコストまで含めた総合判断力",
    ],
    cautions: [
      "安さだけで判断せず、長期的な価値も考慮しましょう",
      "削ってはいけない部分（構造・断熱）を見極めることが大切",
    ],
    nextSteps: [
      "複数社から見積もりを取り、標準仕様を比較する",
      "ライフサイクルコスト（光熱費・メンテナンス費）を試算する",
      "補助金・減税制度を確認する",
    ],
  },
  lifestyleDesign: {
    name: "lifestyleDesign",
    label: "暮らしデザイン型",
    catchCopy: "間取りと動線に、理想の毎日を描く人",
    description:
      "家族の暮らし方やライフスタイルから間取りを考えるタイプ。日々の生活動線や収納計画にこだわり、「住みやすさ」を最優先にします。",
    strengths: [
      "家族の暮らし方を具体的にイメージできる想像力",
      "実用性と快適さのバランス感覚",
      "将来の家族変化まで見据えた計画性",
    ],
    cautions: [
      "要望が多くなりがちなので、優先順位をつけることが大切",
      "間取りの自由度と構造的な制約のバランスも確認しましょう",
    ],
    nextSteps: [
      "家族全員の1日のスケジュールを書き出してみる",
      "収納量の現状を把握する（持ち物リストを作る）",
      "暮らし方に強い工務店との相性面談を予約する",
    ],
  },
  trustPartner: {
    name: "trustPartner",
    label: "安心パートナー型",
    catchCopy: "信頼できるプロと、一緒につくりたい人",
    description:
      "施工実績やアフターサポート、担当者の人柄を重視するタイプ。長期的なパートナーシップを大切にし、安心感のある家づくりを望みます。",
    strengths: [
      "信頼関係を大切にする慎重さ",
      "建てた後の暮らしまで考える長期的視点",
      "プロの意見を素直に取り入れる柔軟性",
    ],
    cautions: [
      "人柄だけでなく、技術力や実績も合わせて評価しましょう",
      "複数社を比較して、客観的に判断することも大切",
    ],
    nextSteps: [
      "OB施主の声を直接聞ける見学会に参加する",
      "アフターサポートの内容を具体的に確認する",
      "担当者との面談で相性を確認する",
    ],
  },
  totalBalance: {
    name: "totalBalance",
    label: "トータルバランス型",
    catchCopy: "すべてを見渡して、最適解を見つける人",
    description:
      "デザイン・性能・コスト・暮らしやすさ・信頼性のすべてをバランスよく重視するタイプ。総合的に最も満足度の高い選択を目指します。",
    strengths: [
      "多角的な視点で総合判断ができるバランス感覚",
      "特定の要素に偏らない冷静な意思決定力",
      "幅広い選択肢から最適解を見つけ出す分析力",
    ],
    cautions: [
      "すべてを求めると決めきれなくなることも。優先順位を意識しましょう",
      "「80点の満足」を目指す心構えも大切です",
    ],
    nextSteps: [
      "各社の総合力を一覧表で比較する",
      "最も譲れないポイントを1つだけ決めてみる",
      "複数社と面談して、フィーリングの合う会社を見つける",
    ],
  },
};

// 表示ラベル組み合わせテーブル
export const subTypeLabels: Record<TypeName, Record<TypeName, string>> = {
  designFirst: {
    designFirst: "",
    performanceExpert: "性能にも妥協しない",
    costBalance: "コスパ意識も高い",
    lifestyleDesign: "暮らしやすさも追求する",
    trustPartner: "信頼も大切にする",
    totalBalance: "総合力も求める",
  },
  performanceExpert: {
    designFirst: "デザインにもこだわる",
    performanceExpert: "",
    costBalance: "コスパ意識も高い",
    lifestyleDesign: "暮らしやすさも追求する",
    trustPartner: "信頼も大切にする",
    totalBalance: "総合力も求める",
  },
  costBalance: {
    designFirst: "デザインにもこだわる",
    performanceExpert: "性能にも妥協しない",
    costBalance: "",
    lifestyleDesign: "暮らしやすさも追求する",
    trustPartner: "信頼も大切にする",
    totalBalance: "総合力も求める",
  },
  lifestyleDesign: {
    designFirst: "デザインにもこだわる",
    performanceExpert: "性能にも妥協しない",
    costBalance: "コスパ意識も高い",
    lifestyleDesign: "",
    trustPartner: "信頼も大切にする",
    totalBalance: "総合力も求める",
  },
  trustPartner: {
    designFirst: "デザインにもこだわる",
    performanceExpert: "性能にも妥協しない",
    costBalance: "コスパ意識も高い",
    lifestyleDesign: "暮らしやすさも追求する",
    trustPartner: "",
    totalBalance: "総合力も求める",
  },
  totalBalance: {
    designFirst: "デザイン寄りの",
    performanceExpert: "性能重視寄りの",
    costBalance: "コスパ重視寄りの",
    lifestyleDesign: "暮らし重視寄りの",
    trustPartner: "安心重視寄りの",
    totalBalance: "",
  },
};
