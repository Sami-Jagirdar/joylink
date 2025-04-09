import { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { useNavigate } from 'react-router-dom';

// { url }: { url: string }
function Connections() {

  const navigate = useNavigate();
  const [devices, setDevices] = useState<string[]>([]);
  const qrCodeRef = useRef<HTMLCanvasElement>(null);
  const [selectedLayout, setSelectedLayout] = useState<string>("");

  const [url, setUrl] = useState<string>("No Network Connection");
  useEffect(() => {
    // FR2: Generate.Connection.Methods - Fetch Client URL
    const fetchUrl = async () => {
      const url = await window.electron.getControllerUrl();
      if (url) {
        setUrl(url);
      } else {
        setUrl("No Network Connection");
      }
    };
    fetchUrl();
  }, [])

  useEffect(() => {
    // Listen for device updates from Electron
    window.electron.listenForClientDeviceInformation((deviceNames: string[]) => {
      console.log("Updated Device List:", deviceNames);
      setDevices(deviceNames);
    });

    const fetchCurrentLayout = async () => {
      const currentLayout = await window.electron.getCurrentLayout();
      if (currentLayout) {
          setSelectedLayout(currentLayout);
      } else {
          setSelectedLayout("");
      }
    };

    fetchCurrentLayout();

  }, []);

  useEffect(() => {
    // FR2: Generate.Connection.Methods - QR Code 
    if (url !== "No Network Connection" && qrCodeRef.current) {
      QRCode.toCanvas(qrCodeRef.current, url, function (error) {
        if (error) {
          console.error('Error generating QR code:', error);
        }
      });
    }
  }, [url]);

  //FR7- Client.Disconnect - Manually disconnect handling
  const handleDisconnect = (deviceName: string) => {
    console.log(`Disconnecting ${deviceName}`);

    // Send manual disconnect request via Electron and sockets
    window.electron.sendManualDisconnect(deviceName);
  };

  return (

      <div className="flex flex-col items-center mx-auto pt-8 px-4 min-h-screen min-w-screen">
        <h1 className="text-3xl font-bold mb-8 text-center">Scan URL to Play</h1>
    
        {/* FR2: Generate.Connection.Methods - Display Client URL  */}
        <p className="mb-3 text-white-700 break-all">{url}</p>
        
        <canvas ref={qrCodeRef} id="qrcode" className="mb-8"></canvas>

        <div className="w-auto rounded-lg shadow-sm p-6">
          <h2 className="text-xl text-white font-bold mb-4 text-center">Connections</h2>
          
          {devices.length === 0 ? (
            <p className="text-center text-gray-400">No devices connected.</p>
          ) : (

            //FR7- Client.Disconnect - Manual disconnect of currently connected client button
            <ul className="space-y-3">
              {devices.map((device, index) => (
                <li key={index} className="flex justify-between items-center p-2 bg-zinc-900 rounded-md border border-green-500">
                  <span className="text-md font-medium p-2">{device} |</span>
                  <span className="text-md font-medium">{selectedLayout}</span>
                  <button
                    className="text-green-100 px-4 py-2 rounded-md"
                    onClick={() => handleDisconnect(device)}
                  >
                    Disconnect
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <button
          className="px-8 py-4 bg-neutral-900 text-white text-xl font-semibold rounded-lg hover:border-red-700 hover:border shadow-lg transform hover:scale-105 cursor-pointer"
          onClick={() => navigate('/customize')}
        >
          Back to customize
        </button>
      </div>

    
  );
}

export default Connections;
