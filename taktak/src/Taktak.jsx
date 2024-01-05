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

  return (
    <div className='w-full h-full bg-black'>
      <div className="status text-white">{getStatus()}</div>
      <div className="board h-5/6">
        {board.map((row, rowIndex) => (
            <div key={rowIndex} className="flex h-1/6 gap-4 text-white">
            {row.map((square, colIndex) => (
                <div key={colIndex} className='border basis-2/12'>{rowIndex}</div>
            ))}
            </div>
        ))}
      </div>
    </div>
  );
};

export default TakTakGame;
