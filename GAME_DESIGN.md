# Intergalactic Supermarket - Game Design Document

## Overview
**Supermarket Sorting** is a singleplayer game in which the player fills the shelves of a grocery store. The player begins with items in a stockroom and must manage inventory flow: retrieving stacks from the stockroom, placing them on a cart, and then stocking individual items onto shelves. As items are purchased by customers, the player must continuously monitor shelves and restock them to maintain revenue. The game has infinite progression with no final win condition.

---

## Core Gameplay Loop

1. **Monitor Shelves** — Player views the Sales Floor to see which items are depleted
2. **Plan Route** — Decide which items need restocking first (cart has limited capacity)
3. **Retrieve from Stockroom** — Visit the stockroom and pick up stacks of needed items
4. **Stock Shelves** — Return to Sales Floor and place individual items onto shelves
5. **Earn Revenue** — Customers take items and generate currency (slower when shelves are empty)
6. **Repeat** — As items deplete again, the cycle continues

---

## Game Interface

### Layout
The game is divided into two distinct screens: the **Sales Floor** and the **Stockroom**.

#### Sales Floor
- **Left side:** Shelves displaying items in container arrangements (pyramids for apples, boxes for potatoes, etc.)
- **Right side:** Player's cart — a grid of slots with limited capacity
- **Top center:** Location cards showing available aisles with indicator dots:
  - **Red dot** = Player is not in this area
  - **Green dot** = Player is currently viewing this area
- Player can click location cards to view different aisles, each containing different shelves/items

#### Stockroom
- **Left side:** Player's cart (same grid as Sales Floor view, positioned bottom-left to correspond with Sales Floor cart location)
- **Right side:** Items organized in a grid format, sorted by tabs (Fruits, Vegetables, Drinks, etc.)
  - Each item displays a quantity badge indicating how many stacks remain
- Player can click tabs to filter by item type

---

## Interaction Model

### Stockroom → Cart (Click-Based)
1. Player clicks an item in the stockroom inventory
2. A stack of items (starting quantity: 3) is picked up and placed onto an empty cart slot
3. The quantity badge on the stockroom item decrements
4. When the stack quantity reaches 0, the stack vanishes from the stockroom

**Upgrade Potential:** Cart can hold more items, and initial stack size can increase beyond 3.

### Cart → Shelf (Click-Based, Single Items)
1. Player clicks and holds on a stack in their cart
2. Player clicks on an empty or occupied shelf position
3. One item from the stack is placed on the shelf
4. The stack's quantity badge decrements
5. If the stack reaches 0 items, it vanishes from the cart
6. **Multiple items per position:** A single shelf position can hold multiple items (e.g., a row of 3 red apples in a pyramid formation)

---

## Visual Representation

### Shelf Containers
Items are arranged in abstract but suggestive container formations:
- **Apples:** Small pyramid arrangement
- **Potatoes:** Square box arrangement
- **Mangoes, Pears, Peaches:** Linear arrangements (one-third column each)

These containers suggest real grocery store product displays and help the player intuitively understand item types and quantities.

### Cart
A simple grid of slots representing a shopping cart. Each slot can hold a stack of items with a quantity badge.

### Stockroom
Items displayed in a warehouse-style grid, organized by category tabs. Suggests bulk inventory storage.

---

## Customer System

### Customer Lifecycle
Customers automatically arrive, browse, and purchase items. The player cannot interrupt this behavior—the goal is to ensure items exist for customers to purchase.

#### States
1. **Arriving**
   - Customer enters the Sales Floor area
   - Customer's picture/avatar appears at the left side of the shelf
   
2. **Looking**
   - Customer searches for an item within the current aisle
   - A small, indeterminate progress circle appears beside the customer's picture
   - Game randomly selects an item type available in this aisle
   
3. **Retrieving** (if item is in stock)
   - The item disappears from the shelf, leaving an empty slot
   - The item appears beside the customer's head
   - If multiple items are retrieved: a quantity badge appears beside the item
   - Customer repeats the Looking → Retrieving cycle a variable number of times
   
4. **Not Found** (if item is out of stock)
   - No items are affected
   - A "Cancel" icon appears beside the customer's head
   - Customer skips Retrieving and proceeds to next item or departure
   
5. **Departure**
   - Customer fades out from the shelf area

### Currency & Progression
- **Revenue:** Currency increments each time a customer retrieves an item
- **Empty Shelves Penalty:** As shelves deplete, revenue generation slows (customers cannot purchase items that don't exist)
- **Restocking Motivation:** This creates a feedback loop where empty shelves reduce income, incentivizing the player to maintain stock
- **Offline Progression:** Currency continues to accumulate even when the player is in the stockroom (though at a slower rate if shelves are empty)

---

## Progression & Rewards

### Infinite Progression
The game has no win condition. It continues indefinitely as items deplete and the player restocks them.

### Unlockables
- **New Items:** Additional product types become available
- **New Shelf Areas:** Fresh aisles appear (positioned above or below the starting layout)
- **Cart Upgrades:** Additional cart slots become available, allowing the player to carry more items per trip
- **Stack Size Increase:** Initial stack size when picking items from the stockroom can increase beyond 3

### Difficulty Scaling
- More complex shelf layouts with more items
- Faster customer purchasing rates
- Larger variety of items requiring more frequent restocking decisions

---

## Shelves - Initial Layout

### Aisle 1 - Fruits

**Shelf Row 1 (Top):**
- Red apples — Small pyramid
- Green apples — Small pyramid

**Shelf Row 2 (Middle):**
- Mango — One-third column
- Pear — One-third column
- Peach — One-third column

**Shelf Row 3 (Bottom):**
- (To be determined)

---

## Technical Considerations

### State Management
- **Shelf inventory:** Tracks item quantities at each shelf position
- **Cart inventory:** Tracks stacks and their quantities in player's cart
- **Stockroom inventory:** Tracks available item stacks with quantities
- **Customer queue:** Active customers per aisle with their states and timing
- **Currency counter:** Total revenue accumulated

### Interactions
- Click-based selection system (no drag-and-drop)
- Location card navigation
- Item category tabs in stockroom
- Progress circle timers for customer actions

### Performance
- Potentially many customers active simultaneously
- Needs efficient shelf rendering
- Cart and stockroom grids should scroll if capacity is exceeded

### Testing & Quality Assurance
- **Unit Tests Required:** All new game features must include unit test coverage
- Test categories include: inventory logic, customer behavior, currency calculations, state transitions, collision detection
- Encourages modular, testable code architecture

### Asset Management
- **Emoji-to-PNG Transition Strategy:** Game will initially use emojis for rapid prototyping, but must be designed to easily swap to PNG assets later
- **Implementation Approach:** All item rendering should use a centralized asset manager that abstracts the source (emoji vs PNG)
- **Asset Configuration:** Items should be defined in a data-driven format (JSON or config file) that specifies:
  - Item name/ID
  - Current asset (emoji string or asset key)
  - Display dimensions/scale
  - Positioning rules (pyramid, box, linear layout)
- **Maintainability:** Changing from emoji to PNG should require only:
  - Updating the asset configuration file
  - Adding PNG files to the assets directory
  - No changes to game logic or scene code

---

## Art Style & Tone
- All-ages, family-friendly
- Emoji-based or simple, colorful graphics
- Abstract but suggestive of real grocery store environments
- No mature content or alcohol references

