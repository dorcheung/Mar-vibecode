# Vibecoding - Interactive Game Portfolio

A collection of interactive web applications built with vanilla JavaScript, HTML, and CSS.

## Overview

**Vibecoding** is a project portfolio featuring two distinct interactive games: **BiochemApp** (educational biochemistry game) and **NewsApp** (action-based news delivery game). Both applications combine fun interactive mechanics with engaging gameplay.

## Features

### 1. **BiochemApp - Biochem Brew**
- Click the beaker button to "synthesize" and display random biochemistry facts
- 20 amino acids float around the screen with particle-like animations
- Fetches molecular structure images from PubChem API
- Unlocks a hidden Pac-Man-style maze game with interactive gameplay
- ~15 carefully curated biochemistry facts

### 2. **NewsApp - Breaking News Delivery**
- Dynamic physics-based movement with gravity mechanics
- Score tracking system for each successful news delivery
- 3-life health system with invincibility frames after hits
- Real-time score and lives display
- Beautiful space theme with animated night sky backdrop

## Technical Architecture

### File Structure
```
Vibecoding/
├── BiochemApp/
│   ├── index.html       # Main HTML structure and UI layout
│   ├── script.js        # Main application logic and fact system
│   ├── game.js          # Maze game engine and player mechanics
│   ├── style.css        # Styling and animations
│   └── facts.json       # Biochemistry facts database
│
├── NewsApp/
│   ├── index.html       # Main game interface
│   ├── game.js          # Core game logic and mechanics
│   ├── script.js        # Additional functionality
│   ├── style.css        # Styling and animations
│   └── NewsFetch.md     # Project documentation
│
└── README.md            # Documentation
```

### Core Components - BiochemApp

#### **script.js - Main Application**
- **Fact Management**: Loads facts from JSON and displays random selections
- **Amino Acid Spawning**: Creates floating amino acid particles with PubChem API integration
- **Event Handling**: Manages beaker clicks and UI state transitions
- **Easter Egg Logic**: Detects click patterns to unlock the game

#### **game.js - Game Engine**
- **Maze System**: 
  - Uses a 2D array where: 1 = walls, 0 = pills, 2 = player start position
  - 15x11 grid with strategic wall patterns
  - Total pill count calculated at game start
  
- **Player Physics**:
  - Position-based movement system with velocity (vx, vy)
  - Speed: 3 pixels per frame
  - Collision detection prevents movement through walls
  - 8-directional movement (arrow keys or WASD)
  
- **Rendering Loop**:
  - Canvas-based animation at 60+ FPS
  - Player rendered with animated Pac-Man effect

#### **style.css - Visual Design**
- **Glass Morphism**: Semi-transparent panel with backdrop blur
- **Glow Effects**: Neon-style buttons with hover animations
- **Responsive Layout**: Adapts to different screen sizes
- **Color Scheme**: Purple/cyan cyberpunk aesthetic with animated gradients

#### **facts.json - Content Database**
- Array of biochemistry facts covering:
  - Enzyme kinematics and catalysis
  - Metabolic pathways (Krebs Cycle, electron transport chain)
  - Vitamin and mineral biochemistry
  - Protein synthesis and degradation
  - DNA replication accuracy

### Core Components - NewsApp

#### **game.js - Game Logic**
- **Game Variables**: Canvas setup, score tracking, lives management, frames counter
- **Gravity System**: GRAVITY = 0.4, JUMP_INITIAL = -5.8, MAX_HOLD_FRAMES = 18
- **Player Mechanics**: Position-based movement with physics
- **Collision Detection**: Obstacle avoidance and ground collision
- **Scoring System**: Points for collecting news items

#### **script.js - Additional Functionality**
- **UI Management**: Score display and lives display updates
- **Event Handling**: Input processing and game state management
- **Animation Loop**: Rendering at 60+ FPS

#### **style.css - Visual Design**
- **Space Theme**: Night sky backdrop with stars and animated elements
- **Glass Effects**: Semi-transparent UI panels
- **Responsive Design**: Adapts to different screen sizes
- **Animation Effects**: Smooth transitions and visual feedback

## How It Works

### BiochemApp User Flow

1. **Initial Load**
   - Page displays main panel with "Biochem Brew" title
   - Facts.json loads asynchronously
   - Amino acids begin spawning with fade-in animations

2. **Interact with Beaker**
   - User clicks beaker button
   - Beaker animation triggers
   - Random fact displays from facts.json

3. **Unlock Easter Egg**
   - Click on the fact text area
   - "ATOMIC SOUP CREATED" overlay appears
   - "ENTER THE SOUP" button unlocks the maze game

4. **Play Maze Game**
   - Use Arrow keys or WASD to move
   - Navigate through the maze to collect pills
   - Collect all pills to trigger victory screen
   - Random cat image displays as reward

### NewsApp User Flow

1. **Game Start**
   - Press any key or click to begin
   - Player character appears in game world with space backdrop

2. **Active Gameplay**
   - Use arrow keys or WASD to move
   - Hold spacebar to jump with hold mechanics
   - Collect news items for points
   - Avoid obstacles to maintain lives

3. **Game Over**
   - Lose all 3 lives and game ends
   - Final score displayed
   - Option to restart

## Technologies Used

- **HTML5**: Semantic markup and canvas for game rendering
- **CSS3**: Glass morphism, animations, gradients, responsive design
- **Vanilla JavaScript**: No frameworks, pure DOM manipulation and game logic
- **Canvas API**: 2D graphics for game rendering
- **PubChem API**: Molecular structure data (BiochemApp only)
- **JSON**: Data storage for facts (BiochemApp only)

## How to Run

### BiochemApp
1. Navigate to `BiochemApp` directory
2. Open `index.html` in a modern web browser
3. Click the beaker to see biochemistry facts
4. Click the fact text to unlock the maze game

### NewsApp
1. Navigate to `NewsApp` directory
2. Open `index.html` in a modern web browser
3. Press any key or click to start
4. Use arrow keys/WASD to move, spacebar to jump

## Expandability

### BiochemApp
- **Add Facts**: Simply add new biochemistry facts to `facts.json`
- **Add Amino Acids**: Extend the `AMINO_ACIDS` array in `script.js` with new CIDs from PubChem
- **Modify Maze**: Edit the `initialMaze` 2D array in `game.js` to create new maze layouts
- **Customize Styling**: Adjust CSS variables and animation timings in `style.css`

### NewsApp
- **Add Obstacles**: Modify obstacle arrays in `game.js`
- **Adjust Physics**: Tweak gravity and jump constants for different feel
- **New Items**: Add collectible types in the scoring system
- **Difficulty Levels**: Implement progressive difficulty scaling

## Browser Compatibility

- Modern browsers with ES6 support
- Canvas API support required
- Recommended: Chrome, Firefox, Safari, Edge (latest versions)

## License

Educational project for biochemistry learning.
