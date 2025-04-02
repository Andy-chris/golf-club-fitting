// Mock data for GitHub Pages deployment
import { ClubType, GolfProfile, SwingAnalysis, RecommendedClub, RetailerDeal } from './types';

// Mock club types
export const mockClubTypes: ClubType[] = [
  {
    id: 1,
    name: "Drivers",
    description: "Maximum distance off the tee",
    iconName: "drive"
  },
  {
    id: 2,
    name: "Fairway Woods",
    description: "Versatile clubs for distance and accuracy",
    iconName: "wood"
  },
  {
    id: 3,
    name: "Hybrids",
    description: "The perfect blend of woods and irons",
    iconName: "hybrid"
  },
  {
    id: 4,
    name: "Irons",
    description: "Precision clubs for approach shots",
    iconName: "iron"
  },
  {
    id: 5,
    name: "Wedges",
    description: "Specialized clubs for short game control",
    iconName: "wedge"
  },
  {
    id: 6,
    name: "Putters",
    description: "Designed for the green to sink putts",
    iconName: "putter"
  }
];

// Mock golf profile
export const mockGolfProfile: GolfProfile = {
  id: 1,
  heightFeet: 5,
  heightInches: 10,
  weight: 175,
  age: 35,
  gender: "male",
  handicap: "mid",
  ballFlight: "fade",
  swingSpeed: 95,
  priority: "forgiveness"
};

// Mock swing analysis
export const mockSwingAnalysis: SwingAnalysis = {
  id: 1,
  profileId: 1,
  swingSpeed: 95,
  swingPath: "outside-in",
  clubFace: "slightly-open",
  tempo: "moderate"
};

// Mock recommended clubs
export const mockRecommendedClubs: RecommendedClub[] = [
  {
    id: 1,
    name: "TaylorMade Stealth 2 Driver",
    description: "Features a 60X Carbon Twist Face for enhanced distance and forgiveness",
    price: 52900,
    forgiveness: 4,
    distance: 5,
    feel: 4,
    priceCategory: "premium",
    badgeText: "Best Overall",
    clubTypeId: 1,
    profileId: 1
  },
  {
    id: 2,
    name: "Callaway Paradym Driver",
    description: "Designed with a 360° carbon chassis for maximum distance and stability",
    price: 49900,
    forgiveness: 5,
    distance: 4,
    feel: 4,
    priceCategory: "premium",
    badgeText: "Most Forgiving",
    clubTypeId: 1,
    profileId: 1
  },
  {
    id: 3,
    name: "Ping G430 Max Driver",
    description: "Features a movable weight for shot shape adjustment and increased MOI",
    price: 47500,
    forgiveness: 5,
    distance: 4,
    feel: 3,
    priceCategory: "mid-range",
    badgeText: "Best Value",
    clubTypeId: 1,
    profileId: 1
  }
];

// Mock retailer deals
export const mockRetailerDeals: RetailerDeal[] = [
  {
    id: 1,
    retailerName: "Golf UK",
    price: 52900,
    shipping: 0,
    inStock: true,
    shippingTime: "1-3 days",
    imageUrl: "https://placehold.co/400x300?text=TaylorMade+Stealth+2",
    clubId: 1
  },
  {
    id: 2,
    retailerName: "Golf Discount Direct",
    price: 49900,
    shipping: 495,
    inStock: true,
    shippingTime: "2-4 days",
    imageUrl: "https://placehold.co/400x300?text=TaylorMade+Stealth+2",
    clubId: 1
  },
  {
    id: 3,
    retailerName: "British Golf Store",
    price: 51900,
    shipping: 0,
    inStock: true,
    shippingTime: "Next day",
    imageUrl: "https://placehold.co/400x300?text=TaylorMade+Stealth+2",
    clubId: 1
  }
];