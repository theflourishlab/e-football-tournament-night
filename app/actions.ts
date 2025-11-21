'use server';

import { getLeagueData, saveLeagueData, Player, Match } from '@/lib/storage';
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
