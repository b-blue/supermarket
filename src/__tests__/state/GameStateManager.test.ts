import {
  createDefaultGameState,
  addItemToCart,
  removeItemFromCart,
  placeItemOnShelf,
  removeItemFromShelf,
  addCurrency,
  switchAisle,
} from '../../state/GameStateManager';
import { GameState } from '../../types';

describe('GameStateManager', () => {
  let gameState: GameState;

  beforeEach(() => {
    gameState = createDefaultGameState();
  });

  describe('Initial State', () => {
    it('should create default game state', () => {
      expect(gameState).toBeDefined();
      expect(gameState.cart).toBeDefined();
      expect(gameState.stockroom).toBeDefined();
      expect(gameState.salesFloor).toBeDefined();
      expect(gameState.currency).toBeDefined();
    });

    it('should have empty cart initially', () => {
      expect(gameState.cart.slots.length).toBe(0);
    });

    it('should have items in stockroom', () => {
      expect(gameState.stockroom.inventory.length).toBeGreaterThan(0);
    });

    it('should have empty shelves initially', () => {
      gameState.salesFloor.aisles.forEach((aisle) => {
        aisle.shelves.forEach((shelf) => {
          shelf.positions.forEach((position) => {
            expect(position.items.length).toBe(0);
          });
        });
      });
    });

    it('should start with 0 currency', () => {
      expect(gameState.currency.total).toBe(0);
    });
  });

  describe('Cart Management', () => {
    it('should add item to cart', () => {
      const success = addItemToCart(gameState, 'red-apple', 3);
      expect(success).toBe(true);
      expect(gameState.cart.slots.length).toBe(1);
      expect(gameState.cart.slots[0].itemId).toBe('red-apple');
      expect(gameState.cart.slots[0].quantity).toBe(3);
    });

    it('should decrement stockroom quantity when adding to cart', () => {
      const beforeQuantity = gameState.stockroom.inventory.find(
        (i) => i.itemId === 'red-apple'
      )?.quantity;
      addItemToCart(gameState, 'red-apple', 3);
      const afterQuantity = gameState.stockroom.inventory.find(
        (i) => i.itemId === 'red-apple'
      )?.quantity;
      expect(afterQuantity).toBe((beforeQuantity || 0) - 3);
    });

    it('should fail to add item if insufficient stock', () => {
      const success = addItemToCart(gameState, 'red-apple', 1000);
      expect(success).toBe(false);
      expect(gameState.cart.slots.length).toBe(0);
    });

    it('should fail to add item if cart is full', () => {
      // Fill cart to max with different items to avoid stock limits
      const itemIds = [
        'red-apple',
        'green-apple',
        'mango',
        'pear',
        'peach',
        'potato',
      ];
      for (let i = 0; i < gameState.cart.maxSlots; i++) {
        addItemToCart(gameState, itemIds[i]);
      }
      // Try to add one more
      const success = addItemToCart(gameState, 'carrot');
      expect(success).toBe(false);
    });

    it('should remove item from cart', () => {
      addItemToCart(gameState, 'red-apple', 3);
      const success = removeItemFromCart(gameState, 0);
      expect(success).toBe(true);
      expect(gameState.cart.slots.length).toBe(0);
    });

    it('should return item to stockroom when removed from cart', () => {
      const beforeQuantity = gameState.stockroom.inventory.find(
        (i) => i.itemId === 'red-apple'
      )?.quantity;
      addItemToCart(gameState, 'red-apple', 3);
      removeItemFromCart(gameState, 0);
      const afterQuantity = gameState.stockroom.inventory.find(
        (i) => i.itemId === 'red-apple'
      )?.quantity;
      expect(afterQuantity).toBe(beforeQuantity);
    });

    it('should fail to remove item with invalid index', () => {
      const success = removeItemFromCart(gameState, 0);
      expect(success).toBe(false);
    });
  });

  describe('Shelf Management', () => {
    it('should place item on shelf', () => {
      addItemToCart(gameState, 'red-apple', 3);
      const aisle = gameState.salesFloor.aisles[0];
      const success = placeItemOnShelf(
        gameState,
        0, // cart slot
        aisle.id,
        0, // shelf index
        0 // position index
      );
      expect(success).toBe(true);
      expect(aisle.shelves[0].positions[0].items.length).toBeGreaterThan(0);
    });

    it('should decrement cart quantity when placing item', () => {
      addItemToCart(gameState, 'red-apple', 3);
      const aisle = gameState.salesFloor.aisles[0];
      placeItemOnShelf(gameState, 0, aisle.id, 0, 0);
      expect(gameState.cart.slots[0].quantity).toBe(2);
    });

    it('should remove stack from cart when quantity reaches 0', () => {
      addItemToCart(gameState, 'red-apple', 1);
      const aisle = gameState.salesFloor.aisles[0];
      placeItemOnShelf(gameState, 0, aisle.id, 0, 0);
      expect(gameState.cart.slots.length).toBe(0);
    });

    it('should fail to place item on non-existent shelf', () => {
      addItemToCart(gameState, 'red-apple', 3);
      const success = placeItemOnShelf(gameState, 0, 'non-existent-aisle', 0, 0);
      expect(success).toBe(false);
    });

    it('should fail to place item when shelf position is full', () => {
      addItemToCart(gameState, 'red-apple', 10);
      const aisle = gameState.salesFloor.aisles[0];
      const position = aisle.shelves[0].positions[0];

      // Fill the position to max capacity
      for (let i = 0; i < position.maxCapacity; i++) {
        placeItemOnShelf(gameState, 0, aisle.id, 0, 0);
      }

      // Try to place one more
      const success = placeItemOnShelf(gameState, 0, aisle.id, 0, 0);
      expect(success).toBe(false);
    });

    it('should remove item from shelf', () => {
      addItemToCart(gameState, 'red-apple', 1);
      const aisle = gameState.salesFloor.aisles[0];
      placeItemOnShelf(gameState, 0, aisle.id, 0, 0);

      const success = removeItemFromShelf(gameState, aisle.id, 0, 0);
      expect(success).toBe(true);
      expect(aisle.shelves[0].positions[0].items.length).toBe(0);
    });

    it('should fail to remove item from empty position', () => {
      const aisle = gameState.salesFloor.aisles[0];
      const success = removeItemFromShelf(gameState, aisle.id, 0, 0);
      expect(success).toBe(false);
    });
  });

  describe('Currency Management', () => {
    it('should add currency', () => {
      addCurrency(gameState, 10);
      expect(gameState.currency.total).toBe(10);
    });

    it('should accumulate currency', () => {
      addCurrency(gameState, 10);
      addCurrency(gameState, 5);
      expect(gameState.currency.total).toBe(15);
    });
  });

  describe('Aisle Navigation', () => {
    it('should switch to different aisle', () => {
      const aisle = gameState.salesFloor.aisles[0];
      expect(gameState.salesFloor.currentAisleId).toBe(aisle.id);
    });

    it('should fail to switch to non-existent aisle', () => {
      const success = switchAisle(gameState, 'non-existent-aisle');
      expect(success).toBe(false);
    });
  });
});
