"use client";

import { useEffect, useState } from "react";
import GameButton from "../components/GameButton";
import { DPad } from "../components/DPad";

interface LayoutOneProps {
  socket: SocketIOClient.Socket; // Accept the socket as a prop
}

export default function VirtualGamepad({ socket }: LayoutOneProps) {
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const handleConnect = () => setConnected(true);
    const handleDisconnect = () => setConnected(false);

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
    };
  }, [socket]);

  const handleButtonEvent = (buttonId: string, isPressed: boolean) => {
    if (connected) {
      socket.emit("gamepad", { button: buttonId, pressed: isPressed });
      console.log(`Button ${buttonId} ${isPressed ? "pressed" : "released"}`);
    }
  };

  return (
    <div className="relative w-full max-w-[900px] mx-auto">
      <div className={`absolute -top-10 right-0 flex items-center gap-2 ${connected ? "text-green-500" : "text-red-500"}`}>
        <div className={`h-3 w-3 rounded-full ${connected ? "bg-green-500" : "bg-red-500"}`}></div>
        <span className="text-sm">{connected ? "Connected" : "Disconnected"}</span>
      </div>

      <div className="relative rounded-xl border-[10px] border-[#686A74] bg-white p-4 md:p-8 shadow-2xl">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 md:gap-4">
          <div className="md:ml-4">
            <DPad onDirectionPress={handleButtonEvent} />
          </div>

          <div className="md:mr-4 flex h-[240px] w-[240px] items-center justify-center">
            <div className="relative h-full w-full">
              <div className="absolute left-1/2 top-0 -translate-x-1/2">
                <GameButton name="y" label="Y" color="bg-[#807300]" onPress={(isPressed) => handleButtonEvent("y", isPressed)} className="h-[85px] w-[85px] rounded-full" />
              </div>
              <div className="absolute right-0 top-1/2 -translate-y-1/2">
                <GameButton name="b" label="B" color="bg-[#A90202]" onPress={(isPressed) => handleButtonEvent("b", isPressed)} className="h-[85px] w-[85px] rounded-full" />
              </div>
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2">
                <GameButton name="a" label="A" color="bg-[#00802F]" onPress={(isPressed) => handleButtonEvent("a", isPressed)} className="h-[85px] w-[85px] rounded-full" />
              </div>
              <div className="absolute left-0 top-1/2 -translate-y-1/2">
                <GameButton name="x" label="X" color="bg-[#001880]" onPress={(isPressed) => handleButtonEvent("x", isPressed)} className="h-[85px] w-[85px] rounded-full" />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 flex justify-center gap-16">
          <GameButton name="start" label="START" color="bg-[#4E4848]" textColor="text-white" onPress={(isPressed) => handleButtonEvent("start", isPressed)} className="h-[15px] w-[70px] rounded-full px-2 py-1 text-xs" />
          <GameButton name="options" label="OPTIONS" color="bg-[#4E4848]" textColor="text-white" onPress={(isPressed) => handleButtonEvent("options", isPressed)} className="h-[15px] w-[70px] rounded-full px-2 py-1 text-xs" />
        </div>
      </div>
    </div>
  );
}
