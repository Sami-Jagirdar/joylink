import { useState, useEffect } from 'react'
import './App.css'
import QRCode from 'qrcode';

function App() {
  const [url, setUrl] = useState<string>("No Network Connection");
  useEffect(() => {
    window.electron.listenForControllerUrl((url: any) => {
      if (url) {
        setUrl(url);

        const qrcodeElement = document.getElementById('qrcode') as HTMLCanvasElement;
        QRCode.toCanvas(qrcodeElement, url, function (error: any) {
          if (error) {
              console.error('Error generating QR code:', error);
          }
          //console.log('QR code generated!');
        })
      } else {
        setUrl("No Network Connection");
      }
    })
  }, [])
  return (
    <>
      <h1>JoyLink</h1>
      <div>
        <p>{url}</p>
      </div>
      <canvas id="qrcode"></canvas>
    </>
  )
}

export default App
