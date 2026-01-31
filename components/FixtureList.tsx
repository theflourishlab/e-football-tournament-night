'use client';

import { useState } from 'react';
import { Match, Player } from '@/lib/storage';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { updateFixture } from '@/app/actions';
import { Loader2, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FixtureListProps {
    fixtures: Match[];
    players: Player[];
}

export function FixtureList({ fixtures, players }: FixtureListProps) {
    const [selectedFixture, setSelectedFixture] = useState<Match | null>(null);
    const [homeScore, setHomeScore] = useState('');
    const [awayScore, setAwayScore] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (fixtures.length === 0) {
        return (
            <div className="text-center p-8 border rounded-lg bg-muted/20">
                <p className="text-muted-foreground">No fixtures generated yet.</p>
            </div>
        );
    }

    const getPlayerName = (id: string) => players.find(p => p.id === id)?.name || 'Unknown';

    const handleCardClick = (match: Match) => {
        if (match.homeScore !== -1) return; // Already played
        setSelectedFixture(match);
        setHomeScore('');
        setAwayScore('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedFixture || !homeScore || !awayScore) return;

        setIsSubmitting(true);
        try {
            await updateFixture(selectedFixture.id, parseInt(homeScore), parseInt(awayScore));
            setSelectedFixture(null);
        } catch (error) {
            console.error(error);
            alert('Failed to update fixture');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
                Upcoming Fixtures
                <span className="text-xs font-normal text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                    {fixtures.length}
                </span>
            </h3>
            <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-1">
                {fixtures.map((match) => {
                    const isPlayed = match.homeScore !== -1;
                    return (
                        <Card
                            key={match.id}
                            className={cn(
                                "overflow-hidden transition-all duration-200 border-muted/60 relative",
                                !isPlayed && "hover:shadow-md cursor-pointer hover:border-primary/50 group",
                                isPlayed && "bg-muted/30 opacity-80"
                            )}
                            onClick={() => handleCardClick(match)}
                        >
                            {isPlayed && (
                                <div className="absolute top-2 right-2 text-green-600">
                                    <CheckCircle2 className="h-4 w-4" />
                                </div>
                            )}
                            <CardContent className="p-4 flex items-center justify-between gap-3">
                                <div className="flex-1 text-right">
                                    <p className={cn("font-medium truncate leading-tight", isPlayed && "text-muted-foreground")} title={getPlayerName(match.homePlayerId)}>
                                        {getPlayerName(match.homePlayerId)}
                                    </p>
                                </div>

                                <div className="flex flex-col items-center justify-center min-w-[3rem]">
                                    {isPlayed ? (
                                        <div className="flex items-center gap-1 font-bold text-lg">
                                            <span>{match.homeScore}</span>
                                            <span className="text-muted-foreground text-sm">-</span>
                                            <span>{match.awayScore}</span>
                                        </div>
                                    ) : (
                                        <span className="text-[10px] font-bold text-muted-foreground/70 uppercase tracking-wider group-hover:text-primary transition-colors">VS</span>
                                    )}
                                </div>

                                <div className="flex-1 text-left">
                                    <p className={cn("font-medium truncate leading-tight", isPlayed && "text-muted-foreground")} title={getPlayerName(match.awayPlayerId)}>
                                        {getPlayerName(match.awayPlayerId)}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            <Dialog open={!!selectedFixture} onOpenChange={(open) => !open && setSelectedFixture(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Record Match Result</DialogTitle>
                    </DialogHeader>
                    {selectedFixture && (
                        <form onSubmit={handleSubmit} className="space-y-6 py-4">
                            <div className="flex items-center justify-between gap-4">
                                <div className="flex-1 text-center space-y-2">
                                    <Label className="text-muted-foreground">Home</Label>
                                    <div className="font-semibold text-lg truncate">
                                        {getPlayerName(selectedFixture.homePlayerId)}
                                    </div>
                                    <Input
                                        type="number"
                                        min="0"
                                        className="text-center text-2xl h-14 font-bold"
                                        value={homeScore}
                                        onChange={(e) => setHomeScore(e.target.value)}
                                        autoFocus
                                    />
                                </div>
                                <div className="text-2xl font-bold text-muted-foreground pt-6">:</div>
                                <div className="flex-1 text-center space-y-2">
                                    <Label className="text-muted-foreground">Away</Label>
                                    <div className="font-semibold text-lg truncate">
                                        {getPlayerName(selectedFixture.awayPlayerId)}
                                    </div>
                                    <Input
                                        type="number"
                                        min="0"
                                        className="text-center text-2xl h-14 font-bold"
                                        value={awayScore}
                                        onChange={(e) => setAwayScore(e.target.value)}
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={() => setSelectedFixture(null)}>Cancel</Button>
                                <Button type="submit" disabled={isSubmitting || !homeScore || !awayScore}>
                                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Save Result
                                </Button>
                            </DialogFooter>
                        </form>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
