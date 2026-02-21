/**
 * Core type definitions for the Intergalactic Supermarket game
 */

export interface ItemDefinition {
  id: string;
  name: string;
  // Asset can be an emoji or asset key (will be swapped for PNG later)
  asset: string;
  category: 'fruit' | 'vegetable' | 'drink' | 'dairy' | 'bakery' | 'other';
  // Display dimensions for rendering
  displayWidth: number;
  displayHeight: number;
}

export interface StackedItem {
  itemId: string;
  quantity: number;
}

export interface ShelfPosition {
  // Can hold multiple items (e.g., pyramid of apples)
  items: StackedItem[];
  maxCapacity: number;
}

export interface Shelf {
  id: string;
  positions: ShelfPosition[];
}

export interface Aisle {
  id: string;
  name: string;
  shelves: Shelf[];
}

export interface Cart {
  slots: StackedItem[];
  maxSlots: number;
  initialStackSize: number;
}

export interface SalesFloor {
  aisles: Aisle[];
  currentAisleId: string;
}

export interface Stockroom {
  inventory: StackedItem[];
}

export interface GameCurrency {
  total: number;
}

export interface GameState {
  salesFloor: SalesFloor;
  stockroom: Stockroom;
  cart: Cart;
  currency: GameCurrency;
}

export interface Customer {
  id: string;
  state: 'arriving' | 'looking' | 'retrieving' | 'not-found' | 'departure';
  targetAisleId: string;
  itemsToFetch: number;
  itemsRetrieved: StackedItem[];
  createdAt: number;
}
