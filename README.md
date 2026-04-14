# BiochemApp - Biochem Brew

An interactive web application that teaches biochemistry through engaging interactive elements, floating animations, and a hidden Pac-Man-style game.

## Overview

**Biochem Brew** is an educational game that combines fun interactive mechanics with real biochemistry facts. Click a beaker to synthesize random biochemistry facts, watch amino acids float across your screen, and unlock a hidden maze game.

## Features

### 1. **Fact Synthesis System**
- Click the beaker button to "synthesize" and display random biochemistry facts
- Facts range from enzyme kinetics to vitamin deficiencies
- Facts are loaded from `facts.json` for easy expansion
- Includes ~15 carefully curated biochemistry facts

### 2. **Interactive Amino Acid Animation**
- 20 amino acids float around the screen with particle-like animations
- Amino acids have random velocities, sizes, and opacity
- Creates a visually engaging background while educating users
- Fetches molecular structure images from PubChem API using SMILES representations
- Each amino acid has an associated CID (Compound ID) for data lookup

### 3. **Easter Egg - Pac-Man Style Game**
- Clicking the main text area triggers the "Atomic Soup" easter egg
- Unlocks an interactive maze game with:
  - **Player Controls**: Arrow keys or WASD to navigate
  - **Objective**: Collect all pills in the maze (Pac-Man style)
  - **Collision Detection**: Walls block movement, precise boundary checking
  - **Win Condition**: Collect all pills to complete the level
  - **Victory Screen**: Displays a random cat GIF as reward

## Technical Architecture

### File Structure
```
BiochemApp/
├── index.html       # Main HTML structure and UI layout
├── script.js        # Main application logic and fact system
├── game.js          # Maze game engine and player mechanics
├── style.css        # Styling and animations
├── facts.json       # Biochemistry facts database
└── README.md        # Documentation
```

### Core Components

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
  - Player rendered as an animated circle with:
    - Animated mouth (opening/closing for Pac-Man effect)
    - Rotation angle based on direction
    - Visual feedback during movement

#### **style.css - Visual Design**
- **Glass Morphism**: Semi-transparent panel with backdrop blur
- **Glow Effects**: Neon-style buttons with hover animations
- **Responsive Layout**: Adapts to different screen sizes
- **Color Scheme**: Purple/cyan cyberpunk aesthetic with animated gradients

#### **facts.json - Content Database**
- Array of biochemistry facts
- Each fact covers important biochemistry concepts:
  - Enzyme kinematics and catalysis
  - Metabolic pathways (Krebs Cycle, electron transport chain)
  - Vitamin and mineral biochemistry
  - Protein synthesis and degradation
  - DNA replication accuracy

## How It Works

### User Flow

1. **Initial Load**
   - Page displays main panel with "Biochem Brew" title
   - Facts.json loads asynchronously
   - Amino acids begin spawning with fade-in animations

2. **Interact with Beaker**
   - User clicks beaker button
   - Beaker animation triggers (stirring rod animation)
   - Random fact displays from facts.json
   - Amino acids spawn with new random properties

3. **Unlock Easter Egg**
   - Click on the fact text area
   - "ATOMIC SOUP CREATED" overlay appears
   - "ENTER THE SOUP" button unlocks the maze game

4. **Play Maze Game**
   - Use Arrow keys or WASD to move
   - Navigate through the maze to collect pills (shown as dots)
   - Each pill collected updates the score
   - Collect all pills to trigger victory screen
   - Random cat image displays as reward
   - Click "Quit Game" to return to main panel

## Biochemistry Facts Coverage

Topics included in the fact database:
- **Vitamin Chemistry**: B12 (cobalamin), C, B3 (niacin), scurvy, pellagra
- **Enzyme Kinetics**: Enzyme mistake rates, proofreading mechanisms
- **Energy Metabolism**: ATP production, brain energy usage, Krebs Cycle
- **Hemoglobin**: Bohr effect and oxygen affinity
- **Lipids**: Essential fatty acids and desaturase enzymes
- **Bile & Digestion**: Bile salt emulsification, iron absorption
- **Protein Modification**: Ubiquitin tagging for protein destruction
- **Genetic Code**: Selenocysteine and unique tRNA mechanisms

## Technologies Used

- **HTML5**: Semantic markup and canvas for game rendering
- **CSS3**: Glass morphism, animations, gradients, responsive design
- **Vanilla JavaScript**: No frameworks, pure DOM manipulation and game logic
- **Canvas API**: 2D graphics for maze game rendering
- **PubChem API**: Molecular structure data for amino acids
- **JSON**: Data storage for facts

## How to Run

1. Clone the repository
2. Open `index.html` in a modern web browser
3. Click the beaker to see biochemistry facts
4. Click the fact text to unlock the maze game

## Expandability

- **Add Facts**: Simply add new biochemistry facts to `facts.json`
- **Add Amino Acids**: Extend the `AMINO_ACIDS` array in `script.js` with new CIDs from PubChem
- **Modify Maze**: Edit the `initialMaze` 2D array in `game.js` to create new maze layouts
- **Customize Styling**: Adjust CSS variables and animation timings in `style.css`

## Browser Compatibility

- Modern browsers with ES6 support
- Canvas API support required
- Recommended: Chrome, Firefox, Safari, Edge (latest versions)

## License

Educational project for biochemistry learning.
