import { useEffect } from 'react'
import io from 'socket.io-client'
import { Joystick } from 'react-joystick-component';
import './App.css'

let SOCKET: SocketIOClient.Socket

async function handleJoystickMove(data: any) {
  console.log(data)
  SOCKET.emit('joystick-move', data);
}

function App() {
  useEffect(() => {
    // Connect to the server via WebSocket
    const url = window.location.href;
    SOCKET = io(url);
  })

  return (
    <>
      <Joystick size={100} baseColor="gray" stickColor="blue" move={handleJoystickMove} />
    </>
  )
}

export default App
