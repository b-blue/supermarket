import { AssetManager, getAssetManager } from '../../managers/AssetManager';

describe('AssetManager', () => {
  let manager: AssetManager;

  beforeEach(() => {
    // Create fresh instance for each test
    manager = new AssetManager();
  });

  describe('Item Loading', () => {
    it('should load all items from configuration', () => {
      const allItems = manager.getAllItems();
      expect(allItems.length).toBeGreaterThan(0);
      expect(allItems.length).toBe(10); // Based on items.json
    });

    it('should retrieve item by ID', () => {
      const item = manager.getItem('red-apple');
      expect(item).toBeDefined();
      expect(item?.name).toBe('Red Apple');
      expect(item?.category).toBe('fruit');
    });

    it('should return undefined for non-existent item', () => {
      const item = manager.getItem('non-existent');
      expect(item).toBeUndefined();
    });
  });

  describe('Category Filtering', () => {
    it('should get items by category', () => {
      const fruits = manager.getItemsByCategory('fruit');
      expect(fruits.length).toBeGreaterThan(0);
      fruits.forEach((item) => {
        expect(item.category).toBe('fruit');
      });
    });

    it('should get all categories', () => {
      const categories = manager.getCategories();
      expect(categories.length).toBeGreaterThan(0);
      expect(categories).toContain('fruit');
      expect(categories).toContain('vegetable');
    });

    it('should return sorted categories', () => {
      const categories = manager.getCategories();
      const sorted = [...categories].sort();
      expect(categories).toEqual(sorted);
    });
  });

  describe('Asset Retrieval', () => {
    it('should get asset in emoji mode', () => {
      manager.setAssetMode('emoji');
      const asset = manager.getAsset('red-apple');
      expect(asset).toBe('🍎');
    });

    it('should get asset in png mode', () => {
      manager.setAssetMode('png');
      const asset = manager.getAsset('red-apple');
      expect(asset).toBe('item_red-apple');
    });

    it('should return null for non-existent item', () => {
      const asset = manager.getAsset('non-existent');
      expect(asset).toBeNull();
    });
  });

  describe('Display Dimensions', () => {
    it('should get display dimensions for item', () => {
      const dims = manager.getDisplayDimensions('red-apple');
      expect(dims).toBeDefined();
      expect(dims?.width).toBe(32);
      expect(dims?.height).toBe(32);
    });

    it('should return null for non-existent item', () => {
      const dims = manager.getDisplayDimensions('non-existent');
      expect(dims).toBeNull();
    });
  });

  describe('Asset Mode Management', () => {
    it('should start in emoji mode', () => {
      expect(manager.getAssetMode()).toBe('emoji');
    });

    it('should switch to png mode', () => {
      manager.setAssetMode('png');
      expect(manager.getAssetMode()).toBe('png');
    });

    it('should switch back to emoji mode', () => {
      manager.setAssetMode('png');
      manager.setAssetMode('emoji');
      expect(manager.getAssetMode()).toBe('emoji');
    });
  });

  describe('Singleton Pattern', () => {
    it('should return same instance from getAssetManager', () => {
      const manager1 = getAssetManager();
      const manager2 = getAssetManager();
      expect(manager1).toBe(manager2);
    });
  });
});
