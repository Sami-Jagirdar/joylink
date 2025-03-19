import { useEffect, useState } from "react";
import io from "socket.io-client";
import LayoutOne from "./pages/LayoutOne";
import { Joystick } from "react-joystick-component";
import "./App.css";

function App() {
  const [socket, setSocket] = useState<SocketIOClient.Socket | null>(null);
  const [useGamepad] = useState(true); // Toggle between joystick and gamepad

  useEffect(() => {
    const url = window.location.href
    const socketInstance = io(url); // Update if needed
    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, []);

    // Add meta tag to prevent zooming
    const viewport = document.querySelector('meta[name="viewport"]');
    if (viewport) {
      // Update existing viewport meta tag
      viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
    } else {
      // Create new viewport meta tag if it doesn't exist
      const meta = document.createElement('meta');
      meta.name = 'viewport';
      meta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
      document.head.appendChild(meta);
    }

    // Prevent pinch-to-zoom on touch devices
    // document.addEventListener('touchmove', function(event) {
    //   if (event.scale !== 1) { 
    //     event.preventDefault();
    //   }8
    // }, { passive: false });

  const handleJoystickMove = (data: any) => {
    console.log(data);
    if (socket) {
      socket.emit("joystick-move", data);
    }
  };

  return (
    <>
      {useGamepad ? (
        socket ? <LayoutOne socket={socket} /> : <p>Connecting...</p>
      ) : (
        <Joystick size={100} baseColor="gray" stickColor="blue" move={handleJoystickMove} />
      )}
    </>
  );
}

export default App;
