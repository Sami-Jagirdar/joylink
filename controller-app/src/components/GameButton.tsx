"use client"

import { useState, useEffect, useRef } from "react"

interface GameButtonProps {
  name: string
  label?: string
  color: string
  textColor?: string
  className?: string
  onPress: (isPressed: boolean) => void
}

export default function GameButton({
  name,
  label,
  color,
  textColor = "text-white",
  className = "",
  onPress,
}: GameButtonProps) {
  const [isPressed, setIsPressed] = useState(false)
  // Keep track of active pointer IDs to prevent duplicate events
  const activePointers = useRef(new Set<number>())

  // Handle pointer events (works for both touch and mouse)
  const handlePointerDown = (e: React.PointerEvent) => {
    e.stopPropagation() // Prevent event bubbling
    
    // Only process if this pointer isn't already active
    if (!activePointers.current.has(e.pointerId)) {
      activePointers.current.add(e.pointerId)
      
      if (!isPressed) {
        setIsPressed(true)
        onPress(true) // Only emit press event once
      }
      
      // Capture pointer to receive all events
      e.currentTarget.setPointerCapture(e.pointerId)
    }
  }

  const handlePointerUp = (e: React.PointerEvent) => {
    e.stopPropagation() // Prevent event bubbling
    
    // Remove this pointer from active set
    activePointers.current.delete(e.pointerId)
    
    // Release pointer capture
    try {
      e.currentTarget.releasePointerCapture(e.pointerId)
    } catch (err) {
      // Ignore errors if already released
    }
    
    // Only change state if no other pointers are active
    if (activePointers.current.size === 0 && isPressed) {
      setIsPressed(false)
      onPress(false) // Only emit release event once
    }
  }

  const handlePointerCancel = (e: React.PointerEvent) => {
    e.stopPropagation() // Prevent event bubbling
    
    // Remove this pointer from active set
    activePointers.current.delete(e.pointerId)
    
    // Release pointer capture
    try {
      e.currentTarget.releasePointerCapture(e.pointerId)
    } catch (err) {
      // Ignore errors if already released
    }
    
    // Only change state if no other pointers are active
    if (activePointers.current.size === 0 && isPressed) {
      setIsPressed(false)
      onPress(false) // Only emit release event once
    }
  }
  
  // For sliding behavior - handle when pointer enters while already pressed
  const handlePointerEnter = (e: React.PointerEvent) => {
    e.stopPropagation() // Prevent event bubbling
    
    // Only process for sliding (when buttons are pressed)
    const isPressing = e.buttons > 0
    
    if (isPressing && !activePointers.current.has(e.pointerId)) {
      activePointers.current.add(e.pointerId)
      
      if (!isPressed) {
        setIsPressed(true)
        onPress(true) // Only emit press event once
      }
      
      // Capture this pointer
      e.currentTarget.setPointerCapture(e.pointerId)
    }
  }

  // Clean up pressed state when component unmounts
  useEffect(() => {
    return () => {
      if (isPressed) {
        onPress(false)
      }
      activePointers.current.clear()
    }
  }, [isPressed, onPress])

  return (
    <button
      className={`
        ${color} ${textColor} font-bold
        ${isPressed ? "translate-y-2 brightness-75 shadow-inner" : "shadow-lg"}
        transition-all duration-100 ease-in-out
        select-none outline-none touch-none
        ${className}
      `}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
      onPointerEnter={handlePointerEnter}
      aria-pressed={isPressed}
      data-button={name}
    >
      {label || name.toUpperCase()}
    </button>
  )
}