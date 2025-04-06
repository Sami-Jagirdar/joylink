import { useEffect, useState } from "react";
import io from "socket.io-client";
import LayoutOne from "./pages/LayoutOne";
import LayoutTwo from "./pages/LayoutTwo";

function getDeviceType(socket: SocketIOClient.Socket) {
  const ua = navigator.userAgent;
  let deviceType = "";

  if (/android/i.test(ua)) {
    deviceType = "Android Device";
  } else if (/iPhone|iPad|iPod/i.test(ua)) {
    deviceType = "iOS Device";
  } else {
    deviceType = "Unknown Device Type";
  }

  return `${deviceType} | Socket ID - ${socket.id}`;
}

interface LayoutSettigs {
  layout: string;
  voiceEnabled: boolean;
  motionEnabled: boolean;
}

function App() {
  const [socket, setSocket] = useState<SocketIOClient.Socket | null>(null);
  const [layout, setLayout] = useState<LayoutSettigs>({
    layout: 'layout-two',
    voiceEnabled: false,
    motionEnabled: false,
  });
  const [connected, setConnected] = useState(false);
  const [manuallyDisconnected, setManuallyDisconnected] = useState(false);
  const [maxConnections, setMaxConnections] = useState(false);

  useEffect(() => {
    const url = window.location.href
    const socketInstance = io(url); // Update if needed
    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  useEffect(() => {
    if (socket) {

      const handleConnect = () => setConnected(true);
      const handleDisconnect = () => setConnected(false);
      const handleManualDisconnect = () => setManuallyDisconnected(true);
      const handleMaxConnections = () => setMaxConnections(true);

      const sendDeviceInfo = () => {
        const deviceName = getDeviceType(socket);
        socket.emit('device-info', { deviceName: deviceName });
      };

      socket.on("connect", handleConnect);
      socket.on("disconnect", handleDisconnect);
      socket.on("request-device-info", sendDeviceInfo);
      socket.on("max-connections-reached", handleMaxConnections)
      socket.on("manually-disconnect", handleManualDisconnect)
      socket.on("layout", (layout: LayoutSettigs) => {
        setLayout(layout)
      })

      return () => {
        socket.off("connect", handleConnect);
        socket.off("disconnect", handleDisconnect);
        socket.off("request-device-info", sendDeviceInfo);
        socket.off("max-connections-reached", handleMaxConnections);
        socket.off("manually-disconnect", handleManualDisconnect);
      };
    }
  }, [socket])

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
    return (
      <>
        {layout.layout === 'layout-one' ? (
          socket ? 
            <LayoutOne 
            socket={socket}
            connected={connected} 
            maxConnections={maxConnections} 
            manuallyDisconnected={manuallyDisconnected}
            voiceEnabled={layout.voiceEnabled} 
            motionEnabled={layout.motionEnabled}/> 
          : 
            <p>Connecting...</p>
        ) : layout.layout === 'layout-two' ? (
          socket ? 
            <LayoutTwo 
            socket={socket} 
            connected={connected} 
            maxConnections={maxConnections} 
            manuallyDisconnected={manuallyDisconnected}
            voiceEnabled={layout.voiceEnabled}
            motionEnabled={layout.motionEnabled}
            /> 
          : 
            <p>Connecting...</p>
        ) : (
          <p>Layout not selected</p>
        )}
      </>
    );
}

export default App;
