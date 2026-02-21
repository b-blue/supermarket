import {
  NavigationManager,
  getNavigationManager,
  resetNavigationManager,
} from '../../managers/NavigationManager';
import { SceneKeys } from '../../config/SceneKeys';
import { createDefaultGameState } from '../../state/GameStateManager';
import { Scene } from 'phaser';

/**
 * Mock Phaser Scene for testing
 */
class MockScene {
  public key: string;
  public tweens = {
    add: jest.fn((config) => {
      // Immediately call onComplete for testing
      if (config.onComplete) {
        config.onComplete();
      }
    }),
  };
  public cameras = {
    main: {
      scrollX: 0,
    },
  };
  public scene = {
    key: '',
    get: jest.fn((key) => new MockScene(key)),
    switch: jest.fn(),
  };

  constructor(key: string = 'TestScene') {
    this.key = key;
    this.scene.key = key;
  }
}

describe('NavigationManager', () => {
  let navigationManager: NavigationManager;
  let mockScene: MockScene;
  let gameState: any;

  beforeEach(() => {
    resetNavigationManager();
    navigationManager = new NavigationManager();
    mockScene = new MockScene(SceneKeys.SALES_FLOOR);
    gameState = createDefaultGameState();
  });

  describe('Initialization', () => {
    it('should initialize with scene and game state', () => {
      navigationManager.initialize(mockScene as any, gameState);
      expect(navigationManager.getCurrentScene()).toBe(mockScene);
      expect(navigationManager.getGameState()).toBe(gameState);
    });

    it('should return null for scene before initialization', () => {
      const newManager = new NavigationManager();
      expect(newManager.getCurrentScene()).toBeNull();
    });

    it('should return null for game state before initialization', () => {
      const newManager = new NavigationManager();
      expect(newManager.getGameState()).toBeNull();
    });
  });

  describe('Scene Tracking', () => {
    beforeEach(() => {
      navigationManager.initialize(mockScene as any, gameState);
    });

    it('should track current scene', () => {
      navigationManager.initialize(mockScene as any, gameState);
      expect(navigationManager.getCurrentScene()).toBe(mockScene);
    });

    it('should track current scene key', () => {
      expect(navigationManager.getCurrentSceneKey()).toBe(SceneKeys.SALES_FLOOR);
    });

    it('should update scene after switch', () => {
      const newScene = new MockScene(SceneKeys.STOCKROOM);
      (mockScene.scene.get as jest.Mock).mockReturnValue(newScene);

      navigationManager.switchScene(SceneKeys.STOCKROOM);
      // After transition completes
      expect((mockScene.scene.switch as jest.Mock)).toHaveBeenCalledWith(
        SceneKeys.STOCKROOM
      );
    });
  });

  describe('Transition State', () => {
    beforeEach(() => {
      navigationManager.initialize(mockScene as any, gameState);
    });

    it('should not be transitioning initially', () => {
      expect(navigationManager.isTransitioningBetweenScenes()).toBe(false);
    });

    it('should complete transition after scene switch', (done) => {
      const newScene = new MockScene(SceneKeys.STOCKROOM);
      (mockScene.scene.get as jest.Mock).mockReturnValue(newScene);

      expect(navigationManager.isTransitioningBetweenScenes()).toBe(false);
      navigationManager.switchScene(SceneKeys.STOCKROOM);

      // After tweens and scene.switch complete
      setTimeout(() => {
        expect(navigationManager.isTransitioningBetweenScenes()).toBe(false);
        done();
      }, 100);
    });

    it('should prevent multiple simultaneous transitions', () => {
      const newScene = new MockScene(SceneKeys.STOCKROOM);
      (mockScene.scene.get as jest.Mock).mockReturnValue(newScene);

      // Mark as in progress and prevent animation completion
      let transitionSwitchCalls = 0;
      (mockScene.scene.switch as jest.Mock).mockImplementation(() => {
        transitionSwitchCalls++;
      });

      (mockScene.tweens.add as jest.Mock).mockImplementation((config) => {
        // Don't call onComplete, leaving manager in transitioning state
      });

      navigationManager.switchScene(SceneKeys.STOCKROOM);
      expect(navigationManager.isTransitioningBetweenScenes()).toBe(true);
      expect(transitionSwitchCalls).toBe(0); // First tween not complete yet

      // Try to switch again while transitioning - should be ignored
      navigationManager.switchScene(SceneKeys.MAIN_MENU);

      // Should still be same count - second switch was blocked
      expect(transitionSwitchCalls).toBe(0);
    });
  });

  describe('Game State Preservation', () => {
    it('should preserve game state during transitions', () => {
      navigationManager.initialize(mockScene as any, gameState);
      gameState.currency.total = 100;

      const retrievedState = navigationManager.getGameState();
      expect(retrievedState?.currency.total).toBe(100);
    });

    it('should share same game state reference', () => {
      navigationManager.initialize(mockScene as any, gameState);

      const state1 = navigationManager.getGameState();
      const state2 = navigationManager.getGameState();

      expect(state1).toBe(state2);
    });
  });

  describe('Convenience Methods', () => {
    beforeEach(() => {
      navigationManager.initialize(mockScene as any, gameState);
    });

    it('should switch to stockroom via goToStockroom', () => {
      const stockroomScene = new MockScene(SceneKeys.STOCKROOM);
      (mockScene.scene.get as jest.Mock).mockReturnValue(stockroomScene);

      // Track switch calls
      const switchCalls: string[] = [];
      (mockScene.scene.switch as jest.Mock).mockImplementation((sceneKey) => {
        switchCalls.push(sceneKey);
      });

      navigationManager.goToStockroom();

      expect(switchCalls).toContain(SceneKeys.STOCKROOM);
    });

    it('should have convenience method for returning to sales floor', () => {
      // Just verify the method exists and can be called
      const salesFloorScene = new MockScene(SceneKeys.SALES_FLOOR);
      (mockScene.scene.get as jest.Mock).mockReturnValue(salesFloorScene);

      // Should not throw
      expect(() => {
        navigationManager.goToSalesFloor();
      }).not.toThrow();
    });
  });

  describe('Error Handling', () => {
    it('should throw error when switching without initialization', () => {
      const newManager = new NavigationManager();
      expect(() => {
        newManager.switchScene(SceneKeys.STOCKROOM);
      }).toThrow('NavigationManager not initialized');
    });
  });

  describe('Scene Switch Edge Cases', () => {
    beforeEach(() => {
      navigationManager.initialize(mockScene as any, gameState);
    });

    it('should not switch if already on target scene', () => {
      const switchSpy = jest.spyOn(mockScene.scene, 'switch');
      navigationManager.switchScene(SceneKeys.SALES_FLOOR);

      expect(switchSpy).not.toHaveBeenCalled();
      switchSpy.mockRestore();
    });

    it('should handle case when scene not found', () => {
      (mockScene.scene.get as jest.Mock).mockReturnValue(null);
      const currentSceneBeforeSwitch = navigationManager.getCurrentScene();

      navigationManager.switchScene(SceneKeys.STOCKROOM);

      // Scene should be updated even if get returns null (this is current behavior)
      expect(navigationManager.getCurrentScene()).toBeNull();
    });
  });

  describe('Singleton Pattern', () => {
    it('should return same instance on multiple calls', () => {
      resetNavigationManager();
      const manager1 = getNavigationManager();
      const manager2 = getNavigationManager();

      expect(manager1).toBe(manager2);
    });

    it('should allow reset', () => {
      const manager1 = getNavigationManager();
      manager1.initialize(mockScene as any, gameState);

      resetNavigationManager();

      const manager2 = getNavigationManager();
      expect(manager2.getCurrentScene()).toBeNull();
    });
  });

  describe('Animation Triggers', () => {
    beforeEach(() => {
      navigationManager.initialize(mockScene as any, gameState);
    });

    it('should trigger slide out animation', () => {
      const newScene = new MockScene(SceneKeys.STOCKROOM);
      (mockScene.scene.get as jest.Mock).mockReturnValue(newScene);

      const tweenAddSpy = jest.spyOn(mockScene.tweens, 'add');
      navigationManager.switchScene(SceneKeys.STOCKROOM);

      expect(tweenAddSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          duration: 400, // slideOutDuration
          ease: 'Power2.inOut',
        })
      );

      tweenAddSpy.mockRestore();
    });
  });

  describe('Reset Functionality', () => {
    it('should reset manager state', () => {
      navigationManager.initialize(mockScene as any, gameState);
      expect(navigationManager.getCurrentScene()).not.toBeNull();

      navigationManager.reset();

      expect(navigationManager.getCurrentScene()).toBeNull();
      expect(navigationManager.getGameState()).toBeNull();
      expect(navigationManager.isTransitioningBetweenScenes()).toBe(false);
    });
  });
});
