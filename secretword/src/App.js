import "./App.css";
//React
import { useCallback, useEffect, useState } from "react";
//data
import { wordsList } from "./data/WordData";
//components
import StartScreen from "./components/StartScreen";
import Game from "./components/Game";
import Gameover from "./components/GameOver";

const stages = [
  { id: 1, name: "start" },
  { id: 2, name: "game" },
  { id: 3, name: "end" },
];

function App() {
  const [gameStage, setGameStage] = useState(stages[0].name);
  const [words] = useState(wordsList);
  const [pickedWord, setPickedWord] = useState("");
  const [pickedCategory, setPickedCategory] = useState("");
  const [letters, setLetters] = useState([]);
  //pick word and category
  const pickWordAndCategory = useCallback( () => {
    const categories = Object.keys(words);
    const category =
      categories[Math.floor(Math.random() * Object.keys(categories).length)];
    const word =
      words[category][Math.floor(Math.random() * words[category].length)];
    console.log(word);
    console.log(category);
    return { word, category };
  }, [words]);
  const guessesQty = 3;
  // state to hold guessed letters, wrong letters, guesses and score
  const [guessedLetters, setGuessedLetters] = useState([]);
  const [wrongLetters, setWrongLetters] = useState([]);
  const [guesses, setGuesses] = useState(guessesQty);
  const [score, setScore] = useState(50);
  //start the game
  const StartGame = useCallback(() => {
    //pick a random category
    const { word, category } = pickWordAndCategory();
    console.log(word, category);
    //create an array with letters of category
    let wordLetters = word.split("");
    wordLetters = wordLetters.map((l) => l.toLowerCase());

    //fill states
    setPickedWord(word);
    setPickedCategory(category);
    setLetters(wordLetters);
    //change game stage
    setGameStage(stages[1].name);
  }, [pickWordAndCategory]);

  const verifyLetter = (letter) => {
    const normalizedLetter = letter.toLowerCase();
    //check if letter has already been utilized
    if (
      guessedLetters.includes(normalizedLetter) ||
      wrongLetters.includes(normalizedLetter)
    ) {
      return;
    }
    //push guessed letter or remove a guess
    if (letters.includes(normalizedLetter)) {
      setGuessedLetters((actualGuessedLetters) => [
        ...actualGuessedLetters,
        normalizedLetter,
      ]);
    } else {
      setWrongLetters((actualWrongLetters) => [
        ...actualWrongLetters,
        normalizedLetter,
      ]);
      setGuesses((actualGuesses) => actualGuesses - 1);
    }
  };

  const clearLetterStates = () => {
    setGuessedLetters([]);
    setWrongLetters([]);
  };

  useEffect(() => {
    if (guesses <= 0) {
      //reset all states
      clearLetterStates();
      setGameStage(stages[2].name);
    }
  }, [guesses]);

  const GameOver = () => {
    setGameStage(stages[2].name);
  };

  useEffect(() => {
    const uniqueLetters = [...new Set(letters)];

    if (guessedLetters.length === uniqueLetters.length) {
      //add score
      setScore((actualScore) => (actualScore += 100));
      //restart game with new word
      clearLetterStates();
      StartGame();
    }
    console.log(uniqueLetters);
  }, [guessedLetters, letters, StartGame]);

  const retry = () => {
    setScore(0);
    setGuesses(guessesQty);
    setGameStage(stages[0].name);
  };

  return (
    <div className="App">
      {gameStage === "start" && <StartScreen StartGame={StartGame} />}
      {gameStage === "game" && (
        <Game
          GameOver={GameOver}
          guessedLetters={guessedLetters}
          wrongLetters={wrongLetters}
          guesses={guesses}
          score={score}
          pickedWord={pickedWord}
          pickedCategory={pickedCategory}
          letters={letters}
          verifyLetter={verifyLetter}
        />
      )}
      {gameStage === "end" && <Gameover retry={retry} score={score} />}
    </div>
  );
}

export default App;
