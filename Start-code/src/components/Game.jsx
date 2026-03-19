import React, { useState } from "react";
import Entity from "./Entity.jsx";
import GameOver from "./GameOver.jsx";
import BattleLog from "./BattleLog.jsx";

// ----------------------------------------------------------------------------------------------------------
// HELPER FUNCTIONS
// ----------------------------------------------------------------------------------------------------------

// Generate a random values in the range {min, max}
function getRandomValue(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

// Create an attack log
function createLogAttack(isPlayer, damage) {
  return {
    isPlayer: isPlayer,
    isDamage: true,
    text: ` takes ${damage} damages`,
  };
}

// Create a healing log
function createLogHeal(healing) {
  return {
    isPlayer: true,
    isDamage: false,
    text: ` heal ${healing} life points`,
  };
}

function Game() {
  // ----------------------------------------------------------------------------------------------------------
  // STATES & VARIABLES
  // ----------------------------------------------------------------------------------------------------------
  const [playerHealth, setPlayerHealth] = useState(100);
  const [monsterHealth, setMonsterHealth] = useState(100);
  const [battleLog, setBattleLog] = useState([]);
  const [round, setRound] = useState(1);
  const [winner, setWinner] = useState(null);

  const isGameOver = winner !== null;
  const canSpecialAttack = round % 3 === 0;
  // ----------------------------------------------------------------------------------------------------------
  // BUTTONS EVENT FUNCTIONS
  // ----------------------------------------------------------------------------------------------------------
  function attackHandler() {
    // Generate random damage vlaues
    const playerDamage = getRandomValue(5, 12);
    const monsterDamage = getRandomValue(5, 12);

    // Apply the damages to the health
    const newMonster = Math.max(monsterHealth - playerDamage, 0);
    const newPlayer = Math.max(playerHealth - monsterDamage, 0);

    setMonsterHealth(newMonster);
    setPlayerHealth(newPlayer);

    // Add the two log entries to our entry array
    setBattleLog((prev) => [
      // set to "true" because the logic in our BattleLog component if it's set to "true" then it's the Player, and the otherwise for the monster.
      createLogAttack(true, playerDamage),
      createLogAttack(false, monsterDamage),
      // We use the spread operator to add the old log entries to the new array, so the two new log entries are shown on top
      ...prev,
    ]);

    // increment the round, the round is use for canSpecialAttack
    setRound((prev) => prev + 1);

    // Check for winner
    checkWinner(newPlayer, newMonster);
  }

  // Logic for every handlers are pretty similar to attackHandler
  function specialAttackHandler() {
    const playerDamage = getRandomValue(8, 25);
    const monsterDamage = getRandomValue(8, 15);

    const newMonster = Math.max(monsterHealth - playerDamage, 0);
    const newPlayer = Math.max(playerHealth - monsterDamage, 0);

    setMonsterHealth(newMonster);
    setPlayerHealth(newPlayer);

    setBattleLog((prev) => [
      createLogAttack(true, playerDamage),
      createLogAttack(false, monsterDamage),
      ...prev,
    ]);

    setRound((prev) => prev + 1);

    checkWinner(newPlayer, newMonster);
  }

  function healHandler() {
    const healValue = getRandomValue(8, 15);
    const playerDamage = getRandomValue(5, 12);

    const healed = Math.min(playerHealth + healValue, 100);
    const newPlayer = Math.max(healed - playerDamage, 0);

    setPlayerHealth(newPlayer);

    setBattleLog((prev) => [
      createLogHeal(healValue),
      createLogAttack(true, playerDamage),
      ...prev,
    ]);

    setRound((prev) => prev + 1);
    checkWinner(newPlayer, monsterHealth);
  }

  function killYourselfHandler() {
    setPlayerHealth(0);
    setBattleLog((prev) => [
      { isPlayer: true, isDamage: true, text: " gave up!" },
      ...prev,
    ]);
    checkWinner(0, monsterHealth);
  }

  function restartGame() {
    setPlayerHealth(100);
    setMonsterHealth(100);
    setBattleLog([]);
    setRound(1);
    setWinner(null);
  }
  // ----------------------------------------------------------------------------------------------------------
  // JSX FUNCTIONS
  // ----------------------------------------------------------------------------------------------------------
  function checkWinner(pHealth, mHealth) {
    if (pHealth <= 0 && mHealth <= 0) setWinner("draw");
    else if (pHealth <= 0) setWinner("monster");
    else if (mHealth <= 0) setWinner("player");
  }
  // ----------------------------------------------------------------------------------------------------------
  // MAIN  TEMPLATE
  // ----------------------------------------------------------------------------------------------------------
  return (
    <>
      <Entity entityName="Your Health" health={playerHealth} />
      <Entity entityName="Monster Health" health={monsterHealth} />

      {isGameOver && (
        <GameOver
          title={
            winner === "draw"
              ? "It's a draw!"
              : winner === "player"
              ? "You Won!"
              : "Monster Won!"
          }
          restartGame={restartGame}
        />
      )}

      {!isGameOver && (
        <section id="controls">
          <button onClick={attackHandler}>ATTACK</button>
          <button onClick={specialAttackHandler} disabled={!canSpecialAttack}>
            SPECIAL !
          </button>
          <button onClick={healHandler}>HEAL</button>
          <button onClick={killYourselfHandler}>KILL YOURSELF</button>
        </section>
      )}

      <BattleLog logs={battleLog} />
    </>
  );
}

export default Game;
