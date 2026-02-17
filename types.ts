
export interface Medicine {
  id: string;
  name: string;
  category: string;
  tags: string[];
}

export interface Herb {
  id: string;
  name: string;
  sanskrit_name?: string;
  property: 'Heating' | 'Cooling' | 'Neutral';
  conflicts_with_tags: string[];
  warning_msg: string;
  season_conflict: string[];
  image?: string; // Optional field for UI
}

export interface SeasonalRule {
  dosha: string;
  avoid_properties: string[];
  recommendations: string[];
  warning: string;
  icon?: string; // Added for UI aesthetics
}

export type SeasonalData = Record<string, SeasonalRule>;

export enum InteractionStatus {
  SAFE = 'Safe',
  CAUTION = 'Caution',
  CONFLICT = 'Conflict'
}

export interface InteractionResult {
  status: InteractionStatus;
  message: string;
  details: string;
}

export interface InteractionReport {
  id: string;
  label: string;
  date: string;
  status: InteractionStatus;
  details: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  dosha: string;
  avatar: string;
  medications: string[];
  dob: string;
  age: number;
  phone: string;
  weight?: number;
  height?: number;
  bloodGroup?: string;
  gender?: string;
  reports: InteractionReport[];
}

export interface WeatherData {
  temp: number;
  humidity: number;
  description: string;
  city: string;
  season: 'Summer' | 'Monsoon' | 'Winter';
}
