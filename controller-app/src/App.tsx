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
