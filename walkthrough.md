# eFootball Tournament App Walkthrough

## Overview
A Next.js application to track eFootball tournament scores among friends. It features a Premier League-style table, match recording, and player management, with a premium dark-mode UI.

## Features
- **League Table**: Automatically sorted by Points, then Goal Difference, then Goals For.
- **Match Recording**: Simple interface to log scores between players.
- **Player Management**: Add new players to the league.
- **Persistence**: Data is saved to `league_data.json` in the project root, making it easy to backup.
- **Premium UI**: Dark mode, glassmorphism effects, and smooth animations using Framer Motion.

## How to Run
1. **Install Dependencies**:
   ```bash
   npm install
   ```
2. **Start Development Server**:
   ```bash
   npm run dev
   ```
3. **Open Browser**:
   Navigate to `http://localhost:3000`.

## Usage Guide
### Adding Players
1. Go to the "Manage Players" tab.
2. Enter a player name and click "Add Player".
3. Repeat for all participants.

### Recording Matches
1. Go to the "Record Match" tab.
2. Select Home and Away players.
3. Enter the scores.
4. Click "Update Table".
5. The League Table will update automatically with animations.

## Data Backup
To backup your league data, simply copy the `league_data.json` file from the project root to a safe location (e.g., Google Drive, Dropbox).

## Tech Stack
- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS v4
- **UI Components**: Shadcn UI (manually configured)
- **Animations**: Framer Motion & Tailwindcss-animate
- **Icons**: Lucide React
