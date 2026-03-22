// === タイプ名 ===
export type TypeName =
  | "designFirst"
  | "performanceExpert"
  | "costBalance"
  | "lifestyleDesign"
  | "trustPartner"
  | "totalBalance";

// === ヒアリング関連 ===
export type QuestionType =
  | "single"
  | "multi"
  | "ranked"
  | "image"
  | "cascade"
  | "family";

export type QuestionOption = {
  value: string;
  label: string;
  imageUrl?: string;
};

export type Question = {
  id: string;
  category: number;
  categoryLabel: string;
  text: string;
  subText?: string;
  type: QuestionType;
  maxSelect?: number;
  minSelect?: number;
  options: QuestionOption[];
  condition?: {
    dependsOn: string;
    showWhen: string[];
  };
};

// === 回答データ ===
export type Answer = {
  questionId: string;
  value: string | string[];
  rank?: string[];
};

export type UserAnswers = {
  answers: Answer[];
  completedAt: string;
};

// === 家族構成 ===
export type FamilyData = {
  adults: number;
  children: number;
  futurePlan: string;
};

// === 工務店データ ===
export type Builder = {
  id: string;
  name: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  logoUrl: string;
  b1_areas: string[];
  b2_priceRanges: string[];
  b2_mainPriceRange: string;
  b3_exteriorStyles: string[];
  b3_interiorStyles: string[];
  b3_bestStyle: string;
  b4_strengths: string[];
  b4_specs: string[];
  b4_values: {
    ua?: number;
    c?: number;
    seismicGrade?: number;
    zehCount?: number;
  };
  b5_services: string[];
  b5_designFreedom: string;
  b5_annualBuilds: number;
  b6_styles: string[];
  b6_features: string[];
  b7_topStrengths: string[];
  photos: { url: string; tags: string[]; category: string }[];
  reviews: { text: string; author: string }[];
  awards: string[];
  campaign: string;
};

// === 診断結果 ===
export type RadarValues = {
  design: number;
  performance: number;
  cost: number;
  lifestyle: number;
  trust: number;
};

export type Recommendation = {
  builderId: string;
  rawScore: number;
  displayMatchRate: number;
  reasonText: string;
};

export type DiagnosisResult = {
  mainType: TypeName;
  subType: TypeName;
  typeScores: Record<TypeName, number>;
  displayLabel: string;
  radarValues: RadarValues;
  recommendations: Recommendation[];
};

// === 資料請求フォーム ===
export type RequestFormData = {
  name: string;
  email: string;
  phone: string;
  address?: string;
  message?: string;
  builderIds: string[];
};
