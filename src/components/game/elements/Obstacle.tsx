import React from 'react';

const OBSTACLE_WIDTH = 50;
const OBSTACLE_HEIGHT = 20;

type ObstacleVariant = 'spiky-bar' | 'solid-block';

interface ObstacleProps {
  obstacle: {
    id: number;
    x: number;
    y: number;
    variant: ObstacleVariant;
  };
}

const SpikyBar: React.FC = () => (
    <div
        className="absolute w-full h-full"
        style={{
            backgroundColor: 'hsl(var(--destructive))',
            clipPath: 'polygon(0% 25%, 25% 0%, 50% 25%, 75% 0%, 100% 25%, 100% 100%, 0% 100%)',
            animation: 'glitch 1.5s infinite linear alternate-reverse',
            boxShadow: '0 0 10px hsl(var(--destructive) / 0.7)'
        }}
    />
);

const SolidBlock: React.FC = () => (
    <div
        className="absolute w-full h-full bg-destructive/80 border-2 border-destructive rounded"
        style={{
            boxShadow: 'inset 0 0 8px hsl(var(--destructive) / 0.5)'
        }}
    />
);

const Obstacle: React.FC<ObstacleProps> = ({ obstacle }) => {
  const { x, y, variant } = obstacle;

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: OBSTACLE_WIDTH,
        height: OBSTACLE_HEIGHT,
      }}
    >
      {variant === 'spiky-bar' && <SpikyBar />}
      {variant === 'solid-block' && <SolidBlock />}
    </div>
  );
};

export default Obstacle;
