export type PantryCategory = 'Produce' | 'Dairy & Eggs' | 'Meat & Fish' | 'Pantry';

export type PantryStatus = 'have' | 'low';

export type Ingredient = {
  id: string;
  name: string;
  category: PantryCategory;
};

export type PantryItem = Ingredient & {
  status: PantryStatus;
};

export type RecipeIngredient = {
  id: string;
  amount: string;
};

export type Recipe = {
  id: string;
  name: string;
  minutes: number;
  difficulty: 'Easy' | 'Medium';
  rating: number;
  ratingCount: number;
  /** Human label for the cookware count, e.g. "1 pan" or "2 tools". */
  panLabel: string;
  tools: string[];
  cleanupNote: string;
  ingredients: RecipeIngredient[];
  steps: string[];
};

export type CookLog = {
  id: string;
  recipeId: string;
  name: string;
  cookedAt: string;
  rating: number;
  photoUri?: string;
};

export type Preferences = {
  dietary: string[];
  goals: string[];
  skill: string;
  time: string;
};

export type AppState = {
  pantry: PantryItem[];
  prefs: Preferences;
  /** ISO day keys for every day a meal was cooked. */
  cookedDays: string[];
  streak: number;
  bestStreak: number;
  graceDaysLeft: number;
  mealsCooked: number;
  recipesTried: number;
  triedRecipeIds: string[];
  avgRating: number;
  history: CookLog[];
  /** Recipe id -> timestamp (ms) when it was hidden from the feed. */
  hiddenRecipes: Record<string, number>;
  achievementSeen: boolean;
  celebration: { days: number; nextDays: number } | null;
  /** Recipe id whose "log meal" sheet is open, or null. */
  logSheetRecipeId: string | null;
};

export type PantryUpdate = 'used' | 'low' | 'have';
