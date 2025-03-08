"use client"

import { useEffect, useState } from "react"

interface DPadProps {
  onDirectionPress: (buttonId: string, isPressed: boolean) => void
}

export function DPad({ onDirectionPress }: DPadProps) {
  const [pressedButtons, setPressedButtons] = useState<Record<string, boolean>>({
    up: false,
    right: false,
    down: false,
    left: false,
  })

   // Improved pointer event handlers with sliding support
   const handlePointerDown = (e: React.PointerEvent, buttonId: string) => {
    if (!pressedButtons[buttonId]) {
      setPressedButtons((prev) => ({ ...prev, [buttonId]: true }))
      onDirectionPress(buttonId, true)
      
      // Store pointer ID
      e.currentTarget.setPointerCapture(e.pointerId)
    }
  }

  const handlePointerUp = (e: React.PointerEvent, buttonId: string) => {
    if (pressedButtons[buttonId]) {
      setPressedButtons((prev) => ({ ...prev, [buttonId]: false }))
      onDirectionPress(buttonId, false)
      
      // Release pointer tracking
      e.currentTarget.releasePointerCapture(e.pointerId)
    }
  }

  const handlePointerCancel = (e: React.PointerEvent, buttonId: string) => {
    if (pressedButtons[buttonId]) {
      setPressedButtons((prev) => ({ ...prev, [buttonId]: false }))
      onDirectionPress(buttonId, false)
      
      // Ensure pointer is released
      try {
        e.currentTarget.releasePointerCapture(e.pointerId)
      } catch (err) {
        // Ignore errors if pointer was already released
      }
    }
  }

  // For sliding behavior - handle when pointer enters while already pressed down
  const handlePointerEnter = (e: React.PointerEvent, buttonId: string) => {
    // Only register if a button press is active (sliding behavior)
    const isPressing = e.buttons > 0
    
    if (isPressing && !pressedButtons[buttonId]) {
      setPressedButtons((prev) => ({ ...prev, [buttonId]: true }))
      onDirectionPress(buttonId, true)
      e.currentTarget.setPointerCapture(e.pointerId)
    }
  }

  // Clean up on unmount
  useEffect(() => {
    return () => {
      // Release any pressed buttons
      Object.entries(pressedButtons).forEach(([buttonId, isPressed]) => {
        if (isPressed) {
          onDirectionPress(buttonId, false)
        }
      })
    }
  }, [pressedButtons, onDirectionPress])

  return (
    <div className="relative h-[210px] w-[260px] touch-none">
      {/* Up button - steeper triangle and longer pad */}
      <div
        className={`
          absolute left-1/2 top-0 h-[100px] w-[90px] -translate-x-1/2
          bg-[#4E4848] 
          ${pressedButtons.up ? "translate-y-1 brightness-75" : "shadow-md"}
          transition-all duration-100 ease-in-out
          cursor-pointer touch-none
          border border-black
        `}
        style={{
          clipPath: "polygon(0% 0%, 100% 0%, 100% 60%, 50% 100%, 0% 60%)",
        }}
        onPointerDown={(e) => handlePointerDown(e, "up")}
        onPointerUp={(e) => handlePointerUp(e, "up")}
        onPointerCancel={(e) => handlePointerCancel(e, "up")}
        onPointerEnter={(e) => handlePointerEnter(e, "up")}
        aria-pressed={pressedButtons.up}
        data-button="up"
      />

      {/* Right button - steeper triangle and longer pad */}
      <div
        className={`
          absolute right-0 top-1/2 h-[80px] w-[120px] -translate-y-1/2
          bg-[#4E4848] 
          ${pressedButtons.right ? "translate-x-1 brightness-75" : "shadow-md"}
          transition-all duration-100 ease-in-out
          cursor-pointer
          border border-black
        `}
        style={{
          clipPath: "polygon(40% 0%, 100% 0%, 100% 100%, 40% 100%, 0% 50%)",
        }}
        onPointerDown={(e) => handlePointerDown(e, "right")}
        onPointerUp={(e) => handlePointerUp(e, "right")}
        onPointerCancel={(e) => handlePointerCancel(e, "right")}
        onPointerEnter={(e) => handlePointerEnter(e, "right")}
        aria-pressed={pressedButtons.right}
        data-button="right"
      />

      {/* Down button - steeper triangle and longer pad */}
      <div
        className={`
          absolute bottom-0 left-1/2 h-[100px] w-[90px] -translate-x-1/2
          bg-[#4E4848] 
          ${pressedButtons.down ? "translate-y-[-1px] brightness-75" : "shadow-md"}
          transition-all duration-100 ease-in-out
          cursor-pointer
          border border-black
        `}
        style={{
          clipPath: "polygon(0% 40%, 50% 0%, 100% 40%, 100% 100%, 0% 100%)",
        }}
        onPointerDown={(e) => handlePointerDown(e, "down")}
        onPointerUp={(e) => handlePointerUp(e, "down")}
        onPointerCancel={(e) => handlePointerCancel(e, "down")}
        onPointerEnter={(e) => handlePointerEnter(e, "down")}
        aria-pressed={pressedButtons.down}
        data-button="down"
      />

      {/* Left button - steeper triangle and longer pad */}
      <div
        className={`
          absolute left-0 top-1/2 h-[80px] w-[120px] -translate-y-1/2
          bg-[#4E4848] 
          ${pressedButtons.left ? "translate-x-[-1px] brightness-75" : "shadow-md"}
          transition-all duration-100 ease-in-out
          cursor-pointer
          border border-black
        `}
        style={{
          clipPath: "polygon(0% 0%, 60% 0%, 100% 50%, 60% 100%, 0% 100%)",
        }}
        onPointerDown={(e) => handlePointerDown(e, "left")}
        onPointerUp={(e) => handlePointerUp(e, "left")}
        onPointerCancel={(e) => handlePointerCancel(e, "left")}
        onPointerEnter={(e) => handlePointerEnter(e, "left")}
        aria-pressed={pressedButtons.left}
        data-button="left"
      />

      {/* Center piece - circular */}
      <div className="absolute left-1/2 top-1/2 h-[20px] w-[20px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#4E4848] border border-black"></div>
    </div>
  )
}

