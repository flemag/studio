import React, { useState, useEffect, useRef } from 'react';

const PLAYER_SIZE = 20;

type Direction = 'left' | 'right' | 'none';

interface PlayerProps {
  x: number;
  y: number;
  vy: number;
  direction: Direction;
  isShielded: boolean;
}

const Player: React.FC<PlayerProps> = ({ x, y, vy, direction, isShielded }) => {
  const [isLanding, setIsLanding] = useState(false);
  const prevVyRef = useRef(vy);

  useEffect(() => {
    if (prevVyRef.current < -0.5 && vy >= 0) {
      setIsLanding(true);
      const timer = setTimeout(() => setIsLanding(false), 200);
      return () => clearTimeout(timer);
    }
    prevVyRef.current = vy;
  }, [vy]);

  const rotation = direction === 'left' ? -15 : direction === 'right' ? 15 : 0;

  const squashAnimationClass = isLanding ? 'animate-squash-player' : '';

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: PLAYER_SIZE,
        height: PLAYER_SIZE,
        transform: `rotate(${rotation}deg)`,
        transition: 'transform 150ms linear',
      }}
    >
      {isShielded && (
        <div
          className="absolute inset-[-6px] rounded-full border-2 border-cyan-400 animate-pulse"
          style={{
            boxShadow: '0 0 10px 2px cyan',
            opacity: 0.8
          }}
        />
      )}
      <svg
        width={PLAYER_SIZE}
        height={PLAYER_SIZE}
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
            filter: 'drop-shadow(0 0 3px hsl(var(--primary)))',
            position: 'relative',
            zIndex: 1
        }}
        className={squashAnimationClass}
      >
        <path
          d="M10 2L18 18H2L10 2Z"
          className="fill-primary stroke-primary-foreground"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <path
          d="M10 12L14 18H6L10 12Z"
          className="fill-primary/50"
        />
        {vy > 1 && (
          <path d="M10 19 L 8 23 H 12 L 10 19 Z" className="fill-accent animate-pulse" />
        )}
      </svg>
    </div>
  );
};

// I need to add this class to globals.css
// .animate-squash-player { animation: squash 200ms ease-in-out; }
// I will do that next.

export default Player;
