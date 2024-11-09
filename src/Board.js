import React from 'react';
import Cell from './Cell';
import './Board.css';

const Board = ({ board, onCellClick }) => {
  return (
    <div className="board">
      {board.map((row, rowIndex) => 
        row.map((cell, colIndex) => (
          <Cell
            key={`${rowIndex}-${colIndex}`}
            row={rowIndex}
            col={colIndex}
            value={cell}
            onClick={onCellClick}
          />
        ))
      )}
    </div>
  );
};

export default Board;
