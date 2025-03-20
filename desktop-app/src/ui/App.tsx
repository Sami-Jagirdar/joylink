import './App.css'

import Connections from './connections.tsx';
import {Router} from "../lib/electron-router-dom.ts";
import { Route } from 'react-router-dom';
import StartPage from './StartPage.tsx';
// import CustomizeMappingsPage from './CustomizeMappingsPage.tsx';

function App() {
  
  return (
    <Router  main = {
      <>
        <Route path="/" element={<StartPage />} />
        <Route path="/connections" element={<Connections />} />
        {/* <Route path="/customize-mappings" element={<CustomizeMappingsPage />} /> */}
      </>
    }
    />
  )
}

export default App