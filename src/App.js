import React, { useState, useEffect } from "react";
import "./MemoryGame.css";

// Fest definierte Aufgabenpaare
const tasks = [
  { plus: { task: "5 + 3", result: 8 }, minus: { task: "8 - 3", result: 5 } },
  { plus: { task: "7 + 4", result: 11 }, minus: { task: "11 - 4", result: 7 } },
  { plus: { task: "6 + 2", result: 8 }, minus: { task: "8 - 2", result: 6 } },
  { plus: { task: "9 + 1", result: 10 }, minus: { task: "10 - 1", result: 9 } },
  { plus: { task: "3 + 6", result: 9 }, minus: { task: "9 - 6", result: 3 } },
  { plus: { task: "4 + 5", result: 9 }, minus: { task: "9 - 5", result: 4 } }
];

const MemoryGame = () => {
  const [selected, setSelected] = useState([]); // Aktuell ausgewählte Karten
  const [matched, setMatched] = useState([]);   // Richtig zugeordnete Paare
  const [attempts, setAttempts] = useState(0);  // Anzahl der Versuche
  const [completedRounds, setCompletedRounds] = useState(0);  // Anzahl der gespielten Runden
  const [isGameOver, setIsGameOver] = useState(false);  // Spielstatus
  const [showError, setShowError] = useState(false);    // Anzeige von Fehlern bei falscher Auswahl

  // Prüfe, ob ein Paar korrekt ausgewählt wurde
  useEffect(() => {
    if (selected.length === 2) {
      const [first, second] = selected;
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

  // Prüfe, ob alle Paare gefunden wurden
  useEffect(() => {
    if (matched.length === tasks.length * 2) {
      setIsGameOver(true);
    }
  }, [matched]);

  // Klick-Event für die Karten
  const handleCardClick = (task, type) => {
    if (
      selected.length < 2 &&
      !selected.some((sel) => sel.task === task.task) &&
      !matched.some((sel) => sel.task === task.task)
    ) {
      setSelected([...selected, { ...task, type }]);
    }
  };

  // Spiel zurücksetzen
  const resetGame = () => {
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
          <p>Du hast {attempts} Versuche gebraucht.</p>
          <p>Bisher gespielte Runden: {completedRounds}</p>
          <button onClick={resetGame}>Noch eine Runde spielen</button>
        </div>
      )}
    </div>
  );
};

export default MemoryGame;
