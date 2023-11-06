import { useState} from "react";

import Player from "./components/Player.jsx";
import  GameBoard from "./components/gameboard.jsx";
import Log from './components/Log.jsx';
import GameOver from "./components/GameOver.jsx";
import { WINNING_COMBINATIONS } from "./winning-combinations.js";

const PLAYERS ={
  X:'Player 1',
  O:'Player 2'
};

const INITIAL_GAME_BOARD = [
  [null, null, null],
  [null, null, null],
  [null, null, null],
];

function deriveActivePlayer(gameTurns){
  
  let currentPlayer = 'X';
    
    if (gameTurns.length > 0 && gameTurns[0].player === 'X'){
      currentPlayer='O';
    }
    return currentPlayer;
}

function deriveGameBoard(gameTurns){
  let gameBoard = [...INITIAL_GAME_BOARD.map(array => [...array])];
  
  for(const turn of gameTurns){
      const {square, player} = turn;
      const {row,col} = square;
 
      gameBoard [row] [col] = player;
 
  };
  return gameBoard;
 }

function deriveWinner(gameBoard, player){
  let winner;

  for (const combination of WINNING_COMBINATIONS){
    const firstSquareSymbol = 
    gameBoard[combination[0].row][combination[0].col];
    const secondSquareSymbol = 
    gameBoard[combination[1].row][combination[1].col];
    const thirdSquareSymbol = 
    gameBoard[combination[2].row][combination[2].col];
  
    if (firstSquareSymbol && 
      firstSquareSymbol === secondSquareSymbol && 
      firstSquareSymbol === thirdSquareSymbol)
       {
        
        winner=player[firstSquareSymbol];
    };
}
return winner;
}

function App() {
  const [player,setPlayer] = useState(PLAYERS)
  const [gameTurns, setGameTurns] = useState([]);
 // const [activePlayer, setActivePlayer] = useState('X');

 const activePlayer = deriveActivePlayer (gameTurns);
 const gameBoard = deriveGameBoard(gameTurns);
 const winner = deriveWinner(gameBoard, player)
 const hasDraw = gameTurns.length === 9 && !winner;

  function handleSelectSquare(rowIndex,colIndex) {
  //setActivePlayer((curActivePlayer) => curActivePlayer === 'X'? 'O' : 'X');
  setGameTurns((prevTurns) => {
    const currentPlayer = deriveActivePlayer(prevTurns);

    const updateTurns = [
      { square: {row:rowIndex, col:colIndex},player:currentPlayer },
      ...prevTurns,
    ];

    return updateTurns;
    });
}
function handleRestart(){
  setGameTurns([]);
}

function handlePlayerNameChange(symbol,newName){
 setPlayer( prevPlayers => {
  return {
    ...prevPlayers,
    [symbol]: newName
  }
 });
}

  return (
  <main>
    <div id="game-container">
      <ol id="players" className="highlight-player">
        
        <Player initialName={PLAYERS.X} symbol="X" isActive={activePlayer === 'X'} onChangeName={handlePlayerNameChange}/>
        <Player initialName={PLAYERS.O} symbol="O" isActive={activePlayer === 'O'} onChangeName={handlePlayerNameChange}/>
      </ol>
     {(winner || hasDraw) && <GameOver winner={winner} onRestart={handleRestart}/>}
      <GameBoard onSelectSquare={handleSelectSquare} board={gameBoard} /> 
    </div>
    <Log turns={gameTurns} />
  </main>
   ) ;
}

export default App
