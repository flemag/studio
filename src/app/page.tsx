import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ArrowRight, Coins, Cpu, ShieldAlert } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4 text-foreground">
      <main className="flex flex-col items-center justify-center text-center">
        <div className="relative mb-8">
          <div className="absolute -top-4 -left-4 w-16 h-16 bg-primary rounded-full mix-blend-lighten filter blur-xl opacity-70 animate-pulse"></div>
          <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-accent rounded-full mix-blend-lighten filter blur-xl opacity-70 animate-pulse delay-2000"></div>
          <h1 className="font-headline text-6xl md:text-8xl font-bold text-primary">
            Data Rush
          </h1>
          <p className="font-headline text-2xl md:text-4xl text-primary-foreground/80 mt-2">
            Server Ascent
          </p>
        </div>

        <p className="max-w-xl md:text-lg mb-8 text-muted-foreground">
          Guide your data icon up an infinite server tower. Dodge firewalls,
          evade viruses, and collect bits to climb the leaderboard. How high can
          you ascend?
        </p>

        <div className="flex gap-4 mb-12">
          <Link href="/play" passHref>
            <Button size="lg" className="font-bold text-lg">
              Start Ascent <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl">
          <Card className="bg-background/50 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Cpu className="text-primary" />
                Infinite Tower
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Ascend through procedurally generated server modules, offering a
                unique challenge every time you play.
              </CardDescription>
            </CardContent>
          </Card>
          <Card className="bg-background/50 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShieldAlert className="text-destructive" />
                Dodge Obstacles
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Navigate past moving firewalls and spreading viruses that
                threaten to corrupt your data icon.
              </CardDescription>
            </CardContent>
          </Card>
          <Card className="bg-background/50 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Coins className="text-accent" />
                Collect Bits
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Gather valuable bits to increase your score and prove your
                prowess on the global leaderboard.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </main>
      <footer className="mt-16 text-sm text-muted-foreground">
        <p>A game by Firebase Studio. Use arrow keys to move.</p>
      </footer>
    </div>
  );
}
