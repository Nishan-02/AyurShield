
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
    sanskrit_name: "Adraka",
    property: "Heating",
    conflicts_with_tags: ["anticoagulant", "blood_thinner"],
    warning_msg: "CRITICAL: Ginger thins the blood. Combining with anticoagulants causes internal bleeding risk.",
    season_conflict: ["Summer", "Autumn"],
    image: "https://wallpapers.com/images/hd/sliced-and-powdered-ginger-root-spice-7ime6ljxsz0wxi9v.jpg"
  },
  {
    id: "h2",
    name: "Turmeric",
    sanskrit_name: "Haridra",
    property: "Heating",
    conflicts_with_tags: ["anticoagulant", "hypoglycemic"],
    warning_msg: "CAUTION: High doses of Turmeric can lower blood sugar and thin blood excessively.",
    season_conflict: ["Summer"],
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Curcuma_longa_roots.jpg/640px-Curcuma_longa_roots.jpg"
  },
  {
    id: "h3",
    name: "Ashwagandha",
    sanskrit_name: "Withania Somnifera",
    property: "Heating",
    conflicts_with_tags: ["sedative", "thyroid_med", "hypoglycemic"],
    warning_msg: "DANGER: Increases sedation and thyroid hormone levels. Do not mix with SSRIs or Thyroid meds.",
    season_conflict: ["Summer"],
    image: "https://img.freepik.com/premium-photo/ashwagandha-known-as-withania-somnifera-ashwagandha_1047188-6743.jpg?w=2000"
  },
  {
    id: "h4",
    name: "Ginkgo Biloba",
    sanskrit_name: "Ginkgo",
    property: "Cooling",
    conflicts_with_tags: ["anticoagulant", "nsaid"],
    warning_msg: "CRITICAL: Ginkgo is a potent blood thinner. Major bleeding risk with Aspirin/Warfarin.",
    season_conflict: ["Winter"],
    image: "https://th.bing.com/th/id/OIP.i_UYTuy1GKke0nXNYPEoGAHaEr?w=268&h=180&c=7&r=0&o=7&dpr=1.4&pid=1.7&rm=3"
  },
  {
    id: "h5",
    name: "Karela (Bitter Melon)",
    sanskrit_name: "Karavellaka",
    property: "Cooling",
    conflicts_with_tags: ["hypoglycemic"],
    warning_msg: "DANGER: Karela mimics insulin. Combining with Diabetes meds can cause severe hypoglycemia.",
    season_conflict: ["Winter"],
    image: "https://thumbs.dreamstime.com/z/indian-green-karela-store-stall-indian-green-karela-close-up-111614510.jpg"
  },
  {
    id: "h6",
    name: "Licorice (Mulethi)",
    sanskrit_name: "Yashtimadhu",
    property: "Cooling",
    conflicts_with_tags: ["hypotensive", "diuretic"],
    warning_msg: "CAUTION: Licorice can raise blood pressure and deplete potassium. Dangerous with heart meds.",
    season_conflict: ["Winter"],
    image: "https://5.imimg.com/data5/SELLER/Default/2022/6/DS/NC/BP/126009257/mulethi-licorice-root-1000x1000.jpg"
  },
  {
    id: "h7",
    name: "Tulsi (Holy Basil)",
    sanskrit_name: "Tulasi",
    property: "Neutral",
    conflicts_with_tags: [],
    warning_msg: "None. Tulsi is generally safe.",
    season_conflict: [],
    image: "https://tse4.mm.bing.net/th/id/OIP.9UEqqH4Bat1m9DQIppoH0AHaE8?rs=1&pid=ImgDetMain&o=7&rm=3"
  },
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
