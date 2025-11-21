'use client';

import { Player } from '@/lib/storage';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface LeagueTableProps {
    players: Player[];
}

export function LeagueTable({ players }: LeagueTableProps) {
    // Sort players: Points -> GD -> GF
    const sortedPlayers = [...players].sort((a, b) => {
        if (b.points !== a.points) return b.points - a.points;
        const gdA = a.goalsFor - a.goalsAgainst;
        const gdB = b.goalsFor - b.goalsAgainst;
        if (gdB !== gdA) return gdB - gdA;
        return b.goalsFor - a.goalsFor;
    });

    return (
        <div className="w-full overflow-hidden rounded-xl border bg-card/50 backdrop-blur-sm shadow-lg">
            <Table>
                <TableHeader className="bg-muted/50">
                    <TableRow>
                        <TableHead className="w-12 text-center font-bold">#</TableHead>
                        <TableHead className="font-bold">Club</TableHead>
                        <TableHead className="text-center font-bold">MP</TableHead>
                        <TableHead className="text-center font-bold">W</TableHead>
                        <TableHead className="text-center font-bold">D</TableHead>
                        <TableHead className="text-center font-bold">L</TableHead>
                        <TableHead className="text-center font-bold">GF</TableHead>
                        <TableHead className="text-center font-bold">GA</TableHead>
                        <TableHead className="text-center font-bold">GD</TableHead>
                        <TableHead className="text-center font-bold text-primary text-lg">Pts</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {sortedPlayers.map((player, index) => (
                        <motion.tr
                            key={player.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className={cn(
                                "group transition-colors hover:bg-muted/50",
                                index < 4 ? "border-l-4 border-l-primary" : "border-l-4 border-l-transparent"
                            )}
                        >
                            <TableCell className="text-center font-medium">{index + 1}</TableCell>
                            <TableCell className="font-semibold text-lg">{player.name}</TableCell>
                            <TableCell className="text-center">{player.played}</TableCell>
                            <TableCell className="text-center text-green-500 font-medium">{player.won}</TableCell>
                            <TableCell className="text-center text-yellow-500 font-medium">{player.drawn}</TableCell>
                            <TableCell className="text-center text-red-500 font-medium">{player.lost}</TableCell>
                            <TableCell className="text-center opacity-70">{player.goalsFor}</TableCell>
                            <TableCell className="text-center opacity-70">{player.goalsAgainst}</TableCell>
                            <TableCell className="text-center font-bold">
                                {player.goalsFor - player.goalsAgainst > 0 ? '+' : ''}
                                {player.goalsFor - player.goalsAgainst}
                            </TableCell>
                            <TableCell className="text-center font-black text-xl text-primary">
                                {player.points}
                            </TableCell>
                        </motion.tr>
                    ))}
                    {sortedPlayers.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={10} className="h-24 text-center text-muted-foreground">
                                No teams in the league yet. Add players to get started.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
