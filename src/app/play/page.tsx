import Game from '@/components/game/Game';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function PlayPage() {
  return (
    <div className="relative flex flex-col items-center justify-center h-[100dvh] bg-background overflow-hidden p-4">
      <Link href="/" passHref>
        <Button variant="ghost" className="absolute top-4 left-4 z-20">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>
      </Link>
      <Game />
    </div>
  );
}
