import './App.css'

import Connections from './connections.tsx';
import StartPage from './start.tsx';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';


function App() {

  const [url, setUrl] = useState<string>("No Network Connection");
  useEffect(() => {
    window.electron.listenForControllerUrl((url) => {
      if (url) {
        setUrl(url);
      } else {
        setUrl("No Network Connection");
      }
    })
  }, [])

  return (
    <Router>
      <Routes>
        <Route path="/" element={<StartPage />} />
        <Route path="/connections" element={<Connections url = {url}/>} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  )
}

export default App