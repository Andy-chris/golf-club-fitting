import { GolfProfile, SwingAnalysis } from "../types";

/**
 * Determines the appropriate recommendation based on user profile and swing analysis
 */
export function determineRecommendationCategory(profile: GolfProfile, analysis: SwingAnalysis): 'budget' | 'mid-range' | 'premium' {
  // This is a simplified recommendation algorithm
  // In a real app, this would be more complex based on user data
  
  // Default to mid-range
  let category: 'budget' | 'mid-range' | 'premium' = 'mid-range';
  
  // If user prioritizes value, lean toward budget
  if (profile.priority === 'value') {
    category = 'budget';
  }
  
  // If user has low handicap and high swing speed, recommend premium
  if (
    (profile.handicap === 'low' || profile.handicap === 'scratch') && 
    analysis.swingSpeed > 100
  ) {
    category = 'premium';
  }
  
  // If user is a beginner with slower swing speed, recommend budget
  if (
    (profile.handicap === 'beginner' || profile.handicap === 'high') && 
    analysis.swingSpeed < 80
  ) {
    category = 'budget';
  }
  
  return category;
}

/**
 * Formats a price from pence to pounds with commas
 */
export function formatPrice(pence: number): string {
  const pounds = pence / 100;
  return pounds.toLocaleString('en-GB', {
    style: 'currency',
    currency: 'GBP',
    minimumFractionDigits: 2
  });
}

/**
 * Calculates a rating score from 1-5 based on profile characteristics
 */
export function calculateRatingForCharacteristic(
  profile: GolfProfile, 
  characteristic: 'forgiveness' | 'distance' | 'feel'
): number {
  // This would be a more sophisticated algorithm in a real application
  // Here we're just returning appropriate values based on profile
  
  switch (characteristic) {
    case 'forgiveness':
      // Higher handicap players need more forgiveness
      if (profile.handicap === 'beginner') return 5;
      if (profile.handicap === 'high') return 4;
      if (profile.handicap === 'mid') return 3;
      return 2;
      
    case 'distance':
      // Higher swing speed players get more distance
      if (profile.swingSpeed && profile.swingSpeed > 100) return 5;
      if (profile.swingSpeed && profile.swingSpeed > 90) return 4;
      if (profile.swingSpeed && profile.swingSpeed > 80) return 3;
      return 2;
      
    case 'feel':
      // Lower handicap players value feel more
      if (profile.handicap === 'scratch') return 5;
      if (profile.handicap === 'low') return 4;
      if (profile.handicap === 'mid') return 3;
      return 2;
  }
}
