/**
 * Scene identifiers and constants
 */
export const SceneKeys = {
  BOOT: 'Boot',
  PRELOADER: 'Preloader',
  MAIN_MENU: 'MainMenu',
  GAME_OVER: 'GameOver',
  SALES_FLOOR: 'SalesFloor',
  STOCKROOM: 'Stockroom',
} as const;

export type SceneKey = (typeof SceneKeys)[keyof typeof SceneKeys];
