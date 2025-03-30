import Connections from './pages/connections.tsx';
import StartPage from './pages/start.tsx';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Customize from './pages/customize.tsx';



function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<StartPage />} />
        <Route path="/connections" element={<Connections/>} />
        <Route path="/customize" element={<Customize />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  )
}

export default App