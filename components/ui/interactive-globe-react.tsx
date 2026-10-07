"use client"

import React, { useEffect, useRef, useState } from 'react';
import { Globe } from './interactive-globe/index.js';

interface GlobeProps {
  className?: string;
  dotColor?: string;
  activeDotColor?: string;
  glowColor?: string;
  backgroundColor?: string;
  autoRotate?: boolean;
  scale?: number;
  dotCount?: number;
  enableScrollAnimation?: boolean;
}

export default function InteractiveGlobeReact({
  className = "",
  dotColor = "#FFFFFF",
  activeDotColor = "#FF6B35",
  glowColor = "#000000",
  backgroundColor = "transparent",
  autoRotate = true,
  scale = 1.0,
  dotCount = 20000,
  enableScrollAnimation = false
}: GlobeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const globeInstanceRef = useRef<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    let isMounted = true;
    let globe: any;

    const initGlobe = async () => {
      try {
        globe = new Globe({
          container: containerRef.current as HTMLElement,
          dotColor,
          activeDotColor,
          glowColor,
          backgroundColor,
          autoRotate,
          scale,
          dotCount,
          antialias: true,
          enableZoom: false,
          enablePan: false,
          texturePath: '/earth-mask.png' // Default, wait does it need a texture path?
        });

        globeInstanceRef.current = globe;
        await globe.init();

        // Trigger a resize event to ensure it captures dimensions correctly
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new Event('resize'));
        }

        if (isMounted) {
          setIsLoaded(true);
        }
      } catch (err: any) {
        if (isMounted) {
          setErrorMsg(err.message || String(err));
        }
        console.error("Failed to initialize interactive globe:", err);
      }
    };

    initGlobe();

    return () => {
      isMounted = false;
      if (globe) {
        if (typeof globe.stop === 'function') globe.stop();
        if (typeof globe.destroy === 'function') globe.destroy();
        if (typeof globe.dispose === 'function') globe.dispose();
      }
      
      // Cleanup any canvas added to the container
      if (containerRef.current) {
        while (containerRef.current.firstChild) {
          containerRef.current.removeChild(containerRef.current.firstChild);
        }
      }
    };
  }, [dotColor, activeDotColor, glowColor, backgroundColor, autoRotate, scale, dotCount]);

  useEffect(() => {
    if (!enableScrollAnimation) return;

    const handleScroll = () => {
      const globe = globeInstanceRef.current;
      if (!globe || !globe.globeGroup || !globe.camera) return;

      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      
      // Calculate progress between 0 and 1 over 1.5 window heights
      const maxScroll = windowHeight * 1.5;
      const progress = Math.min(Math.max(scrollY / maxScroll, 0), 1);

      // Easing function for smooth stop
      const easeOutQuad = (t: number) => t * (2 - t);
      const easedProgress = easeOutQuad(progress);

      // Target coords for Kerala, India (Lat: 10.85, Lon: 76.27)
      // Because of 3D axes, we usually rotate Y by -lon and X by lat
      const startPhi = 0;
      const startTheta = 0;
      
      // Adjust these angles experimentally based on the globe's initial orientation
      const targetPhi = 15; 
      const targetTheta = -80; 

      // Interpolate rotation
      const currentPhi = startPhi + (targetPhi - startPhi) * easedProgress;
      const currentTheta = startTheta + (targetTheta - startTheta) * easedProgress;
      globe.setRotation(currentPhi, currentTheta);

      // Interpolate scale/zoom (start scale from props to max zoom 2.0)
      const targetScale = 2.0;
      const currentScale = scale + (targetScale - scale) * easedProgress;
      globe.globeGroup.scale.setScalar(currentScale);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Trigger once initially
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [enableScrollAnimation, scale]);

  if (errorMsg) {
    return (
      <div className={`relative ${className} flex items-center justify-center p-8 bg-transparent`}>
        <p className="text-red-500/50 font-mono text-sm">{errorMsg}</p>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <div 
        ref={containerRef} 
        className="w-full h-full"
      />
    </div>
  );
}
