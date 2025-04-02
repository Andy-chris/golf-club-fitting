import { pgTable, text, serial, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Golf Profile Schema
export const golfProfiles = pgTable("golf_profiles", {
  id: serial("id").primaryKey(),
  heightFeet: integer("height_feet").notNull(),
  heightInches: integer("height_inches").notNull(),
  weight: integer("weight").notNull(),
  age: integer("age").notNull(),
  gender: text("gender").notNull(),
  handicap: text("handicap").notNull(),
  ballFlight: text("ball_flight").notNull(),
  swingSpeed: integer("swing_speed"),
  priority: text("priority").notNull(),
});

export const insertGolfProfileSchema = createInsertSchema(golfProfiles).omit({
  id: true,
});

export type InsertGolfProfile = z.infer<typeof insertGolfProfileSchema>;
export type GolfProfile = typeof golfProfiles.$inferSelect;

// Club Types
export const clubTypes = pgTable("club_types", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  iconName: text("icon_name").notNull(),
});

export const insertClubTypeSchema = createInsertSchema(clubTypes).omit({
  id: true,
});

export type InsertClubType = z.infer<typeof insertClubTypeSchema>;
export type ClubType = typeof clubTypes.$inferSelect;

// Swing Analysis
export const swingAnalyses = pgTable("swing_analyses", {
  id: serial("id").primaryKey(),
  swingSpeed: integer("swing_speed").notNull(),
  swingPath: text("swing_path").notNull(),
  clubFace: text("club_face").notNull(),
  tempo: text("tempo").notNull(),
  impactPosition: text("impact_position"),
  attackAngle: text("attack_angle"),
  backswingLength: text("backswing_length"),
  followThrough: text("follow_through"),
  balanceRating: integer("balance_rating"),
  consistency: integer("consistency"),
  powerTransfer: integer("power_transfer"),
  profileId: integer("profile_id").notNull(),
});

export const insertSwingAnalysisSchema = createInsertSchema(swingAnalyses).omit({
  id: true,
});

export type InsertSwingAnalysis = z.infer<typeof insertSwingAnalysisSchema>;
export type SwingAnalysis = typeof swingAnalyses.$inferSelect;

// Recommended Clubs
export const recommendedClubs = pgTable("recommended_clubs", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: integer("price").notNull(),
  forgiveness: integer("forgiveness").notNull(),
  distance: integer("distance").notNull(),
  feel: integer("feel").notNull(),
  priceCategory: text("price_category").notNull(),
  badgeText: text("badge_text").notNull(),
  clubTypeId: integer("club_type_id").notNull(),
  profileId: integer("profile_id").notNull(),
});

export const insertRecommendedClubSchema = createInsertSchema(recommendedClubs).omit({
  id: true,
});

export type InsertRecommendedClub = z.infer<typeof insertRecommendedClubSchema>;
export type RecommendedClub = typeof recommendedClubs.$inferSelect;

// Retailer Deals
export const retailerDeals = pgTable("retailer_deals", {
  id: serial("id").primaryKey(),
  retailerName: text("retailer_name").notNull(),
  price: integer("price").notNull(),
  shipping: integer("shipping").notNull(),
  inStock: boolean("in_stock").notNull(),
  shippingTime: text("shipping_time"),
  imageUrl: text("image_url"),
  clubId: integer("club_id").notNull(),
});

export const insertRetailerDealSchema = createInsertSchema(retailerDeals).omit({
  id: true,
});

export type InsertRetailerDeal = z.infer<typeof insertRetailerDealSchema>;
export type RetailerDeal = typeof retailerDeals.$inferSelect;
