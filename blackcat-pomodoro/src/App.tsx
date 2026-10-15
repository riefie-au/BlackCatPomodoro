import React, { useState, useEffect, useMemo } from 'react';
import './App.css';


//Calculates the session schedule
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
  const schedule = useMemo( () => buildSchedule(totalMinutes, workMinutes, breakMinutes), [totalMinutes, workMinutes, breakMinutes]);
  const currentSession = schedule[sessionIndex];
  const isBreak = currentSession.type === "break";
  const breakCount = schedule.filter(s => s.type === "break").length;
  const focusCount = schedule.filter(s => s.type === "work").length;
  const typeTotal = isBreak ? breakCount : focusCount;
  const sessionNumber = sessionIndex + 1;

  const typeNumber = schedule
    .slice(0, sessionIndex + 1)
    .filter(s => s.type === currentSession.type)
    .length;


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

  useEffect(() => {
    if (timeLeft !== 0 || !isRunning) {
      return;
    }

  const nextIndex = sessionIndex + 1;

  if(nextIndex >= schedule.length) {
    setIsRunning(false);
    setSessionIndex(0);
    setTimeLeft(schedule[0].minutes * 60);
  } else {
    setSessionIndex(nextIndex);
    setTimeLeft(schedule[nextIndex].minutes * 60);
  }
}, [timeLeft, isRunning, schedule, sessionIndex]);

      
  const formatTime = (seconds: number): string => { //Fomats the time to 2 digit spaces for minute and 2 digit spaces for seconds
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');

    const s = (seconds % 60).toString().padStart(2, '0');

    return `${m}:${s}`;
  }

  const breakText = (count: number): string => {
    if (count === 0) {
      return "No breaks";
    } 
    if (count === 1) {
      return "1 break";
    }
    return `${count} breaks`;
  };


  const changeTotal = (amount: number) => {
    const newTotal = totalMinutes + amount;
    if (newTotal < MIN_TOTAL || newTotal > MAX_TOTAL) {
      return;
    }

    setTotalMinutes(newTotal);
    setSessionIndex(0);

    const newSchedule = buildSchedule(newTotal, workMinutes, breakMinutes);
    setTimeLeft(newSchedule[0].minutes * 60);
  };

  

  
  const handleClick = () => {
    if (!isRunning) {
      setIsRunning(true);
    } else {
      setIsRunning(false);
      setSessionIndex(0);
      setTimeLeft(schedule[0].minutes * 60);
    }
  };

  return (
    <div style={{position: 'relative'}}>
      <div>
        <button className="closeButton">
          Close
        </button>
      </div>
    
      <div className="home-content">
        {isRunning ? (
          <>
            <p className="encouragement-text">{encouragement}</p>

            <h1 className="timer">{formatTime(timeLeft)}</h1>

            <p className="session-text">
              {isBreak ? "Break" : "Focus"} · {typeNumber} · {totalMinutes} min total
            </p>
          </>
        ) : (
          <>
            <div className = "home-controlls">
              <button className="image-button" onClick={() => changeTotal(-STEP)}>-</button>
              <h1 className="total-text">{totalMinutes} min</h1>
              <button className="image-button" onClick={() => changeTotal(STEP)}>+</button>
            </div>  

            <p className="session-text">{breakText(breakCount)}</p>
          </>
        )}
        <button className="home-button" onClick={handleClick}>
          {isRunning ? "Stop" : "Start"}
        </button>
      </div>
    </div>
    
    
  );
}

export default App;
