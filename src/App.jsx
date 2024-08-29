import Logo from "./assets/Logo.png";
import Home from "./pages/Home";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MainMenu from "./pages/MainMenu";
import Contest from "./pages/Contest";
import TournamentSetup from "./pages/TournamentSetup";

function App() {
  return (
    <>
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/main-menu" element={<MainMenu />} />
        <Route path="/setup-tournament" element={<TournamentSetup />} />
        <Route path="/contest" element={<Contest/>} />
      </Routes>
    </Router>
    </>
  );
}

export default App;
