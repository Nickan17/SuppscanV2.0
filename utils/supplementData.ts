import { Supplement } from '@/types';

const dummySupplements: Supplement[] = [
  {
    id: 'DEMO123456',
    name: 'Vitamin D3 5000 IU',
    brand: 'Nature\'s Way',
    category: 'Vitamins',
    imageUrl: 'https://images.pexels.com/photos/3683074/pexels-photo-3683074.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    qualityScore: 88,
    scores: {
      clinicalDosing: 90,
      thirdPartyTesting: 95,
      brandTransparency: 80,
    },
    aiSummary: 'This supplement contains 5000 IU of Vitamin D3 (cholecalciferol), which is a clinically supported dose for individuals with deficiency. The dose is well above the RDA of 600-800 IU but within safe limits for most adults. Research shows this dose can effectively raise blood levels in deficient individuals. This product uses olive oil as a carrier for better absorption since Vitamin D is fat-soluble. The supplement is third-party tested and uses quality ingredients with minimal fillers.',
    ingredients: [
      { name: 'Vitamin D3 (as Cholecalciferol)', dosage: '5000 IU' },
      { name: 'Olive Oil', dosage: '100 mg' },
      { name: 'Gelatin', dosage: '' },
      { name: 'Glycerin', dosage: '' },
    ],
  },
  {
    id: 'DEMO123457',
    name: 'Magnesium Glycinate',
    brand: 'Pure Encapsulations',
    category: 'Minerals',
    imageUrl: 'https://images.pexels.com/photos/8105060/pexels-photo-8105060.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    qualityScore: 92,
    scores: {
      clinicalDosing: 95,
      thirdPartyTesting: 100,
      brandTransparency: 85,
    },
    aiSummary: 'This magnesium glycinate supplement provides 120mg of elemental magnesium per capsule, which is a highly bioavailable form that\'s less likely to cause digestive distress. The clinical dose for magnesium is typically 200-400mg daily, so 2-3 capsules would meet recommended targets. Pure Encapsulations maintains excellent third-party testing standards and has clear transparency about their manufacturing process. The glycinate form is particularly effective for sleep, anxiety, and muscle recovery applications.',
    ingredients: [
      { name: 'Magnesium (as Magnesium Glycinate)', dosage: '120mg' },
      { name: 'Vegetable Cellulose', dosage: '' },
      { name: 'Ascorbyl Palmitate', dosage: '' },
    ],
  },
  {
    id: 'DEMO123458',
    name: 'Whey Protein Isolate',
    brand: 'Optimum Nutrition',
    category: 'Protein',
    imageUrl: 'https://images.pexels.com/photos/3683054/pexels-photo-3683054.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    qualityScore: 84,
    scores: {
      clinicalDosing: 90,
      thirdPartyTesting: 85,
      brandTransparency: 78,
    },
    aiSummary: 'This whey protein isolate provides 25g of protein per serving with minimal carbs and fat, making it an excellent option for muscle recovery and growth. The leucine content (approximately 2.5g per serving) is sufficient to stimulate muscle protein synthesis. The product undergoes third-party testing for purity and banned substances, though the testing frequency isn\'t fully disclosed. While the product contains artificial sweeteners, the overall formulation is backed by substantial research for supporting muscle recovery and growth.',
    ingredients: [
      { name: 'Protein (as Whey Protein Isolate)', dosage: '25g' },
      { name: 'Total Carbohydrates', dosage: '1g' },
      { name: 'Total Fat', dosage: '0.5g' },
      { name: 'Natural and Artificial Flavors', dosage: '' },
    ],
  },
  {
    id: 'DEMO123459',
    name: 'Fish Oil Omega-3',
    brand: 'Nordic Naturals',
    category: 'Fatty Acids',
    imageUrl: 'https://images.pexels.com/photos/3683098/pexels-photo-3683098.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    qualityScore: 94,
    scores: {
      clinicalDosing: 95,
      thirdPartyTesting: 100,
      brandTransparency: 90,
    },
    aiSummary: 'This high-quality fish oil supplement provides 1100mg of combined EPA and DHA per serving, which meets clinical recommendations for general health benefits. Nordic Naturals is known for their exceptional purity testing, surpassing international standards for heavy metals and oxidation. The triglyceride form used is more bioavailable than ethyl esters found in some competitors. The company maintains full transparency about sourcing (wild-caught sardines and anchovies) and their manufacturing process is certified sustainable.',
    ingredients: [
      { name: 'Total Omega-3s', dosage: '1600mg' },
      { name: 'EPA (Eicosapentaenoic Acid)', dosage: '650mg' },
      { name: 'DHA (Docosahexaenoic Acid)', dosage: '450mg' },
      { name: 'Other Omega-3s', dosage: '500mg' },
      { name: 'Vitamin E (as d-alpha tocopherol)', dosage: '30 IU' },
    ],
  },
  {
    id: 'DEMO123460',
    name: 'Ashwagandha KSM-66',
    brand: 'Jarrow Formulas',
    category: 'Hormonal Support',
    imageUrl: 'https://images.pexels.com/photos/3683121/pexels-photo-3683121.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    qualityScore: 89,
    scores: {
      clinicalDosing: 85,
      thirdPartyTesting: 90,
      brandTransparency: 95,
    },
    aiSummary: 'This supplement uses KSM-66 Ashwagandha, which is a full-spectrum extract with clinical research backing its stress-reducing and hormonal balancing effects. The dose (300mg per capsule) is at the lower end of the clinical range, so two capsules daily would be needed to match most study protocols (600mg). Jarrow Formulas provides extensive information about their quality control processes and sources the patented KSM-66 extract which maintains a standardized withanolide content. The product is free from common allergens and has minimal fillers.',
    ingredients: [
      { name: 'Ashwagandha Extract (KSM-66)', dosage: '300mg' },
      { name: 'Cellulose', dosage: '' },
      { name: 'Magnesium Stearate', dosage: '' },
      { name: 'Silicon Dioxide', dosage: '' },
    ],
  },
];

export function getSupplementData(barcode: string): Supplement {
  return dummySupplements.find(s => s.id === barcode) || dummySupplements[0];
}

export function searchSupplements(query: string): Supplement[] {
  if (!query) return dummySupplements;
  
  const lowerQuery = query.toLowerCase();
  return dummySupplements.filter(
    s => s.name.toLowerCase().includes(lowerQuery) || 
         s.brand.toLowerCase().includes(lowerQuery) ||
         s.category.toLowerCase().includes(lowerQuery)
  );
}

export function getHistoryData(): Supplement[] {
  // This would normally be retrieved from storage
  // For demo, return 3 of the supplements as "history"
  return dummySupplements.slice(0, 3);
}

export function getTopSupplements(category: string): Supplement[] {
  if (category === 'All') return dummySupplements.sort((a, b) => b.qualityScore - a.qualityScore);
  
  return dummySupplements
    .filter(s => s.category === category || category === 'All')
    .sort((a, b) => b.qualityScore - a.qualityScore);
}