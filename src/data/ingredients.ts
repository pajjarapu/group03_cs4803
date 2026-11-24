import type { Ingredient, PantryCategory, PantryItem } from '@/types';

/** Every ingredient the app knows about, used for recipe matching and search. */
export const INGREDIENTS: Ingredient[] = [
  { id: 'garlic', name: 'Garlic', category: 'Produce' },
  { id: 'lemon', name: 'Lemon', category: 'Produce' },
  { id: 'spinach', name: 'Spinach', category: 'Produce' },
  { id: 'onion', name: 'Onion', category: 'Produce' },
  { id: 'carrots', name: 'Carrots', category: 'Produce' },
  { id: 'mushrooms', name: 'Mushrooms', category: 'Produce' },
  { id: 'tomato', name: 'Tomato', category: 'Produce' },
  { id: 'basil', name: 'Basil', category: 'Produce' },
  { id: 'parsley', name: 'Parsley', category: 'Produce' },
  { id: 'peas', name: 'Peas', category: 'Produce' },
  { id: 'ginger', name: 'Ginger', category: 'Produce' },
  { id: 'cilantro', name: 'Cilantro', category: 'Produce' },

  { id: 'butter', name: 'Butter', category: 'Dairy & Eggs' },
  { id: 'eggs', name: 'Eggs', category: 'Dairy & Eggs' },
  { id: 'milk', name: 'Milk', category: 'Dairy & Eggs' },
  { id: 'parmesan', name: 'Parmesan', category: 'Dairy & Eggs' },
  { id: 'cheddar', name: 'Cheddar', category: 'Dairy & Eggs' },
  { id: 'cream', name: 'Cream', category: 'Dairy & Eggs' },
  { id: 'yogurt', name: 'Greek yogurt', category: 'Dairy & Eggs' },

  { id: 'chicken-thighs', name: 'Chicken thighs', category: 'Meat & Fish' },
  { id: 'bacon', name: 'Bacon', category: 'Meat & Fish' },

  { id: 'pasta', name: 'Pasta', category: 'Pantry' },
  { id: 'rice', name: 'Rice', category: 'Pantry' },
  { id: 'olive-oil', name: 'Olive oil', category: 'Pantry' },
  { id: 'canned-tomatoes', name: 'Canned tomatoes', category: 'Pantry' },
  { id: 'tomato-paste', name: 'Tomato paste', category: 'Pantry' },
  { id: 'chickpeas', name: 'Chickpeas', category: 'Pantry' },
  { id: 'curry-powder', name: 'Curry powder', category: 'Pantry' },
  { id: 'soy-sauce', name: 'Soy sauce', category: 'Pantry' },
  { id: 'sesame-oil', name: 'Sesame oil', category: 'Pantry' },
  { id: 'flour', name: 'Flour', category: 'Pantry' },
  { id: 'honey', name: 'Honey', category: 'Pantry' },
  { id: 'cumin', name: 'Cumin', category: 'Pantry' },
  { id: 'black-beans', name: 'Black beans', category: 'Pantry' },
  { id: 'tortillas', name: 'Tortillas', category: 'Pantry' },
  { id: 'salt', name: 'Salt', category: 'Pantry' },
  { id: 'black-pepper', name: 'Black pepper', category: 'Pantry' },
];

export const INGREDIENTS_BY_ID: Record<string, Ingredient> = Object.fromEntries(
  INGREDIENTS.map((ingredient) => [ingredient.id, ingredient]),
);

export const CATEGORY_ORDER: PantryCategory[] = [
  'Produce',
  'Dairy & Eggs',
  'Meat & Fish',
  'Pantry',
];

/** Starting pantry: 24 items, 3 running low. */
export const INITIAL_PANTRY: PantryItem[] = [
  { id: 'garlic', name: 'Garlic', category: 'Produce', status: 'have' },
  { id: 'lemon', name: 'Lemon', category: 'Produce', status: 'low' },
  { id: 'spinach', name: 'Spinach', category: 'Produce', status: 'have' },
  { id: 'onion', name: 'Onion', category: 'Produce', status: 'have' },
  { id: 'carrots', name: 'Carrots', category: 'Produce', status: 'have' },
  { id: 'mushrooms', name: 'Mushrooms', category: 'Produce', status: 'have' },

  { id: 'butter', name: 'Butter', category: 'Dairy & Eggs', status: 'have' },
  { id: 'eggs', name: 'Eggs', category: 'Dairy & Eggs', status: 'low' },
  { id: 'milk', name: 'Milk', category: 'Dairy & Eggs', status: 'low' },
  { id: 'parmesan', name: 'Parmesan', category: 'Dairy & Eggs', status: 'have' },

  { id: 'chicken-thighs', name: 'Chicken thighs', category: 'Meat & Fish', status: 'have' },
  { id: 'bacon', name: 'Bacon', category: 'Meat & Fish', status: 'have' },

  { id: 'pasta', name: 'Pasta', category: 'Pantry', status: 'have' },
  { id: 'rice', name: 'Rice', category: 'Pantry', status: 'have' },
  { id: 'olive-oil', name: 'Olive oil', category: 'Pantry', status: 'have' },
  { id: 'canned-tomatoes', name: 'Canned tomatoes', category: 'Pantry', status: 'have' },
  { id: 'chickpeas', name: 'Chickpeas', category: 'Pantry', status: 'have' },
  { id: 'curry-powder', name: 'Curry powder', category: 'Pantry', status: 'have' },
  { id: 'soy-sauce', name: 'Soy sauce', category: 'Pantry', status: 'have' },
  { id: 'flour', name: 'Flour', category: 'Pantry', status: 'have' },
  { id: 'honey', name: 'Honey', category: 'Pantry', status: 'have' },
  { id: 'cumin', name: 'Cumin', category: 'Pantry', status: 'have' },
  { id: 'salt', name: 'Salt', category: 'Pantry', status: 'have' },
  { id: 'black-pepper', name: 'Black pepper', category: 'Pantry', status: 'have' },
];
