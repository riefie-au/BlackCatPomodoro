import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  
  const [timeLeft, setTimeLeft] = useState(1);
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [encouragement, setEncouragement] = useState("");
  const [workMinutes, setWorkMinutes] = useState(25);
  const [breakMinutes, setBreakMinutes] = useState(5);
  

  const quoteMessages = [
  "Tomorrow will worry about itself - Matthew 6:34",
  "Let everything happen to you: beauty and terror. Just keep going. No feeling is final. - Rainer Maria Rilke",
  "Fear not, for I am with you; be not dismayed, for I am your God - Isaiah 41:10",
  "It is the Lord who goes before you. He will be with you; he will never leave you or forsake you. - Deuteronomy 31:8",
  "Keep on going!",
  "You're doing great!",
  "I believe in you!",
  ];

  const breakMessages = [
  "Good Job! Consistency is key ~",
  "Don't forget to drink water",
  "Take a deep breath",
  "Don't forget to stretch!",
  ];

//Encouragement message updater
useEffect(() => {
  let messageInterval: NodeJS.Timeout;

  if (isRunning) {
    const messages = isBreak ? breakMessages : quoteMessages;
    setEncouragement(messages[0]);
    let index = 1

    messageInterval = setInterval(() => {
      setEncouragement(messages[index]);
      index = (index + 1) % messages.length;
    }, 4000)
  } else {
    setEncouragement("");
  }

  return () => clearInterval(messageInterval);
}, [isRunning, isBreak]);
//countdown timer
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
    setTimeLeft(breakMode ? 1 * 60 : 1 * 60);
  }

  const increaseTime = () => {
    if (isBreak) {
      const newMinutes = breakMinutes + 5;
      setBreakMinutes(newMinutes);
      setTimeLeft(newMinutes * 60);
    }
    else {
      const newMinutes = workMinutes + 5;
      setWorkMinutes(newMinutes);
      setTimeLeft(newMinutes * 60);
    }
  }

  const decreaseTime = () => {
    if (breakMinutes < 5 || workMinutes < 5) {
      return
    }
    if (isBreak) {
      const newMinutes = breakMinutes - 5;
      setBreakMinutes(newMinutes);
      setTimeLeft(newMinutes * 60);
    }
    else {
      const newMinutes = workMinutes - 5;
      setWorkMinutes(newMinutes);
      setTimeLeft(newMinutes * 60);
    }

  }
  const handleClick = () => {
    if (!isRunning) {
      setIsRunning(true);
    } else {
      setIsRunning(false);
      setTimeLeft(isBreak ? 1 * 60 : 1 * 60);
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

        <p className={`encouragemet-text ${!isRunning ? "hidden" : ""}`}>
          { encouragement }
        </p>

        <div className="timer-row">
          <button onClick={decreaseTime}>-</button>
           <h1 className="home-timer">{formatTime(timeLeft)}</h1>
          <button onClick={increaseTime}>+</button>
        </div>

  

        <button className="home-button" onClick={handleClick}>
          Start
        </button>
      </div>
    </div>
    
    
  );
}

export default App;
