"use client"

import { useState } from "react"

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

  // Unified pointer event handlers
  const handlePointerDown = (buttonId: string) => {
    setPressedButtons((prev) => ({ ...prev, [buttonId]: true }))
    onDirectionPress(buttonId, true)
  }

  const handlePointerUp = (buttonId: string) => {
    setPressedButtons((prev) => ({ ...prev, [buttonId]: false }))
    onDirectionPress(buttonId, false)
  }

  const handlePointerLeave = (buttonId: string) => {
    if (pressedButtons[buttonId]) {
      setPressedButtons((prev) => ({ ...prev, [buttonId]: false }))
      onDirectionPress(buttonId, false)
    }
  }

  return (
    <div className="relative h-[240px] w-[340px]">
      {/* Up button - steeper triangle and longer pad */}
      <div
        className={`
          absolute left-1/2 top-0 h-[110px] w-[120px] -translate-x-1/2
          bg-[#4E4848] 
          ${pressedButtons.up ? "translate-y-1 brightness-75" : "shadow-md"}
          transition-all duration-100 ease-in-out
          cursor-pointer
          border border-black
        `}
        style={{
          clipPath: "polygon(0% 0%, 100% 0%, 100% 60%, 50% 100%, 0% 60%)",
        }}
        onPointerDown={() => handlePointerDown("up")}
        onPointerUp={() => handlePointerUp("up")}
        onPointerLeave={() => handlePointerLeave("up")}
        aria-pressed={pressedButtons.up}
        data-button="up"
      />

      {/* Right button - steeper triangle and longer pad */}
      <div
        className={`
          absolute right-0 top-1/2 h-[90px] w-[160px] -translate-y-1/2
          bg-[#4E4848] 
          ${pressedButtons.right ? "translate-x-1 brightness-75" : "shadow-md"}
          transition-all duration-100 ease-in-out
          cursor-pointer
          border border-black
        `}
        style={{
          clipPath: "polygon(40% 0%, 100% 0%, 100% 100%, 40% 100%, 0% 50%)",
        }}
        onPointerDown={() => handlePointerDown("right")}
        onPointerUp={() => handlePointerUp("right")}
        onPointerLeave={() => handlePointerLeave("right")}
        aria-pressed={pressedButtons.right}
        data-button="right"
      />

      {/* Down button - steeper triangle and longer pad */}
      <div
        className={`
          absolute bottom-0 left-1/2 h-[110px] w-[120px] -translate-x-1/2
          bg-[#4E4848] 
          ${pressedButtons.down ? "translate-y-[-1px] brightness-75" : "shadow-md"}
          transition-all duration-100 ease-in-out
          cursor-pointer
          border border-black
        `}
        style={{
          clipPath: "polygon(0% 40%, 50% 0%, 100% 40%, 100% 100%, 0% 100%)",
        }}
        onPointerDown={() => handlePointerDown("down")}
        onPointerUp={() => handlePointerUp("down")}
        onPointerLeave={() => handlePointerLeave("down")}
        aria-pressed={pressedButtons.down}
        data-button="down"
      />

      {/* Left button - steeper triangle and longer pad */}
      <div
        className={`
          absolute left-0 top-1/2 h-[90px] w-[160px] -translate-y-1/2
          bg-[#4E4848] 
          ${pressedButtons.left ? "translate-x-[-1px] brightness-75" : "shadow-md"}
          transition-all duration-100 ease-in-out
          cursor-pointer
          border border-black
        `}
        style={{
          clipPath: "polygon(0% 0%, 60% 0%, 100% 50%, 60% 100%, 0% 100%)",
        }}
        onPointerDown={() => handlePointerDown("left")}
        onPointerUp={() => handlePointerUp("left")}
        onPointerLeave={() => handlePointerLeave("left")}
        aria-pressed={pressedButtons.left}
        data-button="left"
      />

      {/* Center piece - circular */}
      <div className="absolute left-1/2 top-1/2 h-[50px] w-[50px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#4E4848] border border-black"></div>
    </div>
  )
}

