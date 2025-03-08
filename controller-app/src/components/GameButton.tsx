"use client"

import { useState, useEffect } from "react"

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

  // Handle pointer events (works for both touch and mouse)
  const handlePointerDown = (e: React.PointerEvent) => {
    setIsPressed(true)
    onPress(true)
    e.currentTarget.setPointerCapture(e.pointerId)
  }

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsPressed(false)
    onPress(false)
    e.currentTarget.releasePointerCapture(e.pointerId)
  }

  const handlePointerCancel = (e: React.PointerEvent) => {
    if (isPressed) {
      setIsPressed(false)
      onPress(false)
      
      // Ensure pointer is released
      try {
        e.currentTarget.releasePointerCapture(e.pointerId)
      } catch (err) {
        // Ignore errors if pointer was already released
      }
    }
  }
  
  // For sliding behavior - handle when pointer enters while already pressed
  const handlePointerEnter = (e: React.PointerEvent) => {
    // Only capture if a button is already being pressed (sliding behavior)
    // We can detect this based on whether any pointer is active
    const isPressing = e.buttons > 0
    
    if (isPressing && !isPressed) {
      setIsPressed(true)
      onPress(true)
      e.currentTarget.setPointerCapture(e.pointerId)
    }
  }

  // Clean up pressed state when component unmounts
  useEffect(() => {
    return () => {
      if (isPressed) {
        onPress(false)
      }
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

