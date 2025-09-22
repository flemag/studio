import React, { useMemo, useRef, useImperativeHandle, forwardRef } from 'react';

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
}

export interface StarfieldHandles {
  updateScroll: (scrollOffset: number) => void;
}

const zones = [
    { height: 0, from: 'hsl(222, 39%, 11%)', to: 'hsl(0, 0%, 0%)', starColor: 'hsl(0, 0%, 100%)' },
    { height: 2000, from: 'hsl(265, 39%, 20%)', to: 'hsl(300, 40%, 10%)', starColor: 'hsl(300, 50%, 80%)' },
    { height: 5000, from: 'hsl(180, 40%, 20%)', to: 'hsl(200, 50%, 10%)', starColor: 'hsl(180, 50%, 80%)' },
    { height: 8000, from: 'hsl(48, 89%, 30%)', to: 'hsl(25, 50%, 15%)', starColor: 'hsl(50, 100%, 85%)' },
];

const Starfield = forwardRef<StarfieldHandles, StarfieldProps>(({ starCount, gameWidth, gameHeight }, ref) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const starsRef = useRef<(HTMLDivElement | null)[]>([]);
  const currentZoneRef = useRef(0);

  const starsData = useMemo(() => {
    const starArray: Star[] = [];
    for (let i = 0; i < starCount; i++) {
      starArray.push({
        id: i,
        x: Math.random() * gameWidth,
        y: Math.random() * gameHeight * 2,
        size: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.5 + 0.2,
        speed: Math.random() * 0.5 + 0.1,
      });
    }
    return starArray;
  }, [starCount, gameWidth, gameHeight]);

  useImperativeHandle(ref, () => ({
    updateScroll: (scrollOffset: number) => {
      const totalHeight = gameHeight * 2;
      starsData.forEach((star, i) => {
        const starEl = starsRef.current[i];
        if (starEl) {
          const initialY = star.y;
          const scrolledY = initialY - (scrollOffset * star.speed);
          const wrappedY = ((scrolledY % totalHeight) + totalHeight) % totalHeight;
          starEl.style.transform = `translate3d(0, ${wrappedY - initialY}px, 0)`;
        }
      });

      const newZoneIndex = zones.slice().reverse().findIndex(zone => scrollOffset >= zone.height);
      const activeZoneIndex = zones.length - 1 - newZoneIndex;

      if (activeZoneIndex !== currentZoneRef.current) {
        currentZoneRef.current = activeZoneIndex;
        const activeZone = zones[activeZoneIndex];

        if (containerRef.current) {
          containerRef.current.style.background = `linear-gradient(to bottom, ${activeZone.from}, ${activeZone.to})`;
        }

        starsRef.current.forEach(starEl => {
          if (starEl) {
            starEl.style.backgroundColor = activeZone.starColor;
          }
        });
      }
    }
  }));

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 overflow-hidden"
      style={{
        willChange: 'transform',
        transition: 'background 2s linear',
        background: `linear-gradient(to bottom, ${zones[0].from}, ${zones[0].to})`
      }}
    >
      {starsData.map((star, i) => (
        <div
          key={star.id}
          ref={el => { starsRef.current[i] = el; }}
          className="absolute rounded-full"
          style={{
            left: star.x,
            top: star.y,
            width: star.size,
            height: star.size,
            opacity: star.opacity,
            backgroundColor: zones[0].starColor,
            transition: 'background-color 2s linear',
          }}
        />
      ))}
    </div>
  );
});

Starfield.displayName = 'Starfield';

export default Starfield;
