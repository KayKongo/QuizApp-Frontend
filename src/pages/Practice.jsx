import React, { useState, useEffect } from 'react';
import { Setting2, Back } from 'iconsax-react';
import { useNavigate } from 'react-router-dom';

function PracticeContest() {
  const [questions, setQuestions] = useState([]); // State to store fetched questions
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); // State to keep track of current question index

  const navigate = useNavigate(); // Initialize the navigate hook

  const handleGoBack = () => {
    navigate(-1); // Go back to the previous page
  };

  // Fetch questions from the API
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/first_round/quiz'); // Fetch questions from the API
        const data = await response.json(); // Parse JSON response

        // Ensure data is in the correct format
        if (data && Array.isArray(data)) {
          setQuestions(data); // Set questions in state if data is an array
        } else {
          console.error('Unexpected data format:', data); // Log if the format is unexpected
        }
      } catch (error) {
        console.error('Error fetching questions:', error);
      }
    };

    fetchQuestions();
  }, []);

  // Handle moving to the next question
  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  // Handle moving to the previous question
  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  // Extract current question data safely
  const currentQuestion = questions[currentQuestionIndex] || {};

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
          <div className="bg-[#A1DDE8] rounded-3xl p-4 w-3/4 h-1/2 self-end mb-8">
            <div className="text-xl font-normal mb-1">Question</div>
            <div className="bg-white p-10 rounded-2xl">
              {/* Display the current question safely */}
              {currentQuestion.Question || 'Loading...'}
            </div>
          </div>
          <div className="bg-[#A1DDE8] rounded-3xl w-3/4 self-end p-4">
            <div className="text-xl font-normal mb-1">Your Answer</div>
            <div className="bg-white p-4 rounded-2xl">
              {/* Placeholder for the user's answer */}
              Your answer will show here
            </div>
          </div>
        </div>

        {/* Right side: Time Left and Contestants */}
        <div className="grid grid-cols-2 gap-10 w-1/2 p-4">
          <div className="bg-cyan-50 rounded-3xl shadow p-4">
            <div className="bg-cyan-50 rounded-full shadow w-20 h-20 mb-4"></div>
            <div className="text-2xl font-light">Contestant 1</div>
            <div className="text-2xl font-light mt-4">0</div>
          </div>
          {/* Additional Contestant Info... */}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-center mt-4">
        <button onClick={handlePrevQuestion} disabled={currentQuestionIndex === 0} className="mr-2 bg-gray-300 p-2 rounded-lg">
          Previous
        </button>
        <button onClick={handleNextQuestion} disabled={currentQuestionIndex === questions.length - 1} className="ml-2 bg-gray-300 p-2 rounded-lg">
          Next
        </button>
      </div>

      {/* Submit Answer Button */}
      <button className="GenerateFixtures bg-indigo-500 rounded-2xl shadow mt-8 p-1 mx-auto w-60 flex justify-center items-center">
        <span className="SubmitAnswer text-white text-2xl font-light">Submit Answer</span>
      </button>
    </div>
  );
}

export default PracticeContest;
