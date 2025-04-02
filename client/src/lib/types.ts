export interface ClubType {
  id: number;
  name: string;
  description: string;
  iconName: string;
}

export interface GolfProfile {
  id: number;
  heightFeet: number;
  heightInches: number;
  weight: number;
  age: number;
  gender: string;
  handicap: string;
  ballFlight: string;
  swingSpeed?: number;
  priority: string;
}

export interface SwingAnalysis {
  id: number;
  swingSpeed: number;
  swingPath: string;
  clubFace: string;
  tempo: string;
  profileId: number;
}

export interface RecommendedClub {
  id: number;
  name: string;
  description: string;
  price: number;
  forgiveness: number;
  distance: number;
  feel: number;
  priceCategory: string;
  badgeText: string;
  clubTypeId: number;
  profileId: number;
}

export interface RetailerDeal {
  id: number;
  retailerName: string;
  price: number;
  shipping: number;
  inStock: boolean;
  shippingTime?: string;
  imageUrl?: string;
  clubId: number;
}

export interface Step {
  id: number;
  name: string;
  label: string;
}

export interface ProfileFormData {
  heightFeet: number;
  heightInches: number;
  weight: number;
  age: number;
  gender: string;
  handicap: string;
  ballFlight: string;
  swingSpeed?: number;
  priority: string;
}
