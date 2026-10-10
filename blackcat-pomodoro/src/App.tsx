import React, { useState, useEffect } from 'react';
import './App.css';

type Session = { type: "work" | "break", minutes: number };

function buildSchedule(total: number, work: number, rest: number): Session[] {
  const schedule: Session[] = [];
  let remaining = total;

  while (remaining > 0) {
    const workLength = Math.min(work, remaining);
    schedule.push({ type: "work", minutes: workLength });
    remaining -= workLength;

    if (remaining >= rest + work) {
      schedule.push({ type: "break", minutes: rest });
      remaining -= rest;
    } else {
      schedule[schedule.length - 1].minutes += remaining;
      remaining = 0;
    }
  }
  return schedule;
}

const STEP = 15;
const MIN_TOTAL = 15;
const MAX_TOTAL = 240;

function App() {
  
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [encouragement, setEncouragement] = useState("");
  const [workMinutes, setWorkMinutes] = useState(25);
  const [breakMinutes, setBreakMinutes] = useState(5);
  const [totalMinutes, setTotalMinutes] = useState(60);
  const [sessionIndex, setSessionIndex] = useState(0);
  const schedule = buildSchedule(totalMinutes, workMinutes, breakMinutes);
  const currentSession = schedule[sessionIndex];
  const isBreak = currentSession.type === "break";


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


  const changeTotal = (amount: number) => {
    const newTotal = totalMinutes + amount;
    if (newTotal < MIN_TOTAL || newTotal > MAX_TOTAL) {
      return;
    }

    setTotalMinutes(newTotal);
    setSessionIndex(0);

    const newSchedule = buildSchedule(newTotal, workMinutes, breakMinutes);
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
          <button className="image-button" onClick={() => changeTotal(-STEP)} disabled={isRunning}>-</button>
          <button className="image-button" onClick={() => changeTotal(STEP)} disabled={isRunning}>+</button>
        </div>

        <p className={`encouragemet-text ${!isRunning ? "hidden" : ""}`}>
          { encouragement }
        </p>

        
        <span className="total-text" >{totalMinutes} min</span>
        <h1 className="home-timer">{formatTime(timeLeft)}</h1>

         
        <button className="home-button" onClick={handleClick}>
          Start
        </button>
      </div>
    </div>
    
    
  );
}

export default App;
