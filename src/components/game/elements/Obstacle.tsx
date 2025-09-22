import React from 'react';

const OBSTACLE_WIDTH = 50;
const OBSTACLE_HEIGHT = 20; // A bit taller for the effect

interface ObstacleProps {
  obstacle: {
    id: number;
    x: number;
    y: number;
  };
}

const Obstacle: React.FC<ObstacleProps> = ({ obstacle }) => {
  return (
    <div
      className="absolute"
      style={{
        left: obstacle.x,
        top: obstacle.y,
        width: OBSTACLE_WIDTH,
        height: OBSTACLE_HEIGHT,
        backgroundColor: 'hsl(var(--destructive))',
        clipPath: 'polygon(0% 25%, 25% 0%, 50% 25%, 75% 0%, 100% 25%, 100% 100%, 0% 100%)',
        animation: 'glitch 1.5s infinite linear alternate-reverse',
        boxShadow: '0 0 10px hsl(var(--destructive) / 0.7)'
      }}
    />
  );
};

export default Obstacle;
