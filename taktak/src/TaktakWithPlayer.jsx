/* eslint-disable no-unused-vars */
import { useState } from 'react';

const TaktakWithPlayer = () => {
  const [board, setBoard] = useState(Array(5).fill(Array(5).fill(1)));
  const [alphabet, setAlphabet] = useState(["A", "B", "C", "D", "E"]);
  const [numberic, setNumeric] = useState([1, 2, 3, 4, 5]);
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
      <div className="board border w-full p-4">
        <div className="flex flex-row">
          <div className="flex flex-col items-end text-white">
            <div className="grid place-content-center h-10 w-24">&nbsp;</div>
            {
              numberic.map((item, index) => {
                return <div key={index} className="grid place-content-center h-24 w-10 border">{item}</div>
              })
            }
          </div>
          <div className="flex flex-col">
            <div className="flex">
              {alphabet.map((item, index) => (
                  <div key={index} className="flex text-white">
                    <div className='grid place-content-center border h-10 w-24'>{item}</div>
                  </div>
              ))}
            </div>
            <div className="flex flex-col">
              {board.map((row, rowIndex) => (
                  <div key={rowIndex} className="flex text-white">
                  {row.map((square, colIndex) => (
                      <div key={colIndex} className='grid place-content-center bg-yellow-700 hover:bg-yellow-200 border h-24 w-24'>{rowIndex}</div>
                  ))}
                  </div>
              ))}
            </div>
            <div className="flex">
              {alphabet.map((item, index) => (
                  <div key={index} className="flex text-white">
                    <div className='grid place-content-center border h-10 w-24'>{item}</div>
                  </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col items-start text-white">
            <div className="grid place-content-center h-10 w-24">&nbsp;</div>
            {
              numberic.map((item, index) => {
                return <div key={index} className="grid place-content-center h-24 w-10 border">{item}</div>
              })
            }
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='w-full h-full bg-black flex justify-center'>
      <Table/>  
    </div>
  );
};

export default TaktakWithPlayer;
