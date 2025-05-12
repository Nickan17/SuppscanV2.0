export interface Supplement {
  id: string;
  name: string;
  brand: string;
  category: string;
  imageUrl: string;
  qualityScore: number;
  scores: {
    clinicalDosing: number;
    thirdPartyTesting: number;
    brandTransparency: number;
  };
  aiSummary: string;
  ingredients: {
    name: string;
    dosage: string;
  }[];
}