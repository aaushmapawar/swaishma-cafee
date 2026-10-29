export type DietaryTag = 'vegetarian' | 'vegan' | 'spicy' | 'gluten-free' | 'contains-nuts' | 'contains-dairy' | 'contains-shellfish' | 'chef-special';

export type FoodCategory =
  | 'starters'
  | 'snacks'
  | 'burgers-sandwiches'
  | 'pizzas'
  | 'pasta'
  | 'main-courses'
  | 'desserts'
  | 'beachside-specials';

export type DrinkCategory =
  | 'coffee-hot'
  | 'coffee-cold'
  | 'tea'
  | 'fresh-juices'
  | 'mocktails'
  | 'smoothies'
  | 'milkshakes'
  | 'beverages';

export type MenuCategoryType = FoodCategory | DrinkCategory;

export interface MenuItem {
  id: string;
  name: string;
  category: MenuCategoryType;
  menuType: 'food' | 'drink';
  description: string;
  price: number;
  image: string;
  dietaryTags: DietaryTag[];
  allergens: string[];
  calories?: number;
  prepTimeMinutes?: number;
  isPopular?: boolean;
  isAvailable?: boolean;
  ingredients?: string[];
  pairingRecommendation?: string;
  caffeineLevel?: 'None' | 'Low' | 'Medium' | 'High';
}

export interface Review {
  id: string;
  authorName: string;
  authorCity?: string;
  rating: number; // 1 to 5
  date: string;
  text: string;
  favoriteDish?: string;
  helpfulCount: number;
  verifiedVisit?: boolean;
}

export interface CafeInfo {
  name: string;
  tagline: string;
  shortDescription: string;
  address: {
    street: string;
    neighborhood: string;
    city: string;
    postalCode: string;
    landmark: string;
  };
  phone: string;
  whatsapp: string;
  email: string;
  hours: {
    monday: string;
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
    saturday: string;
    sunday: string;
  };
  socialLinks: {
    instagram: string;
    facebook: string;
    pinterest: string;
    tripadvisor: string;
  };
  coordinates: {
    lat: number;
    lng: number;
  };
  announcement?: string;
}

export interface CartItem {
  item: MenuItem;
  quantity: number;
  specialInstructions?: string;
}

export interface TourChapter {
  id: string;
  title: string;
  duration: string;
  tagline: string;
  description: string;
  thumbnail: string;
  videoUrl?: string;
  highlight: string;
}
