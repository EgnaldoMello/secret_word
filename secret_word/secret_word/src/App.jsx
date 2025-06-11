//css
import "./App.css";
//react
import { useCallback, useEffect, useState } from "react";
//data
import { wordsList } from "./data/words";
//components
import StartScreen from "./components/StartScreen";
import GameScreen from "./components/GameScreen";
import EndScreen from "./components/EndScreen";

const stages = [
  { id: 1, name: "start" },
  { id: 2, name: "game" },
  { id: 3, name: "end" },
];

const App = () => {
  const [gameStage, setGameStage] = useState(stages[0].name);
  const [words] = useState(wordsList);

  console.log(words);

  return (
    <div className="App">
      {gameStage === "start" && <StartScreen />}
      {gameStage === "game" && <GameScreen />}
      {gameStage === "end" && <EndScreen />}
    </div>
  );
};

export default App;
