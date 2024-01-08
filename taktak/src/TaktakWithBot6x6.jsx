/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import TakAI from "./TakAI";
import Board from "./Board";
import Stone from "./Stone";

const TaktakWithPlayer = () => {
    const [board, setBoard] = useState(() => Array.from({ length: 6 }, () => Array(6).fill(null)));
    const [alphabet, setAlphabet] = useState(["A", "B", "C", "D", "E", "F"]);
    const [numberic, setNumeric] = useState([1, 2, 3, 4, 5, 6]);
    const ai = new TakAI(2);

    const [playerTurn, setPlayerTurn] = useState(1); // 1 playerOne , 2 Player Two
    const [players, setPlayers] = useState({
        1: { stones: 30, capstones: 1, stonesClicked: false, capstoneClicked: false },
        2: { stones: 30, capstones: 1, stonesClicked: false, capstoneClicked: false },
    });

    const [previewMode, setPreviewMode] = useState(false);
    const [previewBoard, setPreviewBoard] = useState([]);
    const [actionMode, setActionMode] = useState(false);
    const [hand, setHand] = useState([]);
    const [pickUpMode, setPickUpMode] = useState(false);
    const [lastPickUpPosition, setLastPickUpPosition] = useState(null);
    const [pickUpDirection, setPickUpDirection] = useState(null);

    const [stoneMode, setStoneMode] = useState(false); // false = flat, true = standing

    const reset = () => {
        setBoard(() => Array.from({ length: 6 }, () => Array(6).fill(null)));
        setPlayerTurn(1);
        setPlayers({
            1: { stones: 30, capstones: 1, stonesClicked: false, capstoneClicked: false },
            2: { stones: 30, capstones: 1, stonesClicked: false, capstoneClicked: false },
        });
        setActionMode(false);
        setHand([]);
        setPickUpMode(false);
        setLastPickUpPosition(null);
        setPickUpDirection(null);
        setPreviewMode([]);
    };

    const handleClick = (rowIndex, colIndex) => {
        const currentPlayer = players[playerTurn];
        const columnBoard = board[rowIndex][colIndex];

        if (playerTurn === 1) {
            // Player 1's turn (Human)
            if (previewMode) {
                setPreviewBoard(columnBoard ? columnBoard : []);
            } else if (pickUpMode) {
                placeFromHand(rowIndex, colIndex);
            } else if (currentPlayer.capstoneClicked || currentPlayer.stonesClicked) {
                const stoneType = currentPlayer.capstoneClicked ? "capstone" : stoneMode ? "standing" : "flatstone";
                placeStone(rowIndex, colIndex, stoneType);
                nextTurn();
            } else {
                if (!columnBoard) return;
                if (columnBoard[columnBoard.length - 1]) {
                    pickUpColumn(rowIndex, colIndex);
                }
            }
        }
    };
    const performAIMove = () => {
        console.log("start think");
        // Create a new Board instance with the same size as the current game board
        const aiBoard = new Board(board.length);

        // Update the new Board instance to reflect the current game state
        aiBoard.grid = board.map((row) =>
            row.map((cell) => {
                if (cell) {
                    return cell.map((stone) => {
                        // Convert stone.type back to single-character values
                        let type;
                        if (stone.type === "flatstone") {
                            type = "f";
                        } else if (stone.type === "standing") {
                            type = "s";
                        } else if (stone.type === "capstone") {
                            type = "c";
                        }

                        // Create a new Stone object with the converted type
                        return new Stone(stone.player, type);
                    });
                } else {
                    return null;
                }
            })
        );
        aiBoard.currentPlayer = playerTurn;
        aiBoard.players = JSON.parse(JSON.stringify(players)); // Deep copy the players object
        aiBoard.actionMode = actionMode;
        aiBoard.hand = [...hand]; // Clone the hand array
        aiBoard.pickUpMode = pickUpMode;
        aiBoard.lastPickUpPosition = lastPickUpPosition ? { ...lastPickUpPosition } : null; // Clone or set to null
        aiBoard.pickUpDirection = pickUpDirection ? { ...pickUpDirection } : null; // Clone or set to null
        console.log(aiBoard.grid);

        // Let AI determine the best move based on the updated board state
        const move = ai.determineMove(aiBoard);
        if (move.type === "f") {
            move.type = "flatstone";
        } else if (move.type === "s") {
            move.type = "standing";
        } else if (move.type === "c") {
            move.type = "capstone";
        }

        // Swap 'x' and 'y' properties
        if (move.x !== undefined && move.y !== undefined) {
            const tempX = move.x;
            move.x = move.y;
            move.y = tempX;
        }

        if (move.fromX !== undefined && move.fromY !== undefined) {
            const tempfromX = move.fromX;
            move.fromX = move.fromY;
            move.fromY = tempfromX;
        }
        if (move.toX !== undefined && move.toY !== undefined) {
            const temptoX = move.toX;
            move.toX = move.toY;
            move.toY = temptoX;
        }

        console.log(move);
        if (move) {
            // Perform the AI's move
            if (move.type === "stack") {
                // Handle AI stacking move
                let returnValue = pickUpColumn(move.fromX, move.fromY);
                let currentHand = returnValue.newHand;
                let currentLastPickUpPosition = returnValue.newLastPickUpPosition;
                while (returnValue.newHand.length > 0) {
                    console.log("place");
                    let currentValue = placeFromHandAlways(move.toX, move.toY, currentHand, returnValue.newBoard, currentLastPickUpPosition);
                    currentHand = currentValue.currentHand;
                    currentLastPickUpPosition = currentValue.currentLastPickUpPosition;
                }
                setHand(currentHand);
            } else {
                placeStone(move.x, move.y, move.type); // Handle AI placing stone
            }
        } else {
            console.log("AI has no valid moves.");
        }
        console.log("stop think");
        nextTurn(); // End AI's turn
    };

    const placeStone = (row, col, stone) => {
        let temp = board;
        if (temp[row][col] == null) {
            temp[row][col] = [{ player: playerTurn, type: stone }];
        } else {
            temp[row][col].push({ player: playerTurn, type: stone });
        }
        console.log(temp[row][col]);
        if (playerTurn == 2) {
            if (stone == "flatstone" || stone == "standing") {
                const updatedPlayers = { ...players }; // Create a copy of the 'players' object

                // Check if player 2 exists in the 'updatedPlayers' object
                // Reduce the 'stones' count by 1 for player 2
                updatedPlayers[2].stones -= 1;

                // Update the state with the modified 'updatedPlayers' object
                setPlayers(updatedPlayers);
            } else if (stone == "capstone") {
                const updatedPlayers = { ...players }; // Create a copy of the 'players' object

                // Check if player 2 exists in the 'updatedPlayers' object
                // Reduce the 'stones' count by 1 for player 2
                updatedPlayers[2].capstone -= 1;

                // Update the state with the modified 'updatedPlayers' object
                setPlayers(updatedPlayers);
            }
        }
        setBoard(temp);
    };

    const pickUpColumn = (row, col) => {
        let stones = board[row][col];
        let topStone = stones[stones.length - 1];

        if (topStone.player !== playerTurn) return;

        const newHand = stones.slice(-Math.min(5, stones.length));
        const remainingStones = stones.slice(0, -Math.min(5, stones.length));

        setHand(newHand);
        setPickUpMode(true);
        setLastPickUpPosition({ row, col });
        setPickUpDirection(null);

        // Update the board with the remaining stones or set it to null if empty
        const newBoard = [...board];
        newBoard[row][col] = remainingStones.length > 0 ? remainingStones : null;
        setBoard(newBoard);
        return {
            newHand: newHand,
            newLastPickUpPosition: { row, col },
            newBoard: newBoard,
        };
    };

    const placeFromHand = (row, col) => {
        // console.log(pickUpMode);
        // console.log(hand);
        if (pickUpMode && hand.length > 0) {
            let isValidMove;
            if (pickUpDirection === null) {
                // First move: can place in the same position or any adjacent space
                let dx = col - lastPickUpPosition.col;
                let dy = row - lastPickUpPosition.row;
                isValidMove = (dx === 0 && dy === 0) || (Math.abs(dx) === 1 && dy === 0) || (dx === 0 && Math.abs(dy) === 1);

                if (isValidMove && (dx !== 0 || dy !== 0)) {
                    setPickUpDirection({ dy, dx });
                }
            } else {
                isValidMove =
                    (col === lastPickUpPosition.col && row === lastPickUpPosition.row) || // Same position as the last
                    (col === lastPickUpPosition.col + pickUpDirection.dx && row === lastPickUpPosition.row + pickUpDirection.dy); // One space in the chosen direction
            }

            if (isValidMove) {
                let topStone = board[row][col] ? board[row][col][board[row][col].length - 1] : null;
                if (topStone && (topStone.type === "standing" || topStone.type === "capstone")) {
                    console.log("Cannot place on top of a standing stone or capstone.");
                    return;
                }
                console.log("hand before shift : ");
                console.log(hand);
                let stone = hand.shift(); // Remove the first stone from the hand
                console.log(stone);
                if (!board[row][col]) {
                    const newBoard = [...board];
                    newBoard[row][col] = [stone];
                    setBoard(newBoard);
                } else {
                    const newBoard = [...board];
                    newBoard[row][col].push(stone);
                    setBoard(newBoard);
                }

                setLastPickUpPosition({ row, col }); // Update the last position
                if (hand.length === 0) {
                    setPickUpMode(false);
                    nextTurn();
                }
            } else {
                console.log("Invalid move. You must place in the same position or one space in the chosen direction.");
            }
        } else {
            console.log("Not in pick up mode or no stones in hand.");
        }
    };
    const placeFromHandAlways = (row, col, newHand, nBoard, newLastPickUpPosition) => {
        // console.log(pickUpMode);
        // console.log(hand);
        let isValidMove;
        if (pickUpDirection === null) {
            // First move: can place in the same position or any adjacent space
            let dx = col - newLastPickUpPosition.col;
            let dy = row - newLastPickUpPosition.row;
            isValidMove = (dx === 0 && dy === 0) || (Math.abs(dx) === 1 && dy === 0) || (dx === 0 && Math.abs(dy) === 1);

            if (isValidMove && (dx !== 0 || dy !== 0)) {
                setPickUpDirection({ dy, dx });
            }
        } else {
            isValidMove =
                (col === newLastPickUpPosition.col && row === newLastPickUpPosition.row) || // Same position as the last
                (col === newLastPickUpPosition.col + pickUpDirection.dx && row === newLastPickUpPosition.row + pickUpDirection.dy); // One space in the chosen direction
        }

        if (isValidMove) {
            let topStone = board[row][col] ? board[row][col][board[row][col].length - 1] : null;
            if (topStone && (topStone.type === "standing" || topStone.type === "capstone")) {
                console.log("Cannot place on top of a standing stone or capstone.");
                return;
            }

            let stone = newHand.shift(); // Remove the first stone from the hand
            console.log(stone);
            if (!board[row][col]) {
                const newBoard = [...nBoard];
                newBoard[row][col] = [stone];
                setBoard(newBoard);
            } else {
                const newBoard = [...nBoard];
                newBoard[row][col].push(stone);
                setBoard(newBoard);
            }

            setLastPickUpPosition({ row, col }); // Update the last position
            if (newHand.length === 0) {
                setPickUpMode(false);
                nextTurn();
            }
            return {
                currentHand: stone,
                currentLastPickUpPosition: { row, col },
            };
        } else {
            console.log("Invalid move. You must place in the same position or one space in the chosen direction.");
        }
    };

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

        setActionMode(false);
        setHand([]);
        setPickUpMode(false);
        setLastPickUpPosition(null);
        setPickUpDirection(null);
        setPreviewMode(false);
        setStoneMode(false);
        if (playerTurn === 1) {
            // Switch to AI's turn
            setPlayerTurn(2);
        } else {
            // Switch back to human player's turn
            setPlayerTurn(1);
        }
    };
    useEffect(() => {
        if (playerTurn === 2) {
            performAIMove();
        }
        const result = checkWin(board);
        console.log(result);
        if (result !== "No winner yet.") {
            alert(result);
        }
    }, [playerTurn, board]);
    useEffect(() => {}, [board]);
    const checkWin = (newBoard) => {
        // Check for both players
        for (let player = 1; player <= 2; player++) {
            // Check for a connecting path from the top to bottom and from left to right
            console.log("Checking Win Player " + player);
            if (hasConnectingPath(player, "vertical", newBoard) || hasConnectingPath(player, "horizontal", newBoard)) {
                return `Player ${player} wins!`;
            }
        }
        return "No winner yet.";
    };

    const hasConnectingPath = (player, direction, newBoard) => {
        let visited = new Set(); // Keep track of visited cells
        let queue = []; // Queue for BFS

        // Initialize the queue based on the direction of the search
        if (direction === "vertical") {
            for (let x = 0; x < newBoard.length; x++) {
                if (isPlayerStone(x, 0, player, newBoard)) {
                    queue.push({ row: x, col: 0 });
                    visited.add(`${x},0`);
                }
            }
        } else {
            // 'horizontal'
            for (let y = 0; y < newBoard.length; y++) {
                if (isPlayerStone(0, y, player, newBoard)) {
                    queue.push({ row: 0, col: y });
                    visited.add(`0,${y}`);
                }
            }
        }

        // BFS to find a path
        while (queue.length > 0) {
            let { row, col } = queue.shift();

            // Check if we've reached the opposite side
            if ((direction === "vertical" && col === newBoard.length - 1) || (direction === "horizontal" && row === newBoard.length - 1)) {
                return true;
            }

            // Check all four adjacent cells
            [
                { row, col: col - 1 },
                { row, col: col + 1 },
                { row: row - 1, col },
                { row: row + 1, col },
            ].forEach(({ row: nx, col: ny }) => {
                if (isPlayerStone(nx, ny, player, newBoard) && !visited.has(`${nx},${ny}`)) {
                    queue.push({ row: nx, col: ny });
                    visited.add(`${nx},${ny}`);
                }
            });
        }

        return false; // No connecting path found
    };

    const isPlayerStone = (row, col, player, newBoard) => {
        if (row < 0 || row >= board.length || col < 0 || col >= board[row].length) {
            // Out of bounds, safely return false or handle as needed
            return false;
        }
        // Check if the specified cell contains a stone (flat or capstone) of the given player
        return newBoard[row][col] && newBoard[row][col].length > 0 && newBoard[row][col][newBoard[row][col].length - 1].player === player && newBoard[row][col][newBoard[row][col].length - 1].type !== "standing";
    };

    const PlayerClickStonesDeck = (turn, type) => {
        if (playerTurn !== turn || previewMode) {
            return;
        }

        if ((type == "stone" && players[turn].stones == 0 && !players[turn].stonesClicked) || (type == "cap" && players[turn].capstones == 0 && !players[turn].capstoneClicked)) return;

        setPlayers((prevPlayers) => {
            if (type === "stone") {
                const updatedPlayers = {
                    ...prevPlayers,
                    [turn]: {
                        ...prevPlayers[turn],
                        stones: prevPlayers[turn].stonesClicked ? prevPlayers[turn].stones + 1 : prevPlayers[turn].stones - 1,
                        stonesClicked: !prevPlayers[turn].stonesClicked,
                        capstones: prevPlayers[turn].capstoneClicked ? prevPlayers[turn].capstones + 1 : prevPlayers[turn].capstones,
                        capstoneClicked: prevPlayers[turn].capstoneClicked ? !prevPlayers[turn].capstoneClicked : prevPlayers[turn].capstoneClicked,
                    },
                };
                return updatedPlayers;
            } else {
                const updatedPlayers = {
                    ...prevPlayers,
                    [turn]: {
                        ...prevPlayers[turn],
                        capstones: prevPlayers[turn].capstoneClicked ? prevPlayers[turn].capstones + 1 : prevPlayers[turn].capstones - 1,
                        capstoneClicked: !prevPlayers[turn].capstoneClicked,
                        stones: prevPlayers[turn].stonesClicked ? prevPlayers[turn].stones + 1 : prevPlayers[turn].stones,
                        stonesClicked: prevPlayers[turn].stonesClicked ? !prevPlayers[turn].stonesClicked : prevPlayers[turn].stonesClicked,
                    },
                };
                return updatedPlayers;
            }
        });
    };

    const renderStoneRecursive = (stone) => {
        return stone.map((stone, index) => {
            <Stone key={index} player={stone.player} type={stone.type}>
                {stone.children && this.renderStoneRecursive(stone.children)}
            </Stone>
        })
    }

    const PrintBoard = () => {
        const renderStones = (stones, playerTurn) => {
          if (!stones.length) return null; // Base case: no more stones
      
          const item = stones[0]; // Take the first stone
          const type = item.type;
          console.log(stones.length);
          const width = `h-${16 - (stones.length - 1) * 2}`; // Adjust width based on depth
      
          // Choose the component based on the type
          const StoneComponent =
            type === "flatstone" ? Flatstone : type === "standing" ? Standstone : Capstone;
      
          // Recursively nest stones
        //   alert()
          return (
            <StoneComponent width={width} playerTurn={stones[0].player}>
              {renderStones(stones.slice(1), stones[0].player)}
            </StoneComponent>
          );
        };
      
        return board.map((row, rowIndex) => (
          <div key={rowIndex} className="flex text-white">
            {row.map((square, colIndex) => {
                console.log(square);
                console.log(square? square.reverse(): "null");
                return (
                    <div
                      key={colIndex}
                      className="grid place-content-center bg-yellow-700 hover:bg-yellow-200 border h-24 w-24"
                      onClick={() => handleClick(rowIndex, colIndex)}
                    >
                      {square && renderStones(square.slice().reverse(), square?.slice().reverse()[0].player)}
                    </div>
                  )
            })}
          </div>
        ));
      };      

    const LeftsideNumber = () => {
        return (
            <div className="flex flex-col items-end text-white ">
                <div className="grid place-content-center h-10 w-24 ">&nbsp;</div>
                {numberic.map((item, index) => {
                    return (
                        <div key={index} className="grid place-content-center h-24 w-10 border bg-yellow-600">
                            {item}
                        </div>
                    );
                })}
            </div>
        );
    };

    const PlayerOneDeck = () => {
        return (
            <div className="flex flex-col border basis-1/3 rounded-lg bg-gradient-to-r from-zinc-900 via-neutral-800 to-stone-700  text-white px-4">
                <div className="text-lg mb-4">Player 1</div>
                <div className="text-lg mb-4">Score</div>
                <div className="flex items-center gap-4 mb-4">
                    <div
                        className={`w-24 h-24 ${players[1].stonesClicked ? "bg-slate-400" : "bg-white"} hover:bg-slate-400`}
                        onClick={() => {
                            PlayerClickStonesDeck(1, "stone");
                        }}
                    ></div>
                    <div className="text-md">Stone : {players[1].stones}</div>
                </div>
                <div className="flex items-center gap-4 mb-4">
                    <div
                        className={`w-24 h-24 ${players[1].capstoneClicked ? "bg-slate-400" : "bg-white"} hover:bg-slate-400 rounded-full`}
                        onClick={() => {
                            PlayerClickStonesDeck(1, "cap");
                        }}
                    ></div>
                    <div className="text-md">Stone : {players[1].capstones}</div>
                </div>
                {players[1].stonesClicked && (
                    <div className="flex flex-col gap-3 items-center">
                        <button onClick={() => setStoneMode(true)} className="w-full bg-blue-500 hover:bg-blue-700 focus:outline-none focus:ring focus:border-blue-300 text-white font-bold py-2 px-4 rounded">
                            Stand
                        </button>

                        <button onClick={() => setStoneMode(false)} className="w-full bg-green-500 hover:bg-green-700 focus:outline-none focus:ring focus:border-green-300 text-white font-bold py-2 px-4 rounded">
                            Flat
                        </button>
                        <div className="text-lg">{!stoneMode ? "Flat" : "Stand"}</div>
                    </div>
                )}
            </div>
        );
    };

    const PlayerTwoDeck = () => {
        return (
            <div className="flex flex-col border basis-1/3 rounded-lg bg-gradient-to-r from-zinc-400 via-neutral-500 to-stone-600 text-black px-4">
                <div className="text-lg mb-4">Player 2</div>
                <div className="text-lg mb-4">Score</div>
                <div className="flex items-center gap-4 mb-4">
                    <div
                        className={`w-24 h-24 ${players[2].stonesClicked ? "bg-slate-200" : "bg-black"} hover:bg-stone-200`}
                        onClick={() => {
                            PlayerClickStonesDeck(2, "stone");
                        }}
                    ></div>
                    <div className="text-md">Stone : {players[2].stones}</div>
                </div>
                <div className="flex items-center gap-4 mb-4">
                    <div
                        className={`w-24 h-24 ${players[1].capstoneClicked ? "bg-slate-200" : "bg-black"} hover:bg-stone-200 rounded-full`}
                        onClick={() => {
                            PlayerClickStonesDeck(2, "cap");
                        }}
                    ></div>
                    <div className="text-md">Stone : {players[2].capstones}</div>
                </div>
                {players[2].stonesClicked && (
                    <div className="flex flex-col gap-3 items-center">
                        <button onClick={() => setStoneMode(true)} className="w-full bg-blue-500 hover:bg-blue-700 focus:outline-none focus:ring focus:border-blue-300 text-white font-bold py-2 px-4 rounded">
                            Stand
                        </button>

                        <button onClick={() => setStoneMode(false)} className="w-full bg-green-500 hover:bg-green-700 focus:outline-none focus:ring focus:border-green-300 text-white font-bold py-2 px-4 rounded">
                            Flat
                        </button>
                        <div className="text-lg">{!stoneMode ? "Flat" : "Stand"}</div>
                    </div>
                )}
            </div>
        );
    };

    const Table = () => {
        return (
            <div className="board flex border justify-between w-full p-4 bg-gradient-to-r from-gray-600 via-zinc-500 to-neutral-400">
                <PlayerOneDeck />
                <div className="flex flex-row basis-1/3">
                    <LeftsideNumber />
                    <div className="flex flex-col">
                        <div className="flex">
                            {alphabet.map((item, index) => (
                                <div key={index} className="flex text-white bg-yellow-600">
                                    <div className="grid place-content-center border h-10 w-24">{item}</div>
                                </div>
                            ))}
                        </div>
                        <div className="flex flex-col">
                            <PrintBoard />
                        </div>
                        <div className="flex">
                            {alphabet.map((item, index) => (
                                <div key={index} className="flex text-white bg-yellow-600">
                                    <div className="grid place-content-center border h-10 w-24">{item}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="flex flex-col items-start text-white ">
                        <div className="grid place-content-center h-10 w-24 ">&nbsp;</div>
                        {numberic.map((item, index) => {
                            return (
                                <div key={index} className="grid place-content-center h-24 w-10 border bg-yellow-600">
                                    {item}
                                </div>
                            );
                        })}
                    </div>
                </div>
                <PlayerTwoDeck></PlayerTwoDeck>
            </div>
        );
    };

    const Flatstone = ({ playerTurn, width }) => {
        return <div className={`${playerTurn == 1 ? "bg-white" : "bg-black"} w-16 ${width}`}></div>;
    };

    const Standstone = ({ playerTurn }) => {
        return <div className={`${playerTurn == 1 ? "bg-white" : "bg-black"} h-16 w-8`}></div>;
    };

    const Capstone = ({ playerTurn }) => {
        return <div className={`${playerTurn == 1 ? "bg-white" : "bg-black"} h-8 w-8 rounded-full`}></div>;
    };

    const FlatstonePreview = ({ playerTurn }) => {
        return <div className={`${playerTurn == 1 ? "bg-white" : "bg-black border"} h-4 w-16`}></div>;
    };

    const StandstonePreview = ({ playerTurn }) => {
        return <div className={`${playerTurn == 1 ? "bg-white" : "bg-black border"} h-8 w-4`}></div>;
    };

    const CapstonePreview = ({ playerTurn }) => {
        return <div className={`${playerTurn == 1 ? "bg-white" : "bg-black border"} h-8 w-8 rounded-full`}></div>;
    };

    return (
        <div className="w-full h-full bg-black flex flex-col justify-center">
            <div className="text-lg text-white self-center">
                <div className="flex flex-col-reverse items-center">
                    {previewMode &&
                        previewBoard.map((item, index) => {
                            return (
                                <div key={index} className="flex">
                                    {item.type == "flatstone" && <FlatstonePreview playerTurn={item.player} />}
                                    {item.type == "standing" && <StandstonePreview playerTurn={item.player} />}
                                    {item.type == "capstone" && <CapstonePreview playerTurn={item.player} />}
                                </div>
                            );
                        })}
                </div>
                <button onClick={reset}>reset</button>
                <button
                    className={`rounded-lg ms-5 p-1 ${previewMode ? "bg-orange-600" : "bg-indigo-500"} hover:bg-slate-400 rounded-full`}
                    onClick={() => {
                        setPreviewMode(!previewMode);
                    }}
                >
                    Preview
                </button>
            </div>
            <div className="text-lg text-white">Player Turn : {playerTurn}</div>
            <Table />
        </div>
    );
};

export default TaktakWithPlayer;
