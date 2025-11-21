'use client';

import { useState } from 'react';
import { Player } from '@/lib/storage';
import { addMatch } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Trophy } from 'lucide-react';
import { toast } from 'sonner'; // We need to add sonner or useToast

interface MatchFormProps {
    players: Player[];
    onSuccess?: () => void;
}

export function MatchForm({ players, onSuccess }: MatchFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [homeId, setHomeId] = useState('');
    const [awayId, setAwayId] = useState('');
    const [homeScore, setHomeScore] = useState('');
    const [awayScore, setAwayScore] = useState('');

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!homeId || !awayId || homeId === awayId) {
            // Basic validation
            return;
        }

        setIsSubmitting(true);
        try {
            await addMatch(homeId, awayId, parseInt(homeScore) || 0, parseInt(awayScore) || 0);
            setHomeId('');
            setAwayId('');
            setHomeScore('');
            setAwayScore('');
            onSuccess?.();
        } catch (error) {
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <Card className="border-none shadow-none bg-transparent">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                    <Trophy className="h-5 w-5 text-primary" />
                    Record Match Result
                </CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-2 gap-8 items-end">
                        {/* Home Team */}
                        <div className="space-y-2">
                            <Label>Home Team</Label>
                            <Select value={homeId} onValueChange={setHomeId}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select player" />
                                </SelectTrigger>
                                <SelectContent>
                                    {players.map(p => (
                                        <SelectItem key={p.id} value={p.id} disabled={p.id === awayId}>
                                            {p.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Score */}
                        <div className="flex items-center gap-4 justify-center">
                            <div className="space-y-2 text-center w-20">
                                <Label className="text-xs text-muted-foreground">Home</Label>
                                <Input
                                    type="number"
                                    min="0"
                                    value={homeScore}
                                    onChange={e => setHomeScore(e.target.value)}
                                    className="text-center text-2xl font-bold h-14"
                                />
                            </div>
                            <span className="text-2xl font-bold text-muted-foreground">:</span>
                            <div className="space-y-2 text-center w-20">
                                <Label className="text-xs text-muted-foreground">Away</Label>
                                <Input
                                    type="number"
                                    min="0"
                                    value={awayScore}
                                    onChange={e => setAwayScore(e.target.value)}
                                    className="text-center text-2xl font-bold h-14"
                                />
                            </div>
                        </div>

                        {/* Away Team */}
                        <div className="space-y-2">
                            <Label>Away Team</Label>
                            <Select value={awayId} onValueChange={setAwayId}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select player" />
                                </SelectTrigger>
                                <SelectContent>
                                    {players.map(p => (
                                        <SelectItem key={p.id} value={p.id} disabled={p.id === homeId}>
                                            {p.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <Button
                        type="submit"
                        className="w-full h-12 text-lg font-semibold bg-primary hover:bg-primary/90"
                        disabled={isSubmitting || !homeId || !awayId}
                    >
                        {isSubmitting ? <Loader2 className="animate-spin" /> : 'Update Table'}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
