import React, { useState } from 'react';
import Board from './Board'; 
import './App.css';

// Directions for flipping
const directions = [
  [-1, 0], [1, 0], [0, -1], [0, 1], // vertical and horizontal moves
  [-1, -1], [-1, 1], [1, -1], [1, 1] // diagonal moves
];

const App = () => {
  const [board, setBoard] = useState(initializeBoard());
  const [currentPlayer, setCurrentPlayer] = useState('black');
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState(null);

  // create a board with starting positions
  function initializeBoard() {
    const newBoard = Array.from({ length: 8 }, () => Array(8).fill(null));
    newBoard[3][3] = 'white';
    newBoard[3][4] = 'black';
    newBoard[4][3] = 'black';
    newBoard[4][4] = 'white';
    return newBoard;
  }

  // Handle click on a cell
  function handleCellClick(row, col) {
    if (gameOver || !isValidMove(row, col)) return;

    const updatedBoard = [...board];
    updatedBoard[row][col] = currentPlayer;
    flipPieces(updatedBoard, row, col);
    setBoard(updatedBoard);

    // Check if the game should end in case of no more moves
    if (checkGameEnd()) {
      setGameOver(true);
    } else {
      setCurrentPlayer(currentPlayer === 'black' ? 'white' : 'black');
    }
  }

  // Check if a move is valid and no existing piece is there
  function isValidMove(row, col) {
    if (board[row][col] !== null) return false;
    const opponent = currentPlayer === 'black' ? 'white' : 'black';

    for (const [dx, dy] of directions) {
      let x = row + dx;
      let y = col + dy;
      let hasOpponentBetween = false;

      while (x >= 0 && x < 8 && y >= 0 && y < 8 && board[x][y] === opponent) {
        x += dx;
        y += dy;
        hasOpponentBetween = true;
      }

      if (hasOpponentBetween && x >= 0 && x < 8 && y >= 0 && y < 8 && board[x][y] === currentPlayer) {
        return true;
      }
    }

    return false;
  }

  // Flip the opponent's pieces
  function flipPieces(updatedBoard, row, col) {
    const opponent = currentPlayer === 'black' ? 'white' : 'black';

    for (const [dx, dy] of directions) {
      let x = row + dx;
      let y = col + dy;
      let cellsToFlip = [];

      while (x >= 0 && x < 8 && y >= 0 && y < 8 && updatedBoard[x][y] === opponent) {
        cellsToFlip.push([x, y]);
        x += dx;
        y += dy;
      }

      if (x >= 0 && x < 8 && y >= 0 && y < 8 && updatedBoard[x][y] === currentPlayer) {
        for (const [fx, fy] of cellsToFlip) {
          updatedBoard[fx][fy] = currentPlayer;
        }
      }
    }
  }

  // Check if the game has ended
  function checkGameEnd() {
    let currentValidMoveFound = false;
    let otherValidMoveFound = false;

    // Check for current player's valid move
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        if (isValidMove(i, j)) {
          currentValidMoveFound = true;
          break;
        }
      }
      if (currentValidMoveFound) break;
    }

    if (!currentValidMoveFound) {
      // Switch player if current player has no valid moves
      setCurrentPlayer(currentPlayer === 'black' ? 'white' : 'black');

      // Check for opponent's valid move
      for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
          if (isValidMove(i, j)) {
            otherValidMoveFound = true;
            break;
          }
        }
        if (otherValidMoveFound) break;
      }

      if (!otherValidMoveFound) {
        // Count pieces
        const blackCount = board.flat().filter(piece => piece === 'black').length;
        const whiteCount = board.flat().filter(piece => piece === 'white').length;

        if (blackCount > whiteCount) {
          setWinner('black');
        } else if (whiteCount > blackCount) {
          setWinner('white');
        } else {
          setWinner('draw');
        }

        return true; // Game is over
      }
    }

    return false; // Game continues
  }
//adding button for restart
const restartGame = () => {
  setBoard(initializeBoard());
  setCurrentPlayer('black'); // Reset to Black starting
  setGameOver(false); // Game is no longer over
};

  return (
    <div className="app">
      <h1>Othello</h1>
      <Board board={board} onCellClick={handleCellClick} />
      <p>Current Player: {currentPlayer}</p>
      <button onClick={restartGame} className="restart-button">
            Restart Game
          </button>
      {gameOver && (
        <div className="game-over">
          <h2 style={{textAlign: "center", color: "red"}}>Game Over!</h2>
          <p>Congratulations {winner === 'draw' ? 'It\'s a draw!' : winner}! You won! </p>
        </div>
      )}
    </div>
  );
};

export default App;
