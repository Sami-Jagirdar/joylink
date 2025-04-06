import Connections from './pages/connections.tsx';
import StartPage from './pages/start.tsx';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Customize from './pages/customize.tsx';
import ChooseLayout from './pages/chooseLayout.tsx';



function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<StartPage />} />
        <Route path="/choose-layout" element={<ChooseLayout />} />
        <Route path="/connections" element={<Connections/>} />
        <Route path="/customize" element={<Customize />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  )
}

export default App