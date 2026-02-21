# Intergalactic Supermarket

- Supermarket Sorting is a singleplayer game in which the player fills the shelves of a grocery store. The user begins the game with items in a stockroom and must place them onto a cart. From the cart, the player can then move items onto the shelves. Over time, items deplete and the user must review the shelves periodically to see what is missing, and note which items should be retrieved from the stockroom. 

## Game Interface
- The game's UI is divided into two areas: the "Sales Floor" and the "Warehouse." 
- The game begins on the first area, a section of the Sales Floor which shows several shelves of items with some of those items missing. These shelves with missing items are on the left side of the screen. 
- On the right side of the screen is the user's inventory. The inventory area represents a cart the player takes onto the floor of the supermarket to refill the store shelves. The cart can only hold a limited amount of items, however, so the player must prioritize certain items to be restocked first.
- Once the player has populated the cart with items, the player will drag the stacks of items from the cart onto empty spaces on the shelves. However, every time the player clicks such a stack onto an empty shelf space, only a single item is 
- Above the player's cart are several cards indicating a new location, typically an "aisle" which contains different shelves with different items. The player can click through these cards to view each aisle as many times as desired. 
- The cards have a red dot if the player is not in that area. The cards have a green dot if the user is in that area. 
- Over time the items on the shelves will dwindle, and the user will need to determine which items are in need of being restocked first. 

- To restock shelves the player needs to go to the "stockroom" location, which is among the location cards near the player's cart on the "sales floor" view. 
- Once in the "stockroom" the user is pushed to a second area, the "stockroom."
- In the stockroom the player's card is on the bottom left, which corresponds to its location in the bottom right of the screen when on the "sales floor." 
- In the stockroom, emojis appear on the right-hand side and are sorted by tabs into types (fruits, vegetables, drinks, etc.). The player can freely click through these tabs. 
- The player must drag a "stack" of items from the tabs on the right-hand side, and place the stack onto the cart. The stack has a quantity badge indicating how many times that item can be placed before the stack vanishes. 
- In this view, when items are placed onto the cart from the right-hand stockroom, or when items from the cart are placed into the stockroom, the entire stack is transferred. 


## Refilling Items
- Stacks of items are taken from the stockroom. Single items are placed onto the shelves. When an item is placed on a shelf, the number of the items in the player's hand decrements by one. If there is a single item left in the player's hand, as indicated by its quantity badge, and that single item is placed on a shelf, the stack in the player's hand disappears. 
- At the beginning of the game, players clicking on items in the stockroom will pick up a stack of 3 of that item, to place on their cart. This amount can be increased. 
- When a customer takes an item, a currency counter increments. This number is always moving even when customers are not visible on-screen (such as when the player is in the stockroom). The currency counter moves more slowly as shelves empty (when a Customer wants an item but it is not on the shelf, the customer does not pay for it). 
- Each shelf has a small "Customers" area where peoples' faces appear. These faces indicate the "timers" that remove items. For instance, the first person might be a man with a beard with a small circle "loading" indicator near his face. After a few seconds, a blueberry disappears from the shelf and appears near his face in place of the "loading" indicator. Then another loading indicator appears beside the blueberry, and an orange disappears from the shelf, and appears beside the blueberry. Then, the man leaves the area. 
- Customers can take more than one item from the shelf, in which case the image of the item beside the customer's face will have a small badge indicating the taken quantity. 
- Players can order new items at any time by paying for them using currency from the currency counter. 

## Customer States
- Customers proceed through the following states: 
  - Arriving. Customers arrive in a "section" by appearing at the top of the screen. The customer's picture is at the left-hand side of the screen. 
  - Looking. Customers look for their first item after arriving. This is indicated by a small loading indicator to the right of the customer's picture. 
    - While looking, the game logic selects a type of item that could appear in this "section" of the sales floor. 
		- If the item is found, the customer moves to the "Retrieving" state
		- If the item is not found, the customer will skip the "Retrieving" state and move into the "Not Found" state
  - Retrieving. The item is removed from the container (leaving an empty slot) and appears beside the customer's head. 
  - Not Found. No items are affected. A "Cancel" icon appears beside the customer's head. 
- Repeat. The process repeats a variable number of times, beginning with Looking and ending with Retrieving or Not Found. 
- Departure. The customer component fades from the stack of customers in the current area. 

## Progression
- New items and shelf areas are some of the rewards
- No liquor license, keep game all-ages/all-peoples
- New shelf areas could be positioned above or below the starting sales floor view
- Additional slots on the cart are opened up

## Shelves

### Shelf 1, Row 1
- Red apples, small pyramid
- Green apples, small pyramid

### Shelf 1, Row 2
- Mango, one-third column
- Pear, one-third column
- Peach, one-third column

