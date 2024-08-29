import React, { useEffect } from 'react';
import Logo from "../assets/Logo.svg";

function MainMenu() {


  return (
    <div className="relative flex flex-col h-screen">

      <div
        className='size-16 m-5'>
        <img src={Logo} alt="Logo" className="" />
      </div>



        <div className='flex flex-col md:flex-row md:justify-between space-y-4 md:space-y-0'>
            <div className="text-justify ml-24">
                <div className="text-4xl font-semibold leading-tight mb-2">Select Game Mode</div>
                <div className="text-2xl leading-tight">
                Browse through various quiz categories <br />such as General Knowledge, Science, History, and more.<br />Good Luck!
                </div>
            </div>
`
            <div className="flex flex-wrap justify-center gap-1 mr-12">

                    <img 
                        className="w-56 h-40 rounded-tl-[40px] rounded-tr-[128px] rounded-bl-[60px] rounded-br-3xl mt-16" 
                        src="https://via.placeholder.com/319x244" 
                        alt="Image 1" 
                    />
                    
                    <div className='gap-1'>
                    <div className='flex flex-wrap justify-center gap-1'>
                    <img 
                        className="w-36 h-28 rounded-tl-[40px] rounded-tr-3xl rounded-bl-[60px] rounded-br-3xl" 
                        src="https://via.placeholder.com/189x154" 
                        alt="Image 2" 
                    />
                    <img 
                        className="w-36 h-28 rounded-tl-[40px] rounded-tr-3xl rounded-bl-[60px] rounded-br-3xl" 
                        src="https://via.placeholder.com/359x157" 
                        alt="Image 3" 
                    />
                        
                    </div>

                    <img 
                        className="w-72 h-28 rounded-tl-3xl rounded-tr-3xl rounded-bl-[60px] rounded-br-3xl mt-1" 
                        src="https://via.placeholder.com/195x157" 
                        alt="Image 4" 
                    />

                    </div>
                   
</div>

        </div>

        <div className="flex justify-start items-center ml-24">
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
    <button className="bg-[#f8fdff] rounded-[21px] shadow p-4 flex flex-col items-center">
      <div className="text-black text-3xl font-semibold">Practice</div>
      <img className="w-[116px] h-[116px] mb-4" src="https://via.placeholder.com/116x116" alt="Timed Quiz" />
    </button>
    <button className="bg-[#f8fdff] rounded-[21px] shadow p-4 flex flex-col items-center">
      <div className="text-black text-3xl font-semibold">Timed Quiz</div>
      <img className="w-[116px] h-[116px] mb-4" src="https://via.placeholder.com/116x116" alt="Timed Quiz" />
    </button>
    <button className="bg-[#f8fdff] rounded-[21px] shadow p-4 flex flex-col items-center">
      <div className="text-black text-3xl font-semibold">Survival</div>
      <img className="w-[116px] h-[108.38px] mb-4" src="https://via.placeholder.com/116x108" alt="Survival" />
    </button>
    <button className="bg-[#f8fdff] rounded-[21px] shadow p-4 flex flex-col items-center">
      <div className="text-black text-3xl font-semibold">Challenge a Friend</div>
      <img className="w-[123.33px] h-[101.82px] mb-4" src="https://via.placeholder.com/123x102" alt="Challenge a Friend" />
    </button>
    <button className="bg-[#f8fdff] rounded-[21px] shadow p-4 flex flex-col items-center">
      <div className="text-black text-3xl font-semibold text-center">Settings</div>
      <img className="w-[116px] h-[116px] mb-4" src="https://via.placeholder.com/116x116" alt="Timed Quiz" />
    </button>
    <button className="bg-[#f8fdff] rounded-[21px] shadow p-4 flex flex-col items-center">
      <div className="text-black text-3xl font-semibold mb-4">Tournament</div>
      <img className="w-[116px] h-[103.86px]" src="https://via.placeholder.com/116x104" alt="Tournament" />
    </button>
  </div>
</div>

        
      </div>
  );
}

export default MainMenu;
