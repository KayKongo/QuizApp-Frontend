import Logo from "./assets/Logo.png";
import Home from "./pages/Home";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MainMenu from "./pages/MainMenu";

function App() {
  return (
    <>
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/main-menu" element={<MainMenu />} />
      </Routes>
    </Router>
    </>
  );
}

export default App;
