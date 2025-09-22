"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import { useToast } from "@/hooks/use-toast";
import { adjustDifficulty, AdjustDifficultyInput } from '@/ai/flows/dynamic-difficulty-adjustment';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import Player from './elements/Player';
import Platform from './elements/Platform';
import Bit from './elements/Bit';
import Obstacle from './elements/Obstacle';
import Starfield from './elements/Starfield';
import { playJumpSound, playBitSound, playGameOverSound, resumeAudioContext } from '@/lib/audio';

// Game constants
const GAME_WIDTH = 400;
const GAME_HEIGHT = 700;
const PLAYER_SIZE = 20;
const PLAYER_SPEED = 5;
const GRAVITY = 0.25;
const JUMP_VELOCITY = 8;
const PLATFORM_HEIGHT = 15;
const PLATFORM_COUNT = 12;
const BIT_SIZE = 10;
const OBSTACLE_WIDTH = 50;
const OBSTACLE_HEIGHT = 15;
const AI_INTERVAL = 20000; // 20 seconds

// Types
type PlayerState = { x: number; y: number; vy: number; };
type Platform = { id: number; x: number; y: number; width: number; };
type Bit = { id: number; x: number; y: number; };
type Obstacle = { id: number; x: number; y: number; vx: number; };
type DifficultyParams = { obstacleFrequency: number; platformSpacing: number; };

export default function Game() {
  const [score, setScore] = useState(0);
  const [height, setHeight] = useState(0);
  const [gameState, setGameState] = useState<'start' | 'playing' | 'gameOver'>('start');
  const [finalScore, setFinalScore] = useState(0);
  const [scale, setScale] = useState(1);
  
  const playerRef = useRef<PlayerState>({ x: 0, y: 0, vy: 0 });
  const platformsRef = useRef<Platform[]>([]);
  const bitsRef = useRef<Bit[]>([]);
  const obstaclesRef = useRef<Obstacle[]>([]);
  const difficultyRef = useRef<DifficultyParams>({ obstacleFrequency: 0.2, platformSpacing: 0.5 });
  const keysRef = useRef<{ [key: string]: boolean }>({});
  const gameLoopRef = useRef<number>();
  const gameTimeRef = useRef(0);
  const obstaclesAvoidedRef = useRef(0);
  const heightRef = useRef(0);

  const [_, forceRender] = useState(0);
  const { toast } = useToast();
  const isMobile = useIsMobile();

  const gameContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateScale = () => {
      const container = gameContainerRef.current;
      if (container) {
        const { width, height } = container.getBoundingClientRect();
        const scaleX = width / GAME_WIDTH;
        const scaleY = height / GAME_HEIGHT;
        setScale(Math.min(scaleX, scaleY));
      } else {
        const { innerWidth, innerHeight } = window;
        const availableHeight = innerHeight - (isMobile ? 120 : 80);
        const scaleX = innerWidth / GAME_WIDTH;
        const scaleY = availableHeight / GAME_HEIGHT;
        setScale(Math.min(scaleX, scaleY));
      }
    };

    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, [isMobile]);

  const resetGame = useCallback(() => {
    playerRef.current = { x: GAME_WIDTH / 2 - PLAYER_SIZE / 2, y: GAME_HEIGHT - 50, vy: 0 };

    const initialPlatforms: Platform[] = [];
    const basePlatform = { id: Date.now(), x: GAME_WIDTH / 2 - 50, y: GAME_HEIGHT - 20, width: 100 };
    initialPlatforms.push(basePlatform);
    let lastY = basePlatform.y;
    for (let i = 1; i < PLATFORM_COUNT; i++) {
        lastY -= (80 + Math.random() * 80 * difficultyRef.current.platformSpacing);
        initialPlatforms.push({
            id: Date.now() + i,
            x: Math.random() * (GAME_WIDTH - 100),
            y: lastY,
            width: 80 + Math.random() * 50
        });
    }
    platformsRef.current = initialPlatforms;
    
    playerRef.current.vy = JUMP_VELOCITY;
    bitsRef.current = [];
    obstaclesRef.current = [];
    setScore(0);
    setHeight(0);
    heightRef.current = 0;
    gameTimeRef.current = 0;
    obstaclesAvoidedRef.current = 0;
    setGameState('playing');
    resumeAudioContext();
  }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent, isDown: boolean) => {
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        e.preventDefault();
        keysRef.current[e.key] = isDown;
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => handleKey(e, true);
    const handleKeyUp = (e: KeyboardEvent) => handleKey(e, false);
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);
  
  // AI Difficulty Adjustment
  useEffect(() => {
    if (gameState !== 'playing') return;
    const intervalId = setInterval(async () => {
      gameTimeRef.current += AI_INTERVAL / 1000;
      const input: AdjustDifficultyInput = {
        score,
        level: Math.floor(heightRef.current / 1000),
        obstaclesAvoided: obstaclesAvoidedRef.current,
        bitsCollected: score,
        timePlayed: gameTimeRef.current,
      };
      try {
        const newDifficulty = await adjustDifficulty(input);
        difficultyRef.current = newDifficulty;
      } catch (error) {
        console.error("AI Difficulty Adjustment Failed:", error);
        toast({
            variant: "destructive",
            title: "AI Error",
            description: "Could not adjust game difficulty.",
        });
      }
    }, AI_INTERVAL);
    return () => clearInterval(intervalId);
  }, [gameState, score, toast]);

  // Game Loop
  useEffect(() => {
    if (gameState !== 'playing') {
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
      return;
    }
    const loop = () => {
      let { x, y, vy } = playerRef.current;
      if (keysRef.current.ArrowLeft) x -= PLAYER_SPEED;
      if (keysRef.current.ArrowRight) x += PLAYER_SPEED;
      x = Math.max(0, Math.min(GAME_WIDTH - PLAYER_SIZE, x));
      
      vy -= GRAVITY;
      y -= vy;

      let scrollOffset = 0;
      if (y < GAME_HEIGHT / 2 && vy > 0) {
        scrollOffset = vy;
        y = GAME_HEIGHT / 2;
      }

      if (scrollOffset > 0) {
        heightRef.current += scrollOffset;
        setHeight(h => h + scrollOffset);
        platformsRef.current.forEach(p => p.y += scrollOffset);
        bitsRef.current.forEach(b => b.y += scrollOffset);
        obstaclesRef.current.forEach(o => o.y += scrollOffset);
      }
      
      const playerBottom = y + PLAYER_SIZE;
      if (vy < 0) {
        platformsRef.current.forEach(platform => {
          if (x < platform.x + platform.width && x + PLAYER_SIZE > platform.x && playerBottom >= platform.y && playerBottom <= platform.y + PLATFORM_HEIGHT) {
            vy = JUMP_VELOCITY;
            y = platform.y - PLAYER_SIZE;
            playJumpSound();
          }
        });
      }

      bitsRef.current = bitsRef.current.filter(bit => {
        if (x < bit.x + BIT_SIZE && x + PLAYER_SIZE > bit.x && y < bit.y + BIT_SIZE && y + PLAYER_SIZE > bit.y) {
          setScore(s => s + 1);
          playBitSound();
          return false;
        }
        return true;
      });

      let isGameOver = false;
      obstaclesRef.current.forEach(obstacle => {
        if (x < obstacle.x + OBSTACLE_WIDTH && x + PLAYER_SIZE > obstacle.x && y < obstacle.y + OBSTACLE_HEIGHT && y + PLAYER_SIZE > obstacle.y) {
          isGameOver = true;
        }
      });
      if (y > GAME_HEIGHT) isGameOver = true;
      
      if (isGameOver) {
        setFinalScore(Math.floor(heightRef.current) + score * 10);
        setGameState('gameOver');
        playGameOverSound();
        return;
      }
      
      playerRef.current = { x, y, vy };

      platformsRef.current = platformsRef.current.filter(p => p.y < GAME_HEIGHT + 50);
      let highestPlatform = platformsRef.current.reduce((max, p) => p.y < max.y ? p : max, {y: GAME_HEIGHT});
      while (platformsRef.current.length < PLATFORM_COUNT) {
        const newY = highestPlatform.y - (80 + Math.random() * 80 * difficultyRef.current.platformSpacing);
        const newWidth = 60 + Math.random() * 60;
        const newX = Math.random() * (GAME_WIDTH - newWidth);
        const newId = Date.now() + Math.random();
        const newPlatform = { id: newId, x: newX, y: newY, width: newWidth, };
        platformsRef.current.unshift(newPlatform);
        highestPlatform = newPlatform;

        if (Math.random() < 0.4) {
          bitsRef.current.push({id: newId, x: newX + newWidth / 2 - BIT_SIZE/2, y: newY - BIT_SIZE - 5});
        }
        if (Math.random() < difficultyRef.current.obstacleFrequency) {
          obstaclesRef.current.push({id: newId, x: newX, y: newY - OBSTACLE_HEIGHT - 5, vx: (Math.random() - 0.5) * 4});
          obstaclesAvoidedRef.current++;
        }
      }

      obstaclesRef.current.forEach(o => {
        o.x += o.vx;
        if (o.x <= 0 || o.x >= GAME_WIDTH - OBSTACLE_WIDTH) o.vx *= -1;
      });

      bitsRef.current = bitsRef.current.filter(b => b.y < GAME_HEIGHT + 50);
      obstaclesRef.current = obstaclesRef.current.filter(o => o.y < GAME_HEIGHT + 50);
      
      forceRender(r => r + 1);
      gameLoopRef.current = requestAnimationFrame(loop);
    };
    gameLoopRef.current = requestAnimationFrame(loop);
    return () => { if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current); };
  }, [gameState, score, toast]);
  
  const currentFinalScore = Math.floor(height) + score * 10;
  
  return (
    <div ref={gameContainerRef} className="flex flex-col items-center justify-center w-full h-full">
      <div style={{ transform: `scale(${scale})`, transformOrigin: 'center center' }}>
        <div className="relative border-4 border-primary shadow-2xl shadow-primary/30 overflow-hidden" style={{ width: GAME_WIDTH, height: GAME_HEIGHT }}>
          <Starfield starCount={100} gameWidth={GAME_WIDTH} gameHeight={GAME_HEIGHT} scrollOffset={heightRef.current} />
          {gameState === 'start' && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm">
              <h1 className="font-headline text-5xl font-bold text-primary animate-pulse">Data Rush</h1>
              <p className="text-lg mt-2 mb-8 text-muted-foreground">Press Start to Ascend</p>
              <Button size="lg" onClick={resetGame}>Start Game</Button>
            </div>
          )}
          {gameState === 'gameOver' && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm">
              <h2 className="font-headline text-5xl font-bold text-destructive">Game Over</h2>
              <p className="text-xl mt-4 text-primary-foreground">Final Score: <span className="text-accent font-bold">{finalScore}</span></p>
              <p className="text-md text-muted-foreground">Height: {Math.floor(heightRef.current)}m | Bits: {score}</p>
              <Button size="lg" onClick={resetGame} className="mt-8">Play Again</Button>
            </div>
          )}

          {/* Player */}
          <Player x={playerRef.current.x} y={playerRef.current.y} />
          {/* Platforms */}
          {platformsRef.current.map(p => <Platform key={p.id} platform={p} />)}
          {/* Bits */}
          {bitsRef.current.map(b => <Bit key={b.id} bit={b} />)}
          {/* Obstacles */}
          {obstaclesRef.current.map(o => <Obstacle key={o.id} obstacle={o} />)}

          {gameState === 'playing' && (
            <div className="absolute top-4 right-4 text-right font-headline text-white z-10">
              <p className="text-lg">Score: <span className="text-accent font-bold">{currentFinalScore}</span></p>
              <p className="text-sm text-muted-foreground">Height: {Math.floor(height)}m</p>
            </div>
          )}
        </div>
        {isMobile && gameState === 'playing' && (
          <div className="flex justify-between w-full mt-4" style={{width: GAME_WIDTH}}>
            <Button
              size="lg"
              className="p-8 text-2xl"
              onTouchStart={() => (keysRef.current['ArrowLeft'] = true)}
              onTouchEnd={() => (keysRef.current['ArrowLeft'] = false)}
              onMouseDown={() => (keysRef.current['ArrowLeft'] = true)}
              onMouseUp={() => (keysRef.current['ArrowLeft'] = false)}
            >
              <ArrowLeft />
            </Button>
            <Button
              size="lg"
              className="p-8 text-2xl"
              onTouchStart={() => (keysRef.current['ArrowRight'] = true)}
              onTouchEnd={() => (keysRef.current['ArrowRight'] = false)}
              onMouseDown={() => (keysRef.current['ArrowRight'] = true)}
              onMouseUp={() => (keysRef.current['ArrowRight'] = false)}
            >
              <ArrowRight />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
