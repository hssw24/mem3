import React, { useState, useEffect } from "react";
import "./MemoryGame.css";

const generateRandomNumber = (max) => Math.floor(Math.random() * max) + 1;

const generateTasks = () => {
  const tasks = [];
  for (let i = 0; i < 6; i++) {
    const a = generateRandomNumber(10);
    const b = generateRandomNumber(10);
    const sum = a + b;
    tasks.push({
      plus: { task: `${a} + ${b}`, result: sum },
      minus: { task: `${sum} - ${b}`, result: a },
    });
  }
  
  // Shuffle tasks to mix plus and minus pairs
  return tasks.sort(() => Math.random() - 0.5);
};

const MemoryGame = () => {
  const [tasks, setTasks] = useState(generateTasks());
  const [selected, setSelected] = useState([]);
  const [matched, setMatched] = useState([]);
  const [attempts, setAttempts] = useState(0);
  const [completedRounds, setCompletedRounds] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    if (selected.length === 2) {
      const [first, second] = selected;
      // Check if selected pair matches (Plus and Minus results match)
      if (
        (first.type === "plus" && second.type === "minus" && first.result === second.result) ||
        (first.type === "minus" && second.type === "plus" && first.result === second.result)
      ) {
        setMatched([...matched, first, second]);
      } else {
        setShowError(true);
        setTimeout(() => setShowError(false), 1000);
      }
      setAttempts(attempts + 1);
      setTimeout(() => setSelected([]), 1000);
    }
  }, [selected]);

  useEffect(() => {
    // Game is over when all pairs are matched
    if (matched.length === tasks.length * 2) {
      setIsGameOver(true);
    }
  }, [matched]);

  const handleCardClick = (task, type) => {
    // Only allow two cards to be selected at a time, and ignore already matched cards
    if (
      selected.length < 2 &&
      !selected.some((sel) => sel.task === task.task) &&
      !matched.some((sel) => sel.task === task.task)
    ) {
      setSelected([...selected, { ...task, type }]);
    }
  };

  const resetGame = () => {
    setTasks(generateTasks());
    setSelected([]);
    setMatched([]);
    setAttempts(0);
    setIsGameOver(false);
    setCompletedRounds(completedRounds + 1);
  };

  return (
    <div className="memory-game">
      <h1>Zahlenmemory - Matheaufgaben</h1>
      <div className="grid">
        <div className="column">
          <h2>Plus-Aufgaben</h2>
          {tasks.map((task, index) => (
            <div
              key={index}
              className={`card ${matched.includes(task.plus) ? "matched" : ""} ${
                selected.includes(task.plus) ? "selected" : ""
              } ${showError && selected.includes(task.plus) ? "error" : ""}`}
              onClick={() => handleCardClick(task.plus, "plus")}
            >
              {task.plus.task}
            </div>
          ))}
        </div>
        <div className="column">
          <h2>Minus-Aufgaben</h2>
          {tasks.map((task, index) => (
            <div
              key={index}
              className={`card ${matched.includes(task.minus) ? "matched" : ""} ${
                selected.includes(task.minus) ? "selected" : ""
              } ${showError && selected.includes(task.minus) ? "error" : ""}`}
              onClick={() => handleCardClick(task.minus, "minus")}
            >
              {task.minus.task}
            </div>
          ))}
        </div>
      </div>

      {isGameOver && (
        <div className="game-over">
          <h2>Spiel beendet!</h2>
          <p>Du hast {attempts} Versuche gebraucht. 
          Bisher gespielte Runden: {completedRounds}</p>
          <button onClick={resetGame}>Noch eine Runde spielen</button>
        </div>
      )}
    </div>
  );
};

export default MemoryGame;
