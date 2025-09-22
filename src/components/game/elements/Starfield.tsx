import React, { useMemo, useRef, useImperativeHandle, forwardRef } from 'react';

// --- Data Structures ---
interface Star {
  id: number; x: number; y: number; size: number; opacity: number; speed: number;
}
interface DecoElement {
  id: number; zone: number; x: number; y: number; size: number; opacity: number; speed: number;
  component: React.ForwardRefExoticComponent<React.PropsWithoutRef<{ style: React.CSSProperties }> & React.RefAttributes<HTMLDivElement>>;
}
interface StarfieldProps {
  starCount: number; gameWidth: number; gameHeight: number;
}
export interface StarfieldHandles {
  updateScroll: (scrollOffset: number) => void;
}

// --- Zone Definitions ---
const zones = [
    { height: 0, from: 'hsl(222, 39%, 11%)', to: 'hsl(0, 0%, 0%)', starColor: 'hsl(0, 0%, 100%)' },
    { height: 2000, from: 'hsl(265, 39%, 20%)', to: 'hsl(300, 40%, 10%)', starColor: 'hsl(300, 50%, 80%)' },
    { height: 5000, from: 'hsl(180, 40%, 20%)', to: 'hsl(200, 50%, 10%)', starColor: 'hsl(180, 50%, 80%)' },
    { height: 8000, from: 'hsl(48, 89%, 30%)', to: 'hsl(25, 50%, 15%)', starColor: 'hsl(50, 100%, 85%)' },
];

// --- Decorative Element Components (wrapped in forwardRef) ---
const NebulaCloud = forwardRef<HTMLDivElement, { style: React.CSSProperties }>((props, ref) => (
    <div ref={ref} style={{...props.style, background: 'radial-gradient(circle, hsl(280 50% 50% / 0.1), transparent 70%)'}} />
));
NebulaCloud.displayName = "NebulaCloud";

const DistantSun = forwardRef<HTMLDivElement, { style: React.CSSProperties }>((props, ref) => (
    <div ref={ref} style={{...props.style, background: 'radial-gradient(circle, hsl(50 100% 80% / 0.8), transparent 70%)', borderRadius: '50%'}} />
));
DistantSun.displayName = "DistantSun";

// --- Main Starfield Component ---
const Starfield = forwardRef<StarfieldHandles, StarfieldProps>(({ starCount, gameWidth, gameHeight }, ref) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const starsRef = useRef<(HTMLDivElement | null)[]>([]);
  const decoRef = useRef<(HTMLDivElement | null)[]>([]);
  const currentZoneRef = useRef(0);

  const starsData = useMemo(() => Array.from({ length: starCount }, (_, i) => ({
    id: i, x: Math.random() * gameWidth, y: Math.random() * gameHeight * 2,
    size: Math.random() * 2 + 0.5, opacity: Math.random() * 0.5 + 0.2, speed: Math.random() * 0.5 + 0.1,
  })), [starCount, gameWidth, gameHeight]);

  const decorativeElements = useMemo(() => {
    const elements: DecoElement[] = [];
    for (let i = 0; i < 5; i++) elements.push({ id: i, zone: 1, x: Math.random() * gameWidth, y: Math.random() * gameHeight * 2, size: Math.random() * 200 + 150, opacity: Math.random() * 0.2 + 0.1, speed: Math.random() * 0.1 + 0.05, component: NebulaCloud });
    for (let i = 0; i < 10; i++) elements.push({ id: 5 + i, zone: 2, x: Math.random() * gameWidth, y: Math.random() * gameHeight * 2, size: Math.random() * 3 + 1, opacity: Math.random() * 0.5 + 0.5, speed: Math.random() * 0.2 + 0.1, component: DistantSun });
    return elements;
  }, [gameWidth, gameHeight]);

  useImperativeHandle(ref, () => ({
    updateScroll: (scrollOffset: number) => {
      const totalHeight = gameHeight * 2;
      const applyTransform = (el: HTMLElement | null, item: Star | DecoElement) => {
        if (!el) return;
        const wrappedY = ((item.y - scrollOffset * item.speed) % totalHeight + totalHeight) % totalHeight;
        el.style.transform = `translate3d(0, ${wrappedY - item.y}px, 0)`;
      };

      starsData.forEach((star, i) => applyTransform(starsRef.current[i], star));
      decorativeElements.forEach((deco, i) => applyTransform(decoRef.current[i], deco));

      const newZoneIndex = zones.slice().reverse().findIndex(zone => scrollOffset >= zone.height);
      const activeZoneIndex = zones.length - 1 - newZoneIndex;

      if (activeZoneIndex !== currentZoneRef.current) {
        currentZoneRef.current = activeZoneIndex;
        const activeZone = zones[activeZoneIndex];
        if (containerRef.current) containerRef.current.style.background = `linear-gradient(to bottom, ${activeZone.from}, ${activeZone.to})`;
        starsRef.current.forEach(starEl => { if (starEl) starEl.style.backgroundColor = activeZone.starColor; });
        decoRef.current.forEach((decoEl, i) => {
            if (decoEl) decoEl.style.opacity = decorativeElements[i].zone === activeZoneIndex ? String(decorativeElements[i].opacity) : '0';
        });
      }
    }
  }));

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden" style={{ willChange: 'transform', transition: 'background 2s linear', background: `linear-gradient(to bottom, ${zones[0].from}, ${zones[0].to})` }}>
      {starsData.map((star, i) => (
        <div key={star.id} ref={el => { starsRef.current[i] = el; }} className="absolute rounded-full" style={{ left: star.x, top: star.y, width: star.size, height: star.size, opacity: star.opacity, backgroundColor: zones[0].starColor, transition: 'background-color 2s linear' }}/>
      ))}
      {decorativeElements.map((deco, i) => {
        const DecoComponent = deco.component;
        return <DecoComponent key={deco.id} ref={el => { decoRef.current[i] = el; }} style={{ position: 'absolute', left: deco.x, top: deco.y, width: deco.size, height: deco.size, opacity: deco.zone === 0 ? deco.opacity : 0, transition: 'opacity 2s linear' }} />
      })}
    </div>
  );
});

Starfield.displayName = 'Starfield';
export default Starfield;
