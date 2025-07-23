//css
import "./App.css";
//react
import { useCallback, useEffect, useState } from "react";
//data - lista de palavras
import { wordsList } from "./data/words";
//components
import StartScreen from "./components/StartScreen";
import GameScreen from "./components/GameScreen";
import EndScreen from "./components/EndScreen";
//estágios do jogo
const stages = [
  { id: 1, name: "start" },
  { id: 2, name: "game" },
  { id: 3, name: "end" },
];
//as tentativas são 3
const guessesQty = 3;

const App = () => {
  const [gameStage, setGameStage] = useState(stages[0].name);
  const [words] = useState(wordsList);
  const [pickedWord, setPickedWord] = useState("");
  const [pickedCategory, setPickedCategory] = useState("");
  const [letters, setLetters] = useState([]);
  //letras adivinhadas
  const [guessedLetters, setGuessedLetters] = useState([]);
  //letras erradas
  const [wrongLetters, setWrongLetters] = useState([]);
  //tentativas do usuário já setadas para 3
  const [guesses, setGuesses] = useState(guessesQty);
  const [score, setScore] = useState(0);
  //useCallBack para evitar que a função seja executada várias vezes
  const pickWordAndCategory = useCallback(() => {
    //as categorias são as chaves do objeto wordList que está no useState words
    const categories = Object.keys(words);
    //categories = é um array de todas as chaves. Category = pega uma chave aleatória
    const category =
      categories[Math.floor(Math.random() * Object.keys(categories).length)];
    //pegando uma palavra aleatória da categoria selecionada. O objeto precisa ser acessado por [] pois estamos utilizando uma constante que recebe a string de categories
    const word =
      words[category][Math.floor(Math.random() * words[category].length)];
    //função retorna um objeto da palavra e da categoria selecionadas
    return { word, category };
  }, [words]);

  //função para começar a jogar
  //useCallBack para evitar que a função seja executada várias vezes
  const startGame = useCallback(() => {
    //função para limpar todas as letras
    clearLettersStates();
    //função para selecionar a palavra e a categoria é ativada, já começa com as constantes word e category desestruturadas e preenchidas
    const { word, category } = pickWordAndCategory();
    //criando a sepração das letras da palavra selecionada através de um array
    let wordLetters = word.split("");
    //colocando todos os itens do array em minúsculo
    wordLetters = wordLetters.map((l) => l.toLowerCase());
    //o useState pickedWord é prenchido com a constante word
    setPickedWord(word);
    //o useState PickedCategory é prenchido com a constante category
    setPickedCategory(category);
    //o useState letters é prenchido com a variável wordLetters
    setLetters(wordLetters);
    //setGameStage no final pois é preciso primeiro selecionar a categoria,a letra e separá-la.
    setGameStage(stages[1].name);
  }, [pickWordAndCategory]);

  //função para processar as letras digitadas
  const verifyLetter = (letter) => {
    //deixando a letra padronizada
    const normalizedLetter = letter.toLowerCase();
    //condicional para averiguar se a letra já foi utilizada de alguma maneira. Desse modo o usuário não desperdiça uma guess(tentativa) e nem processa uma letra que ele ja adivinhou
    if (
      guessedLetters.includes(normalizedLetter) ||
      wrongLetters.includes(normalizedLetter)
    ) {
      //encerra a função verifyLetter
      return;
    }

    //condicional para incluir a letra jogada para as letras adivinhadas(corretas) ou para as letras erradas
    //verifica se a letra jogada está inclusa em algumas das letras da palavra
    if (letters.includes(normalizedLetter)) {
      //se a condição for verdadeira, o state de letra adivinhadas terá um array com as atuais letras adivinhadas mais a nova letra adivinhada
      setGuessedLetters((actualGuessedLetters) => [
        ...actualGuessedLetters,
        normalizedLetter,
      ]);
    } else {
      //se a condição for falsa, o state de letra erradas terá um array com as atuais letras errada mais a nova letra jogada
      setWrongLetters((actualWrongLetters) => [
        ...actualWrongLetters,
        normalizedLetter,
      ]);
      //além disso, será diminuida as tentativas
      setGuesses((actualGuesses) => actualGuesses - 1);
    }
  };
  //função para limpar os states das letras adivinhadas e erradas
  const clearLettersStates = () => {
    setGuessedLetters([]);
    setWrongLetters([]);
  };

  //hook para monitorar alguma dado, nesse caso será o state das tentativas(guesses). Essa é a condição de derrota
  useEffect(() => {
    //condição quando as tentativas forem igual ou menor a 0
    if (guesses <= 0) {
      //funçao para limpar todas letras, erradas e adivinhadas
      clearLettersStates();
      //direciona para tela de fim de jogo
      setGameStage(stages[2].name);
    }
  }, [guesses]);

  //hook para monitorar as letras adivinhadas. Essa é a condição de vitória.
  useEffect(() => {
    //constante de array de letras sem repetição da palavra selecionada
    const uniqueLetters = [...new Set(letters)];
    //vitória quando o array das letras adivinhadas que vai sendo preenchido possui o mesmo tamanho do array das letras sem repetição que vem do letters, contudo, a condição só é verificada após o start do game, na parte do GameScreen.
    if (
      guessedLetters.length === uniqueLetters.length &&
      gameStage === stages[1].name
    ) {
      //adiciona o score quando adivinha a palavra
      setScore((actualScore) => (actualScore += 100));
      //resetar o jogo com a nova palavra
      startGame;
    }
  }, [guessedLetters, startGame, letters, gameStage]);

  //função para reniciar o jogo
  const retry = () => {
    //a pontução só é limpada depois do retry pois ela precisa aparecer na tela de fim de jogo
    setScore(0);
    //as tentativas da mesma forma da pontuação voltam para 3 após o retry
    setGuesses(guessesQty);
    setGameStage(stages[0].name);
  };
  return (
    <div className="App">
      {/*O componente da tela inicial só é ativado se o gameStage for start*/}
      {gameStage === "start" && <StartScreen startGame={startGame} />}
      {/*O componente da tela do jogo só é ativado se o gameStage for game*/}
      {gameStage === "game" && (
        <GameScreen
          verifyLetter={verifyLetter}
          pickedWord={pickedWord}
          pickedCategory={pickedCategory}
          letters={letters}
          guessedLetters={guessedLetters}
          wrongLetters={wrongLetters}
          guesses={guesses}
          score={score}
        />
      )}
      {/*O componente da tela final só é ativado se o gameStage for end*/}
      {gameStage === "end" && <EndScreen retry={retry} score={score} />}
    </div>
  );
};

export default App;
