# Checkers Pro — Premium Russian Draughts Web Game

A complete, production-ready, browser-based Checkers (Russian Draughts / Shashki) web application built with **React**, **TypeScript**, **Vite**, **CSS3**, **Motion for React**, and **Vitest**.

Zero backend required — runs entirely client-side and is ready for instantaneous deployment to **Vercel** as a static site.

---

## 🌟 Features & Highlights

### 1. Game Modes
- **Mode A: Local Two-Player**
  - Pass & play on the same screen (desktop, tablet, or phone).
  - Turn indicators, mandatory capture enforcement, captured piece tallies, and move history.
- **Mode B: Play Against Computer (AI)**
  - **Easy**: Beatable for beginners, prefers available captures with slight randomness.
  - **Medium**: Evaluates center control, material advantage, piece advancement, and shallow minimax search.
  - **Hard**: Deep Minimax with Alpha-Beta Pruning, move ordering (captures & promotions first), king mobility heuristics, and time-budgeted calculations without freezing the UI.

### 2. Full Russian Checkers (Shashki) Rules Engine
- **8×8 Board** with 32 playable dark squares (`a1` is dark, rows 1–8 and columns a–h).
- **Mandatory Captures**: If one or more capture moves are available, the player MUST capture.
- **Backward Captures for Men**: Ordinary men move forward diagonally, but can capture both **forward AND backward**.
- **Flying Kings (Dames)**: Kings slide across any number of empty squares along open diagonals, and can jump enemy pieces at distance landing on any empty square behind them.
- **In-Flight King Promotion ("Flying Promotion")**: If an ordinary man reaches the opponent's back rank during a multi-capture sequence, it immediately promotes to a King and continues jumping as a king on that same turn if further captures are available.
- **Multi-Capture Sequences & Turkish Strike**: Pieces must continue jumping until no further captures remain; jumping the same enemy piece twice in one turn is illegal.
- **Win Detection**: Opponent eliminated (no pieces remaining) OR opponent blocked (no legal moves on their turn).
- **Supported Draw Rules**:
  - **Threefold Repetition**: Same position occurs 3 times.
  - **30-Ply Kings Rule**: 30 consecutive half-moves (15 moves each) with kings without any captures or man moves.

### 3. Visual & Audio Polish
- **Aesthetic**: Obsidian navy theme (`#070a14`), tactile 3D checker pieces with concentric rings, ruby and pearlescent ivory gradients, and royal gold crowns for kings.
- **Themes**: Switchable between **Classic**, **Wood**, and **Slate** boards.
- **Fluid Animations**: Powered by `motion/react` with spring physics and layout morphing.
- **Web Audio API**: 100% self-contained synthesized sounds for piece selection, moves, captures, king promotions, and victory fanfare (zero external audio files, zero 404s).
- **Responsive & Accessible**: Adapts to any viewport from mobile phones to 4K displays. Touch-friendly targets (≥44px), keyboard navigation (`Tab`, `Enter`, `Space`), and reduced-motion support.

### 4. Move History & Full Undo
- Algebraic notation stream (e.g. `c3-d4`, `c3:e5:g7`).
- Auto-scrolls to latest move and displays captured piece tallies.
- **Undo Move**: In 2-player mode, reverts 1 turn. In vs-computer mode, reverts both human and computer turns together.

---

## 📁 Project Architecture

```
checkers/
├── index.html                   # HTML entry point with SEO metadata and SVG crown favicon
├── package.json                 # Dependencies and npm scripts
├── tsconfig.json                # Project TypeScript configuration
├── tsconfig.app.json            # Strict TypeScript configuration for app
├── vite.config.ts               # Vite & Vitest configuration
├── public/                      # Static assets
└── src/
    ├── main.tsx                 # React application mounting
    ├── App.tsx                  # Root component orchestrating views & modals
    ├── types/
    │   └── game.ts              # Core TypeScript interfaces & types
    ├── engine/
    │   ├── board.ts             # Board initialization, cloning, hashing, coordinates
    │   ├── moves.ts             # Simple move generation, mandatory capture enforcement
    │   ├── captures.ts          # Recursive multi-capture DFS, flying kings, in-flight promotion
    │   ├── applyMove.ts         # Immutable move application
    │   ├── gameStatus.ts        # Victory, loss by blockade, threefold repetition & 30-ply draw
    │   └── notation.ts          # Checkers algebraic notation helpers
    ├── ai/
    │   ├── evaluation.ts        # Material, advancement, center control, mobility heuristics
    │   ├── minimax.ts           # Alpha-Beta minimax search with move ordering
    │   └── computerPlayer.ts    # Easy, Medium, and Hard AI move selectors
    ├── services/
    │   ├── soundService.ts      # Web Audio API synthesized audio effects
    │   └── storageService.ts    # Safe LocalStorage persistence & validation
    ├── hooks/
    │   └── useGame.ts           # Master game state, turn flow, and undo controller
    ├── components/
    │   ├── board/
    │   │   ├── GameBoard.tsx    # 8x8 grid with coordinates and theme frame
    │   │   ├── BoardSquare.tsx  # Square target rings, selection, accessibility
    │   │   └── CheckerPiece.tsx # 3D animated piece with spring physics and king crowns
    │   ├── game/
    │   │   ├── GameHeader.tsx   # Top header with logo, sound toggle, restart
    │   │   ├── GameStatusBanner.tsx # Turn, AI thinking, and capture alert badges
    │   │   ├── MoveHistory.tsx  # Player cards, counters, and move history stream
    │   │   ├── GameControls.tsx # Undo, New Game, Theme switcher
    │   │   ├── GameOverModal.tsx# Victory/Draw dialog with confetti
    │   │   └── RulesModal.tsx   # Russian draughts rules guide
    │   └── menu/
    │       ├── MainMenu.tsx     # Landing menu with mode & theme selectors
    │       └── DifficultySelector.tsx # Easy / Medium / Hard AI controls
    ├── styles/
    │   ├── index.css            # Design tokens, typography, glassmorphism, buttons
    │   └── board.css            # Board styling, tactile pieces, responsive layout
    └── test/
        └── engine.test.ts       # Automated Vitest test suite (21 unit & edge case tests)
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher recommended, tested on v22.13.1)
- npm (v9 or higher, tested on 10.9.2)

### Installation
```bash
npm install
```

### Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your web browser.

### Run Automated Tests
```bash
npm run test
```
Runs 21 Vitest unit and edge-case tests validating:
1. Initial board setup and piece distribution
2. Legal ordinary moves
3. Illegal moves
4. Forward movement restrictions for men
5. Backward captures under Russian rules
6. Mandatory captures enforcement
7. Multi-capture sequences
8. King movement (flying king)
9. King captures across distance
10. King promotion upon reaching back rank
11. Promotion during captures (in-flight promotion)
12. Turn switching
13. Captured piece removal
14. Win detection (elimination and blockade)
15. Draw conditions (Threefold repetition and 30-ply rule)
16. Undo and state restoration
17. AI legal-move generation for Easy, Medium, and Hard
18. AI handling of positions with no legal moves
19. Flying king jumping restrictions
20. Friendly piece blocking
21. Turkish strike (preventing double jump on the same piece)

### Production Build
```bash
npm run build
```
Creates an optimized static bundle in the `dist/` directory.

### Preview Production Build
```bash
npm run preview
```

---

## 🚢 Vercel Deployment Instructions

Deploying this project to Vercel is completely zero-config:

### Option 1: Via Vercel Web Dashboard (Recommended)
1. Go to [vercel.com](https://vercel.com) and log in with your GitHub account.
2. Click **"Add New..."** -> **"Project"**.
3. Select your repository `Soxibjon02/checkers`.
4. Vercel automatically detects the Vite preset:
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
5. Click **"Deploy"**. The site will be live on a secure HTTPS URL in under 60 seconds!

### Option 2: Via Vercel CLI
```bash
npm i -g vercel
vercel
```
Follow the interactive prompts to deploy directly from your terminal.

---

## 📜 License
MIT License. Open source and free to use.
