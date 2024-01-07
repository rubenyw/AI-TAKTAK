/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useState } from 'react';

const TaktakWithPlayer = () => {
  const [board, setBoard] = useState(() => Array.from({ length: 5 }, () => Array(5).fill(null)));
  const [alphabet, setAlphabet] = useState(["A", "B", "C", "D", "E"]);
  const [numberic, setNumeric] = useState([1, 2, 3, 4, 5]);

  const [playerTurn, setPlayerTurn] = useState(1); // 1 playerOne , 2 Player Two
  const [players, setPlayers] = useState({
    1: { stones: 21, capstones: 1 },
    2: { stones: 21, capstones: 1 },
  })

  const [actionMode, setActionMode] = useState(false);
  const [hand, setHand] = useState([]);
  const [pickUpMode, setPickUpMode] = useState(false);
  const [lastPickUpPosition, setLastPickUpPosition] = useState(null);
  const [pickUpDirection, setPickUpDirection] = useState(null);

  const reset = () => {
    setBoard(() => Array.from({ length: 5 }, () => Array(5).fill(null)));
    setPlayerTurn(1);
    setPlayers(
      {
        1: { stones: 21, capstones: 1 },
        2: { stones: 21, capstones: 1 },
      }
    );
    setActionMode(false);
    setHand([]);
    setPickUpMode(false);
    setLastPickUpPosition(null);
    setPickUpDirection(null);
  }

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

  const PlayerOneClickDeck = () => {
    if(playerTurn != 1) return;
    
  }

  const PlayerOneDeck = ()=> {
    return (
      <div className="flex flex-col border basis-1/3 bg-black text-white px-4">
        <div className="text-lg mb-4">Player 1</div>
        <div className="flex items-center gap-4 mb-4">
          <div className="w-24 h-24 bg-white">

          </div>
          <div className="text-md">Stone : {players[1].stones}</div>
        </div>
        <div className="flex items-center gap-4 mb-4">
          <div className="w-24 h-24 bg-white rounded-full">

          </div>
          <div className="text-md">Stone : {players[1].capstones}</div>
        </div>
      </div>
    )
  }

  const PlayerTwoDeck = ()=> {
    return (
      <div className="flex flex-col border basis-1/3 bg-white text-black px-4">
        <div className="text-lg mb-4">Player 2</div>
        <div className="flex items-center gap-4 mb-4">
          <div className="w-24 h-24 bg-black">

          </div>
          <div className="text-md">Stone : {players[2].stones}</div>
        </div>
        <div className="flex items-center gap-4 mb-4">
          <div className="w-24 h-24 bg-black rounded-full">

          </div>
          <div className="text-md">Stone : {players[2].capstones}</div>
        </div>
      </div>
    )
  }


  const Table = () => {
    return (
      <div className="board flex border justify-between w-full p-4">
        <PlayerOneDeck/>
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
        <PlayerTwoDeck></PlayerTwoDeck>
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
