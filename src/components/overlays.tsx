import { AchievementModal } from './achievement-modal';
import { LogMealSheet } from './log-meal-sheet';

/** Global overlays that can appear above any screen. */
export function AppOverlays() {
  return (
    <>
      <LogMealSheet />
      <AchievementModal />
    </>
  );
}
