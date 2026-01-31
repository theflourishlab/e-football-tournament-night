'use server';

import { getLeagueData, saveLeagueData, Player, Match, LeagueData } from '@/lib/storage';
import { revalidatePath } from 'next/cache';
import { v4 as uuidv4 } from 'uuid';

export async function addPlayer(name: string) {
    const data = await getLeagueData();

    if (data.players.some(p => p.name.toLowerCase() === name.toLowerCase())) {
        throw new Error('Player already exists');
    }

    const newPlayer: Player = {
        id: uuidv4(),
        name,
        played: 0,
        won: 0,
        drawn: 0,
        lost: 0,
        goalsFor: 0,
        goalsAgainst: 0,
        points: 0,
    };

    data.players.push(newPlayer);
    await saveLeagueData(data);
    revalidatePath('/');
    return { success: true };
}

export async function addMatch(homePlayerId: string, awayPlayerId: string, homeScore: number, awayScore: number) {
    const data = await getLeagueData();

    const homePlayer = data.players.find(p => p.id === homePlayerId);
    const awayPlayer = data.players.find(p => p.id === awayPlayerId);

    if (!homePlayer || !awayPlayer) {
        throw new Error('Player not found');
    }

    // Update Match History
    const newMatch: Match = {
        id: uuidv4(),
        date: new Date().toISOString(),
        homePlayerId,
        awayPlayerId,
        homeScore,
        awayScore,
    };
    data.matches.push(newMatch);

    // Update Home Player Stats
    homePlayer.played += 1;
    homePlayer.goalsFor += homeScore;
    homePlayer.goalsAgainst += awayScore;

    // Update Away Player Stats
    awayPlayer.played += 1;
    awayPlayer.goalsFor += awayScore;
    awayPlayer.goalsAgainst += homeScore;

    if (homeScore > awayScore) {
        homePlayer.won += 1;
        homePlayer.points += 3;
        awayPlayer.lost += 1;
    } else if (awayScore > homeScore) {
        awayPlayer.won += 1;
        awayPlayer.points += 3;
        homePlayer.lost += 1;
    } else {
        homePlayer.drawn += 1;
        homePlayer.points += 1;
        awayPlayer.drawn += 1;
        awayPlayer.points += 1;
    }

    await saveLeagueData(data);
    revalidatePath('/');
    return { success: true };
}

export async function resetLeague() {
    const data = await getLeagueData();
    // Keep players but reset stats
    data.players = data.players.map(p => ({
        ...p,
        played: 0,
        won: 0,
        drawn: 0,
        lost: 0,
        goalsFor: 0,
        goalsAgainst: 0,
        points: 0
    }));
    data.matches = [];
    await saveLeagueData(data);
    revalidatePath('/');
    return { success: true };
}

export async function clearAllData() {
    // Completely wipe all data - delete all players and matches
    const emptyData: LeagueData = {
        players: [],
        matches: [],
        fixtures: [],
    };
    await saveLeagueData(emptyData);
    revalidatePath('/');
    return { success: true };
}

export async function generateFixtures() {
    const data = await getLeagueData();
    const players = [...data.players];

    if (players.length < 2) {
        throw new Error('Need at least 2 players to generate fixtures');
    }

    // Round Robin Algorithm
    // If odd number of players, add a dummy player
    if (players.length % 2 !== 0) {
        players.push({ id: 'bye', name: 'Bye', played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, points: 0 });
    }

    const numPlayers = players.length;
    const numRounds = numPlayers - 1;
    const halfSize = numPlayers / 2;

    const fixtures: Match[] = [];

    const playerIds = players.map(p => p.id);

    for (let round = 0; round < numRounds; round++) {
        for (let i = 0; i < halfSize; i++) {
            const home = playerIds[i];
            const away = playerIds[numPlayers - 1 - i];

            if (home !== 'bye' && away !== 'bye') {
                fixtures.push({
                    id: uuidv4(),
                    date: new Date().toISOString(), // Placeholder date, maybe we can add "Round X" metadata later if needed
                    homePlayerId: home,
                    awayPlayerId: away,
                    homeScore: -1, // -1 indicates not played
                    awayScore: -1,
                });
            }
        }

        // Rotate playerIds array (keep first element fixed)
        playerIds.splice(1, 0, playerIds.pop()!);
    }

    data.fixtures = fixtures;
    await saveLeagueData(data);
    revalidatePath('/');
    return { success: true };
}

export async function updateFixture(fixtureId: string, homeScore: number, awayScore: number) {
    const data = await getLeagueData();

    const fixtureIndex = data.fixtures.findIndex(f => f.id === fixtureId);
    if (fixtureIndex === -1) {
        throw new Error('Fixture not found');
    }

    const fixture = data.fixtures[fixtureIndex];

    // Update fixture status
    fixture.homeScore = homeScore;
    fixture.awayScore = awayScore;

    // Add to matches history
    const newMatch: Match = {
        ...fixture,
        id: fixture.id
    };

    // Check if match already exists in matches (idempotency)
    const existingMatchIndex = data.matches.findIndex(m => m.id === fixture.id);
    if (existingMatchIndex === -1) {
        data.matches.push(newMatch);

        // Update player stats only if it wasn't already recorded
        await updatePlayerStats(data, fixture.homePlayerId, fixture.awayPlayerId, homeScore, awayScore);
    } else {
        // If it exists, we might want to update the score? 
        // For now, let's assume we just update the stats if we were editing, but that's complex (need to revert old stats).
        // Let's assume this is a one-time record action for now.
        throw new Error('Match result already recorded');
    }

    await saveLeagueData(data);
    revalidatePath('/');
    return { success: true };
}

async function updatePlayerStats(data: LeagueData, homePlayerId: string, awayPlayerId: string, homeScore: number, awayScore: number) {
    const homePlayer = data.players.find(p => p.id === homePlayerId);
    const awayPlayer = data.players.find(p => p.id === awayPlayerId);

    if (!homePlayer || !awayPlayer) {
        throw new Error('Player not found');
    }

    // Update Home Player Stats
    homePlayer.played += 1;
    homePlayer.goalsFor += homeScore;
    homePlayer.goalsAgainst += awayScore;

    // Update Away Player Stats
    awayPlayer.played += 1;
    awayPlayer.goalsFor += awayScore;
    awayPlayer.goalsAgainst += homeScore;

    if (homeScore > awayScore) {
        homePlayer.won += 1;
        homePlayer.points += 3;
        awayPlayer.lost += 1;
    } else if (awayScore > homeScore) {
        awayPlayer.won += 1;
        awayPlayer.points += 3;
        homePlayer.lost += 1;
    } else {
        homePlayer.drawn += 1;
        homePlayer.points += 1;
        awayPlayer.drawn += 1;
        awayPlayer.points += 1;
    }
}
