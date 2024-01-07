/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useState } from 'react';

const TaktakWithPlayer = () => {
  const [board, setBoard] = useState(() => Array.from({ length: 5 }, () => Array(5).fill(null)));
  const [alphabet, setAlphabet] = useState(["A", "B", "C", "D", "E"]);
  const [numberic, setNumeric] = useState([1, 2, 3, 4, 5]);

  const [playerTurn, setPlayerTurn] = useState(1); // 1 playerOne , 2 Player Two
  const [players, setPlayers] = useState({
    1: { stones: 21, capstones: 1, stonesClicked: false, capstoneClicked: false },
    2: { stones: 21, capstones: 1, stonesClicked: false, capstoneClicked: false },
  })

  const [previewMode, setPreviewMode] = useState(false);
  const [previewBoard, setPreviewBoard] = useState([]);
  const [actionMode, setActionMode] = useState(false);
  const [hand, setHand] = useState([]);
  const [pickUpMode, setPickUpMode] = useState(false);
  const [lastPickUpPosition, setLastPickUpPosition] = useState(null);
  const [pickUpDirection, setPickUpDirection] = useState(null);

  const [stoneMode, setStoneMode] = useState(false); // false = flat, true = standing

  const reset = () => {
    setBoard(() => Array.from({ length: 5 }, () => Array(5).fill(null)));
    setPlayerTurn(1);
    setPlayers(
      {
        1: { stones: 21, capstones: 1, stonesClicked: false, capstoneClicked: false },
        2: { stones: 21, capstones: 1, stonesClicked: false, capstoneClicked: false },
      }
    );
    setActionMode(false);
    setHand([]);
    setPickUpMode(false);
    setLastPickUpPosition(null);
    setPickUpDirection(null);
    setPreviewMode([]);
  }

  const handleClick = (rowIndex, colIndex) => {
    const currentPlayer = players[playerTurn];
    if(previewMode){
      setPreviewBoard(board[rowIndex][colIndex]?board[rowIndex][colIndex] :[]);
    }
    else if(!currentPlayer.capstoneClicked && !currentPlayer.stonesClicked){
      setPreviewMode(board[rowIndex][colIndex]? board[rowIndex][colIndex]: []);
    }else{
      const stoneType = players[playerTurn].capstoneClicked? "capstone" : (stoneMode? "standing" : "flatstone");
      placeStone(rowIndex, colIndex, stoneType);
      nextTurn();

    }
  }

  const placeStone = (row, col, stone) => {
    let temp = board;
    if(temp[row][col] == null){
      temp[row][col] = [{ player: playerTurn, type: stone }];
    }else{
      temp[row][col].push({ player: playerTurn, type: stone });
    }
    console.log(temp[row][col]);
    setBoard(temp);
  }

  const nextTurn = () => {

    setPlayers((prevPlayers) => {
      const updatedPlayers = {
        ...prevPlayers,
        [playerTurn]: {
          ...prevPlayers[playerTurn],
          stonesClicked: false,
          capstoneClicked: false,
        },
      };
      return updatedPlayers;
    });

    setStoneMode(false);
    setPlayerTurn(playerTurn === 1 ? 2 : 1);
  }
  

  const PlayerClickStonesDeck = (turn, type) => {
    if (playerTurn !== turn || previewMode) {
      return;
    }
    
    if( (type == "stone" && players[turn].stones == 0 && !players[turn].stonesClicked) ||
        (type == "cap" && players[turn].capstones == 0 && !players[turn].capstoneClicked))return;

    setPlayers((prevPlayers) => {
      if (type === "stone") {
        const updatedPlayers = {
          ...prevPlayers,
          [turn]: {
            ...prevPlayers[turn],
            stones: prevPlayers[turn].stonesClicked? prevPlayers[turn].stones + 1 : prevPlayers[turn].stones - 1,
            stonesClicked: !prevPlayers[turn].stonesClicked,
            capstones: prevPlayers[turn].capstoneClicked? prevPlayers[turn].capstones + 1 : prevPlayers[turn].capstones,
            capstoneClicked: prevPlayers[turn].capstoneClicked? !prevPlayers[turn].capstoneClicked : prevPlayers[turn].capstoneClicked,
          },
        };
        return updatedPlayers;
      } else {
        const updatedPlayers = {
          ...prevPlayers,
          [turn]: {
            ...prevPlayers[turn],
            capstones: prevPlayers[turn].capstoneClicked? prevPlayers[turn].capstones + 1 : prevPlayers[turn].capstones - 1,
            capstoneClicked: !prevPlayers[turn].capstoneClicked,
            stones: prevPlayers[turn].stonesClicked? prevPlayers[turn].stones + 1 : prevPlayers[turn].stones,
            stonesClicked: prevPlayers[turn].stonesClicked? !prevPlayers[turn].stonesClicked : prevPlayers[turn].stonesClicked,
          },
        };
        return updatedPlayers;
      }
    });
  };

  const PrintBoard = () => {
    return (
      board.map((row, rowIndex) => (
        <div key={rowIndex} className="flex text-white">
          {row.map((square, colIndex) => {
            return (
              <div key={colIndex} className='grid place-content-center bg-yellow-700 hover:bg-yellow-200 border h-24 w-24'
                onClick={()=>{
                  handleClick(rowIndex, colIndex);
                }}
              >
                {
                  square &&
                  square[square.length - 1].type == "flatstone" &&
                  <Flatstone playerTurn={square[square.length - 1].player}/>
                }
                {
                  square &&
                  square[square.length - 1].type == "standing" &&
                  <Standstone playerTurn={square[square.length - 1].player}/>
                }
                {
                  square &&
                  square[square.length - 1].type == "capstone" &&
                  <Capstone playerTurn={square[square.length - 1].player}/>
                }
              </div>
          )
          })}
        </div>
      ))
    )
  }

  const LeftsideNumber = ()=>{
    return (
      <div className="flex flex-col items-end text-white ">
        <div className="grid place-content-center h-10 w-24 ">&nbsp;</div>
          {
            numberic.map((item, index) => {
              return <div key={index} className="grid place-content-center h-24 w-10 border bg-yellow-600">{item}</div>
            })
          }
      </div>
    )
  }

  const PlayerOneDeck = ()=> {
    return (
      <div className="flex flex-col border basis-1/3 rounded-lg bg-gradient-to-r from-zinc-900 via-neutral-800 to-stone-700  text-white px-4">
        <div className="text-lg mb-4">Player 1</div>
        <div className="text-lg mb-4">Score</div>
          <div className="flex items-center gap-4 mb-4">
            <div className={`w-24 h-24 ${players[1].stonesClicked? "bg-slate-400" : "bg-white"} hover:bg-slate-400`}
              onClick={()=>{PlayerClickStonesDeck(1, "stone")}}
            >

            </div>
            <div className="text-md">Stone : {players[1].stones}</div>
          </div>
        <div className="flex items-center gap-4 mb-4">
          <div className={`w-24 h-24 ${players[1].capstoneClicked? "bg-slate-400" : "bg-white"} hover:bg-slate-400 rounded-full`}
            onClick={()=>{PlayerClickStonesDeck(1, "cap")}}
          >

          </div>
          <div className="text-md">Stone : {players[1].capstones}</div>
        </div>
        {
          players[1].stonesClicked && (
          <div className="flex flex-col gap-3 items-center">
            <button 
              onClick={() => setStoneMode(true)} 
              className="w-full bg-blue-500 hover:bg-blue-700 focus:outline-none focus:ring focus:border-blue-300 text-white font-bold py-2 px-4 rounded"
            >
              Stand
            </button>

            <button 
              onClick={() => setStoneMode(false)} 
              className="w-full bg-green-500 hover:bg-green-700 focus:outline-none focus:ring focus:border-green-300 text-white font-bold py-2 px-4 rounded"
            >
              Flat
            </button>
            <div className="text-lg">
              {!stoneMode? "Flat" : "Stand"}
            </div>
          </div>
        )
      }
      </div>
    )
  }

  const PlayerTwoDeck = ()=> {
    return (
      <div className="flex flex-col border basis-1/3 rounded-lg bg-gradient-to-r from-zinc-400 via-neutral-500 to-stone-600 text-black px-4">
        <div className="text-lg mb-4">Player 2</div>
        <div className="text-lg mb-4">Score</div>
        <div className="flex items-center gap-4 mb-4">
          <div className={`w-24 h-24 ${players[2].stonesClicked? "bg-slate-400" : "bg-black"} hover:bg-slate-400`}
            onClick={()=>{PlayerClickStonesDeck(2, "stone")}}
          >

          </div>
          <div className="text-md">Stone : {players[2].stones}</div>
        </div>
        <div className="flex items-center gap-4 mb-4">
          <div className="w-24 h-24 bg-black rounded-full"
            onClick={()=>{PlayerClickStonesDeck(2, "cap")}}
          >

          </div>
          <div className="text-md">Stone : {players[2].capstones}</div>
        </div>
        {
          players[2].stonesClicked && (
          <div className="flex flex-col gap-3 items-center">
            <button 
              onClick={() => setStoneMode(true)} 
              className="w-full bg-blue-500 hover:bg-blue-700 focus:outline-none focus:ring focus:border-blue-300 text-white font-bold py-2 px-4 rounded"
            >
              Stand
            </button>

            <button 
              onClick={() => setStoneMode(false)} 
              className="w-full bg-green-500 hover:bg-green-700 focus:outline-none focus:ring focus:border-green-300 text-white font-bold py-2 px-4 rounded"
            >
              Flat
            </button>
            <div className="text-lg">
              {!stoneMode? "Flat" : "Stand"}
            </div>
          </div>
        )
      }
      </div>
    )
  }

  const Table = () => {
    return (
      <div className="board flex border justify-between w-full p-4 bg-gradient-to-r from-gray-600 via-zinc-500 to-neutral-400">
        <PlayerOneDeck/>
        <div className="flex flex-row basis-1/3">
          <LeftsideNumber/>
          <div className="flex flex-col">
            <div className="flex">
              {alphabet.map((item, index) => (
                  <div key={index} className="flex text-white bg-yellow-600">
                    <div className='grid place-content-center border h-10 w-24'>{item}</div>
                  </div>
              ))}
            </div>
            <div className="flex flex-col">
              <PrintBoard/>
            </div>
            <div className="flex">
              {alphabet.map((item, index) => (
                  <div key={index} className="flex text-white bg-yellow-600">
                    <div className='grid place-content-center border h-10 w-24'>{item}</div>
                  </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col items-start text-white ">
            <div className="grid place-content-center h-10 w-24 ">&nbsp;</div>
            {
              numberic.map((item, index) => {
                return <div key={index} className="grid place-content-center h-24 w-10 border bg-yellow-600">{item}</div>
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
  const Capstone = ({playerTurn})=> {
    return <div className={`${playerTurn == 1? "bg-white" : "bg-black"} h-8 w-8 rounded-full`}></div>
  }

  const FlatstonePreview = ({playerTurn}) => {
    return (
      <div className={`${playerTurn == 1? "bg-white" : "bg-black border"} h-4 w-16`}></div>
    )
  }

  const StandstonePreview = ({playerTurn})=> {
    return (
      <div className={`${playerTurn == 1? "bg-white" : "bg-black border"} h-8 w-4`}></div>
    )
  }
  const CapstonePreview = ({playerTurn})=> {
    return <div className={`${playerTurn == 1? "bg-white" : "bg-black border"} h-8 w-8 rounded-full`}></div>
  }

  return (
    <div className='w-full h-full bg-black flex flex-col justify-center'>
      <div className="text-lg text-white self-center">
        <div className="flex flex-col-reverse items-center">
          {
            previewMode &&
            previewBoard.map((item, index)=> {
              return (
                <div key={index} className="flex">
                  {
                    item.type == "flatstone" &&
                    <FlatstonePreview playerTurn={item.player}/>
                  }
                  {
                    item.type == "standing" &&
                    <StandstonePreview playerTurn={item.player}/>
                  }
                  {
                    item.type == "capstone" &&
                    <CapstonePreview playerTurn={item.player}/>
                  }
                </div>
              )
            })
          }
        </div>
        <button onClick={reset}>reset</button>
        <button onClick={()=>{setPreviewMode(!previewMode)}}>Preview</button>
      </div>
      <div className="text-lg text-white">Player Turn : {playerTurn}</div>
      <Table/>  
    </div>
  );
};

export default TaktakWithPlayer;
