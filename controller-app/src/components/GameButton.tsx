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
  const handlePointerDown = () => {
    setIsPressed(true)
    onPress(true)
  }

  const handlePointerUp = () => {
    setIsPressed(false)
    onPress(false)
  }

//   const handlePointerLeave = () => {
//     if (isPressed) {
//       setIsPressed(false)
//       onPress(false)
//     }
//   }

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
        select-none outline-none
        ${className}
      `}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
    //   onPointerLeave={handlePointerLeave}
      aria-pressed={isPressed}
      data-button={name}
    >
      {label || name.toUpperCase()}
    </button>
  )
}

