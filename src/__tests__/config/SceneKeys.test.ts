import { SceneKeys } from '../../config/SceneKeys';

describe('SceneKeys', () => {
  it('should define all scene constants', () => {
    expect(SceneKeys.BOOT).toBe('Boot');
    expect(SceneKeys.PRELOADER).toBe('Preloader');
    expect(SceneKeys.MAIN_MENU).toBe('MainMenu');
    expect(SceneKeys.GAME_OVER).toBe('GameOver');
    expect(SceneKeys.SALES_FLOOR).toBe('SalesFloor');
    expect(SceneKeys.STOCKROOM).toBe('Stockroom');
  });

  it('should have unique scene keys', () => {
    const values = Object.values(SceneKeys);
    const uniqueValues = new Set(values);
    expect(uniqueValues.size).toBe(values.length);
  });

  it('should have no empty or null values', () => {
    Object.values(SceneKeys).forEach((value) => {
      expect(value).toBeTruthy();
      expect(typeof value).toBe('string');
    });
  });
});
