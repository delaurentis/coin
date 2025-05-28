# Coin-spiracy - A Coin Weighing Puzzle Game

Coinspiracy is an interactive web-based implementation of the classic coin weighing puzzle. In this puzzle game, you need to identify the single "weighted" coin among a set of identical-looking coins using a balance scale.  This version features a special mode for adverserial play that always presents the worst case scenario to the player.  Thus the name, coin-spiracy.

## Demo

Visit https://coin.retrorabbit.games/ for a live demo.

## Game Concept

The game presents you with 12 coins, one of which is slightly heavier than the others. Your task is to find this heavier coin by strategically weighing groups of coins against each other on a balance scale. The challenge is to find the weighted coin in as few weighings as possible.

## How to Play

1. **Select a side of the scale** (left or right) where you want to place coins
2. **Click on coins** to add them to the selected side of the scale
3. **Click the "Weigh" button** to compare the weights of the coins on each side
4. **Analyze the result** - the scale will tip toward the heavier side or remain balanced if both sides weigh the same
5. **Continue weighing** different combinations of coins to narrow down which coin is heavier
6. **Make your guess** by clicking on the coin you believe is weighted when you've gathered enough information

The game tracks the number of weighings you've made, challenging you to find the weighted coin in the minimum number of weighings possible.

## Game Modes

Coinspiracy offers two distinct game modes:

1. **Random Mode**: The weighted coin is randomly selected at the start of the game. The scale behaves according to the physical properties of the coins.

2. **Worst Case Mode**: The game dynamically determines the weighing results to make the puzzle as challenging as possible. This mode ensures you need to use an optimal strategy to solve the puzzle efficiently.

## Special Features

### Hint Mode

Press 'H' to toggle hint mode. When active, coins that are potential candidates for being the weighted coin (based on your previous weighings) are highlighted in silver. This helps you visualize which coins have been eliminated and which remain as possibilities.

### Game Log

Press 'L' to toggle the game log. The log records all your previous weighings, showing which coins were on each side of the scale and the result. This helps you keep track of your progress and analyze your strategy.

### Game State Persistence

The game automatically saves your progress to local storage, allowing you to continue your game even if you close your browser or refresh the page.

## Technical Implementation

Coinspiracy is built with:
- React with TypeScript for the UI and game logic
- CSS Modules for component-specific styling
- Local Storage API for game state persistence

The game implements algorithms to:
- Track potential weighted coins based on weighing history
- Implement the worst-case strategy for maximum challenge

## Installation and Running

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Start the development server:
   ```
   npm start
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Building for Production

To create a production build:
```
npm run build
```

This generates optimized files in the `build` folder that can be deployed to any static hosting service.

## Credits

Coin-spiracy was written by Pete DeLaurentis, based on the classic coin weighing puzzle and ideas from math camp director Dr. Susan Durst.
