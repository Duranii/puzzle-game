import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [timeLeft, setTimeLeft] = useState(15);
  const [gameStarted, setGameStarted] = useState(false);
  const [numbers, setNumbers] = useState(Array.from({ length: 9 }, (_, index) => index + 1));
  const [gameFinished, setGameFinished] = useState(false);

  useEffect(() => {
    let countdown;
    if (gameStarted && !gameFinished) {
      countdown = setInterval(() => {
        setTimeLeft(prevTime => prevTime - 1);
      }, 1000);
    }

    if (timeLeft === 0 && !gameFinished) {
      clearInterval(countdown);
      setGameStarted(false);
      alert("Time's up! Sorry, you didn't win. Try again!");
    }

    return () => clearInterval(countdown);
  }, [timeLeft, gameStarted, gameFinished]);

  function getRandomNumbers() {
    let shuffledNumbers = [...numbers];
    for (let i = shuffledNumbers.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledNumbers[i], shuffledNumbers[j]] = [shuffledNumbers[j], shuffledNumbers[i]];
    }
    return shuffledNumbers;
  }

  function startGame() {
    setGameStarted(true);
    setTimeLeft(15);
    setNumbers(getRandomNumbers());
    setGameFinished(false);
  }

  function allowDrop(event) {
    event.preventDefault();
  }

  function drag(event) {
    event.dataTransfer.setData("text", event.target.id);
  }

  function drop(event) {
    event.preventDefault();
    const data = event.dataTransfer.getData("text");
    const target = event.target;
    if (target.tagName !== 'DIV') {
      return;
    }
    const source = document.getElementById(data);
    const temp = source.innerHTML;
    source.innerHTML = target.innerHTML;
    target.innerHTML = temp;
  }

  function isAscendingOrder(arr) {
    for (let i = 0; i < arr.length - 1; i++) {
      if (arr[i] > arr[i + 1]) {
        return false;
      }
    }
    return true;
  }

  function finishGame(numbers) {
    setGameStarted(false);
    if (isAscendingOrder(numbers)) {
      alert("You won!");
      setGameFinished(true);
    } else {
      alert("Sorry, you didn't win. Try again!");
      setGameFinished(false); 
    }
  }
  

  return (
    <div className="bg-slate-400 h-screen">
      <div className="flex justify-center items-center gap-16 mx-24">
        <button id="submit-btn" onClick={startGame} disabled={gameStarted} className="font-semibold bg-white mt-6 w-36 h-12 border-[2px] border-black">Start Game</button>
        <div className="w-[50%] border-[6px] grid grid-cols-3 border-teal-400 mt-14 hidden" id="win">
          <img style={{ display: 'block', WebkitUserSelect: 'none', margin: 'auto', cursor: 'zoom-in', backgroundColor: 'hsl(0, 0%, 90%)' }} src="https://spectacular-syrniki-77bb87.netlify.app/winning-lights.gif" width="800" height="240" alt="winning animation" />
        </div>
        <div id="container" className="w-[50%] border-[6px] grid grid-cols-3 border-teal-400 mt-14">
          {numbers.map((number, index) => (
            <div key={index}>
              <div draggable="true" onDragStart={drag} onDragOver={allowDrop} onDrop={drop} id={`boxes${index + 1}`} className="box w-[100%] h-44 text-5xl flex justify-center items-center border-[2px] cursor-pointer border-black bg-white">{number}</div>
            </div>
          ))}
        </div>
        <div>
          <div className="text-4xl" id="win-message"></div>
          <div id="loseGame"></div>
          <div className="flex flex-col gap-3 pt-8 buttons">
            <button id="finish-btn" onClick={finishGame} className="cursor-pointer font-semibold bg-white mt-6 w-36 h-12 border-[2px] border-black">Finish</button>
            <div className="text-black font-semibold" id="timer">Time remaining: <span id="time">{timeLeft}</span> seconds</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
