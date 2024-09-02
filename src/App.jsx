import Logo from "./assets/Logo.png";
import Home from "./pages/Home";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MainMenu from "./pages/MainMenu";
import Contest from "./pages/Contest";
import TournamentSetup from "./pages/TournamentSetup";
import MultiplayerSetup from "./pages/MultiplayerSetup";
import SurvivalSetup from "./pages/SurvivalSetup";
import SurvivalContest from "./pages/SurvivalContest";
import PracticeSetup from "./pages/PracticeSetup";

function App() {
  return (
    <>
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/main-menu" element={<MainMenu />} />
        <Route path="/setup-tournament" element={<TournamentSetup />} />
        <Route path="/contest" element={<Contest/>} />
        <Route path="/setup-multiplayer" element={<MultiplayerSetup/>} />
        <Route path="/setup-survival" element={<SurvivalSetup/>} /> 
        <Route path="/survival-contest" element={<SurvivalContest/>} /> 
        <Route path="/setup-practice" element={<PracticeSetup/>} /> 
      </Routes>
    </Router>
    </>
  );
}

export default App;
