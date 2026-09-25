'use client';

import { useRef, useCallback } from 'react';
import './BorderGlow.css';

const BorderGlow = ({
  children,
  className = '',
  colors = ['#06b6d4', '#a855f7', '#ec4899'], // Cyan, Purple, Pink
  borderRadius = 28,
  glowIntensity = 0.5,
  style = {},
  backgroundColor = "rgba(15, 15, 20, 0.4)", // Very dark charcoal base with slight transparency
  // Keep these props for compatibility even if unused by the new simplified approach
  edgeSensitivity, 
  glowColor, 
  glowRadius, 
  coneSpread, 
  animated, 
  fillOpacity
}: any) => {
  const cardRef = useRef<HTMLDivElement>(null);

  const getCenterOfElement = useCallback((el: HTMLElement) => {
    const { width, height } = el.getBoundingClientRect();
    return [width / 2, height / 2];
  }, []);

  const getEdgeProximity = useCallback((el: HTMLElement, x: number, y: number) => {
    const [cx, cy] = getCenterOfElement(el);
    const dx = x - cx;
    const dy = y - cy;
    let kx = Infinity;
    let ky = Infinity;
    if (dx !== 0) kx = cx / Math.abs(dx);
    if (dy !== 0) ky = cy / Math.abs(dy);
    // Value from 0 at center to 1 at edge
    return Math.min(Math.max(1 / Math.min(kx, ky), 0), 1);
  }, [getCenterOfElement]);

  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const edge = getEdgeProximity(card, x, y);
    // Range 0 to 100
    card.style.setProperty('--edge-proximity', `${(edge * 100).toFixed(3)}`);
  }, [getEdgeProximity]);

  const handlePointerLeave = useCallback(() => {
    const card = cardRef.current;
    if (!card) return;
    card.style.setProperty('--edge-proximity', '0');
  }, []);

  return (
    <div
      ref={cardRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className={`border-glow-card ${className}`}
      style={{
        '--card-bg': backgroundColor,
        '--border-radius': `${borderRadius}px`,
        '--glow-gradient': `linear-gradient(135deg, ${colors.join(', ')})`,
        '--glow-intensity': glowIntensity,
        ...style,
      } as React.CSSProperties}
    >
      <div className="border-glow-inner h-full w-full">
        {children}
      </div>
    </div>
  );
};

export default BorderGlow;
