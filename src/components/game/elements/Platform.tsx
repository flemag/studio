import React from 'react';

const PLATFORM_HEIGHT = 15;

interface PlatformProps {
  platform: {
    id: number;
    x: number;
    y: number;
    width: number;
  };
}

const Platform: React.FC<PlatformProps> = ({ platform }) => {
  return (
    <div
      className="absolute rounded-md"
      style={{
        left: platform.x,
        top: platform.y,
        width: platform.width,
        height: PLATFORM_HEIGHT,
        background: 'linear-gradient(to bottom, hsl(var(--primary) / 0.8), hsl(var(--primary)))',
        boxShadow: '0 0 8px hsl(var(--primary) / 0.6)',
        border: '1px solid hsl(var(--primary) / 0.7)'
      }}
    />
  );
};

export default Platform;
