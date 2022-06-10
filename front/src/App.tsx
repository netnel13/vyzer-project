import React, { useState } from 'react';
import './App.css';
import DrawingPage from './pages/DrawingPage';
import GamePage from './pages/GamePage';
import LobbyPage from './pages/LobbyPage';
import WelcomePage from './pages/WelcomePage';
import { Pages } from './types';

function App() {

  const [page,setPage] = useState<Pages>(0)

  return (
    <div className="App">
      {page === 0 && <WelcomePage  setPage={setPage}/>}
      {page === 1 && <LobbyPage setPage={setPage} />}
      {page === 2 && <GamePage setPage={setPage}/>}
      {page === 3 && <DrawingPage setPage={setPage}/>}
      {page === 4 && <div>End Screen</div>}
    </div>
  );
}

export default App;
