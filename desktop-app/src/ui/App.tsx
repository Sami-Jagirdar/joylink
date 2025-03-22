import Connections from './connections.tsx';
import StartPage from './start.tsx';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Customize from './customize.tsx';


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