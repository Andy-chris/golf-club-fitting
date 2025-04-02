import { 
  users, 
  type User, 
  type InsertUser, 
  type ClubType, 
  type InsertClubType, 
  type GolfProfile, 
  type InsertGolfProfile, 
  type SwingAnalysis, 
  type InsertSwingAnalysis, 
  type RecommendedClub, 
  type InsertRecommendedClub, 
  type RetailerDeal, 
  type InsertRetailerDeal 
} from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Club Types
  getClubTypes(): Promise<ClubType[]>;
  getClubType(id: number): Promise<ClubType | undefined>;
  createClubType(clubType: InsertClubType): Promise<ClubType>;

  // Golf Profile
  createGolfProfile(profile: InsertGolfProfile): Promise<GolfProfile>;
  getGolfProfile(id: number): Promise<GolfProfile | undefined>;

  // Swing Analysis
  createSwingAnalysis(analysis: InsertSwingAnalysis): Promise<SwingAnalysis>;
  getSwingAnalysis(id: number): Promise<SwingAnalysis | undefined>;
  getSwingAnalysisByProfileId(profileId: number): Promise<SwingAnalysis | undefined>;

  // Recommended Clubs
  createRecommendedClub(club: InsertRecommendedClub): Promise<RecommendedClub>;
  getRecommendedClub(id: number): Promise<RecommendedClub | undefined>;
  getRecommendedClubsByProfileId(profileId: number): Promise<RecommendedClub[]>;
  getRecommendedClubsByClubTypeAndProfileId(clubTypeId: number, profileId: number): Promise<RecommendedClub[]>;

  // Retailer Deals
  createRetailerDeal(deal: InsertRetailerDeal): Promise<RetailerDeal>;
  getRetailerDealsByClubId(clubId: number): Promise<RetailerDeal[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private clubTypes: Map<number, ClubType>;
  private golfProfiles: Map<number, GolfProfile>;
  private swingAnalyses: Map<number, SwingAnalysis>;
  private recommendedClubs: Map<number, RecommendedClub>;
  private retailerDeals: Map<number, RetailerDeal>;
  currentId: number;

  constructor() {
    this.users = new Map();
    this.clubTypes = new Map();
    this.golfProfiles = new Map();
    this.swingAnalyses = new Map();
    this.recommendedClubs = new Map();
    this.retailerDeals = new Map();
    this.currentId = 1;
    this.initializeClubTypes();
  }

  private initializeClubTypes() {
    const clubTypesData: InsertClubType[] = [
      { name: "Drivers", description: "Maximum distance off the tee", iconName: "sports_golf" },
      { name: "Fairway Woods", description: "Long shots from the fairway", iconName: "sports_golf" },
      { name: "Hybrids", description: "Versatile clubs for various shots", iconName: "sports_golf" },
      { name: "Irons", description: "Precision approach shots", iconName: "sports_golf" },
      { name: "Wedges", description: "Short game and bunker shots", iconName: "sports_golf" },
      { name: "Putters", description: "Precision on the green", iconName: "sports_golf" },
    ];

    clubTypesData.forEach(clubType => this.createClubType(clubType));
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Club Type methods
  async getClubTypes(): Promise<ClubType[]> {
    return Array.from(this.clubTypes.values());
  }

  async getClubType(id: number): Promise<ClubType | undefined> {
    return this.clubTypes.get(id);
  }

  async createClubType(insertClubType: InsertClubType): Promise<ClubType> {
    const id = this.currentId++;
    const clubType: ClubType = { ...insertClubType, id };
    this.clubTypes.set(id, clubType);
    return clubType;
  }

  // Golf Profile methods
  async createGolfProfile(insertProfile: InsertGolfProfile): Promise<GolfProfile> {
    const id = this.currentId++;
    const profile: GolfProfile = { ...insertProfile, id };
    this.golfProfiles.set(id, profile);
    return profile;
  }

  async getGolfProfile(id: number): Promise<GolfProfile | undefined> {
    return this.golfProfiles.get(id);
  }

  // Swing Analysis methods
  async createSwingAnalysis(insertAnalysis: InsertSwingAnalysis): Promise<SwingAnalysis> {
    const id = this.currentId++;
    const analysis: SwingAnalysis = { ...insertAnalysis, id };
    this.swingAnalyses.set(id, analysis);
    return analysis;
  }

  async getSwingAnalysis(id: number): Promise<SwingAnalysis | undefined> {
    return this.swingAnalyses.get(id);
  }

  async getSwingAnalysisByProfileId(profileId: number): Promise<SwingAnalysis | undefined> {
    return Array.from(this.swingAnalyses.values()).find(
      (analysis) => analysis.profileId === profileId
    );
  }

  // Recommended Club methods
  async createRecommendedClub(insertClub: InsertRecommendedClub): Promise<RecommendedClub> {
    const id = this.currentId++;
    const club: RecommendedClub = { ...insertClub, id };
    this.recommendedClubs.set(id, club);
    return club;
  }

  async getRecommendedClub(id: number): Promise<RecommendedClub | undefined> {
    return this.recommendedClubs.get(id);
  }

  async getRecommendedClubsByProfileId(profileId: number): Promise<RecommendedClub[]> {
    return Array.from(this.recommendedClubs.values()).filter(
      (club) => club.profileId === profileId
    );
  }

  async getRecommendedClubsByClubTypeAndProfileId(clubTypeId: number, profileId: number): Promise<RecommendedClub[]> {
    return Array.from(this.recommendedClubs.values()).filter(
      (club) => club.clubTypeId === clubTypeId && club.profileId === profileId
    );
  }

  // Retailer Deal methods
  async createRetailerDeal(insertDeal: InsertRetailerDeal): Promise<RetailerDeal> {
    const id = this.currentId++;
    const deal: RetailerDeal = { ...insertDeal, id };
    this.retailerDeals.set(id, deal);
    return deal;
  }

  async getRetailerDealsByClubId(clubId: number): Promise<RetailerDeal[]> {
    return Array.from(this.retailerDeals.values()).filter(
      (deal) => deal.clubId === clubId
    );
  }
}

export const storage = new MemStorage();
