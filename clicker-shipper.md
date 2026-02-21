# Circle Shipper

> **Status:** This document describes a separate game from Supermarket Sorting. Integration with the main Intergalactic Supermarket project is pending.

---

## Overview
In **Circle Shipper**, the player fulfills orders for items by finding them using a rotary dial to sort through inventory. The player starts without knowing item locations but gradually learns through gameplay, eventually entering a "flow state" where they can complete orders efficiently.

---

## Core Mechanics

### The Dial System
- A circular dial displays up to 6 items at a time
- Player clicks on an item to select it and rotate the dial
- Selected item moves to the center of the dial
- Process either continues (multi-level dial) or adds item to the box (terminal dial)

### Order Fulfillment
1. An order appears showing required items (e.g., Cake ×1, Sushi ×2)
2. Player uses the dial to navigate to each required item
3. Click-ups on items select them and add them to the shipment
4. Order must be completed within optional budget constraints

### Learning & Flow State
- **Initial Phase:** Player doesn't know where items are on the dial
- **Discovery Phase:** Repeated orders teach item locations through inference
- **Flow State:** Player becomes proficient and completes orders quickly
- **Progression:** New items are gradually added to the dial, extending the learning curve

---

## Difficulty Elements

### Dial Complexity
- Starting dial configuration: ~3-4 items
- Gradually expands to maximum of 6 items
- New items added as rewards/progression

### Order Variety
- **Simple Orders:** 1-2 items of the same type
- **Complex Orders:** 3+ items of different types
- **Budget Orders:** Orders that have a cost limit; player must ensure order value doesn't exceed budget
- **Vague Descriptions:** Items in orders may have unclear or cryptic names, requiring pattern recognition

### Speed Scaling
- Order arrival rate can be adjusted
- Later game may have tighter time limits or fast-arriving orders
- Encourages faster decision-making and memorization

---

## UI Elements

### Dial Display
- Circular arrangement of items (emojis or icons)
- Center position highlighted (current selection)
- Click on any item to select and rotate dial

### Order List
- Small area beside the dial displaying current order requirements
- Shows item emoji, quantity required, and cost
- Updates as items are added to the box

### Shipment Box
- Variable-sized containers based on order complexity
- Visual representation of collected items
- Displays order completion progress

### Budget Indicator (Optional Orders)
- Shows maximum budget for the order
- Tracks current box value
- Warns if approaching or exceeding budget

---

## Progression

### Unlockables
- **New Items:** Additional items unlock on the dial
- **Speed Increases:** Orders arrive faster as player improves
- **Complexity:** Orders require more varied items and tighter timing
- **Dial Size Expansion:** Dial can display more items simultaneously

### Rewards
- Currency earned per completed order
- Performance bonuses for fast/efficient completion
- Unlock achievements or stats tracking

---

## Design Philosophy

The game trains pattern recognition and spatial memory through repeated interaction with a limited set of items. The satisfaction comes from mastery—the transformation from confused searching to confident, rapid order fulfillment represents genuine skill development.

