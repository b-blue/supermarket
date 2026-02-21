/**
 * Layout and UI configuration constants
 * Centralized layout system for consistent positioning across scenes
 */

export const LayoutConfig = {
  // Game canvas dimensions
  game: {
    width: 1024,
    height: 768,
  },

  // Margins and padding
  margins: {
    standard: 16,
    small: 8,
    large: 24,
  },

  // Sales Floor layout
  salesFloor: {
    // Left side: shelves
    shelves: {
      x: 16,
      y: 80,
      width: 500,
      height: 650,
      padding: 12,
    },

    // Right side: cart
    cart: {
      x: 536,
      y: 80,
      width: 472,
      height: 650,
      slotSize: 80,
      slotGap: 8,
      slotsPerRow: 4,
    },

    // Top: location cards
    locationCards: {
      x: 16,
      y: 16,
      width: 992,
      height: 56,
      cardWidth: 120,
      cardHeight: 48,
      cardGap: 12,
      indicatorRadius: 8,
    },

    // Navigation button
    goToStockroomButton: {
      x: 850,
      y: 710,
      width: 158,
      height: 42,
    },
  },

  // Stockroom layout
  stockroom: {
    // Bottom left: cart
    cart: {
      x: 16,
      y: 600,
      width: 280,
      height: 152,
      slotSize: 60,
      slotGap: 8,
      slotsPerRow: 3,
    },

    // Top: category tabs
    tabs: {
      x: 16,
      y: 16,
      width: 280,
      height: 560,
      tabHeight: 48,
      tabGap: 4,
    },

    // Right: inventory grid
    inventory: {
      x: 316,
      y: 16,
      width: 692,
      height: 736,
      itemSize: 80,
      itemGap: 12,
      itemsPerRow: 7,
    },

    // Navigation button
    returnToSalesFloorButton: {
      x: 850,
      y: 710,
      width: 158,
      height: 42,
    },
  },

  // Button styling
  button: {
    fontSize: 16,
    fontFamily: 'Arial',
    backgroundColor: 0x4a90e2,
    hoverColor: 0x357abd,
    textColor: '#ffffff',
  },

  // Text styling
  text: {
    fontSize: 16,
    fontFamily: 'Arial',
    color: '#000000',
  },

  // Animation timing
  transitions: {
    slideOutDuration: 400, // ms
    slideInDuration: 400, // ms
  },
} as const;
