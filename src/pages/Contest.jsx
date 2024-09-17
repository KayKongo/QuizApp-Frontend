import React, { useState, useEffect } from 'react';
import { Setting2, Back } from 'iconsax-react';
import { useNavigate } from 'react-router-dom';
import SecMicrophone from '../components/ContestSpeech';

function Contest() {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [transcript, setTranscript] = useState('');
  const [contestantPoints, setContestantPoints] = useState([0, 0, 0]);  // Initialize points for each contestant

  const handleTranscriptChange = (newTranscript) => {
    setTranscript(newTranscript);
  };

  useEffect(() => {
    fetch('http://127.0.0.1:8000/first_round/quiz')
      .then((response) => response.json())
      .then((data) => {
        console.log('Fetched questions:', data);
        setQuestions(data.questions || []);
      })
      .catch((error) => console.error('Error fetching questions:', error));
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime === 1) {
          handleNextQuestion();
          return 30;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentQuestionIndex, questions]);

  const handleNextQuestion = () => {
    setCurrentQuestionIndex((prevIndex) =>
      prevIndex < questions.length - 1 ? prevIndex + 1 : 0
    );
  };

  const handleSubmitAnswer = () => {
    const userAnswer = transcript;
    const correctAnswer = questions[currentQuestionIndex]?.Answer;

    fetch('http://127.0.0.1:8000/first_round/check-answer-sec', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_answer: userAnswer,
        correct_answer: correctAnswer,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('API result:', data);
        const points = data.points;  // Get the points from the API response

        // Update contestant points (assuming contestant 1 for now)
        setContestantPoints((prevPoints) =>
          prevPoints.map((pointsForContestant, idx) =>
            idx === 0 ? pointsForContestant + points : pointsForContestant  // Update points for contestant 1
          )
        );
      })
      .catch((error) => console.error('Error checking answer:', error));
  };

  const getCurrentQuestion = () => {
    if (questions.length > 0 && currentQuestionIndex < questions.length) {
      const currentQuestion = questions[currentQuestionIndex];
      return currentQuestion['Question'];
    }
    return 'Loading questions...';
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="relative bg-white p-4">
      <div className="flex justify-between items-center mb-20">
        <Back size="32" color="#555555" onClick={handleGoBack} className="cursor-pointer" />
        <Setting2 size="32" color="#555555" className="cursor-pointer" />
      </div>

      <div className="flex">
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
              {getCurrentQuestion()}
            </div>
          </div>
          <div className="w-3/4 self-end">
            <SecMicrophone onTranscriptChange={handleTranscriptChange} showTranscript={true} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-10 w-2/6 p-4">
          <div className="bg-[#A1DDE8] rounded-3xl shadow p-4">
            <div className="text-2xl font-medium">Time Left</div>
            <div className="text-3xl font-medium mt-4">{timeLeft} seconds</div>
          </div>
          {[1, 2, 3].map((num) => (
            <div key={num} className="bg-cyan-50 rounded-3xl shadow p-4">
              <div className="bg-cyan-50 rounded-full shadow w-20 h-20 mb-4"></div>
              <div className="text-2xl font-light">Contestant {num}</div>
              <div className="text-2xl font-light mt-4">
                {contestantPoints[num - 1]} points
              </div>
            </div>
          ))}
        </div>
      </div>

      <button
        className="GenerateFixtures bg-indigo-500 rounded-2xl shadow mt-8 p-1 mx-auto w-60 flex justify-center items-center"
        onClick={handleSubmitAnswer}
      >
        <span className="SubmitAnswer text-white text-2xl font-light">Submit Answer</span>
      </button>
    </div>
  );
}

export default Contest;
