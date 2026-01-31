import fs from 'fs/promises';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'league_data.json');

export interface Player {
    id: string;
    name: string;
    played: number;
    won: number;
    drawn: number;
    lost: number;
    goalsFor: number;
    goalsAgainst: number;
    points: number;
}

export interface Match {
    id: string;
    date: string;
    homePlayerId: string;
    awayPlayerId: string;
    homeScore: number;
    awayScore: number;
}

export interface LeagueData {
    players: Player[];
    matches: Match[];
    fixtures: Match[];
}

const INITIAL_DATA: LeagueData = {
    players: [],
    matches: [],
    fixtures: [],
};

export async function getLeagueData(): Promise<LeagueData> {
    try {
        const data = await fs.readFile(DATA_FILE, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        // If file doesn't exist or is invalid, return initial data
        return INITIAL_DATA;
    }
}

export async function saveLeagueData(data: LeagueData): Promise<void> {
    await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2));
}
