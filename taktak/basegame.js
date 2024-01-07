class Stone {
    constructor(player, type) {
        this.player = player; // Either 1 or 2 indicating the player
        this.type = type; // 'flat', 'standing', or 'capstone'
    }

    isCapstone() {
        return this.type === "capstone";
    }

    isStanding() {
        return this.type === "standing";
    }
}

class Board {
    constructor(size) {
        this.size = size;
        this.grid = Array.from({ length: size }, () => Array(size).fill(null));
        this.currentPlayer = 1; // Player 1 starts
        this.players = {
            1: { stones: 21, capstones: 1 },
            2: { stones: 21, capstones: 1 },
        };
        this.actionMode = false;
        this.hand = [];
        this.pickUpMode = false;
        this.lastPickUpPosition = null;
        this.pickUpDirection = null;
    }

    executeCommand(input) {
        if (input === "-1") {
            this.toggleActionMode();
            console.log(`Toggled action mode to: ${this.actionMode}`);
        } else {
            const [x, y] = input.split(",").map(Number);
            if (!isNaN(x) && !isNaN(y)) {
                this.click(x, y);
            } else {
                console.log("Invalid input. Please enter coordinates as x,y or -1 to toggle action mode.");
            }
        }
        this.printBoard(); // Print the board after each action
    }

    toggleActionMode() {
        this.actionMode = !this.actionMode;
    }

    nextTurn() {
        this.currentPlayer = this.currentPlayer === 1 ? 2 : 1;
        this.actionMode = false; // Reset action mode at the end of the turn
        this.pickUpMode = false; // Reset pick up mode at the end of the turn
        this.pickUpDirection = null; // Reset pick up direction
    }
    checkWin() {
        // Check for both players
        for (let player = 1; player <= 2; player++) {
            // Check for a connecting path from the top to bottom and from left to right
            if (this.hasConnectingPath(player, "vertical") || this.hasConnectingPath(player, "horizontal")) {
                return `Player ${player} wins!`;
            }
        }
        return "No winner yet.";
    }

    hasConnectingPath(player, direction) {
        let visited = new Set(); // Keep track of visited cells
        let queue = []; // Queue for BFS

        // Initialize the queue based on the direction of the search
        if (direction === "vertical") {
            for (let x = 0; x < this.size; x++) {
                if (this.isPlayerStone(x, 0, player)) {
                    queue.push({ x, y: 0 });
                    visited.add(`${x},0`);
                }
            }
        } else {
            // 'horizontal'
            for (let y = 0; y < this.size; y++) {
                if (this.isPlayerStone(0, y, player)) {
                    queue.push({ x: 0, y });
                    visited.add(`0,${y}`);
                }
            }
        }

        // BFS to find a path
        while (queue.length > 0) {
            let { x, y } = queue.shift();

            // Check if we've reached the opposite side
            if ((direction === "vertical" && y === this.size - 1) || (direction === "horizontal" && x === this.size - 1)) {
                return true;
            }

            // Check all four adjacent cells
            [
                [x, y - 1],
                [x, y + 1],
                [x - 1, y],
                [x + 1, y],
            ].forEach(([nx, ny]) => {
                if (this.isPlayerStone(nx, ny, player) && !visited.has(`${nx},${ny}`)) {
                    queue.push({ x: nx, y: ny });
                    visited.add(`${nx},${ny}`);
                }
            });
        }

        return false; // No connecting path found
    }

    isPlayerStone(x, y, player) {
        // Check if the specified cell contains a stone (flat or capstone) of the given player
        return x >= 0 && x < this.size && y >= 0 && y < this.size && this.grid[y][x] && this.grid[y][x].length > 0 && this.grid[y][x][this.grid[y][x].length - 1].player === player && !this.grid[y][x][this.grid[y][x].length - 1].isStanding();
    }

    placeStone(x, y, stone) {
        if (!this.pickUpMode && x >= 0 && x < this.size && y >= 0 && y < this.size) {
            if (this.grid[y][x] === null) {
                this.grid[y][x] = [stone];
            } else {
                this.grid[y][x].push(stone);
            }
        } else {
            console.log("Cannot place stones while in pick up mode or out of bounds.");
        }
    }
    pickUpColumn(x, y) {
        if (x >= 0 && x < this.size && y >= 0 && y < this.size && this.grid[y][x] && this.grid[y][x].length > 0) {
            let stones = this.grid[y][x];
            let topStone = stones[stones.length - 1];
            if (topStone.player === this.currentPlayer) {
                // Check if the top stone belongs to the current player
                this.hand = stones.splice(-Math.min(5, stones.length)); // Pick up to 5 stones from the top
                this.pickUpMode = true; // Turn pick up mode on if stones were successfully picked up
                this.lastPickUpPosition = { x, y };
                this.pickUpDirection = null;
            } else {
                console.log("Top stone does not belong to the current player.");
            }
        } else {
            console.log("Coordinates are out of bounds or no stones to pick up.");
        }
    }

    placeFromHand(x, y) {
        if (this.pickUpMode && this.hand.length > 0) {
            let isValidMove;
            if (this.pickUpDirection === null) {
                // First move: can place in the same position or any adjacent space
                let dx = x - this.lastPickUpPosition.x;
                let dy = y - this.lastPickUpPosition.y;
                isValidMove =
                    (dx === 0 && dy === 0) || // Same position
                    (Math.abs(dx) === 1 && dy === 0) || // Adjacent horizontally
                    (dx === 0 && Math.abs(dy) === 1); // Adjacent vertically

                // Set the direction if the stone is placed in a new position
                if (isValidMove && (dx !== 0 || dy !== 0)) {
                    this.pickUpDirection = { dx, dy };
                }
            } else {
                // Subsequent moves: must follow the previously set direction
                isValidMove = x === this.lastPickUpPosition.x + this.pickUpDirection.dx && y === this.lastPickUpPosition.y + this.pickUpDirection.dy;
            }
            if (isValidMove) {
                let topStone = this.grid[y][x] ? this.grid[y][x][this.grid[y][x].length - 1] : null;
                if (topStone && (topStone.isStanding() || topStone.isCapstone())) {
                    console.log("Cannot place on top of a standing stone or capstone.");
                    return;
                }

                let stone = this.hand.shift(); // Remove the first stone from the hand
                if (this.grid[y][x] === null) {
                    this.grid[y][x] = [stone];
                } else {
                    this.grid[y][x].push(stone);
                }
                this.lastPickUpPosition = { x, y }; // Update the last position
                if (this.hand.length === 0) {
                    this.pickUpMode = false; // Turn pick up mode off if the hand is empty
                    this.nextTurn(); // End the current player's turn
                }
            } else {
                console.log("Invalid move. You must place in the same position or one space in the chosen direction.");
            }
        } else {
            console.log("Not in pick up mode or no stones in hand.");
        }
    }

    click(x, y, type) {
        if (!this.actionMode) {
            // Action mode is off, simply show the column contents
            console.log(this.seeColumn(x, y));
        } else if (this.pickUpMode) {
            // If in pick up mode, try to place a stone from the hand
            this.placeFromHand(x, y);
        } else {
            // Action mode is on, perform actions based on the column state and type
            let column = this.grid[y][x];
            if (column && column.length > 0 && column[column.length - 1].player === this.currentPlayer) {
                // The top stone belongs to the current player, pick up the column
                this.pickUpColumn(x, y);
            } else if (!column || column.length === 0) {
                // The column is empty, place a stone of the specified type
                if (type === "f" && this.players[this.currentPlayer].stones > 0) {
                    this.placeStone(x, y, new Stone(this.currentPlayer, "flat"));
                    this.players[this.currentPlayer].stones -= 1;
                } else if (type === "s" && this.players[this.currentPlayer].stones > 0) {
                    this.placeStone(x, y, new Stone(this.currentPlayer, "standing"));
                    this.players[this.currentPlayer].stones -= 1;
                } else if (type === "c" && this.players[this.currentPlayer].capstones > 0) {
                    this.placeStone(x, y, new Stone(this.currentPlayer, "capstone"));
                    this.players[this.currentPlayer].capstones -= 1;
                } else {
                    console.log("Invalid type or no stones/capstones left.");
                }
                this.nextTurn();
            } else {
                // The top stone belongs to the other player, invalid move
                console.log("Invalid move. The top stone belongs to the other player.");
            }
        }
    }

    seeColumn(x, y) {
        if (x >= 0 && x < this.size && y >= 0 && y < this.size) {
            return this.grid[y][x] || [];
        } else {
            console.log("Coordinates are out of bounds.");
            return [];
        }
    }

    printBoard() {
        this.grid.forEach((row) => {
            let rowString = row
                .map((cell) => {
                    if (cell === null || cell.length === 0) {
                        return ". ";
                    } else {
                        let topStone = cell[cell.length - 1];
                        let symbol = ". ";
                        if (topStone.isCapstone()) {
                            symbol = "C";
                        } else if (topStone.isStanding()) {
                            symbol = "|";
                        } else {
                            symbol = "o";
                        }
                        return symbol + topStone.player; // Append the player number to the symbol
                    }
                })
                .join(" ");
            console.log(rowString);
        });
    }
}

// Function to start the game and handle user inputs
function startGame(board) {
    function promptNextAction() {
        // Print which player's turn it is and how many stones they have before every prompt
        const playerInfo = board.players[board.currentPlayer];
        console.log(`Player ${board.currentPlayer}'s move. Stones: ${playerInfo.stones}, Capstones: ${playerInfo.capstones}`);

        let input = prompt("Enter your move (x,y,type) or -1 to toggle action mode:");
        if (input === "-1") {
            board.toggleActionMode();
        } else {
            const parts = input.split(",");
            const x = parseInt(parts[0], 10);
            const y = parseInt(parts[1], 10);
            const type = parts[2]; // 'f' for flat, 's' for standing, 'c' for capstone

            if (!isNaN(x) && !isNaN(y) && ["f", "s", "c"].includes(type)) {
                board.click(x, y, type);
            } else {
                console.log("Invalid input. Please enter coordinates as x,y,type where type is 'f', 's', or 'c'.");
            }
        }
        board.printBoard(); // Print the board after each action
        promptNextAction(); // Prompt for the next action after the current one is executed
    }

    promptNextAction(); // Start the first prompt
}

// Initialize the game
let board = new Board(5);
startGame(board); // Start the interactive game loop
