'use client';

import { useState } from 'react';
import { clearAllData } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Loader2, Trash2 } from 'lucide-react';

export function ResetLeagueButton() {
    const [isResetting, setIsResetting] = useState(false);

    async function handleReset() {
        const confirmed = window.confirm(
            '⚠️ WARNING: This will permanently delete ALL players and matches from the league. This action cannot be undone. Are you sure you want to continue?'
        );

        if (!confirmed) return;

        setIsResetting(true);
        try {
            await clearAllData();
        } catch (error) {
            console.error('Failed to reset league:', error);
            alert('Failed to reset league. Please try again.');
        } finally {
            setIsResetting(false);
        }
    }

    return (
        <div className="p-4 border border-destructive/50 rounded-lg bg-destructive/5">
            <div className="space-y-3">
                <div>
                    <h3 className="font-semibold text-destructive flex items-center gap-2">
                        <Trash2 className="h-4 w-4" />
                        Danger Zone
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                        Permanently delete all players and matches. This cannot be undone.
                    </p>
                </div>
                <Button
                    variant="destructive"
                    onClick={handleReset}
                    disabled={isResetting}
                    className="w-full"
                >
                    {isResetting ? (
                        <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Resetting League...
                        </>
                    ) : (
                        <>
                            <Trash2 className="h-4 w-4 mr-2" />
                            Reset League (Delete All Data)
                        </>
                    )}
                </Button>
            </div>
        </div>
    );
}
