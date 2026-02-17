
import { Medicine, Herb, SeasonalData } from './types';

export const MEDICINES: Medicine[] = [
  { id: "m1", name: "Warfarin", category: "Blood Thinner", tags: ["anticoagulant", "blood_thinner"] },
  { id: "m2", name: "Aspirin", category: "Pain/Heart", tags: ["anticoagulant", "nsaid"] },
  { id: "m3", name: "Metformin", category: "Diabetes", tags: ["hypoglycemic"] },
  { id: "m4", name: "Insulin", category: "Diabetes", tags: ["hypoglycemic"] },
  { id: "m5", name: "Fluoxetine", category: "Antidepressant", tags: ["sedative", "serotonergic"] },
  { id: "m6", name: "Amlodipine", category: "Blood Pressure", tags: ["hypotensive"] },
  { id: "m7", name: "Thyroxine", category: "Thyroid", tags: ["hormone"] },
  { id: "m8", name: "Paracetamol", category: "Painkiller", tags: ["analgesic", "safe_general"] }
];

export const HERBS: Herb[] = [
  {
    id: "h1",
    name: "Ginger",
    sanskrit_name: "Adrak",
    property: "Heating",
    conflicts_with_tags: ["anticoagulant", "blood_thinner"],
    warning_msg: "CRITICAL: Ginger thins the blood. Combining with anticoagulants causes internal bleeding risk.",
    season_conflict: ["Summer", "Autumn"],
    image: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&q=80&w=400"
  },
  {
    id: "h2",
    name: "Turmeric",
    sanskrit_name: "Haldi",
    property: "Heating",
    conflicts_with_tags: ["anticoagulant", "hypoglycemic"],
    warning_msg: "CAUTION: High doses of Turmeric can lower blood sugar and thin blood excessively.",
    season_conflict: ["Summer"],
    image: "https://images.unsplash.com/photo-1615485500704-8e990f9900f7?auto=format&fit=crop&q=80&w=400"
  },
  {
    id: "h3",
    name: "Ashwagandha",
    sanskrit_name: "Withania Somnifera",
    property: "Heating",
    conflicts_with_tags: ["sedative", "thyroid_med", "hypoglycemic"],
    warning_msg: "DANGER: Ashwagandha increases sedation and thyroid hormone levels. Do not mix with SSRIs or Thyroid meds.",
    season_conflict: ["Summer"],
    image: "https://images.unsplash.com/photo-1628151515220-410e54448551?auto=format&fit=crop&q=80&w=400"
  },
  {
    id: "h4",
    name: "Ginkgo Biloba",
    sanskrit_name: "Ginkgo",
    property: "Cooling",
    conflicts_with_tags: ["anticoagulant", "nsaid"],
    warning_msg: "CRITICAL: Ginkgo is a potent blood thinner. Major bleeding risk with Aspirin/Warfarin.",
    season_conflict: ["Winter"],
    image: "https://images.unsplash.com/photo-1589139265147-380104692793?auto=format&fit=crop&q=80&w=400"
  },
  {
    id: "h5",
    name: "Karela (Bitter Melon)",
    sanskrit_name: "Karavellaka",
    property: "Cooling",
    conflicts_with_tags: ["hypoglycemic"],
    warning_msg: "DANGER: Karela mimics insulin. Combining with Diabetes meds can cause severe hypoglycemia (low sugar coma).",
    season_conflict: ["Winter"],
    image: "https://images.unsplash.com/photo-1594282486552-05b4d80fbb9f?auto=format&fit=crop&q=80&w=400"
  },
  {
    id: "h6",
    name: "Licorice (Mulethi)",
    sanskrit_name: "Yashtimadhu",
    property: "Cooling",
    conflicts_with_tags: ["hypotensive", "diuretic"],
    warning_msg: "CAUTION: Licorice can raise blood pressure and deplete potassium. Dangerous with heart meds.",
    season_conflict: ["Winter"],
    image: "https://images.unsplash.com/photo-1611119747967-df30739c3664?auto=format&fit=crop&q=80&w=400"
  },
  {
    id: "h7",
    name: "Tulsi (Holy Basil)",
    property: "Neutral",
    conflicts_with_tags: [],
    warning_msg: "None. Tulsi is generally safe.",
    season_conflict: [],
    image: "https://images.unsplash.com/photo-1631553127988-34865103a88a?auto=format&fit=crop&q=80&w=400"
  }
];

export const SEASONAL_DATA: SeasonalData = {
  "Summer": {
    "dosha": "Pitta",
    "avoid_properties": ["Heating"],
    "recommendations": ["Coconut Water", "Mint", "Fennel Seeds"],
    "warning": "It is Summer (Pitta Season). Avoid heating herbs like Ginger or Garlic.",
    "icon": "☀️"
  },
  "Winter": {
    "dosha": "Vata",
    "avoid_properties": ["Cooling"],
    "recommendations": ["Ginger Tea", "Sesame Oil Massage", "Tulsi"],
    "warning": "It is Winter (Vata Season). Avoid cooling herbs like Mint or Karela.",
    "icon": "❄️"
  },
  "Monsoon": {
    "dosha": "Kapha",
    "avoid_properties": ["Heavy", "Oily"],
    "recommendations": ["Honey", "Turmeric", "Light Soups"],
    "warning": "It is Monsoon (Kapha Season). Avoid heavy, oily foods and dairy.",
    "icon": "🌧️"
  }
};
