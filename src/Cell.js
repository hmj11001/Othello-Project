import React from 'react';
import './Cell.css'; // Board style

const Cell = ({ row, col, value, onClick }) => {
  return (
    <div className="cell" onClick={() => onClick(row, col)}>
      {value && <div className={`piece ${value}`}></div>}
    </div>
  );
};

export default Cell;
