import React from 'react';

const PLAYER_SIZE = 20;

interface PlayerProps {
  x: number;
  y: number;
}

const Player: React.FC<PlayerProps> = ({ x, y }) => {
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: PLAYER_SIZE,
        height: PLAYER_SIZE,
      }}
    >
      <svg
        width={PLAYER_SIZE}
        height={PLAYER_SIZE}
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ filter: 'drop-shadow(0 0 3px hsl(var(--primary)))' }}
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
      </svg>
    </div>
  );
};

export default Player;
