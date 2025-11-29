export interface Option {
  label: string;
  value: string;
  icon?: React.ComponentType<{ className?: string }>;
  withCount?: boolean;
}

export type UserRole = 'user' | 'admin';

export interface Profile {
  id: string;
  username: string;
  role: UserRole;
  created_at: string;
}

export interface PublicProfile {
  id: string;
  username: string;
  created_at: string;
}

export interface AuthUser {
  id: string;
  email: string;
  profile?: Profile;
}

// Budget types
export interface BudgetEstimateInput {
  days: number;
  travelers: number;
  transportation: 'public' | 'personal' | 'flight';
  accommodation: 'hostel' | 'hotel' | 'luxury';
  distance?: number;
}

export interface BudgetEstimateResult {
  totalBudget: number;
  breakdown: {
    transportation: number;
    accommodation: number;
    food: number;
    activities: number;
    miscellaneous: number;
  };
  details: string;
}

// Trip types
export interface TripPlanInput {
  budget: number;
  travelers: number;
  travelStyle: 'relaxing' | 'adventurous';
  duration: number;
}

export interface DayItinerary {
  day: number;
  date?: string;
  activities: {
    time: string;
    activity: string;
    location?: string;
    type?: 'visit' | 'meal' | 'activity' | 'travel';
  }[];
}

export interface TripPlanResult {
  destination: string;
  costBreakdown: {
    accommodation: number;
    food: number;
    activities: number;
    transportation: number;
  };
  hotels: {
    name: string;
    priceRange: string;
    rating?: string;
  }[];
  restaurants: {
    name: string;
    cuisine: string;
    priceRange: string;
  }[];
  itinerary: DayItinerary[];
}

// Music types
export interface MusicRecommendation {
  genre: string;
  playlists: {
    name: string;
    description: string;
    songs: string[];
  }[];
}
