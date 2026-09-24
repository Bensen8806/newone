'use client'

import { motion, useMotionValue, useSpring, useTransform, AnimatePresence, MotionValue, SpringOptions } from 'framer-motion'
import React, { Children, cloneElement, useEffect, useMemo, useRef, useState } from 'react'

import './Dock.css'

export interface DockItemData {
  icon: React.ReactNode
  label: string
  onClick?: () => void
  className?: string
}

interface DockItemProps {
  children: React.ReactNode
  className?: string
  onClick?: () => void
  mouseX: MotionValue<number>
  spring: SpringOptions
  distance: number
  magnification: number
  baseItemSize: number
  label: string
}

function DockItem({
  children,
  className = '',
  onClick,
  mouseX,
  spring,
  distance,
  magnification,
  baseItemSize,
  label
}: DockItemProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isHovered = useMotionValue(0)

  const mouseDistance = useTransform(mouseX, val => {
    const rect = ref.current?.getBoundingClientRect() ?? {
      x: 0,
      width: baseItemSize
    }
    return val - rect.x - baseItemSize / 2
  })

  const targetSize = useTransform(mouseDistance, [-distance, 0, distance], [baseItemSize, magnification, baseItemSize])
  const size = useSpring(targetSize, spring)

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onClick?.()
    }
  }

  return (
    <motion.div
      ref={ref}
      style={{
        width: size,
        height: size
      }}
      onHoverStart={() => isHovered.set(1)}
      onHoverEnd={() => isHovered.set(0)}
      onFocus={() => isHovered.set(1)}
      onBlur={() => isHovered.set(0)}
      onClick={onClick}
      className={`dock-item ${className}`}
      tabIndex={0}
      role="button"
      aria-haspopup="true"
      aria-label={label}
      onKeyDown={handleKeyDown}
    >
      {Children.map(children, child => {
        if (React.isValidElement(child)) {
          return cloneElement(child as React.ReactElement<{ isHovered?: MotionValue<number> }>, { isHovered })
        }
        return child
      })}
    </motion.div>
  )
}

function DockLabel({ children, className = '', isHovered }: { children: React.ReactNode; className?: string; isHovered?: MotionValue<number> }) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (!isHovered) return
    const unsubscribe = isHovered.on('change', latest => {
      setIsVisible(latest === 1)
    })
    return () => unsubscribe()
  }, [isHovered])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 0 }}
          animate={{ opacity: 1, y: -10 }}
          exit={{ opacity: 0, y: 0 }}
          transition={{ duration: 0.15 }}
          className={`dock-label ${className}`}
          role="tooltip"
          style={{ x: '-50%' }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function DockIcon({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`dock-icon ${className}`}>{children}</div>
}

export interface DockProps {
  items: DockItemData[]
  className?: string
  spring?: SpringOptions
  magnification?: number
  distance?: number
  panelHeight?: number
  dockHeight?: number
  baseItemSize?: number
}

export default function Dock({
  items,
  className = '',
  spring = { mass: 0.1, stiffness: 150, damping: 12 },
  magnification = 64,
  distance = 160,
  panelHeight = 62,
  baseItemSize = 44
}: DockProps) {
  const mouseX = useMotionValue(Infinity)
  const isHovered = useMotionValue(0)

  // Keep container height stable to eliminate auto-scrolling & layout shift
  const containerHeight = useMemo(() => {
    return Math.max(panelHeight + 16, magnification + 20)
  }, [panelHeight, magnification])

  return (
    <div
      style={{ height: containerHeight, minHeight: containerHeight }}
      className="dock-outer flex items-end justify-center"
    >
      <div
        onMouseMove={(e) => {
          isHovered.set(1)
          mouseX.set(e.clientX)
        }}
        onMouseLeave={() => {
          isHovered.set(0)
          mouseX.set(Infinity)
        }}
        className={`dock-panel ${className}`}
        style={{ height: panelHeight }}
        role="toolbar"
        aria-label="Application dock"
      >
        {items.map((item, index) => (
          <DockItem
            key={index}
            onClick={item.onClick}
            className={item.className}
            mouseX={mouseX}
            spring={spring}
            distance={distance}
            magnification={magnification}
            baseItemSize={baseItemSize}
            label={item.label}
          >
            <DockIcon>{item.icon}</DockIcon>
            <DockLabel>{item.label}</DockLabel>
          </DockItem>
        ))}
      </div>
    </div>
  )
}
