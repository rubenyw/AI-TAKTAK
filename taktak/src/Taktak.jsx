/* eslint-disable no-unused-vars */
import { useState } from 'react';

const TakTakGame = () => {
  const [board, setBoard] = useState(Array(5).fill(Array(5).fill(1)));
  const [isXNext, setIsXNext] = useState(true);

  const handleClick = (row, col) => {
    if (board[row][col] || calculateWinner(board)) {
      return;
    }

    const newBoard = board.map(row => [...row]);
    newBoard[row][col] = isXNext ? 'X' : 'O';

    setBoard(newBoard);
    setIsXNext(!isXNext);
  };

  const renderSquare = (row, col) => (
    <button className="square" onClick={() => handleClick(row, col)}>
      {board[row][col]}
    </button>
  );

  const calculateWinner = (currentBoard) => {
    // Add your logic to check for a winner
    // Return 'X' or 'O' if there's a winner, or null if no winner yet
  };

  const getStatus = () => {
    const winner = calculateWinner(board);
    if (winner) {
      return `Winner: ${winner}`;
    } else {
      return `Next player: ${isXNext ? 'X' : 'O'}`;
    }
  };

  const Table = () => {
    return (
      <div className="board border p-4">
        {board.map((row, rowIndex) => (
            <div key={rowIndex} className="flex text-white">
            {row.map((square, colIndex) => (
                <div key={colIndex} className='grid place-content-center border h-24 w-24'>{rowIndex}</div>
            ))}
            </div>
        ))}
      </div>
    )
  }

  return (
    <div className='w-full h-full bg-black'>
      <div className="status text-white">{getStatus()}</div>
      <Table/>  
    </div>
  );
};

export default TakTakGame;
