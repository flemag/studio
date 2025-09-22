import React, { useMemo } from 'react';

interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  speed: number;
}

interface StarfieldProps {
  starCount: number;
  gameWidth: number;
  gameHeight: number;
  scrollOffset: number;
}

const Starfield: React.FC<StarfieldProps> = ({ starCount, gameWidth, gameHeight, scrollOffset }) => {
  const stars = useMemo(() => {
    const starArray: Star[] = [];
    for (let i = 0; i < starCount; i++) {
      starArray.push({
        id: i,
        x: Math.random() * gameWidth,
        y: Math.random() * gameHeight * 2, // Taller to allow for scrolling
        size: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.5 + 0.2,
        speed: Math.random() * 0.5 + 0.1, // Different speeds for parallax
      });
    }
    return starArray;
  }, [starCount, gameWidth, gameHeight]);

  return (
    <div className="absolute inset-0 overflow-hidden bg-gradient-to-b from-gray-900 to-black">
      {stars.map((star) => {
        // Calculate the effective Y position with parallax scrolling
        let newY = (star.y - scrollOffset * star.speed);
        // Wrap stars around to create an infinite effect
        newY = (newY % (gameHeight * 1.5)) + (newY < -gameHeight * 0.5 ? gameHeight * 1.5 : 0);

        return (
          <div
            key={star.id}
            className="absolute bg-white rounded-full"
            style={{
              left: star.x,
              top: newY,
              width: star.size,
              height: star.size,
              opacity: star.opacity,
              transition: 'top 0.1s linear', // Smooth out movement
            }}
          />
        );
      })}
    </div>
  );
};

export default Starfield;
