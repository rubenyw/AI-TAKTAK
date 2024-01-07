/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useState } from 'react';

const TaktakWithPlayer = () => {
  const [board, setBoard] = useState(() => Array.from({ length: 5 }, () => Array(5).fill(null)));
  const [alphabet, setAlphabet] = useState(["A", "B", "C", "D", "E"]);
  const [numberic, setNumeric] = useState([1, 2, 3, 4, 5]);
  const [isXNext, setIsXNext] = useState(true);

  const [playerTurn, setPlayerTurn] = useState(1); // 1 playerOne , 2 Player Two
  const [players, setPlayers] = useState({
    1: { stones: 21, capstones: 1 },
    2: { stones: 21, capstones: 1 },
  })

  const [actionMode, setActionMode] = useState(false);
  const [hand, setHand] = useState([]);
  const [pickUpMode, setPickUpMode] = useState(false);
  const lastPickUpPosition = null;
  const pickUpDirection = null;

  const handleClick = (rowIndex, colIndex) => {
    if (!board[rowIndex][colIndex]) {
      setBoard((prevBoard) => {
        const newBoard = prevBoard.map((row) => [...row]);
        newBoard[rowIndex][colIndex] = { player: playerTurn, type: "standing" };
        setPlayerTurn(playerTurn === 1 ? 2 : 1);
        return newBoard;
      });
    }
  }

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

  const PrintBoard = () => {
    return (
      board.map((row, rowIndex) => (
        <div key={rowIndex} className="flex text-white">
          {row.map((square, colIndex) => (
              <div key={colIndex} className='grid place-content-center bg-yellow-700 hover:bg-yellow-200 border h-24 w-24'
                onClick={()=>{
                  handleClick(rowIndex, colIndex);
                }}
              >
                {
                  square &&
                  square.type == "flatstone" &&
                  <Flatstone playerTurn={square.player}/>
                }
                {
                  square &&
                  square.type == "standing" &&
                  <Standstone playerTurn={square.player}/>
                }
                {
                  square &&
                  square.type == "capstone" &&
                  <Capstone playerTurn={square.player}/>
                }
              </div>
          ))}
        </div>
      ))
    )
  }

  const LeftsideNumber = ()=>{
    return (
      <div className="flex flex-col items-end text-white">
        <div className="grid place-content-center h-10 w-24">&nbsp;</div>
          {
            numberic.map((item, index) => {
              return <div key={index} className="grid place-content-center h-24 w-10 border">{item}</div>
            })
          }
      </div>
    )
  }

  const Table = () => {
    return (
      <div className="board flex border justify-between w-full p-4">
        <div className="flex border basis-1/3 bg-white">ha</div>
        <div className="flex flex-row basis-1/3">
          <LeftsideNumber/>
          <div className="flex flex-col">
            <div className="flex">
              {alphabet.map((item, index) => (
                  <div key={index} className="flex text-white">
                    <div className='grid place-content-center border h-10 w-24'>{item}</div>
                  </div>
              ))}
            </div>
            <div className="flex flex-col">
              <PrintBoard/>
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
        <div className="flex basis-1/3 bg-white">ha</div>
      </div>
    )
  }

  const Flatstone = ({playerTurn}) => {
    return (
      <div className={`${playerTurn == 1? "bg-white" : "bg-black"} h-16 w-16`}></div>
    )
  }

  const Standstone = ({playerTurn})=> {
    return (
      <div className={`${playerTurn == 1? "bg-white" : "bg-black"} h-16 w-8`}></div>
    )
  }
  const Capstone = ({playerTurn})=> {}

  return (
    <div className='w-full h-full bg-black flex flex-col justify-center'>
      <div className="text-lg text-white">Player Turn : {playerTurn}</div>
      <Table/>  
    </div>
  );
};

export default TaktakWithPlayer;
