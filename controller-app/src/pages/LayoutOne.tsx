"use client";

import { useEffect, useRef, useState } from "react";
import GameButton from "../components/GameButton";
import { DPad } from "../components/DPad";
import { WebVoiceProcessor } from "@picovoice/web-voice-processor";

interface LayoutOneProps {
  socket: SocketIOClient.Socket;
  connected: boolean;
  maxConnections: boolean;
  manuallyDisconnected: boolean;
  voiceEnabled: boolean;
  motionEnabled: boolean;
}

let lastProcessedTime = 0;
const THROTTLE_INTERVAL = 16;//ms, This cannot be any lower since that will lag the PC

function getDeviceType(socket: SocketIOClient.Socket) {
  const ua = navigator.userAgent;
  let deviceType = "";

  if (/android/i.test(ua)) {
    deviceType = "Android Device";
  } else if (/iPhone|iPad|iPod/i.test(ua)) {
    deviceType = "iOS Device";
  } else {
    deviceType = "Unkown Device Type";
  }

  return `${deviceType} | Socket ID - ${socket.id}`;
}

// FR3 - Establish.Real.Time.Communication - Client side socket communication
export default function VirtualGamepad({ socket, connected, maxConnections, manuallyDisconnected, voiceEnabled, motionEnabled }: LayoutOneProps) {
  const [isLandscape, setIsLandscape] = useState(false);
  const processorEngineRef = useRef<any>(null); // needs to be any since the type is not defined in the library

  const handleMotion = (event: DeviceMotionEvent) => {
    const now = Date.now();
    if (now - lastProcessedTime >= THROTTLE_INTERVAL) {
      socket.emit('device-motion', {
        x: event.accelerationIncludingGravity?.x,
        y: event.accelerationIncludingGravity?.y,
        z: event.accelerationIncludingGravity?.z,
      })
      lastProcessedTime = now
    }

  }
  if (motionEnabled && window.DeviceMotionEvent) {
    window.addEventListener('devicemotion', handleMotion);
  }

  useEffect(() => {

    // Check and update orientation
    const checkOrientation = () => {
      setIsLandscape(window.innerWidth > window.innerHeight);
    };

    // Initial check
    checkOrientation();

    // Listen for orientation changes
    window.addEventListener('resize', checkOrientation);
    window.addEventListener('orientationchange', checkOrientation);
    if (voiceEnabled) {
      const startAudioCapture = async () => {
              await navigator.mediaDevices.getUserMedia({ audio: true });
              const processorEngine = {
                onmessage: (event: MessageEvent) => {
                  const data = event.data;
                  const frame = data.inputFrame as Int16Array;
                  console.log(frame);
                  socket.emit('audio-stream', frame);
                }
              }
              processorEngineRef.current = processorEngine;
      
              await WebVoiceProcessor.subscribe(processorEngine)
            }
      
            startAudioCapture();
    }

    return () => {
      window.removeEventListener('resize', checkOrientation);
      window.removeEventListener('orientationchange', checkOrientation);
      if (voiceEnabled && processorEngineRef.current) {
        const unsubscribe = async () => {
          await WebVoiceProcessor.unsubscribe(processorEngineRef.current);
          await WebVoiceProcessor.reset();
        }
        unsubscribe();
      }
    };
  }, []);

  const handleButtonEvent = (buttonId: string, isPressed: boolean) => {
    if (connected) {

      if (typeof (DeviceMotionEvent as any).requestPermission === 'function') {
        (DeviceMotionEvent as any).requestPermission()
      }

      socket.emit("button", { button: buttonId, pressed: isPressed });

      if (navigator.vibrate) {
        navigator.vibrate(75);
      }
    }
  };

  if (!isLandscape) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-90 text-white p-4 z-50">
        <div className="text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-2 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v7h7V4H4zm9 0v7h7V4h-7zm-9 9v7h7v-7H4zm9 0v7h7v-7h-7z" />
          </svg>
          <h2 className="text-xl font-bold mb-2">Please Rotate Your Device</h2>
          <p>This controller is designed for landscape orientation.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-gray-900 w-full h-full overflow-hidden">
      <div className={`absolute top-2 right-2 flex items-center gap-2 ${connected ? "text-green-500" : "text-red-500"}`}>
        <div className={`h-3 w-3 rounded-full ${connected ? "bg-green-500" : "bg-red-500"}`}></div>
        <span className="text-sm">
          {maxConnections
            ? "Max connections currently connected. You have been disconnected. You may now close this window."
            : connected
              // CHANGED: Updated the connected text to include device type and socket id
              ? `${getDeviceType(socket)}: Connected`
              : manuallyDisconnected
                ? "Manually Disconnected. You may now close this window."
                : "Disconnected"
          }
        </span>
      </div>
      <div className="h-full w-full flex flex-row items-center justify-between p-4">
        {/* Left side - D-Pad */}
        <div className="flex-1 flex justify-center items-center">
          <DPad onDirectionPress={handleButtonEvent} />
        </div>

        {/* Center - Start/Options buttons */}
        <div className="flex flex-row items-center justify-center gap-8">
          <GameButton name="start" label="START" color="bg-[#4E4848]" textColor="text-white" onPress={(isPressed) => handleButtonEvent("start", isPressed)} className="h-[20px] w-[80px] rounded-full px-2 py-1 text-xs" />
          <GameButton name="select" label="SELECT" color="bg-[#4E4848]" textColor="text-white" onPress={(isPressed) => handleButtonEvent("select", isPressed)} className="h-[20px] w-[80px] rounded-full px-2 py-1 text-xs" />
        </div>

        {/* Right side - Action buttons */}
        <div className="flex-1 flex justify-center items-center">
          <div className="relative h-[240px] w-[240px]">
            <div className="absolute left-1/2 top-2 -translate-x-1/2">
              <GameButton name="y" label="Y" color="bg-[#807300]" onPress={(isPressed) => handleButtonEvent("y", isPressed)} className="h-[85px] w-[85px] rounded-full" />
            </div>
            <div className="absolute right-2 top-1/2 -translate-y-1/2">
              <GameButton name="b" label="B" color="bg-[#A90202]" onPress={(isPressed) => handleButtonEvent("b", isPressed)} className="h-[85px] w-[85px] rounded-full" />
            </div>
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2">
              <GameButton name="a" label="A" color="bg-[#00802F]" onPress={(isPressed) => handleButtonEvent("a", isPressed)} className="h-[85px] w-[85px] rounded-full" />
            </div>
            <div className="absolute left-2 top-1/2 -translate-y-1/2">
              <GameButton name="x" label="X" color="bg-[#001880]" onPress={(isPressed) => handleButtonEvent("x", isPressed)} className="h-[85px] w-[85px] rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
