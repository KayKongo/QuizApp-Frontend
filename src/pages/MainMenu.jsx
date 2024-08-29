import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { endTransition } from '../../redux/transitionSlice';
import Logo from "../assets/Logo.svg";

function MainMenu() {
  const dispatch = useDispatch();
  const moving = useSelector((state) => state.transition.moving);

  useEffect(() => {
    dispatch(endTransition()); // Reset the transition state
  }, [dispatch]);

  return (
    <div className="relative flex flex-col h-screen">
      <div
        className={`absolute top-0 left-0 transition-transform duration-1000 ${
          moving ? 'translate-x-0 translate-y-0' : 'translate-x-[100vw] translate-y-[100vh]'
        }`}
      >
        <img src={Logo} alt="Logo" className="w-20 h-20" />
        <span className="text-4xl font-extrabold ml-2 text-neutral-800">uizArena</span>
      </div>
      <div className="flex-grow flex justify-center items-center">
        {/* Other content of the main menu */}
        <h1 className="text-5xl">Welcome to the Main Menu!</h1>
      </div>
    </div>
  );
}

export default MainMenu;
