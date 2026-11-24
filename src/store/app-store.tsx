import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

import { INGREDIENTS_BY_ID, INITIAL_PANTRY } from '@/data/ingredients';
import { RECIPES, RECIPES_BY_ID } from '@/data/recipes';
import { addDays, dayKey } from '@/lib/dates';
import type {
  AppState,
  PantryItem,
  PantryUpdate,
  Preferences,
  Recipe,
} from '@/types';

type LogMealInput = {
  recipeId: string;
  updates: { ingredientId: string; status: PantryUpdate }[];
  rating: number;
  photoUri?: string;
};

type AppContextValue = {
  state: AppState;
  addPantryItems: (ingredientIds: string[]) => void;
  removePantryItem: (item: PantryItem) => void;
  restorePantryItem: (item: PantryItem) => void;
  togglePantryStatus: (item: PantryItem) => void;
  hideRecipe: (recipe: Recipe) => void;
  showRecipe: (recipeId: string) => void;
  setPreferences: (patch: Partial<Preferences>) => void;
  logMeal: (input: LogMealInput) => void;
  openLogMeal: (recipeId: string) => void;
  closeLogMeal: () => void;
  dismissCelebration: () => void;
  resetApp: () => void;
};

const AppContext = createContext<AppContextValue | null>(null);

function createInitialState(): AppState {
  const now = new Date();
  const cookedDays = [1, 2, 3, 4, 5, 6].map((offset) => dayKey(addDays(now, -offset)));

  return {
    pantry: INITIAL_PANTRY.map((item) => ({ ...item })),
    prefs: {
      dietary: ['Vegetarian', 'Nut-free'],
      goals: ['Cook more often'],
      skill: 'Comfortable',
      time: '30 min',
    },
    cookedDays,
    streak: 6,
    bestStreak: 18,
    graceDaysLeft: 1,
    mealsCooked: 23,
    recipesTried: 9,
    triedRecipeIds: RECIPES.map((recipe) => recipe.id),
    avgRating: 4.4,
    history: [
      {
        id: 'seed-garlic-pasta',
        recipeId: 'garlic-butter-pasta',
        name: 'Garlic Butter Pasta',
        cookedAt: addDays(now, -1).toISOString(),
        rating: 4,
      },
      {
        id: 'seed-lemon-chicken',
        recipeId: 'lemon-chicken',
        name: 'One-Pan Lemon Chicken',
        cookedAt: addDays(now, -3).toISOString(),
        rating: 5,
      },
    ],
    hiddenRecipes: {},
    achievementSeen: false,
    celebration: null,
    logSheetRecipeId: null,
  };
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(createInitialState);

  const addPantryItems = useCallback((ingredientIds: string[]) => {
    setState((prev) => {
      const existing = new Set(prev.pantry.map((item) => item.id));
      const additions = ingredientIds
        .filter((id) => INGREDIENTS_BY_ID[id] && !existing.has(id))
        .map((id) => ({ ...INGREDIENTS_BY_ID[id], status: 'have' as const }));
      if (!additions.length) return prev;
      return { ...prev, pantry: [...prev.pantry, ...additions] };
    });
  }, []);

  const removePantryItem = useCallback((item: PantryItem) => {
    setState((prev) => ({
      ...prev,
      pantry: prev.pantry.filter((entry) => entry.id !== item.id),
    }));
  }, []);

  const restorePantryItem = useCallback((item: PantryItem) => {
    setState((prev) =>
      prev.pantry.some((entry) => entry.id === item.id)
        ? prev
        : { ...prev, pantry: [...prev.pantry, item] },
    );
  }, []);

  const togglePantryStatus = useCallback((item: PantryItem) => {
    setState((prev) => ({
      ...prev,
      pantry: prev.pantry.map((entry) =>
        entry.id === item.id
          ? { ...entry, status: entry.status === 'have' ? 'low' : 'have' }
          : entry,
      ),
    }));
  }, []);

  const hideRecipe = useCallback((recipe: Recipe) => {
    setState((prev) => ({
      ...prev,
      hiddenRecipes: { ...prev.hiddenRecipes, [recipe.id]: Date.now() },
    }));
  }, []);

  const showRecipe = useCallback((recipeId: string) => {
    setState((prev) => {
      const hiddenRecipes = { ...prev.hiddenRecipes };
      delete hiddenRecipes[recipeId];
      return { ...prev, hiddenRecipes };
    });
  }, []);

  const setPreferences = useCallback((patch: Partial<Preferences>) => {
    setState((prev) => ({ ...prev, prefs: { ...prev.prefs, ...patch } }));
  }, []);

  const logMeal = useCallback((input: LogMealInput) => {
    setState((prev) => {
      const recipe = RECIPES_BY_ID[input.recipeId];
      if (!recipe) return prev;

      const today = dayKey(new Date());
      const isNewDay = !prev.cookedDays.includes(today);

      const pantry = prev.pantry.flatMap((item) => {
        const update = input.updates.find((entry) => entry.ingredientId === item.id);
        if (!update) return [item];
        if (update.status === 'used') return [];
        return [{ ...item, status: update.status }];
      });

      const streak = isNewDay ? prev.streak + 1 : prev.streak;
      const mealsCooked = prev.mealsCooked + 1;
      const avgRating = (prev.avgRating * prev.mealsCooked + input.rating) / mealsCooked;
      const isNewRecipe = !prev.triedRecipeIds.includes(recipe.id);

      const history = [
        {
          id: `${recipe.id}-${Date.now()}`,
          recipeId: recipe.id,
          name: recipe.name,
          cookedAt: new Date().toISOString(),
          rating: input.rating,
          photoUri: input.photoUri,
        },
        ...prev.history,
      ].slice(0, 20);

      const shouldCelebrate = isNewDay && streak === 7 && !prev.achievementSeen;

      return {
        ...prev,
        pantry,
        cookedDays: isNewDay ? [...prev.cookedDays, today] : prev.cookedDays,
        streak,
        bestStreak: Math.max(prev.bestStreak, streak),
        mealsCooked,
        avgRating,
        recipesTried: isNewRecipe ? prev.recipesTried + 1 : prev.recipesTried,
        triedRecipeIds: isNewRecipe ? [...prev.triedRecipeIds, recipe.id] : prev.triedRecipeIds,
        history,
        celebration: shouldCelebrate ? { days: streak, nextDays: 14 } : prev.celebration,
      };
    });
  }, []);

  const dismissCelebration = useCallback(() => {
    setState((prev) => ({ ...prev, celebration: null, achievementSeen: true }));
  }, []);

  const openLogMeal = useCallback((recipeId: string) => {
    setState((prev) => ({ ...prev, logSheetRecipeId: recipeId }));
  }, []);

  const closeLogMeal = useCallback(() => {
    setState((prev) => ({ ...prev, logSheetRecipeId: null }));
  }, []);

  const resetApp = useCallback(() => {
    setState(createInitialState());
  }, []);

  const value = useMemo<AppContextValue>(
    () => ({
      state,
      addPantryItems,
      removePantryItem,
      restorePantryItem,
      togglePantryStatus,
      hideRecipe,
      showRecipe,
      setPreferences,
      logMeal,
      openLogMeal,
      closeLogMeal,
      dismissCelebration,
      resetApp,
    }),
    [
      state,
      addPantryItems,
      removePantryItem,
      restorePantryItem,
      togglePantryStatus,
      hideRecipe,
      showRecipe,
      setPreferences,
      logMeal,
      openLogMeal,
      closeLogMeal,
      dismissCelebration,
      resetApp,
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextValue {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used inside an AppProvider');
  }
  return context;
}
