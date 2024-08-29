import React, { useEffect, useState } from 'react';
import Logo from "../assets/Logo.svg";
import studentLaptop from "../assets/student-laptop.jpg";
import { useNavigate } from 'react-router-dom';
import laptop from "../assets/laptop.jpg";
import writing from '../assets/writing.jpg';
import books from '../assets/books.jpg';

function TournamentSetup() {

    const [selectedDifficulty, setSelectedDifficulty] = useState(null);
    const navigate = useNavigate();

    const handleButtonClick = (difficulty) => {
      setSelectedDifficulty(difficulty);
    };

    const handleStartButtonClick = () => {
  
        navigate('/contest');
    };


  return (
    <div className="relative flex flex-col h-screen">

      <div
        className='size-16 m-5'>
        <img src={Logo} alt="Logo" className="" />
      </div>



        <div className='flex flex-col md:flex-row md:justify-between space-y-4 md:space-y-0'>
            <div className="text-justify ml-24">
                <div className="text-3xl font-semibold leading-tight mb-2">Tournament</div>
                <div className="text-xl leading-tight">
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
    src={studentLaptop} 
    alt="Image 1" 
/>

<div className='gap-2'>
<div className='flex flex-wrap justify-center mr-10 gap-1'>
<img 
    className="w-36 h-28 rounded-tl-[40px] rounded-tr-3xl rounded-bl-[60px] rounded-br-3xl" 
    src={laptop} 
    alt="Image 2" 
/>
<img 
    className="w-36 h-28 rounded-tl-[40px] rounded-tr-3xl rounded-bl-[60px] rounded-br-3xl" 
    src={books}
    alt="Image 3" 
/>
    
</div>

<img 
    className="w-72 h-28 rounded-tl-3xl rounded-tr-3xl rounded-bl-[60px] rounded-br-3xl mt-1" 
    src={writing}
    alt="Image 4" 
/>

</div>

</div>
        </div>
        <div className="flex flex-col justify-center items-center mt-16">
      <div className='mr-5 text-2xl'>{!selectedDifficulty ? (
       <p>Setup your tournament's difficulty</p> 
      ) : (
        <p>Choose Number of Contestants</p>
      )}

      </div>
      <div className="bg-[#A1DDE8] rounded-3xl w-72 p-4 h-auto mb-8 mt-1">
        <div className='flex flex-col'>
          {!selectedDifficulty ? (
            <>
              <button onClick={() => handleButtonClick('Easy')} className="bg-white p-5 m-2 rounded-2xl">Easy</button>
              <button onClick={() => handleButtonClick('Intermediate')} className="bg-white p-5 m-2 rounded-2xl">Intermediate</button>
              <button onClick={() => handleButtonClick('Hard')} className="bg-white p-5 m-2 rounded-2xl">Hard</button>
              <button onClick={() => handleButtonClick('Auto')} className="bg-white p-5 m-2 rounded-2xl">Auto</button>
            </>
          ) : (
            <div className="text-center">
              <div className='text-center'>
                <p>Input Number of Contestants here</p>
                <input placeholder='Maximum: 3' className='border rounded-xl py-1 border-black text-center mt-3'/>
              </div>
              <button className='bg-[#607FF4] px-4 py-1 mt-5 rounded-2xl text-white' onClick={handleStartButtonClick}>
                Start Tournament!
              </button>
            </div>
          )}
        </div>
      </div>
    </div>

        
      </div>
  );
}

export default TournamentSetup;
