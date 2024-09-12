import React, { useState, useEffect } from 'react';
import { Setting2, Back, Microphone2, MicrophoneSlash, Refresh2 } from 'iconsax-react';
import { useNavigate } from 'react-router-dom';
import SecMicrophone from '../components/ContestSpeech';


function Contest() {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]); // To store fetched questions
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30); // Initial time for each question
  const [transcript, setTranscript] = useState('');

  // Function to handle transcript change
  const handleTranscriptChange = (newTranscript) => {
      setTranscript(newTranscript);
  };

  useEffect(() => {
    // Fetch questions from API when component mounts
    fetch('http://127.0.0.1:8000/first_round/quiz')
      .then((response) => response.json())
      .then((data) => setQuestions(data))
      .catch((error) => console.error('Error fetching questions:', error));
  }, []);

  useEffect(() => {
    // Timer logic
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime === 1) {
          // When timer reaches 1, reset to 30 and change the question
          handleNextQuestion();
          return 30;
        }
        return prevTime - 1; // Decrement time
      });
    }, 1000); // Run every second

    return () => clearInterval(timer); // Cleanup on component unmount
  }, [currentQuestionIndex, questions]); // Add questions as a dependency

  const handleNextQuestion = () => {
    // Move to the next question or reset to the first question
    setCurrentQuestionIndex((prevIndex) =>
      prevIndex < questions.length - 1 ? prevIndex + 1 : 0
    );
  };

  const handleGoBack = () => {
    navigate(-1); // Go back to the previous page
  };


  

  return (
    <div className="relative bg-white p-4">
      {/* Top section with back and settings buttons */}
      <div className="flex justify-between items-center mb-20">
        <Back size="32" color="#555555" onClick={handleGoBack} className="cursor-pointer" />
        <Setting2 size="32" color="#555555" className="cursor-pointer" />
      </div>

      {/* Round information */}
      <div className="flex">
        {/* Left side: Round description and Question */}
        <div className="flex flex-col w-1/2 p-4 ml-5">
          <div className="mb-4 w-3/4 self-end">
            <div className="text-2xl font-semibold">Round 1</div>
            <div className="text-xl font-light mt-2">
              This is the Round of Fundamentals. Good Luck!
            </div>
          </div>
          <div className="bg-[#A1DDE8] rounded-3xl p-4 w-3/4 h-full self-end mb-8">
            <div className="text-xl font-normal mb-1">Question</div>
            <div className="bg-white p-10 rounded-2xl">
              {questions.length > 0 && questions[currentQuestionIndex]?.Question}
            </div>
          </div>
          <div className='w-3/4 self-end'>
          <SecMicrophone onTranscriptChange={handleTranscriptChange}  showTranscript={true}/>
          </div>

        </div>

        {/* Right side: Time Left and Contestants */}
        <div className="grid grid-cols-2 gap-10 w-2/6 p-4">
          <div className="bg-[#A1DDE8] rounded-3xl shadow p-4">
            <div className="text-2xl font-medium">Time Left</div>
            <div className="text-3xl font-medium mt-4">{timeLeft} seconds</div>
          </div>
          {/* Contestants */}
          {[1, 2, 3].map((num) => (
            <div key={num} className="bg-cyan-50 rounded-3xl shadow p-4">
              <div className="bg-cyan-50 rounded-full shadow w-20 h-20 mb-4"></div>
              <div className="text-2xl font-light">Contestant {num}</div>
              <div className="text-2xl font-light mt-4">0</div>
            </div>
          ))}
        </div>
        
      </div>

      {/* Submit Answer Button */}
      <button className="GenerateFixtures bg-indigo-500 rounded-2xl shadow mt-8 p-1 mx-auto w-60 flex justify-center items-center">
        <span className="SubmitAnswer text-white text-2xl font-light">Submit Answer</span>
      </button>
    </div>
  );
}

export default Contest;
