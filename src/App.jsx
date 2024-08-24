import Logo from "./assets/Logo.png";

function App() {
  return (
    <>
      <div className="flex justify-center items-center h-screen">
        <img src={Logo} alt="" />
        <span className="text-4xl -ml-4 mt-4">uizApp</span>
      </div>
    </>
  );
}

export default App;
