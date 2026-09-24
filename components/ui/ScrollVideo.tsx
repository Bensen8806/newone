'use client'

import React, { useEffect, useRef } from 'react'

export default function ScrollVideo() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  
  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    let targetTime = 0;
    let currentTime = 0;
    let animationFrameId: number;
    let isScrolling = false;
    let scrollTimeout: NodeJS.Timeout;
    
    // Tighter easing for snappier, smoother response that tracks the wheel closer
    const ease = 0.15; 
    
    const drawToCanvas = () => {
      if (video.readyState >= 2) {
        const hRatio = canvas.width / video.videoWidth;
        const vRatio = canvas.height / video.videoHeight;
        const ratio = Math.max(hRatio, vRatio);
        
        const centerShift_x = (canvas.width - video.videoWidth * ratio) / 2;
        const centerShift_y = (canvas.height - video.videoHeight * ratio) / 2;
        
        ctx.drawImage(
          video, 
          0, 0, video.videoWidth, video.videoHeight,
          centerShift_x, centerShift_y, video.videoWidth * ratio, video.videoHeight * ratio
        );
      }
    };

    const handleScroll = () => {
      isScrolling = true;
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => { isScrolling = false; }, 50);

      const scrollY = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const scrollFraction = maxScroll > 0 ? Math.max(0, Math.min(1, scrollY / maxScroll)) : 0;
      
      let opacity = 0;
      if (scrollFraction < 0.2) opacity = scrollFraction / 0.2;
      else if (scrollFraction > 0.8) opacity = (1 - scrollFraction) / 0.2;
      else opacity = 1;
      canvas.style.opacity = opacity.toString();
      
      // Fallback duration if video metadata hasn't fully propagated
      const duration = isNaN(video.duration) || video.duration === 0 ? 6.88 : video.duration;
      targetTime = scrollFraction * duration;
    };

    const renderLoop = () => {
      const currentEase = isScrolling ? ease : 0.2;
      currentTime += (targetTime - currentTime) * currentEase;
      
      // We can update continuously without throttling!
      // The video has been specially encoded with ALL-INTRA keyframes (keyint=1).
      // This means seeking to any arbitrary timestamp takes exactly O(1) time
      // and virtually zero CPU overhead, so we can blast the decoder at 60/120Hz.
      if (Math.abs(video.currentTime - currentTime) > 0.001) {
         video.currentTime = currentTime;
      }

      // If browser doesn't support requestVideoFrameCallback, fallback to polling
      if (!('requestVideoFrameCallback' in HTMLVideoElement.prototype)) {
         drawToCanvas();
      }
      
      animationFrameId = requestAnimationFrame(renderLoop);
    };

    const handleResize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      drawToCanvas();
    };

    const onFrame = () => {
      drawToCanvas();
      if ('requestVideoFrameCallback' in HTMLVideoElement.prototype) {
        (video as any).requestVideoFrameCallback(onFrame);
      }
    };

    if ('requestVideoFrameCallback' in HTMLVideoElement.prototype) {
      (video as any).requestVideoFrameCallback(onFrame);
    }

    video.addEventListener('loadeddata', () => {
      handleResize();
      handleScroll();
      drawToCanvas();
    });

    video.addEventListener('seeked', drawToCanvas);
    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    handleScroll();
    handleResize();
    renderLoop();
    video.load();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
      video.removeEventListener('seeked', drawToCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-full -z-[5] pointer-events-none transition-opacity duration-75 overflow-hidden bg-black">
      {/* 
        CRITICAL: Video cannot be display:none (hidden) or opacity:0 in some browsers, 
        otherwise decoding stops. We use absolute positioning off-screen instead.
      */}
      <video
        ref={videoRef}
        src="/video.mp4"
        preload="auto"
        muted
        playsInline
        style={{ position: 'absolute', top: '-9999px', left: '-9999px', width: '1px', height: '1px' }}
      />
      <canvas
        ref={canvasRef}
        className="w-full h-full object-cover opacity-0"
        style={{ 
          transition: 'opacity 0.1s ease-out',
          filter: 'contrast(1.2) saturate(1.1) brightness(0.9) sepia(0.2) hue-rotate(-10deg)'
        }}
      />
    </div>
  )
}
