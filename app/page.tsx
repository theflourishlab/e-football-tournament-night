import { getLeagueData } from '@/lib/storage';
import { LeagueTable } from '@/components/LeagueTable';
import { MatchForm } from '@/components/MatchForm';
import { PlayerForm } from '@/components/PlayerForm';
import { ResetLeagueButton } from '@/components/ResetLeagueButton';
import { GenerateFixturesButton } from '@/components/GenerateFixturesButton';
import { FixtureList } from '@/components/FixtureList';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Trophy } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const data = await getLeagueData();

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted/50 p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary/10 rounded-xl">
              <Trophy className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tight">eFootball League</h1>
              <p className="text-muted-foreground">Season 2025</p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-[1fr_350px] gap-8">
          <div className="space-y-6">
            <LeagueTable players={data.players} />
          </div>

          <div className="space-y-6">
            <Tabs defaultValue="match" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="match">Record Match</TabsTrigger>
                <TabsTrigger value="fixtures">Fixtures</TabsTrigger>
                <TabsTrigger value="players">Manage Players</TabsTrigger>
              </TabsList>
              <TabsContent value="match" className="mt-4">
                <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
                  <MatchForm players={data.players} />
                </div>
              </TabsContent>
              <TabsContent value="fixtures" className="mt-4">
                <div className="space-y-4">
                  <div className="flex justify-end">
                    <GenerateFixturesButton />
                  </div>
                  <FixtureList fixtures={data.fixtures} players={data.players} />
                </div>
              </TabsContent>
              <TabsContent value="players" className="mt-4">
                <div className="space-y-4">
                  <PlayerForm />
                  <div className="text-sm text-muted-foreground p-4 bg-muted/50 rounded-lg">
                    <p>Total Players: {data.players.length}</p>
                    <p>Total Matches: {data.matches.length}</p>
                  </div>
                  <ResetLeagueButton />
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </main>
  );
}
