'use client'

import React, { useEffect, useRef, useState } from 'react'
import JSZip from 'jszip'

const FRAME_COUNT = 413

export default function ScrollVideo() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imagesRef = useRef<(HTMLImageElement | null)[]>(new Array(FRAME_COUNT + 1).fill(null))
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    let isCancelled = false;

    const loadZip = async () => {
      try {
        console.log("Fetching highly optimized video-frames.zip...")
        const response = await fetch('/video-frames.zip')
        const blob = await response.blob()
        
        console.log("Unzipping frames into RAM...")
        const zip = await JSZip.loadAsync(blob)
        
        // Ensure filenames are sorted (e.g., frame_0001.jpg, frame_0002.jpg)
        const files = Object.keys(zip.files).filter(f => f.endsWith('.jpg')).sort()
        
        let loadedCount = 0;
        
        for (let i = 0; i < files.length; i++) {
          if (isCancelled) return;
          const filename = files[i];
          const fileData = await zip.files[filename].async("blob");
          const url = URL.createObjectURL(fileData);
          
          const img = new Image();
          img.src = url;
          img.onload = () => {
            if (isCancelled) return;
            imagesRef.current[i + 1] = img;
            loadedCount++;
            
            // Draw first frame immediately to unlock UI
            if (i === 0 && canvasRef.current) {
              const ctx = canvasRef.current.getContext('2d', { alpha: false });
              if (ctx) drawScaledImage(ctx, img);
              setLoading(false);
            }
          }
        }
      } catch (e) {
        console.error("Failed to load video zip", e)
      }
    }

    loadZip()

    return () => {
      isCancelled = true;
    }
  }, [])

  const drawScaledImage = (ctx: CanvasRenderingContext2D, img: HTMLImageElement) => {
    if (!img.complete || img.naturalWidth === 0) return;

    const canvas = ctx.canvas
    const hRatio = canvas.width / img.width
    const vRatio = canvas.height / img.height
    const ratio = Math.max(hRatio, vRatio)
    
    const centerShift_x = (canvas.width - img.width * ratio) / 2
    const centerShift_y = (canvas.height - img.height * ratio) / 2
    
    ctx.drawImage(
      img, 
      0, 0, img.width, img.height,
      centerShift_x, centerShift_y, img.width * ratio, img.height * ratio
    )
  }

  // Handle Resize
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current
      if (canvas) {
        const dpr = window.devicePixelRatio || 1
        canvas.width = window.innerWidth * dpr
        canvas.height = window.innerHeight * dpr
        canvas.style.width = `${window.innerWidth}px`
        canvas.style.height = `${window.innerHeight}px`
        
        const ctx = canvas.getContext('2d', { alpha: false })
        if (ctx && imagesRef.current[1]) {
          drawScaledImage(ctx, imagesRef.current[1])
        }
      }
    }
    window.addEventListener('resize', handleResize)
    handleResize()
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Handle Scroll and Animation Loop
  useEffect(() => {
    let animationFrameId: number;
    let targetFrame = 1;
    let currentFrame = 1;
    let lastDrawnFrame = -1;
    
    let isScrolling = false;
    let scrollTimeout: NodeJS.Timeout;

    const handleScroll = () => {
      isScrolling = true;
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => { isScrolling = false; }, 150);

      const scrollY = window.scrollY
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight
      const scrollFraction = maxScroll > 0 ? Math.max(0, Math.min(1, scrollY / maxScroll)) : 0
      
      let opacity = 0
      if (scrollFraction < 0.2) opacity = scrollFraction / 0.2
      else if (scrollFraction > 0.8) opacity = (1 - scrollFraction) / 0.2
      else opacity = 1
      
      if (canvasRef.current) {
        canvasRef.current.style.opacity = opacity.toString()
      }

      targetFrame = 1 + (scrollFraction * (FRAME_COUNT - 1))
    }

    const renderLoop = () => {
      // Dynamic easing: buttery smooth 0.05 while scrolling, snaps to 0.4 when stopped to prevent drifting
      const currentEase = isScrolling ? 0.05 : 0.4;
      const velocity = Math.abs(targetFrame - currentFrame);

      if (velocity < 0.1) {
        currentFrame = targetFrame;
      } else {
        currentFrame += (targetFrame - currentFrame) * currentEase;
      }
      
      let frameIndex = Math.round(currentFrame);
      if (frameIndex < 1) frameIndex = 1;
      if (frameIndex > FRAME_COUNT) frameIndex = FRAME_COUNT;

      const ctx = canvasRef.current?.getContext('2d', { alpha: false });
      
      let frameToDraw = imagesRef.current[frameIndex];
      let fallbackIndex = frameIndex;
      
      while (!frameToDraw && fallbackIndex > 1) {
        fallbackIndex--;
        frameToDraw = imagesRef.current[fallbackIndex];
      }

      if (ctx && frameToDraw && fallbackIndex !== lastDrawnFrame) {
        drawScaledImage(ctx, frameToDraw);
        lastDrawnFrame = fallbackIndex;
      }
      
      animationFrameId = requestAnimationFrame(renderLoop);
    }

    handleScroll();
    renderLoop();
    
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)
      clearTimeout(scrollTimeout)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <div className="fixed top-0 left-0 w-full h-full -z-[5] pointer-events-none overflow-hidden bg-black">
      <div 
        className={`absolute inset-0 flex items-center justify-center text-white/50 transition-opacity duration-500 ${loading ? 'opacity-100' : 'opacity-0'}`}
      >
        <span className="text-sm tracking-widest uppercase">Initializing...</span>
      </div>
      <canvas
        ref={canvasRef}
        className={`w-full h-full object-cover transition-opacity duration-[300ms] ${loading ? 'opacity-0' : 'opacity-100'}`}
      />
    </div>
  )
}
