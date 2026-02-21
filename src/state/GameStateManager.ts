import {
  GameState,
  SalesFloor,
  Aisle,
  Shelf,
  ShelfPosition,
  Cart,
  Stockroom,
  StackedItem,
  GameCurrency,
} from '../types';

/**
 * Initialize default game state
 */
export const createDefaultGameState = (): GameState => {
  return {
    salesFloor: createDefaultSalesFloor(),
    stockroom: createDefaultStockroom(),
    cart: createDefaultCart(),
    currency: { total: 0 },
  };
};

/**
 * Create default sales floor with initial aisles and shelves
 */
const createDefaultSalesFloor = (): SalesFloor => {
  const aisle1 = createAisle('aisle-1', 'Fruits', [
    {
      id: 'aisle-1-shelf-1',
      positions: [
        { items: [], maxCapacity: 5 }, // Red apples
        { items: [], maxCapacity: 5 }, // Green apples
      ],
    },
    {
      id: 'aisle-1-shelf-2',
      positions: [
        { items: [], maxCapacity: 3 }, // Mangos
        { items: [], maxCapacity: 3 }, // Pears
        { items: [], maxCapacity: 3 }, // Peaches
      ],
    },
  ]);

  return {
    aisles: [aisle1],
    currentAisleId: 'aisle-1',
  };
};

/**
 * Create an aisle with shelves
 */
const createAisle = (id: string, name: string, shelves: Shelf[]): Aisle => {
  return {
    id,
    name,
    shelves,
  };
};

/**
 * Create default stockroom with initial inventory
 */
const createDefaultStockroom = (): Stockroom => {
  return {
    inventory: [
      { itemId: 'red-apple', quantity: 10 },
      { itemId: 'green-apple', quantity: 10 },
      { itemId: 'mango', quantity: 8 },
      { itemId: 'pear', quantity: 8 },
      { itemId: 'peach', quantity: 8 },
      { itemId: 'potato', quantity: 15 },
      { itemId: 'carrot', quantity: 15 },
      { itemId: 'broccoli', quantity: 10 },
      { itemId: 'milk', quantity: 12 },
      { itemId: 'bread', quantity: 10 },
    ],
  };
};

/**
 * Create default cart
 */
const createDefaultCart = (): Cart => {
  return {
    slots: [],
    maxSlots: 6,
    initialStackSize: 3,
  };
};

/**
 * Add item to cart
 */
export const addItemToCart = (
  state: GameState,
  itemId: string,
  quantity: number = state.cart.initialStackSize
): boolean => {
  // Check if cart has available slots
  if (state.cart.slots.length >= state.cart.maxSlots) {
    return false;
  }

  // Check if item exists in stockroom
  const stockroomItem = state.stockroom.inventory.find(
    (i) => i.itemId === itemId
  );
  if (!stockroomItem || stockroomItem.quantity < quantity) {
    return false;
  }

  // Remove from stockroom
  stockroomItem.quantity -= quantity;

  // Add to cart
  state.cart.slots.push({ itemId, quantity });
  return true;
};

/**
 * Remove item from cart
 */
export const removeItemFromCart = (state: GameState, slotIndex: number): boolean => {
  if (slotIndex < 0 || slotIndex >= state.cart.slots.length) {
    return false;
  }

  const slot = state.cart.slots[slotIndex];
  state.cart.slots.splice(slotIndex, 1);

  // Return to stockroom
  const stockroomItem = state.stockroom.inventory.find(
    (i) => i.itemId === slot.itemId
  );
  if (stockroomItem) {
    stockroomItem.quantity += slot.quantity;
  } else {
    state.stockroom.inventory.push(slot);
  }

  return true;
};

/**
 * Place single item from cart onto shelf
 */
export const placeItemOnShelf = (
  state: GameState,
  cartSlotIndex: number,
  aileId: string,
  shelfIndex: number,
  positionIndex: number
): boolean => {
  // Validate cart slot
  if (cartSlotIndex < 0 || cartSlotIndex >= state.cart.slots.length) {
    return false;
  }

  // Find aisle
  const aisle = state.salesFloor.aisles.find((a) => a.id === aileId);
  if (!aisle) return false;

  // Find shelf
  if (shelfIndex < 0 || shelfIndex >= aisle.shelves.length) {
    return false;
  }
  const shelf = aisle.shelves[shelfIndex];

  // Find position
  if (positionIndex < 0 || positionIndex >= shelf.positions.length) {
    return false;
  }
  const position = shelf.positions[positionIndex];

  // Check capacity
  const currentCount = position.items.reduce((sum, item) => sum + item.quantity, 0);
  if (currentCount >= position.maxCapacity) {
    return false;
  }

  // Get item from cart
  const cartItem = state.cart.slots[cartSlotIndex];

  // Add to shelf position
  const existingItem = position.items.find((i) => i.itemId === cartItem.itemId);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    position.items.push({ itemId: cartItem.itemId, quantity: 1 });
  }

  // Remove from cart
  cartItem.quantity -= 1;
  if (cartItem.quantity === 0) {
    state.cart.slots.splice(cartSlotIndex, 1);
  }

  return true;
};

/**
 * Remove item from shelf (customer takes it)
 */
export const removeItemFromShelf = (
  state: GameState,
  aisleId: string,
  shelfIndex: number,
  positionIndex: number
): boolean => {
  const aisle = state.salesFloor.aisles.find((a) => a.id === aisleId);
  if (!aisle) return false;

  if (shelfIndex < 0 || shelfIndex >= aisle.shelves.length) {
    return false;
  }
  const shelf = aisle.shelves[shelfIndex];

  if (positionIndex < 0 || positionIndex >= shelf.positions.length) {
    return false;
  }
  const position = shelf.positions[positionIndex];

  if (position.items.length === 0) {
    return false;
  }

  // Remove one item from the first available stack
  const item = position.items[0];
  item.quantity -= 1;
  if (item.quantity === 0) {
    position.items.shift();
  }

  return true;
};

/**
 * Add currency
 */
export const addCurrency = (state: GameState, amount: number): void => {
  state.currency.total += amount;
};

/**
 * Switch to different aisle
 */
export const switchAisle = (state: GameState, aisleId: string): boolean => {
  if (!state.salesFloor.aisles.find((a) => a.id === aisleId)) {
    return false;
  }
  state.salesFloor.currentAisleId = aisleId;
  return true;
};
