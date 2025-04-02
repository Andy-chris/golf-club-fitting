import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { 
  insertGolfProfileSchema, 
  insertSwingAnalysisSchema, 
  insertRecommendedClubSchema, 
  insertRetailerDealSchema 
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all club types
  app.get("/api/club-types", async (req: Request, res: Response) => {
    const clubTypes = await storage.getClubTypes();
    res.json(clubTypes);
  });

  // Get a specific club type
  app.get("/api/club-types/:id", async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid club type ID" });
    }
    
    const clubType = await storage.getClubType(id);
    if (!clubType) {
      return res.status(404).json({ message: "Club type not found" });
    }
    
    res.json(clubType);
  });

  // Create a new golf profile
  app.post("/api/profiles", async (req: Request, res: Response) => {
    try {
      const profileData = insertGolfProfileSchema.parse(req.body);
      const profile = await storage.createGolfProfile(profileData);
      res.status(201).json(profile);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid profile data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create profile" });
    }
  });

  // Create a swing analysis
  app.post("/api/swing-analyses", async (req: Request, res: Response) => {
    try {
      const analysisData = insertSwingAnalysisSchema.parse(req.body);
      const analysis = await storage.createSwingAnalysis(analysisData);
      res.status(201).json(analysis);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid swing analysis data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create swing analysis" });
    }
  });

  // Get swing analysis by profile ID
  app.get("/api/profiles/:profileId/swing-analysis", async (req: Request, res: Response) => {
    const profileId = parseInt(req.params.profileId);
    if (isNaN(profileId)) {
      return res.status(400).json({ message: "Invalid profile ID" });
    }
    
    const analysis = await storage.getSwingAnalysisByProfileId(profileId);
    if (!analysis) {
      return res.status(404).json({ message: "Swing analysis not found for this profile" });
    }
    
    res.json(analysis);
  });

  // Generate club recommendations based on profile and club type
  app.post("/api/recommendations", async (req: Request, res: Response) => {
    try {
      const { profileId, clubTypeId } = req.body;
      
      if (!profileId || !clubTypeId) {
        return res.status(400).json({ message: "Profile ID and club type ID are required" });
      }

      const profile = await storage.getGolfProfile(profileId);
      if (!profile) {
        return res.status(404).json({ message: "Profile not found" });
      }

      const clubType = await storage.getClubType(clubTypeId);
      if (!clubType) {
        return res.status(404).json({ message: "Club type not found" });
      }

      const swingAnalysis = await storage.getSwingAnalysisByProfileId(profileId);
      if (!swingAnalysis) {
        return res.status(404).json({ message: "Swing analysis not found for this profile" });
      }

      // Generate recommendations based on profile and swing analysis
      const budgetClub = await generateRecommendation(profile, swingAnalysis, clubType, "budget");
      const midRangeClub = await generateRecommendation(profile, swingAnalysis, clubType, "mid-range");
      const premiumClub = await generateRecommendation(profile, swingAnalysis, clubType, "premium");

      res.json([budgetClub, midRangeClub, premiumClub]);
    } catch (error) {
      res.status(500).json({ message: "Failed to generate recommendations" });
    }
  });

  // Get recommendations by profile ID
  app.get("/api/profiles/:profileId/recommendations", async (req: Request, res: Response) => {
    const profileId = parseInt(req.params.profileId);
    if (isNaN(profileId)) {
      return res.status(400).json({ message: "Invalid profile ID" });
    }
    
    const recommendations = await storage.getRecommendedClubsByProfileId(profileId);
    res.json(recommendations);
  });

  // Get recommendations by profile ID and club type ID
  app.get("/api/profiles/:profileId/club-types/:clubTypeId/recommendations", async (req: Request, res: Response) => {
    const profileId = parseInt(req.params.profileId);
    const clubTypeId = parseInt(req.params.clubTypeId);
    
    if (isNaN(profileId) || isNaN(clubTypeId)) {
      return res.status(400).json({ message: "Invalid profile ID or club type ID" });
    }
    
    const recommendations = await storage.getRecommendedClubsByClubTypeAndProfileId(clubTypeId, profileId);
    res.json(recommendations);
  });

  // Get retailer deals for a specific club
  app.get("/api/clubs/:clubId/deals", async (req: Request, res: Response) => {
    const clubId = parseInt(req.params.clubId);
    if (isNaN(clubId)) {
      return res.status(400).json({ message: "Invalid club ID" });
    }
    
    const deals = await storage.getRetailerDealsByClubId(clubId);
    res.json(deals);
  });

  // Analyze swing and return results
  app.post("/api/analyze-swing", async (req: Request, res: Response) => {
    try {
      const { profileId, swingVideo } = req.body;
      
      if (!profileId) {
        return res.status(400).json({ message: "Profile ID is required" });
      }

      const profile = await storage.getGolfProfile(profileId);
      if (!profile) {
        return res.status(404).json({ message: "Profile not found" });
      }

      // Generate swing analysis results based on profile and simulated video analysis
      // In a real app, this would process actual video data with computer vision
      const swingSpeed = determineSwingSpeed(profile);
      const swingPath = determineSwingPath(profile);
      const clubFace = determineClubFace(profile);
      const tempo = determineTempo(profile);
      
      // Additional detailed swing metrics for more precise club fitting
      const impactPosition = determineImpactPosition(profile);
      const attackAngle = determineAttackAngle(profile, swingPath);
      const backswingLength = determineBackswingLength(profile, tempo);
      const followThrough = determineFollowThrough(profile, tempo);
      const balanceRating = determineBalanceRating(profile);
      const consistency = determineConsistency(profile);
      const powerTransfer = determinePowerTransfer(profile, swingSpeed, tempo);

      // Create comprehensive swing analysis
      const analysis = await storage.createSwingAnalysis({
        swingSpeed,
        swingPath,
        clubFace,
        tempo,
        impactPosition,
        attackAngle,
        backswingLength,
        followThrough,
        balanceRating,
        consistency,
        powerTransfer,
        profileId
      });

      res.json(analysis);
    } catch (error) {
      res.status(500).json({ message: "Failed to analyze swing" });
    }
  });
  
  const httpServer = createServer(app);
  return httpServer;
}

// Helper functions for generating recommendations and analyses
function determineSwingSpeed(profile: any): number {
  let baseSpeed = 85; // Base average swing speed
  
  // Adjust based on gender
  if (profile.gender === 'male') {
    baseSpeed += 10;
  } else if (profile.gender === 'female') {
    baseSpeed -= 10;
  }
  
  // Adjust based on age
  if (profile.age < 30) {
    baseSpeed += 5;
  } else if (profile.age > 60) {
    baseSpeed -= 10;
  }
  
  // Adjust based on handicap
  if (profile.handicap === 'scratch') {
    baseSpeed += 10;
  } else if (profile.handicap === 'low') {
    baseSpeed += 5;
  } else if (profile.handicap === 'high') {
    baseSpeed -= 5;
  } else if (profile.handicap === 'beginner') {
    baseSpeed -= 10;
  }
  
  // Add a bit of randomness
  baseSpeed += Math.floor(Math.random() * 5) - 2;
  
  return baseSpeed;
}

function determineSwingPath(profile: any): string {
  // Determine swing path based on ball flight
  switch (profile.ballFlight) {
    case 'draw': return 'in-to-out';
    case 'fade': return 'out-to-in';
    case 'hook': return 'severely in-to-out';
    case 'slice': return 'severely out-to-in';
    case 'straight': return 'neutral';
    default: return 'slightly out-to-in';
  }
}

function determineClubFace(profile: any): string {
  // Determine club face based on ball flight
  switch (profile.ballFlight) {
    case 'draw': return 'slightly closed';
    case 'fade': return 'slightly open';
    case 'hook': return 'closed';
    case 'slice': return 'open';
    case 'straight': return 'square';
    default: return 'inconsistent';
  }
}

function determineTempo(profile: any): string {
  // Improved tempo determination based on handicap and age
  if (profile.handicap === 'scratch' || profile.handicap === 'low') {
    return Math.random() > 0.7 ? 'moderate' : 'quick';
  } else if (profile.handicap === 'high') {
    return Math.random() > 0.6 ? 'moderate' : 'slow';
  } else if (profile.handicap === 'beginner') {
    return Math.random() > 0.3 ? 'inconsistent' : 'slow';
  } else if (profile.age > 60) {
    return Math.random() > 0.7 ? 'moderate' : 'slow';
  } else {
    const options = ['slow', 'moderate', 'quick'];
    return options[Math.floor(Math.random() * options.length)];
  }
}

function determineImpactPosition(profile: any): string {
  // Impact position based on player profile
  if (profile.handicap === 'scratch') {
    return 'centered';
  } else if (profile.handicap === 'low') {
    const options = ['centered', 'slightly heel-side', 'slightly toe-side'];
    return options[Math.floor(Math.random() * options.length)];
  } else if (profile.handicap === 'high') {
    const options = ['heel-side', 'toe-side', 'slightly centered'];
    return options[Math.floor(Math.random() * options.length)];
  } else if (profile.handicap === 'beginner') {
    const options = ['inconsistent', 'heel-side', 'toe-side'];
    return options[Math.floor(Math.random() * options.length)];
  } else {
    const options = ['slightly heel-side', 'slightly toe-side', 'centered'];
    return options[Math.floor(Math.random() * options.length)];
  }
}

function determineAttackAngle(profile: any, swingPath: string): string {
  // Attack angle based on swing path and player profile
  if (swingPath.includes('in-to-out')) {
    return profile.handicap === 'scratch' ? 'slightly upward' : 'upward';
  } else if (swingPath.includes('out-to-in')) {
    return profile.handicap === 'scratch' ? 'slightly downward' : 'downward';
  } else {
    if (profile.handicap === 'scratch' || profile.handicap === 'low') {
      return 'neutral';
    } else {
      const options = ['slightly downward', 'slightly upward', 'neutral'];
      return options[Math.floor(Math.random() * options.length)];
    }
  }
}

function determineBackswingLength(profile: any, tempo: string): string {
  // Backswing length based on tempo and handicap
  if (tempo === 'quick') {
    if (profile.handicap === 'scratch' || profile.handicap === 'low') {
      return 'three-quarter';
    } else {
      return 'short';
    }
  } else if (tempo === 'slow') {
    return 'full';
  } else {
    if (profile.handicap === 'scratch') {
      return 'optimal';
    } else if (profile.handicap === 'low') {
      return 'full';
    } else if (profile.handicap === 'high') {
      return Math.random() > 0.5 ? 'over-extended' : 'three-quarter';
    } else {
      return 'inconsistent';
    }
  }
}

function determineFollowThrough(profile: any, tempo: string): string {
  // Follow through based on tempo and handicap
  if (profile.handicap === 'scratch') {
    return 'full balanced';
  } else if (profile.handicap === 'low') {
    return tempo === 'quick' ? 'compact' : 'full';
  } else if (profile.handicap === 'high') {
    return tempo === 'slow' ? 'decelerated' : 'abbreviated';
  } else {
    return 'inconsistent';
  }
}

function determineBalanceRating(profile: any): number {
  // Balance rating (1-5) based on handicap
  if (profile.handicap === 'scratch') {
    return 5;
  } else if (profile.handicap === 'low') {
    return Math.random() > 0.7 ? 5 : 4;
  } else if (profile.handicap === 'high') {
    return Math.random() > 0.7 ? 3 : 2;
  } else {
    return Math.random() > 0.7 ? 2 : 1;
  }
}

function determineConsistency(profile: any): number {
  // Consistency rating (1-5) based on handicap
  if (profile.handicap === 'scratch') {
    return 5;
  } else if (profile.handicap === 'low') {
    return 4;
  } else if (profile.handicap === 'high') {
    return 3;
  } else {
    return 2;
  }
}

function determinePowerTransfer(profile: any, swingSpeed: number, tempo: string): number {
  // Power transfer rating (1-5) based on swing speed, tempo, and handicap
  let rating = 3; // Default middle rating
  
  // Adjust based on handicap
  if (profile.handicap === 'scratch') {
    rating += 2;
  } else if (profile.handicap === 'low') {
    rating += 1;
  } else if (profile.handicap === 'beginner') {
    rating -= 1;
  }
  
  // Adjust based on swing speed
  if (swingSpeed > 100) {
    rating += 1;
  } else if (swingSpeed < 75) {
    rating -= 1;
  }
  
  // Adjust based on tempo
  if (tempo === 'moderate') {
    rating += 0.5;
  } else if (tempo === 'inconsistent') {
    rating -= 1;
  }
  
  // Ensure rating is between 1-5
  return Math.max(1, Math.min(5, Math.round(rating)));
}

async function generateRecommendation(profile: any, swingAnalysis: any, clubType: any, priceCategory: string): Promise<any> {
  // Get available clubs for this club type and price category
  const clubs = getClubsForTypeAndCategory(clubType.name, priceCategory);
  
  // Scoring system to find the best fit based on profile and swing analysis
  const scoredClubs = clubs.map(club => {
    let score = 100; // Start with a perfect score and deduct points
    
    // Deduct points based on swing path match
    if (swingAnalysis.swingPath.includes('out-to-in') && !club.corrective.includes('slice')) {
      score -= 15;
    } else if (swingAnalysis.swingPath.includes('in-to-out') && !club.corrective.includes('hook')) {
      score -= 15;
    }
    
    // Deduct points based on swing speed matching
    const speedDiff = Math.abs(swingAnalysis.swingSpeed - club.idealSwingSpeed);
    score -= speedDiff * 0.5; // Deduct points proportionally to how far off ideal speed
    
    // Handicap considerations
    if (profile.handicap === 'beginner' && club.forgiveness < 4) {
      score -= 20;
    } else if (profile.handicap === 'scratch' && club.forgiveness > 3 && club.workability < 4) {
      score -= 15;
    }
    
    // Priority considerations
    if (profile.priority === 'distance' && club.distance < 4) {
      score -= 15;
    } else if (profile.priority === 'forgiveness' && club.forgiveness < 4) {
      score -= 15;
    } else if (profile.priority === 'feel' && club.feel < 4) {
      score -= 15;
    }
    
    return { ...club, score };
  });
  
  // Sort by score and take the top match
  scoredClubs.sort((a, b) => b.score - a.score);
  const bestMatch = scoredClubs[0] || getDefaultClub(clubType.name, priceCategory);
  
  // Add some randomness if there are multiple clubs with similar scores
  // This prevents always getting the same recommendations
  const topClubs = scoredClubs.filter(club => club.score > bestMatch.score - 10);
  const selectedClub = topClubs[Math.floor(Math.random() * Math.min(topClubs.length, 3))];
  
  // Customize the description based on profile and swing analysis
  let description = selectedClub.description;
  
  if (swingAnalysis.swingPath.includes('out-to-in')) {
    description += " Helps correct slice tendencies.";
  } else if (swingAnalysis.swingPath.includes('in-to-out')) {
    description += " Helps correct hook tendencies.";
  }
  
  if (swingAnalysis.swingSpeed < 70) {
    description += " Optimized for moderate swing speeds.";
  } else if (swingAnalysis.swingSpeed > 95) {
    description += " Designed for players with faster swing speeds.";
  }
  
  // Set badge text based on profile priority
  let badgeText = selectedClub.badgeText;
  if (profile.priority === 'distance') {
    badgeText = "Maximum Distance";
  } else if (profile.priority === 'forgiveness') {
    badgeText = "Most Forgiving";
  } else if (profile.priority === 'feel') {
    badgeText = "Premium Feel";
  }
  
  // Create and save the recommendation
  const recommendation = await storage.createRecommendedClub({
    name: selectedClub.name,
    description,
    price: selectedClub.price,
    forgiveness: selectedClub.forgiveness,
    distance: selectedClub.distance,
    feel: selectedClub.feel,
    priceCategory,
    badgeText,
    clubTypeId: clubType.id,
    profileId: profile.id
  });

  // Generate retailer deals for the recommended club
  await generateRetailerDeals(recommendation.id, selectedClub.price);

  return recommendation;
}

async function generateRetailerDeals(clubId: number, basePrice: number) {
  // UK golf retailers
  const retailers = [
    { name: "American Golf", priceAdjustment: 0, shipping: 0, inStock: true, image: `https://www.americangolf.co.uk/on/demandware.static/-/Sites-master-catalog/default/dwd79c3d5e/images-square/zoom/${clubId}-1.jpg` },
    { name: "Clubhouse Golf", priceAdjustment: -15, shipping: 4.99, inStock: true, image: `https://www.clubhousegolf.co.uk/acatalog/${clubId}-1.jpg` },
    { name: "Golf Online", priceAdjustment: 10, shipping: 0, inStock: true, image: `https://www.golfonline.co.uk/media/catalog/product/${clubId}.jpg` },
    { name: "Snainton Golf", priceAdjustment: -5, shipping: 3.99, inStock: false, image: `https://www.snaintongolf.co.uk/images/products/${clubId}.jpg` }
  ];

  for (const retailer of retailers) {
    // Convert to GBP (£) - roughly 0.78 of USD price
    const ukBasePrice = Math.round(basePrice * 0.78);
    const price = ukBasePrice + retailer.priceAdjustment;
    
    await storage.createRetailerDeal({
      retailerName: retailer.name,
      price,
      shipping: Math.round(retailer.shipping * 100),
      inStock: retailer.inStock,
      shippingTime: retailer.inStock ? null : "Ships in 1-2 weeks",
      clubId,
      imageUrl: retailer.image
    });
  }
}

function getBudgetClubName(clubType: string): string {
  const budgetBrands = {
    "Drivers": "Cleveland Launcher XL",
    "Fairway Woods": "Tour Edge Hot Launch E522",
    "Hybrids": "Cobra Air-X",
    "Irons": "Wilson D9",
    "Wedges": "Cleveland CBX2",
    "Putters": "Odyssey White Hot OG"
  };
  
  return budgetBrands[clubType as keyof typeof budgetBrands] || "Cleveland Launcher XL";
}

function getMidRangeClubName(clubType: string): string {
  const midRangeBrands = {
    "Drivers": "Callaway Rogue ST",
    "Fairway Woods": "Ping G425",
    "Hybrids": "Titleist TSi2",
    "Irons": "Mizuno JPX 923",
    "Wedges": "Vokey SM9",
    "Putters": "Scotty Cameron Select"
  };
  
  return midRangeBrands[clubType as keyof typeof midRangeBrands] || "Callaway Rogue ST";
}

function getPremiumClubName(clubType: string): string {
  const premiumBrands = {
    "Drivers": "TaylorMade Stealth Plus",
    "Fairway Woods": "Titleist TSi4",
    "Hybrids": "Callaway Apex Pro",
    "Irons": "Mizuno Pro 221",
    "Wedges": "Titleist Vokey SM9 Raw",
    "Putters": "Scotty Cameron Special Select"
  };
  
  return premiumBrands[clubType as keyof typeof premiumBrands] || "TaylorMade Stealth Plus";
}

function getBudgetPrice(clubType: string): number {
  const prices = {
    "Drivers": 22999,
    "Fairway Woods": 17999,
    "Hybrids": 15999,
    "Irons": 69999,
    "Wedges": 12999,
    "Putters": 19999
  };
  
  return prices[clubType as keyof typeof prices] || 22999;
}

function getMidRangePrice(clubType: string): number {
  const prices = {
    "Drivers": 39999,
    "Fairway Woods": 27999,
    "Hybrids": 24999,
    "Irons": 99999,
    "Wedges": 16999,
    "Putters": 34999
  };
  
  return prices[clubType as keyof typeof prices] || 39999;
}

function getPremiumPrice(clubType: string): number {
  const prices = {
    "Drivers": 59999,
    "Fairway Woods": 39999,
    "Hybrids": 34999,
    "Irons": 139999,
    "Wedges": 19999,
    "Putters": 44999
  };
  
  return prices[clubType as keyof typeof prices] || 59999;
}

/**
 * Returns a list of clubs for a specific club type and price category
 * Each club includes detailed characteristics for better personalization
 */
function getClubsForTypeAndCategory(clubType: string, priceCategory: string) {
  // First, get the base catalog for this club type
  const allClubs = getClubCatalog(clubType);
  
  // Filter by price category
  return allClubs.filter(club => club.priceCategory === priceCategory);
}

/**
 * Default club to use as fallback if no matches found
 */
function getDefaultClub(clubType: string, priceCategory: string) {
  // These are the original clubs used in the previous implementation
  let name, price, description, badgeText;
  
  switch (priceCategory) {
    case 'budget':
      name = getBudgetClubName(clubType);
      price = getBudgetPrice(clubType);
      description = "Perfect for mid-handicappers seeking value with great forgiveness and decent distance.";
      badgeText = "Best Value";
      break;
    case 'mid-range':
      name = getMidRangeClubName(clubType);
      price = getMidRangePrice(clubType);
      description = "Exceptional balance of distance, forgiveness and feel for your swing characteristics.";
      badgeText = "Recommended";
      break;
    case 'premium':
      name = getPremiumClubName(clubType);
      price = getPremiumPrice(clubType);
      description = "Tour-level performance with cutting-edge technology for maximum distance and workability.";
      badgeText = "Top Performance";
      break;
    default:
      name = getMidRangeClubName(clubType);
      price = getMidRangePrice(clubType);
      description = "All-around performance for most golfers.";
      badgeText = "Versatile";
  }
  
  return {
    name,
    price,
    description,
    badgeText,
    forgiveness: 4,
    distance: 4,
    feel: 4,
    workability: 3,
    idealSwingSpeed: 85,
    corrective: "balanced",
    priceCategory
  };
}

/**
 * Returns a comprehensive catalog of golf clubs for each club type
 * This large database provides many options for personalized recommendations
 */
function getClubCatalog(clubType: string) {
  switch(clubType) {
    case "Drivers":
      return [
        // Budget Drivers
        {
          name: "Cleveland Launcher XL",
          price: 22999,
          description: "Forgiving design with draw bias for more accurate drives.",
          badgeText: "Best Value",
          forgiveness: 5,
          distance: 3,
          feel: 3,
          workability: 2,
          idealSwingSpeed: 80,
          corrective: "slice",
          priceCategory: "budget"
        },
        {
          name: "Cobra Air-X Driver",
          price: 24999,
          description: "Ultralight design helps increase swing speed and distance.",
          badgeText: "Easy Launch",
          forgiveness: 4,
          distance: 4,
          feel: 3,
          workability: 2,
          idealSwingSpeed: 75,
          corrective: "slice",
          priceCategory: "budget"
        },
        {
          name: "Wilson D9 Driver",
          price: 23999,
          description: "Peak kinetic response club face for maximum ball speed.",
          badgeText: "Consistent",
          forgiveness: 4,
          distance: 4,
          feel: 3,
          workability: 2,
          idealSwingSpeed: 85,
          corrective: "balanced",
          priceCategory: "budget"
        },
        {
          name: "Tour Edge Hot Launch C522",
          price: 21999,
          description: "Offset design helps eliminate slices and promotes draw bias.",
          badgeText: "Anti-Slice",
          forgiveness: 5,
          distance: 3,
          feel: 2,
          workability: 2,
          idealSwingSpeed: 75,
          corrective: "slice",
          priceCategory: "budget"
        },
        {
          name: "Tommy Armour Atomic Driver",
          price: 19999,
          description: "Advanced aerodynamics for higher swing speeds and better distance.",
          badgeText: "Distance Boost",
          forgiveness: 3,
          distance: 4,
          feel: 3,
          workability: 3,
          idealSwingSpeed: 90,
          corrective: "balanced",
          priceCategory: "budget"
        },
        
        // Mid-Range Drivers
        {
          name: "Callaway Rogue ST",
          price: 39999,
          description: "AI-designed face for maximum ball speed across the entire face.",
          badgeText: "Recommended",
          forgiveness: 4,
          distance: 5,
          feel: 4,
          workability: 3,
          idealSwingSpeed: 90,
          corrective: "balanced",
          priceCategory: "mid-range"
        },
        {
          name: "TaylorMade SIM2 Max",
          price: 41999,
          description: "Speed Injected twist face provides forgiveness with speed.",
          badgeText: "Top Performer",
          forgiveness: 5,
          distance: 4,
          feel: 4,
          workability: 3,
          idealSwingSpeed: 85,
          corrective: "slice",
          priceCategory: "mid-range"
        },
        {
          name: "Ping G425 Max",
          price: 38999,
          description: "Highest MOI driver with adjustable weighting for shot shaping.",
          badgeText: "Most Forgiving",
          forgiveness: 5,
          distance: 4,
          feel: 3,
          workability: 3,
          idealSwingSpeed: 80,
          corrective: "balanced",
          priceCategory: "mid-range"
        },
        {
          name: "Titleist TSi2",
          price: 42999,
          description: "ATI 425 face material for enhanced ball speed and stability.",
          badgeText: "Premium Feel",
          forgiveness: 4,
          distance: 4,
          feel: 5,
          workability: 3,
          idealSwingSpeed: 88,
          corrective: "balanced",
          priceCategory: "mid-range"
        },
        {
          name: "Mizuno ST-Z 220",
          price: 39999,
          description: "Balanced design with low spin for optimal distance.",
          badgeText: "Low Spin Distance",
          forgiveness: 3,
          distance: 5,
          feel: 5,
          workability: 4,
          idealSwingSpeed: 95,
          corrective: "balanced",
          priceCategory: "mid-range"
        },
        {
          name: "Cobra LTDx Max",
          price: 37999,
          description: "Draw-biased head with adjustable weighting for customized trajectory.",
          badgeText: "Shot Correction",
          forgiveness: 4,
          distance: 4,
          feel: 3,
          workability: 3,
          idealSwingSpeed: 85,
          corrective: "slice",
          priceCategory: "mid-range"
        },
        
        // Premium Drivers
        {
          name: "TaylorMade Stealth Plus",
          price: 59999,
          description: "Carbon fiber face delivers unprecedented distance and forgiveness.",
          badgeText: "Top Performance",
          forgiveness: 4,
          distance: 5,
          feel: 5,
          workability: 4,
          idealSwingSpeed: 95,
          corrective: "balanced",
          priceCategory: "premium"
        },
        {
          name: "Callaway Paradym Triple Diamond",
          price: 59999,
          description: "Tour-proven design with adjustable perimeter weighting for shot shaping.",
          badgeText: "Tour Proven",
          forgiveness: 3,
          distance: 5,
          feel: 5,
          workability: 5,
          idealSwingSpeed: 100,
          corrective: "hook",
          priceCategory: "premium"
        },
        {
          name: "Titleist TSi4",
          price: 57999,
          description: "Low spin design for tour-level players seeking workability.",
          badgeText: "Workability King",
          forgiveness: 3,
          distance: 5,
          feel: 5,
          workability: 5,
          idealSwingSpeed: 100,
          corrective: "hook",
          priceCategory: "premium"
        },
        {
          name: "Ping G425 LST",
          price: 55999,
          description: "Low spin technology for faster swingers seeking distance.",
          badgeText: "Low Spin Tech",
          forgiveness: 3,
          distance: 5,
          feel: 4,
          workability: 4,
          idealSwingSpeed: 95,
          corrective: "balanced",
          priceCategory: "premium"
        },
        {
          name: "Mizuno Pro 223",
          price: 58999,
          description: "Compact profile with exceptional feel and tour-level performance.",
          badgeText: "Pure Feel",
          forgiveness: 2,
          distance: 4,
          feel: 5,
          workability: 5,
          idealSwingSpeed: 105,
          corrective: "hook",
          priceCategory: "premium"
        },
        {
          name: "Srixon ZX7 MkII",
          price: 56999,
          description: "Tour-inspired shape with adjustable sole weights for trajectory control.",
          badgeText: "Tour Inspired",
          forgiveness: 3,
          distance: 4,
          feel: 5,
          workability: 5,
          idealSwingSpeed: 100,
          corrective: "balanced",
          priceCategory: "premium"
        }
      ];
      
    case "Fairway Woods":
      return [
        // Budget Fairway Woods
        {
          name: "Tour Edge Hot Launch E522",
          price: 17999,
          description: "High-launching design with shallow face for easy playability.",
          badgeText: "Best Value",
          forgiveness: 5,
          distance: 3,
          feel: 3,
          workability: 2,
          idealSwingSpeed: 75,
          corrective: "slice",
          priceCategory: "budget"
        },
        {
          name: "Wilson D9 Fairway",
          price: 16999,
          description: "Progressive face height for optimal launch from any lie.",
          badgeText: "Versatile",
          forgiveness: 4,
          distance: 4,
          feel: 3,
          workability: 2,
          idealSwingSpeed: 80,
          corrective: "balanced",
          priceCategory: "budget"
        },
        {
          name: "Cobra Air-X Fairway",
          price: 18999,
          description: "Ultralight design helps increase swing speed for higher launch.",
          badgeText: "Easy Launch",
          forgiveness: 5,
          distance: 3,
          feel: 3,
          workability: 2,
          idealSwingSpeed: 70,
          corrective: "slice",
          priceCategory: "budget"
        },
        {
          name: "Cleveland Launcher XL Halo",
          price: 17499,
          description: "Gliderail technology offers exceptional performance from all lies.",
          badgeText: "All-Terrain",
          forgiveness: 5,
          distance: 3,
          feel: 3,
          workability: 2,
          idealSwingSpeed: 75,
          corrective: "slice",
          priceCategory: "budget"
        },
        {
          name: "Tommy Armour Atomic Fairway",
          price: 15999,
          description: "Lightweight construction promotes higher swing speeds.",
          badgeText: "Distance Boost",
          forgiveness: 4,
          distance: 4,
          feel: 3,
          workability: 2,
          idealSwingSpeed: 85,
          corrective: "balanced",
          priceCategory: "budget"
        },
        
        // Mid-Range Fairway Woods
        {
          name: "Ping G425",
          price: 27999,
          description: "Spinsistency technology for predictable distance with stopping power.",
          badgeText: "Recommended",
          forgiveness: 5,
          distance: 4,
          feel: 4,
          workability: 3,
          idealSwingSpeed: 85,
          corrective: "balanced",
          priceCategory: "mid-range"
        },
        {
          name: "TaylorMade Stealth",
          price: 29999,
          description: "3D carbon crown design shifts weight low for optimal launch.",
          badgeText: "Distance King",
          forgiveness: 4,
          distance: 5,
          feel: 4,
          workability: 3,
          idealSwingSpeed: 90,
          corrective: "balanced",
          priceCategory: "mid-range"
        },
        {
          name: "Callaway Rogue ST Max",
          price: 28999,
          description: "AI-designed face optimized for forgiveness and ball speed.",
          badgeText: "Smart Design",
          forgiveness: 5,
          distance: 4,
          feel: 4,
          workability: 3,
          idealSwingSpeed: 85,
          corrective: "slice",
          priceCategory: "mid-range"
        },
        {
          name: "Titleist TSi2",
          price: 29999,
          description: "Active Recoil Channel creates lower spin for more distance.",
          badgeText: "Premium Feel",
          forgiveness: 4,
          distance: 4,
          feel: 5,
          workability: 3,
          idealSwingSpeed: 88,
          corrective: "balanced",
          priceCategory: "mid-range"
        },
        {
          name: "Cobra LTDx LS",
          price: 26999,
          description: "PWR-COR technology positions weight low and forward for reduced spin.",
          badgeText: "Low Spin",
          forgiveness: 3,
          distance: 5,
          feel: 4,
          workability: 4,
          idealSwingSpeed: 95,
          corrective: "hook",
          priceCategory: "mid-range"
        },
        
        // Premium Fairway Woods
        {
          name: "Titleist TSi4",
          price: 39999,
          description: "Compact tour-preferred profile with incredible workability.",
          badgeText: "Top Performance",
          forgiveness: 3,
          distance: 4,
          feel: 5,
          workability: 5,
          idealSwingSpeed: 100,
          corrective: "hook",
          priceCategory: "premium"
        },
        {
          name: "TaylorMade Stealth Plus",
          price: 37999,
          description: "Adjustable weight track for precise shot shape control.",
          badgeText: "Tour Choice",
          forgiveness: 3,
          distance: 5,
          feel: 5,
          workability: 5,
          idealSwingSpeed: 95,
          corrective: "balanced",
          priceCategory: "premium"
        },
        {
          name: "Callaway Paradym Triple Diamond",
          price: 38999,
          description: "Tour proven design with adjustable hostel for precise trajectory control.",
          badgeText: "Pro Level",
          forgiveness: 2,
          distance: 5,
          feel: 5,
          workability: 5,
          idealSwingSpeed: 100,
          corrective: "hook",
          priceCategory: "premium"
        },
        {
          name: "Ping G425 LST",
          price: 36999,
          description: "Low spin technology for faster swingers seeking distance.",
          badgeText: "Low Spin Tech",
          forgiveness: 3,
          distance: 5,
          feel: 4,
          workability: 4,
          idealSwingSpeed: 95,
          corrective: "balanced",
          priceCategory: "premium"
        },
        {
          name: "Mizuno ST-Z 220",
          price: 38999,
          description: "WAVE Technology delivers powerful ball flights with exceptional feel.",
          badgeText: "Pure Feel",
          forgiveness: 3,
          distance: 4,
          feel: 5,
          workability: 5,
          idealSwingSpeed: 95,
          corrective: "balanced",
          priceCategory: "premium"
        }
      ];
      
    case "Hybrids":
      return [
        // Budget Hybrids
        {
          name: "Cobra Air-X",
          price: 15999,
          description: "Lightweight, high-launching design ideal for slower swing speeds.",
          badgeText: "Best Value",
          forgiveness: 5,
          distance: 3,
          feel: 3,
          workability: 2,
          idealSwingSpeed: 70,
          corrective: "slice",
          priceCategory: "budget"
        },
        {
          name: "Cleveland Launcher XL Halo",
          price: 16999,
          description: "Three rails on the sole help maintain club speed through any lie.",
          badgeText: "Rescue Club",
          forgiveness: 5,
          distance: 3,
          feel: 3,
          workability: 2,
          idealSwingSpeed: 75,
          corrective: "slice",
          priceCategory: "budget"
        },
        {
          name: "Wilson D9",
          price: 15499,
          description: "Progressive head design for optimal trajectory and distance.",
          badgeText: "Easy Launch",
          forgiveness: 4,
          distance: 4,
          feel: 3,
          workability: 2,
          idealSwingSpeed: 80,
          corrective: "balanced",
          priceCategory: "budget"
        },
        {
          name: "Tour Edge Hot Launch E522",
          price: 14999,
          description: "Offset design helps square the face for straighter shots.",
          badgeText: "Anti-Slice",
          forgiveness: 5,
          distance: 3,
          feel: 2,
          workability: 2,
          idealSwingSpeed: 70,
          corrective: "slice",
          priceCategory: "budget"
        },
        {
          name: "Tommy Armour Atomic",
          price: 13999,
          description: "Generous sole width for easy launch from any lie.",
          badgeText: "Confidence Builder",
          forgiveness: 5,
          distance: 3,
          feel: 2,
          workability: 1,
          idealSwingSpeed: 75,
          corrective: "slice",
          priceCategory: "budget"
        },
        
        // Mid-Range Hybrids
        {
          name: "Titleist TSi2",
          price: 24999,
          description: "High MOI design provides stability and consistent distance.",
          badgeText: "Recommended",
          forgiveness: 4,
          distance: 4,
          feel: 5,
          workability: 3,
          idealSwingSpeed: 85,
          corrective: "balanced",
          priceCategory: "mid-range"
        },
        {
          name: "TaylorMade Stealth",
          price: 25999,
          description: "V Steel sole design improves turf interaction from any lie.",
          badgeText: "Versatile",
          forgiveness: 4,
          distance: 5,
          feel: 4,
          workability: 3,
          idealSwingSpeed: 90,
          corrective: "balanced",
          priceCategory: "mid-range"
        },
        {
          name: "Callaway Rogue ST Max OS",
          price: 24999,
          description: "Oversized head with internal jailbreak technology for stability.",
          badgeText: "Maximum Forgiveness",
          forgiveness: 5,
          distance: 4,
          feel: 3,
          workability: 2,
          idealSwingSpeed: 80,
          corrective: "slice",
          priceCategory: "mid-range"
        },
        {
          name: "Ping G425",
          price: 23999,
          description: "Facewrap design maximizes flex for higher ball speeds.",
          badgeText: "Consistent",
          forgiveness: 5,
          distance: 4,
          feel: 4,
          workability: 3,
          idealSwingSpeed: 85,
          corrective: "balanced",
          priceCategory: "mid-range"
        },
        {
          name: "Cobra LTDx",
          price: 22999,
          description: "Hollow split rails improve turf interaction and launch.",
          badgeText: "Turf Friendly",
          forgiveness: 4,
          distance: 4,
          feel: 4,
          workability: 3,
          idealSwingSpeed: 85,
          corrective: "balanced",
          priceCategory: "mid-range"
        },
        
        // Premium Hybrids
        {
          name: "Callaway Apex Pro",
          price: 34999,
          description: "Compact shape preferred by better players for shot shaping.",
          badgeText: "Top Performance",
          forgiveness: 3,
          distance: 4,
          feel: 5,
          workability: 5,
          idealSwingSpeed: 95,
          corrective: "hook",
          priceCategory: "premium"
        },
        {
          name: "TaylorMade Stealth Plus",
          price: 33999,
          description: "Compact tour-inspired profile with adjustable loft sleeve.",
          badgeText: "Tour Proven",
          forgiveness: 3,
          distance: 5,
          feel: 5,
          workability: 5,
          idealSwingSpeed: 95,
          corrective: "balanced",
          priceCategory: "premium"
        },
        {
          name: "Titleist TSi3",
          price: 32999,
          description: "SureFit CG track allows precise center of gravity adjustment.",
          badgeText: "Fully Adjustable",
          forgiveness: 3,
          distance: 4,
          feel: 5,
          workability: 5,
          idealSwingSpeed: 90,
          corrective: "balanced",
          priceCategory: "premium"
        },
        {
          name: "Mizuno CLK",
          price: 31999,
          description: "Quick Switch adjustability and high-energy face for distance.",
          badgeText: "Pure Feel",
          forgiveness: 3,
          distance: 4,
          feel: 5,
          workability: 4,
          idealSwingSpeed: 90,
          corrective: "balanced",
          priceCategory: "premium"
        },
        {
          name: "Srixon ZX",
          price: 30999,
          description: "Rebound Frame alternates rigid and flexible zones for more energy.",
          badgeText: "Distance Plus",
          forgiveness: 3,
          distance: 5,
          feel: 4,
          workability: 4,
          idealSwingSpeed: 95,
          corrective: "balanced",
          priceCategory: "premium"
        }
      ];
      
    case "Irons":
      return [
        // Budget Irons
        {
          name: "Wilson D9",
          price: 69999,
          description: "Power holes maximize face flex for more distance and forgiveness.",
          badgeText: "Best Value",
          forgiveness: 5,
          distance: 4,
          feel: 3,
          workability: 2,
          idealSwingSpeed: 80,
          corrective: "balanced",
          priceCategory: "budget"
        },
        {
          name: "Cobra Air-X",
          price: 68999,
          description: "Lightweight design with deep cavity back for high launch.",
          badgeText: "Easy Launch",
          forgiveness: 5,
          distance: 3,
          feel: 3,
          workability: 2,
          idealSwingSpeed: 75,
          corrective: "slice",
          priceCategory: "budget"
        },
        {
          name: "Cleveland Launcher XL",
          price: 67999,
          description: "MainFrame face technology enhances forgiveness on off-center hits.",
          badgeText: "Game Improvement",
          forgiveness: 5,
          distance: 4,
          feel: 3,
          workability: 2,
          idealSwingSpeed: 80,
          corrective: "slice",
          priceCategory: "budget"
        },
        {
          name: "Tour Edge Hot Launch E522",
          price: 64999,
          description: "Hollow-body construction delivers effortless distance and launch.",
          badgeText: "Super Game Improvement",
          forgiveness: 5,
          distance: 3,
          feel: 2,
          workability: 1,
          idealSwingSpeed: 70,
          corrective: "slice",
          priceCategory: "budget"
        },
        {
          name: "Tommy Armour TA1",
          price: 59999,
          description: "Undercut cavity design for improved perimeter weighting and forgiveness.",
          badgeText: "Easy To Hit",
          forgiveness: 5,
          distance: 3,
          feel: 2,
          workability: 2,
          idealSwingSpeed: 75,
          corrective: "slice",
          priceCategory: "budget"
        },
        
        // Mid-Range Irons
        {
          name: "Mizuno JPX 923",
          price: 99999,
          description: "Chromoly construction delivers exceptional feel with game improvement forgiveness.",
          badgeText: "Recommended",
          forgiveness: 4,
          distance: 4,
          feel: 5,
          workability: 3,
          idealSwingSpeed: 85,
          corrective: "balanced",
          priceCategory: "mid-range"
        },
        {
          name: "Callaway Rogue ST Max OS",
          price: 94999,
          description: "AI-designed face pattern optimizes spin and launch across the face.",
          badgeText: "High Launch",
          forgiveness: 5,
          distance: 5,
          feel: 3,
          workability: 2,
          idealSwingSpeed: 80,
          corrective: "slice",
          priceCategory: "mid-range"
        },
        {
          name: "TaylorMade Stealth",
          price: 97999,
          description: "Cap Back Design with toe wrap construction for distance and stability.",
          badgeText: "Distance King",
          forgiveness: 4,
          distance: 5,
          feel: 3,
          workability: 3,
          idealSwingSpeed: 85,
          corrective: "balanced",
          priceCategory: "mid-range"
        },
        {
          name: "Ping G425",
          price: 92999,
          description: "Precision-milled face delivers consistent distance with forgiveness.",
          badgeText: "Reliable Performance",
          forgiveness: 5,
          distance: 4,
          feel: 4,
          workability: 3,
          idealSwingSpeed: 85,
          corrective: "balanced",
          priceCategory: "mid-range"
        },
        {
          name: "Titleist T300",
          price: 98999,
          description: "Max impact technology enhances distance with great feel.",
          badgeText: "Premium Feel",
          forgiveness: 4,
          distance: 4,
          feel: 5,
          workability: 3,
          idealSwingSpeed: 85,
          corrective: "balanced",
          priceCategory: "mid-range"
        },
        
        // Premium Irons
        {
          name: "Mizuno Pro 221",
          price: 139999,
          description: "Grain flow forged from select 1025E mild carbon steel for iconic feel.",
          badgeText: "Top Performance",
          forgiveness: 2,
          distance: 3,
          feel: 5,
          workability: 5,
          idealSwingSpeed: 100,
          corrective: "hook",
          priceCategory: "premium"
        },
        {
          name: "Titleist 620 MB",
          price: 134999,
          description: "Classic muscle back design for the purest ball striking experience.",
          badgeText: "Tour Quality",
          forgiveness: 1,
          distance: 3,
          feel: 5,
          workability: 5,
          idealSwingSpeed: 105,
          corrective: "hook",
          priceCategory: "premium"
        },
        {
          name: "TaylorMade P7MC",
          price: 137999,
          description: "Compact player's shape with precise CG placement for shot making.",
          badgeText: "Players Choice",
          forgiveness: 2,
          distance: 3,
          feel: 5,
          workability: 5,
          idealSwingSpeed: 100,
          corrective: "hook",
          priceCategory: "premium"
        },
        {
          name: "Callaway Apex MB",
          price: 133999,
          description: "Tour-proven design with 20V grooves for spin control and precision.",
          badgeText: "Precision Master",
          forgiveness: 1,
          distance: 3,
          feel: 5,
          workability: 5,
          idealSwingSpeed: 105,
          corrective: "hook",
          priceCategory: "premium"
        },
        {
          name: "Srixon ZX7",
          price: 129999,
          description: "Tour cavity design offers workability with a touch of forgiveness.",
          badgeText: "Tour Inspired",
          forgiveness: 3,
          distance: 3,
          feel: 5,
          workability: 4,
          idealSwingSpeed: 95,
          corrective: "balanced",
          priceCategory: "premium"
        }
      ];
      
    case "Wedges":
      return [
        // Budget Wedges
        {
          name: "Cleveland CBX2",
          price: 12999,
          description: "Cavity back design offers forgiveness with tour-level spin.",
          badgeText: "Best Value",
          forgiveness: 4,
          distance: 3,
          feel: 4,
          workability: 3,
          idealSwingSpeed: 80,
          corrective: "balanced",
          priceCategory: "budget"
        },
        {
          name: "Wilson Harmonized",
          price: 9999,
          description: "Classic blade shape with high polish finish and sole grind options.",
          badgeText: "Affordable Classic",
          forgiveness: 3,
          distance: 3,
          feel: 3,
          workability: 3,
          idealSwingSpeed: 85,
          corrective: "balanced",
          priceCategory: "budget"
        },
        {
          name: "Cobra King Snakebite",
          price: 11999,
          description: "Snakebite groove technology maximizes spin from any lie.",
          badgeText: "Spin Master",
          forgiveness: 3,
          distance: 3,
          feel: 3,
          workability: 3,
          idealSwingSpeed: 85,
          corrective: "balanced",
          priceCategory: "budget"
        },
        {
          name: "Tour Edge Hot Launch C522",
          price: 10999,
          description: "Wide sole design glides through sand and rough with ease.",
          badgeText: "Easy Escape",
          forgiveness: 4,
          distance: 3,
          feel: 3,
          workability: 2,
          idealSwingSpeed: 80,
          corrective: "balanced",
          priceCategory: "budget"
        },
        {
          name: "Tommy Armour TB1",
          price: 8999,
          description: "CNC milled face pattern increases spin and control around greens.",
          badgeText: "Budget Friendly",
          forgiveness: 3,
          distance: 3,
          feel: 3,
          workability: 3,
          idealSwingSpeed: 85,
          corrective: "balanced",
          priceCategory: "budget"
        },
        
        // Mid-Range Wedges
        {
          name: "Vokey SM9",
          price: 16999,
          description: "Progressive center of gravity design for precise distance control.",
          badgeText: "Recommended",
          forgiveness: 3,
          distance: 4,
          feel: 5,
          workability: 5,
          idealSwingSpeed: 90,
          corrective: "balanced",
          priceCategory: "mid-range"
        },
        {
          name: "Cleveland RTX ZipCore",
          price: 15999,
          description: "UltiZip grooves with low-density core for enhanced spin and control.",
          badgeText: "Spin Control",
          forgiveness: 3,
          distance: 3,
          feel: 4,
          workability: 4,
          idealSwingSpeed: 90,
          corrective: "balanced",
          priceCategory: "mid-range"
        },
        {
          name: "Callaway Jaws Full Toe",
          price: 16499,
          description: "Full face grooves provide maximum spin even on open-face shots.",
          badgeText: "Versatile",
          forgiveness: 3,
          distance: 3,
          feel: 4,
          workability: 5,
          idealSwingSpeed: 85,
          corrective: "balanced",
          priceCategory: "mid-range"
        },
        {
          name: "TaylorMade MG3",
          price: 16999,
          description: "Raised micro-ribs between grooves for increased spin and precision.",
          badgeText: "Precision Plus",
          forgiveness: 3,
          distance: 3,
          feel: 5,
          workability: 5,
          idealSwingSpeed: 90,
          corrective: "balanced",
          priceCategory: "mid-range"
        },
        {
          name: "Ping Glide 4.0",
          price: 15499,
          description: "Precision-milled face with Emery blast finish for consistent spin.",
          badgeText: "All-Weather",
          forgiveness: 4,
          distance: 3,
          feel: 4,
          workability: 4,
          idealSwingSpeed: 85,
          corrective: "balanced",
          priceCategory: "mid-range"
        },
        
        // Premium Wedges
        {
          name: "Titleist Vokey SM9 Raw",
          price: 19999,
          description: "Tour-preferred raw finish with hand ground sole customization.",
          badgeText: "Top Performance",
          forgiveness: 2,
          distance: 3,
          feel: 5,
          workability: 5,
          idealSwingSpeed: 95,
          corrective: "balanced",
          priceCategory: "premium"
        },
        {
          name: "TaylorMade MG3 Tiger Woods Grind",
          price: 19499,
          description: "Specialized sole grind based on Tiger's personal specifications.",
          badgeText: "Tour Spec",
          forgiveness: 2,
          distance: 3,
          feel: 5,
          workability: 5,
          idealSwingSpeed: 100,
          corrective: "hook",
          priceCategory: "premium"
        },
        {
          name: "Mizuno T22 Copper",
          price: 18999,
          description: "Grain flow forged from 1025E carbon steel with copper finish for feel.",
          badgeText: "Pure Feel",
          forgiveness: 2,
          distance: 3,
          feel: 5,
          workability: 5,
          idealSwingSpeed: 95,
          corrective: "balanced",
          priceCategory: "premium"
        },
        {
          name: "Callaway Jaws Raw",
          price: 18499,
          description: "Unplated raw face rusts over time for increased spin and control.",
          badgeText: "Aggressive Spin",
          forgiveness: 2,
          distance: 3,
          feel: 5,
          workability: 5,
          idealSwingSpeed: 90,
          corrective: "balanced",
          priceCategory: "premium"
        },
        {
          name: "Cobra King Forged TEC",
          price: 17999,
          description: "Tungsten weights with fully CNC milled face for precision performance.",
          badgeText: "Tech Forward",
          forgiveness: 3,
          distance: 3,
          feel: 4,
          workability: 5,
          idealSwingSpeed: 90,
          corrective: "balanced",
          priceCategory: "premium"
        }
      ];
      
    case "Putters":
      return [
        // Budget Putters
        {
          name: "Odyssey White Hot OG",
          price: 19999,
          description: "Classic White Hot insert returns with modern milling techniques.",
          badgeText: "Best Value",
          forgiveness: 4,
          distance: null,
          feel: 4,
          workability: null,
          idealSwingSpeed: null,
          corrective: "balanced",
          priceCategory: "budget"
        },
        {
          name: "Cleveland Huntington Beach",
          price: 15999,
          description: "Precision milled face with deep diamond CNC pattern for soft feel.",
          badgeText: "Precise Roll",
          forgiveness: 3,
          distance: null,
          feel: 4,
          workability: null,
          idealSwingSpeed: null,
          corrective: "balanced",
          priceCategory: "budget"
        },
        {
          name: "Wilson Staff Infinite",
          price: 12999,
          description: "Counterbalanced grip helps stabilize the stroke for better consistency.",
          badgeText: "Stable Stroke",
          forgiveness: 4,
          distance: null,
          feel: 3,
          workability: null,
          idealSwingSpeed: null,
          corrective: "balanced",
          priceCategory: "budget"
        },
        {
          name: "Tommy Armour Impact No. 3",
          price: 14999,
          description: "High MOI mallet design with alignment aids for easier aiming.",
          badgeText: "Easy Alignment",
          forgiveness: 5,
          distance: null,
          feel: 3,
          workability: null,
          idealSwingSpeed: null,
          corrective: "balanced",
          priceCategory: "budget"
        },
        {
          name: "Pinemeadow PGX",
          price: 9999,
          description: "Contrasting color scheme helps with alignment at address.",
          badgeText: "High Contrast",
          forgiveness: 4,
          distance: null,
          feel: 3,
          workability: null,
          idealSwingSpeed: null,
          corrective: "balanced",
          priceCategory: "budget"
        },
        
        // Mid-Range Putters
        {
          name: "Scotty Cameron Select",
          price: 34999,
          description: "Precision milled from 303 stainless steel with vibration dampening.",
          badgeText: "Recommended",
          forgiveness: 3,
          distance: null,
          feel: 5,
          workability: null,
          idealSwingSpeed: null,
          corrective: "balanced",
          priceCategory: "mid-range"
        },
        {
          name: "TaylorMade Spider GT",
          price: 29999,
          description: "Multi-material construction with tungsten weighting for stability.",
          badgeText: "Maximum Stability",
          forgiveness: 5,
          distance: null,
          feel: 4,
          workability: null,
          idealSwingSpeed: null,
          corrective: "balanced",
          priceCategory: "mid-range"
        },
        {
          name: "Odyssey Toulon",
          price: 32999,
          description: "Deep diamond milled face creates a soft but responsive feel.",
          badgeText: "Premium Roll",
          forgiveness: 4,
          distance: null,
          feel: 5,
          workability: null,
          idealSwingSpeed: null,
          corrective: "balanced",
          priceCategory: "mid-range"
        },
        {
          name: "Ping Sigma 2",
          price: 27999,
          description: "Dual-durometer PEBAX face insert provides optimal feel and distance control.",
          badgeText: "Precise Control",
          forgiveness: 4,
          distance: null,
          feel: 4,
          workability: null,
          idealSwingSpeed: null,
          corrective: "balanced",
          priceCategory: "mid-range"
        },
        {
          name: "Bettinardi Studio Stock",
          price: 33999,
          description: "Milled from a single block of high-quality steel for ultimate precision.",
          badgeText: "Tour Quality",
          forgiveness: 3,
          distance: null,
          feel: 5,
          workability: null,
          idealSwingSpeed: null,
          corrective: "balanced",
          priceCategory: "mid-range"
        },
        
        // Premium Putters
        {
          name: "Scotty Cameron Special Select",
          price: 44999,
          description: "Tour-inspired designs with premium materials and craftsmanship.",
          badgeText: "Top Performance",
          forgiveness: 3,
          distance: null,
          feel: 5,
          workability: null,
          idealSwingSpeed: null,
          corrective: "balanced",
          priceCategory: "premium"
        },
        {
          name: "Odyssey Tri-Hot 5K",
          price: 39999,
          description: "Tungsten front weighting for unprecedented forgiveness in a blade.",
          badgeText: "High Tech",
          forgiveness: 4,
          distance: null,
          feel: 5,
          workability: null,
          idealSwingSpeed: null,
          corrective: "balanced",
          priceCategory: "premium"
        },
        {
          name: "Evnroll ER11V",
          price: 42999,
          description: "Sweet face technology ensures consistent roll speed across the face.",
          badgeText: "Sweet Face Tech",
          forgiveness: 5,
          distance: null,
          feel: 5,
          workability: null,
          idealSwingSpeed: null,
          corrective: "balanced",
          priceCategory: "premium"
        },
        {
          name: "Bettinardi Queen B",
          price: 41999,
          description: "Hand-polished platinum finish with intricate honeycomb face milling.",
          badgeText: "Luxury Feel",
          forgiveness: 3,
          distance: null,
          feel: 5,
          workability: null,
          idealSwingSpeed: null,
          corrective: "balanced",
          priceCategory: "premium"
        },
        {
          name: "L.A.B. Golf DF 2.1",
          price: 43999,
          description: "Lie Angle Balanced design eliminates torque during the stroke.",
          badgeText: "Revolutionary",
          forgiveness: 4,
          distance: null,
          feel: 5,
          workability: null,
          idealSwingSpeed: null,
          corrective: "balanced",
          priceCategory: "premium"
        }
      ];
      
    default:
      return [];
  }
}
