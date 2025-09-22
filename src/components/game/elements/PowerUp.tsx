import React from 'react';

const POWERUP_SIZE = 16;

interface PowerUpProps {
  powerUp: {
    x: number;
    y: number;
    type: 'double-jump' | 'shield';
  };
}

const ShieldIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="text-cyan-400 w-full h-full">
    <path d="M12 2L4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5l-8-3z" />
  </svg>
);

const DoubleJumpIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="text-green-400 w-full h-full">
    <path d="M4 12l1.41 1.41L11 7.83V20h2V7.83l5.58 5.59L20 12l-8-8-8 8z" />
    <path d="M4 4l1.41 1.41L11 -.17V4h2V-.17l5.58 5.59L20 4l-8-8-8 8z" opacity="0.6"/>
  </svg>
);


const PowerUp: React.FC<PowerUpProps> = ({ powerUp }) => {
  return (
    <div
      className="absolute animate-pulse"
      style={{
        left: powerUp.x,
        top: powerUp.y,
        width: POWERUP_SIZE,
        height: POWERUP_SIZE,
        filter: 'drop-shadow(0 0 5px currentColor)'
      }}
    >
      {powerUp.type === 'shield' ? <ShieldIcon /> : <DoubleJumpIcon />}
    </div>
  );
};

export default PowerUp;
