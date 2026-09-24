'use client'

import React, { useEffect, useRef, useState } from 'react'

const FRAME_COUNT = 488

export default function ScrollVideo() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [images, setImages] = useState<HTMLImageElement[]>([])
  
  // Preload images
  useEffect(() => {
    const loadedImages: HTMLImageElement[] = []
    let loadedCount = 0

    for (let i = 1; i <= FRAME_COUNT; i++) {
      const img = new Image()
      // format: frame_0001.png
      const frameNum = i.toString().padStart(4, '0')
      img.src = `/video-frames-premium/frame_${frameNum}.png`
      
      img.onload = () => {
        loadedCount++
        if (loadedCount === FRAME_COUNT) {
          setImages(loadedImages)
          // Draw first frame when fully loaded if canvas is ready
          const ctx = canvasRef.current?.getContext('2d')
          if (ctx && loadedImages[0]) {
            drawScaledImage(ctx, loadedImages[0])
          }
        }
      }
      loadedImages.push(img)
    }
  }, [])

  const drawScaledImage = (ctx: CanvasRenderingContext2D, img: HTMLImageElement) => {
    const canvas = ctx.canvas
    // Scale image to cover canvas while maintaining aspect ratio
    const hRatio = canvas.width / img.width
    const vRatio = canvas.height / img.height
    const ratio = Math.max(hRatio, vRatio)
    
    const centerShift_x = (canvas.width - img.width * ratio) / 2
    const centerShift_y = (canvas.height - img.height * ratio) / 2
    
    ctx.clearRect(0, 0, canvas.width, canvas.height)
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
      }
    }
    window.addEventListener('resize', handleResize)
    handleResize()
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Handle Scroll
  useEffect(() => {
    if (images.length !== FRAME_COUNT) return // wait till all loaded

    let animationFrameId: number;
    let targetFrame = 0;
    let currentFrame = 0;
    let lastDrawnFrame = -1;
    let lastBlurAmount = -1;
    
    let isScrolling = false;
    let scrollTimeout: NodeJS.Timeout;
    
    // Cinematic smoothness factor
    const ease = 0.05; 
    const hardStopEase = 0.4; // Grabs the brakes when scrolling stops

    const handleScroll = () => {
      isScrolling = true;
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        isScrolling = false;
      }, 50); // Detect hard stop 50ms after the last scroll event

      const scrollY = window.scrollY
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight
      
      // Calculate scroll fraction
      const scrollFraction = maxScroll > 0 ? Math.max(0, Math.min(1, scrollY / maxScroll)) : 0
      
      // Calculate opacity for smooth fade in/out
      let opacity = 0
      if (scrollFraction < 0.2) {
        opacity = scrollFraction / 0.2
      } else if (scrollFraction > 0.8) {
        opacity = (1 - scrollFraction) / 0.2
      } else {
        opacity = 1
      }
      
      if (canvasRef.current) {
        canvasRef.current.style.opacity = opacity.toString()
      }

      targetFrame = scrollFraction * (FRAME_COUNT - 1)
    }

    const renderLoop = () => {
      const velocity = Math.abs(targetFrame - currentFrame);
      const currentEase = isScrolling ? ease : hardStopEase;

      // Snap to target if very close to prevent endless micro-drifting
      if (velocity < 0.05) {
        currentFrame = targetFrame;
      } else {
        // Lerp current frame towards target frame
        currentFrame += (targetFrame - currentFrame) * currentEase;
      }
      
      const frameIndex = Math.round(currentFrame);
      const ctx = canvasRef.current?.getContext('2d');
      
      // Only draw if the actual integer frame has changed to prevent choppiness/flickering
      if (ctx && images[frameIndex] && frameIndex !== lastDrawnFrame) {
        drawScaledImage(ctx, images[frameIndex]);
        lastDrawnFrame = frameIndex;
      }
      
      if (canvasRef.current) {
        // Instantly kill the blur if we stop scrolling, otherwise scale by velocity
        let blurAmount = isScrolling ? Math.min(velocity * 0.05, 4) : 0; 
        if (velocity < 0.05) blurAmount = 0;

        // Only update DOM if blur changed significantly to prevent CSS thrashing
        if (Math.abs(blurAmount - lastBlurAmount) > 0.05 || (blurAmount === 0 && lastBlurAmount !== 0)) {
           canvasRef.current.style.filter = `blur(${blurAmount}px) contrast(1.2) saturate(1.1) brightness(0.9) sepia(0.2) hue-rotate(-10deg)`;
           lastBlurAmount = blurAmount;
        }
      }
      
      animationFrameId = requestAnimationFrame(renderLoop);
    }

    // Initialize
    handleScroll();
    renderLoop();
    
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)
      clearTimeout(scrollTimeout)
      cancelAnimationFrame(animationFrameId)
    }
  }, [images])

  // Mouse wobble removed for stability

  return (
    <div className="fixed top-0 left-0 w-full h-full -z-[5] pointer-events-none transition-opacity duration-75 overflow-hidden">
      <canvas
        ref={canvasRef}
        className="w-full h-full object-cover opacity-0"
        style={{ 
          transition: 'opacity 0.1s ease-out'
          // Filter is now applied dynamically in the renderLoop for motion blur
        }}
      />
    </div>
  )
}
