import { useState, useEffect } from 'react';

function Connections() {
  const [devices, setDevices] = useState<string[]>([]);

  useEffect(() => {
    // Listen for device updates from Electron
    window.electron.listenForClientDeviceInformation((deviceNames: string[]) => {
      console.log("Updated Device List:", deviceNames);
      setDevices(deviceNames);
    });
  }, []);

  const handleDisconnect = (deviceName: string) => {
    console.log(`Disconnecting ${deviceName}`);

    // Send manual disconnect request via Electron and sockets
    window.electron.sendManualDisconnect(deviceName);
};

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold mb-4">Connections</h2>
      {devices.length === 0 ? (
        <p>No devices connected.</p>
      ) : (
        <ul className="space-y-2">
          {devices.map((device, index) => (
            <li key={index} className="flex justify-between items-center p-2 bg-gray-100 rounded">
              <span className="text-md"> {device} </span>
              <button
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-700 transition"
                onClick={() => handleDisconnect(device)}
              >
                Disconnect
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Connections;
