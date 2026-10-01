import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [encouragement, setEncouragement] = useState("");

  const quoteMessages = [
  "Tomorrow will worry about itself - Matthew 6:34",
  "Let everything happen to you: beauty and terror. Just keep going. No feeling is final. - Rainer Maria Rilke",
  "Fear not, for I am with you; be not dismayed, for I am your God - Isaiah 41:10",
  "It is the Lord who goes before you. He will be with you; he will never leave you or forsake you. - Deuteronomy 31:8",
  ];

  const breakMessages = [
  "Don't feel guilty for taking the breaks you need!",
  "Keep on going!",
  "You're doing great!",
  "I believe in you!",
  ];

  useEffect( () => {
    let timer: NodeJS.Timeout; //learn what this does later
    if (isRunning && timeLeft > 0) {
      timer = setInterval( () => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    }
    return() => clearInterval(timer);
  }, [isRunning, timeLeft]);
    
  const formatTime = (seconds: number): string => { //Fomats the time to 2 digit spaces for minute and 2 digit spaces for seconds
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');

    const s = (seconds % 60).toString().padStart(2, '0');

    return `${m}:${s}`;
  }

  const switchMode = (breakMode: boolean) => {
    setIsBreak(breakMode);
    setIsRunning(false);
    setTimeLeft(breakMode ? 5 * 60 : 25 * 60);
  }
  const handleClick = () => {
    if (!isRunning) {
      setIsRunning(true);
    } else {
      setIsRunning(false);
      setTimeLeft(isBreak ?5* 60 : 25 * 60);
    }
  }

  return (
    <div style={{position: 'relative'}}>
      <div>
        <button className="closeButton">
          Close
        </button>
      </div>
    
      <div className="home-content">
        <div className="home-controlls">
          <button className="image-button" onClick={() => switchMode(false)}>
            Work
          </button>
          <button className="image-button" onClick={() => switchMode(true)}>
            Break
          </button>
        </div>

        <p>
          I believe in you!
        </p>

        <h1 className="home-timer">{formatTime(timeLeft)}</h1>

        <button className="home-button" onClick={handleClick}>
          Start
        </button>
      </div>
    </div>
    
    
  );
}

export default App;
