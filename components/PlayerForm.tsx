'use client';

import { useState } from 'react';
import { addPlayer } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, UserPlus } from 'lucide-react';

export function PlayerForm() {
    const [name, setName] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!name.trim()) return;

        setIsSubmitting(true);
        try {
            await addPlayer(name);
            setName('');
        } catch (error) {
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="flex items-end gap-4 p-4 border rounded-lg bg-card/50">
            <div className="flex-1 space-y-2">
                <Label>New Player Name</Label>
                <Input
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="e.g. John Doe"
                />
            </div>
            <Button type="submit" disabled={isSubmitting || !name.trim()}>
                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserPlus className="h-4 w-4 mr-2" />}
                Add Player
            </Button>
        </form>
    );
}
