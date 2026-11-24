import { INGREDIENTS_BY_ID } from '@/data/ingredients';
import type { PantryItem, Recipe, RecipeIngredient } from '@/types';

export type RecipeMatch = {
  /** Names of ingredients with no pantry entry at all. */
  missing: string[];
  /** Names of ingredients in the pantry but running low. */
  low: string[];
  /** Ingredients fully stocked. */
  haveCount: number;
  totalTracked: number;
};

export function matchRecipe(recipe: Recipe, pantry: PantryItem[]): RecipeMatch {
  const byId = new Map(pantry.map((item) => [item.id, item]));
  const missing: string[] = [];
  const low: string[] = [];
  let haveCount = 0;

  for (const ingredient of recipe.ingredients) {
    const item = byId.get(ingredient.id);
    if (!item) {
      missing.push(ingredientName(ingredient));
    } else if (item.status === 'low') {
      low.push(ingredientName(ingredient));
    } else {
      haveCount += 1;
    }
  }

  return { missing, low, haveCount, totalTracked: recipe.ingredients.length };
}

export function ingredientName(ingredient: RecipeIngredient): string {
  return INGREDIENTS_BY_ID[ingredient.id]?.name ?? ingredient.id.replace(/-/g, ' ');
}
