import itemsData from '../config/items.json';
import { ItemDefinition } from '../types';

/**
 * Centralized asset manager for handling item rendering
 * Abstracts emoji vs PNG assets, allowing easy swapping
 */
export class AssetManager {
  private items: Map<string, ItemDefinition> = new Map();
  private assetMode: 'emoji' | 'png' = 'emoji';

  constructor() {
    this.loadItems();
  }

  /**
   * Load all items from configuration
   */
  private loadItems(): void {
    itemsData.items.forEach((item: ItemDefinition) => {
      this.items.set(item.id, item);
    });
  }

  /**
   * Get item definition by ID
   */
  getItem(itemId: string): ItemDefinition | undefined {
    return this.items.get(itemId);
  }

  /**
   * Get all items
   */
  getAllItems(): ItemDefinition[] {
    return Array.from(this.items.values());
  }

  /**
   * Get items by category
   */
  getItemsByCategory(category: ItemDefinition['category']): ItemDefinition[] {
    return Array.from(this.items.values()).filter(
      (item) => item.category === category
    );
  }

  /**
   * Get all unique categories
   */
  getCategories(): ItemDefinition['category'][] {
    const categories = new Set<ItemDefinition['category']>();
    this.items.forEach((item) => categories.add(item.category));
    return Array.from(categories).sort();
  }

  /**
   * Get asset for rendering (emoji or asset key)
   * Currently returns emoji, but can be extended to return PNG asset keys
   */
  getAsset(itemId: string): string | null {
    const item = this.getItem(itemId);
    if (!item) return null;

    // In emoji mode, return the emoji string
    if (this.assetMode === 'emoji') {
      return item.asset;
    }

    // In PNG mode, would return asset key (item.asset would become PNG filename)
    // e.g., return `item_${item.id}` where the asset is pre-loaded as a PNG
    return `item_${item.id}`;
  }

  /**
   * Get display dimensions for an item
   */
  getDisplayDimensions(itemId: string): { width: number; height: number } | null {
    const item = this.getItem(itemId);
    if (!item) return null;
    return {
      width: item.displayWidth,
      height: item.displayHeight,
    };
  }

  /**
   * Switch asset mode (prepare for PNG migration)
   */
  setAssetMode(mode: 'emoji' | 'png'): void {
    this.assetMode = mode;
  }

  /**
   * Get current asset mode
   */
  getAssetMode(): 'emoji' | 'png' {
    return this.assetMode;
  }
}

// Singleton instance
let instance: AssetManager | null = null;

export const getAssetManager = (): AssetManager => {
  if (!instance) {
    instance = new AssetManager();
  }
  return instance;
};
