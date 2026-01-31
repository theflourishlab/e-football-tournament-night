'use client';

import { useState } from 'react';
import { generateFixtures } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Loader2, CalendarDays } from 'lucide-react';

export function GenerateFixturesButton() {
    const [isGenerating, setIsGenerating] = useState(false);

    async function handleGenerate() {
        setIsGenerating(true);
        try {
            await generateFixtures();
        } catch (error) {
            console.error(error);
            alert('Failed to generate fixtures. Make sure you have at least 2 players.');
        } finally {
            setIsGenerating(false);
        }
    }

    return (
        <Button
            onClick={handleGenerate}
            disabled={isGenerating}
            variant="outline"
            className="w-full"
        >
            {isGenerating ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
                <CalendarDays className="h-4 w-4 mr-2" />
            )}
            Generate Fixtures
        </Button>
    );
}
