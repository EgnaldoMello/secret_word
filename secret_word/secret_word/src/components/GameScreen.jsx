import { useState, useRef } from "react";
import "./GameScreen.modules.css";

const GameScreen = ({
  verifyLetter,
  pickedCategory,
  letters,
  guessedLetters,
  guesses,
  wrongLetters,
  score,
}) => {
  //state para somente uma letra que será exibida
  const [letter, setLetter] = useState("");
  //constante do objeto dom input selecionado
  const letterInputRef = useRef(null);
  //a função handleSubmit ativa a função de verificar a letra que foi importada para o gameScreen, com o parâmetro letter
  const handleSubmit = (e) => {
    e.preventDefault();
    verifyLetter(letter);
    //apaga o letter no state e no input
    setLetter("");
    //hook para voltar a selecionar o input da letra após a letra ser envida no onSubmit
    letterInputRef.current.focus();
  };
  return (
    <div className="game">
      <p className="points">
        <span>Pontuação: {score}</span>
      </p>
      <h1>Advinhe a palavra:</h1>
      <h3 className="tip">
        {/*a dica é a categoria selecionada*/}
        Dica sobre a palavra: <span>{pickedCategory}</span>
      </h3>
      <p>Você ainda tem {guesses} tentativa(s).</p>
      <div className="wordContainer">
        {/*map para formar a estrutura da palavra selecionada, parâmetros para a letra e o seu indice key*/}
        {letters.map((letter, i) =>
          //se o array do state guessedLetter tiver nele uma letra da palavra selecionada, ela será impressa na tela
          guessedLetters.includes(letter) ? (
            <span key={i} className="letter">
              {letter}
            </span>
          ) : (
            //se não será impresso um quadrado em branco, por isso o map é usado no state de letters, para aparecer os quadrado na tela conforme o tamanho da palavra
            <span key={i} className="blankSquare"></span>
          )
        )}
      </div>
      <div className="letterContainer">
        <p>Tente advinhar uma letra da palavra:</p>
        {/*evento onSubmit para ativar a função handleSubmit*/}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="letter"
            maxLength="1"
            /*o required permite que o form seja enviado somente após o preenchimento*/
            required
            /*evento onChange para alterar o state letter conforme a letra que o usuário digitou*/
            onChange={(e) => setLetter(e.target.value)}
            /*input vai ser preenchido pelo state*/
            value={letter}
            /*o ref no input é como se letterInputRef fosse a constante do objeto dom input selecionado*/
            ref={letterInputRef}
          />
          <button>Jogar!</button>
        </form>
      </div>
      <div className="wrongLettersContainers">
        <p>Letras já utilizadas:</p>
        {/*Map para exibir as palavras já tentadas que foram erradas*/}
        {wrongLetters.map((letter, i) => (
          <span key={i}> {letter},</span>
        ))}
      </div>
    </div>
  );
};

export default GameScreen;
