import React, { useEffect } from 'react';
import Logo from "../assets/Logo.svg";

function TournamentSetup() {


  return (
    <div className="relative flex flex-col h-screen">

      <div
        className='size-16 m-5'>
        <img src={Logo} alt="Logo" className="" />
      </div>



        <div className='flex flex-col md:flex-row md:justify-between space-y-4 md:space-y-0'>
            <div className="text-justify ml-24">
                <div className="text-4xl font-semibold leading-tight mb-2">Tournament</div>
                <div className="text-2xl leading-tight">
                Compete in thrilling, timed quiz tournaments against others.
                <br />
                    Climb the leaderboard, showcase your knowledge, and win
                <br />
                    exciting rewards!
                </div>
            </div>

            <div className="flex flex-wrap justify-center gap-1 mr-60">

<img 
    className="w-56 h-40 rounded-tl-[40px] rounded-tr-[100px] rounded-bl-[60px] rounded-br-3xl mt-16" 
    src="https://via.placeholder.com/319x244" 
    alt="Image 1" 
/>

<div className='gap-1'>
<div className='flex flex-wrap justify-center mr-10'>
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
            Tournament setup
</div>

        
      </div>
  );
}

export default TournamentSetup;
