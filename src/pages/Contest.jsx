function Contest() {
  return (
    <div className="relative bg-white p-4">
      {/* Top section with back and settings buttons */}
      <div className="flex justify-between items-center">
        <div className="BackButton w-24 h-24">back</div>
        <div className="Settings w-24 h-24">settings</div>
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
        <div className="bg-teal-200 rounded-3xl p-4 w-3/4 h-1/2 self-end mb-8">
          <div className="text-xl font-normal mb-1">Question</div>
          <div className="bg-white p-10 rounded-2xl">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </div>
        </div>
        <div className="bg-teal-200 rounded-3xl w-3/4 self-end p-4">
          <div className="text-xl font-normal mb-1">Your Answer</div>
          <div className="bg-white p-4 rounded-2xl">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </div>
        </div>
      </div>

      {/* Right side: Time Left and Contestants */}
      <div className="grid grid-cols-2 gap-10 w-2/6 p-4">
        <div className="bg-teal-200 rounded-3xl shadow p-4">
          <div className="text-2xl font-medium">Time Left</div>
          <div className="text-3xl font-medium mt-4">30 seconds</div>
        </div>
        <div className="bg-cyan-50 rounded-3xl shadow p-4">
          <div className="bg-cyan-50 rounded-full shadow w-20 h-20 mb-4"></div>
          <div className="text-2xl font-light">Contestant 1</div>
          <div className="text-2xl font-light mt-4">0</div>
        </div>
        <div className="bg-cyan-50 rounded-3xl shadow p-4">
          <div className="bg-cyan-50 rounded-full shadow w-20 h-20 mb-4"></div>
          <div className="text-2xl font-light">Contestant 2</div>
          <div className="text-2xl font-light mt-4">0</div>
        </div>
        <div className="bg-cyan-50 rounded-3xl shadow p-4">
          <div className="bg-cyan-50 rounded-full shadow w-20 h-20 mb-4"></div>
          <div className="text-2xl font-light">Contestant 3</div>
          <div className="text-2xl font-light mt-4">0</div>
        </div>
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
