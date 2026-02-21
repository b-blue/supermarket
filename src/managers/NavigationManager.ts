import { Scene } from 'phaser';
import { SceneKey, SceneKeys } from '../config/SceneKeys';
import { LayoutConfig } from '../config/LayoutConfig';
import { GameState } from '../types';

/**
 * Manages scene transitions with animations and state preservation
 * Singleton pattern ensures single instance across the game
 */
export class NavigationManager {
  private currentScene: Scene | null = null;
  private gameState: GameState | null = null;
  private isTransitioning: boolean = false;

  /**
   * Initialize the navigation manager with scene and game state
   */
  public initialize(scene: Scene, gameState: GameState): void {
    this.currentScene = scene;
    this.gameState = gameState;
  }

  /**
   * Get current active scene
   */
  public getCurrentScene(): Scene | null {
    return this.currentScene;
  }

  /**
   * Get current scene key
   */
  public getCurrentSceneKey(): SceneKey | null {
    return this.currentScene?.scene.key as SceneKey | null;
  }

  /**
   * Check if currently transitioning between scenes
   */
  public isTransitioningBetweenScenes(): boolean {
    return this.isTransitioning;
  }

  /**
   * Get shared game state
   */
  public getGameState(): GameState | null {
    return this.gameState;
  }

  /**
   * Switch to a different scene with slide animation
   */
  public switchScene(targetScene: SceneKey): void {
    if (!this.currentScene) {
      throw new Error('NavigationManager not initialized');
    }

    if (this.isTransitioning) {
      return; // Prevent multiple simultaneous transitions
    }

    if (this.currentScene.scene.key === targetScene) {
      return; // Already on target scene
    }

    this.isTransitioning = true;

    // Slide out animation for current scene
    this.slideOutScene(this.currentScene, () => {
      // Switch to target scene
      this.currentScene?.scene.switch(targetScene);
      this.currentScene = this.currentScene?.scene.get(targetScene) || null;

      if (this.currentScene) {
        // Slide in animation for new scene
        this.slideInScene(this.currentScene, () => {
          this.isTransitioning = false;
        });
      } else {
        this.isTransitioning = false;
      }
    });
  }

  /**
   * Quick method to go to sales floor
   */
  public goToSalesFloor(): void {
    this.switchScene(SceneKeys.SALES_FLOOR);
  }

  /**
   * Quick method to go to stockroom
   */
  public goToStockroom(): void {
    this.switchScene(SceneKeys.STOCKROOM);
  }

  /**
   * Slide out animation for exiting scene
   */
  private slideOutScene(scene: Scene, onComplete: () => void): void {
    const cameras = scene.cameras;
    const mainCamera = cameras.main;

    scene.tweens.add({
      targets: mainCamera,
      scrollX: -LayoutConfig.game.width,
      duration: LayoutConfig.transitions.slideOutDuration,
      ease: 'Power2.inOut',
      onComplete,
    });
  }

  /**
   * Slide in animation for entering scene
   */
  private slideInScene(scene: Scene, onComplete: () => void): void {
    const cameras = scene.cameras;
    const mainCamera = cameras.main;

    // Start off-screen to the right
    mainCamera.scrollX = LayoutConfig.game.width;

    scene.tweens.add({
      targets: mainCamera,
      scrollX: 0,
      duration: LayoutConfig.transitions.slideInDuration,
      ease: 'Power2.inOut',
      onComplete,
    });
  }

  /**
   * Reset navigation manager (useful for testing)
   */
  public reset(): void {
    this.currentScene = null;
    this.gameState = null;
    this.isTransitioning = false;
  }
}

// Singleton instance
let instance: NavigationManager | null = null;

/**
 * Get or create the singleton NavigationManager instance
 */
export const getNavigationManager = (): NavigationManager => {
  if (!instance) {
    instance = new NavigationManager();
  }
  return instance;
};

/**
 * Reset the singleton (primarily for testing)
 */
export const resetNavigationManager = (): void => {
  if (instance) {
    instance.reset();
  }
  instance = null;
};
