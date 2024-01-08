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
export default class TakAI {
    constructor(playerNumber) {
        this.playerNumber = playerNumber; // The player number this AI controls (1 or 2)
    }

    isWinningMove(board, move) {
        // Simulate the move
        let win = false;
        if (move.type === "stack") {
            let stackedStone = board.grid[move.fromY][move.fromX].pop();
            board.grid[move.toY][move.toX].push(stackedStone);
        } else {
            let tempStone = new Stone(this.playerNumber, move.type === "f" ? "flat" : move.type === "c" ? "capstone" : "standing");
            if (!board.grid[move.y][move.x]) {
                board.grid[move.y][move.x] = [];
            }
            board.grid[move.y][move.x].push(tempStone);
        }

        // Check for a win
        if (board.checkWin().startsWith(`Player ${this.playerNumber} wins`)) {
            win = true;
        }

        // Undo the move
        if (move.type === "stack") {
            board.grid[move.fromY][move.fromX].push(board.grid[move.toY][move.toX].pop());
        } else {
            board.grid[move.y][move.x].pop();
        }

        return win;
    }

    // Evaluate the board to give a score based on proximity to a winning state
    evaluateBoardForWinningPath(board) {
        let score = 0;
        let opponent = this.playerNumber === 1 ? 2 : 1; // Determine the opponent's player number

        // Horizontal and vertical checks
        for (let i = 0; i < board.size; i++) {
            let rowProgress = 0;
            let colProgress = 0;
            let opponentRowThreat = 0;
            let opponentColThreat = 0;

            for (let j = 0; j < board.size; j++) {
                // Check rows for progress and threats
                let rowCell = board.grid[i][j];
                if (rowCell && rowCell.length > 0) {
                    let topStone = rowCell[rowCell.length - 1];
                    if (topStone.player === this.playerNumber) {
                        rowProgress += 1;
                    } else if (topStone.player === opponent) {
                        opponentRowThreat += 1;
                    }
                }

                // Check columns for progress and threats
                let colCell = board.grid[j][i];
                if (colCell && colCell.length > 0) {
                    let topStone = colCell[colCell.length - 1];
                    if (topStone.player === this.playerNumber) {
                        colProgress += 1;
                    } else if (topStone.player === opponent) {
                        opponentColThreat += 1;
                    }
                }
            }

            // Incremental score for progress towards winning
            score += rowProgress * 10 + colProgress * 10;

            // Adjust the score based on urgency to block the opponent
            if (opponentRowThreat === board.size - 1) {
                score -= 100; // Very urgent to block
            } else if (opponentRowThreat === board.size - 2) {
                score -= 50; // Less urgent but still important
            }

            if (opponentColThreat === board.size - 1) {
                score -= 100; // Very urgent to block
            } else if (opponentColThreat === board.size - 2) {
                score -= 50; // Less urgent but still important
            }
        }

        return score;
    }

    // Choose the best move based on the heuristic evaluation
    chooseBestMove(board) {
        let validMoves = this.getValidMoves(board);

        // First, check for any immediate winning moves
        for (let move of validMoves) {
            if (this.isWinningMove(board, move)) {
                return move; // Return immediately if a winning move is found
            }
        }

        // If no immediate win, look one turn ahead
        for (let move of validMoves) {
            // Simulate the move
            if (move.type === "stack") {
                let stackedStone = board.grid[move.fromY][move.fromX].pop();
                board.grid[move.toY][move.toX].push(stackedStone);
            } else {
                let tempStone = new Stone(this.playerNumber, move.type === "f" ? "flat" : move.type === "c" ? "capstone" : "standing");
                if (!board.grid[move.y][move.x]) {
                    board.grid[move.y][move.x] = [];
                }
                board.grid[move.y][move.x].push(tempStone);
            }

            // Check for moves that lead to a win next turn
            let nextMoves = this.getValidMoves(board);
            for (let nextMove of nextMoves) {
                if (this.isWinningMove(board, nextMove)) {
                    // Undo the simulated move
                    if (move.type === "stack") {
                        board.grid[move.fromY][move.fromX].push(board.grid[move.toY][move.toX].pop());
                    } else {
                        board.grid[move.y][move.x].pop();
                    }
                    return move; // Return the move that leads to a winning opportunity
                }
            }

            // Undo the simulated move
            if (move.type === "stack") {
                board.grid[move.fromY][move.fromX].push(board.grid[move.toY][move.toX].pop());
            } else {
                board.grid[move.y][move.x].pop();
            }
        }

        // If no winning move found, fall back to the heuristic-based decision
        let bestMove = null;
        let bestScore = -Infinity;

        for (let move of validMoves) {
            let simulatedScore = 0;

            // Simulate and evaluate the move
            if (move.type === "stack") {
                // Temporarily stack the stone onto the blockage
                let stackedStone = board.grid[move.fromY][move.fromX].pop();
                board.grid[move.toY][move.toX].push(stackedStone);
                simulatedScore = this.evaluateBoardForWinningPath(board);
                // Undo the stacking
                board.grid[move.fromY][move.fromX].push(stackedStone);
                board.grid[move.toY][move.toX].pop();
            } else {
                // Temporarily place a stone
                let tempStone = new Stone(this.playerNumber, move.type === "f" ? "flat" : move.type === "c" ? "capstone" : "standing");
                if (!board.grid[move.y][move.x]) {
                    board.grid[move.y][move.x] = [];
                }
                board.grid[move.y][move.x].push(tempStone);
                simulatedScore = this.evaluateBoardForWinningPath(board);
                // Undo the placement
                board.grid[move.y][move.x].pop();
            }

            // Prefer moves that unblock a path or progress toward winning
            if (simulatedScore > bestScore) {
                bestScore = simulatedScore;
                bestMove = move;
            }
        }
        return bestMove;
    }

    // Get all valid moves for the AI player
    getValidMoves(board) {
        let validMoves = [];
        // Collect all valid moves
        for (let x = 0; x < board.size; x++) {
            for (let y = 0; y < board.size; y++) {
                let column = board.grid[y][x];
                // Add moves for placing a new stone (flat or capstone)
                if (!column || column.length === 0) {
                    if (board.players[this.playerNumber].stones > 0) {
                        validMoves.push({ x, y, type: "f" }); // Place a flat stone
                    }
                    if (board.players[this.playerNumber].capstones > 0) {
                        validMoves.push({ x, y, type: "c" }); // Place a capstone
                    }
                } else {
                    let topStone = column[column.length - 1];
                    // Add moves for picking up and stacking if the top stone belongs to the AI player
                    if (topStone.player === this.playerNumber) {
                        validMoves.push({ x, y, type: "pickup" });
                    }
                    // Consider placing beside blocking pieces
                    if (topStone.player !== this.playerNumber && board.players[this.playerNumber].stones > 0) {
                        // Add adjacent positions as potential strategic placements
                        [
                            [x - 1, y],
                            [x + 1, y],
                            [x, y - 1],
                            [x, y + 1],
                        ].forEach(([nx, ny]) => {
                            if (nx >= 0 && nx < board.size && ny >= 0 && ny < board.size && (!board.grid[ny][nx] || board.grid[ny][nx].length === 0)) {
                                validMoves.push({ x: nx, y: ny, type: "f" }); // Consider placing a flat stone beside
                            }
                        });
                    }
                }
            }
        }
        // Iterate through the board to find blockages and adjacent friendly stones
        for (let x = 0; x < board.size; x++) {
            for (let y = 0; y < board.size; y++) {
                let column = board.grid[y][x];
                if (column && column.length > 0) {
                    let topStone = column[column.length - 1];
                    // Check for blockage by the opponent
                    if (topStone.player !== this.playerNumber) {
                        // Check adjacent cells for friendly stones that can stack onto the blockage
                        [
                            [x - 1, y],
                            [x + 1, y],
                            [x, y - 1],
                            [x, y + 1],
                        ].forEach(([nx, ny]) => {
                            if (nx >= 0 && nx < board.size && ny >= 0 && ny < board.size) {
                                let adjacentColumn = board.grid[ny][nx];
                                if (adjacentColumn && adjacentColumn.length > 0) {
                                    let adjacentTopStone = adjacentColumn[adjacentColumn.length - 1];
                                    if (adjacentTopStone.player === this.playerNumber) {
                                        // Consider stacking this stone onto the blockage
                                        validMoves.push({ fromX: nx, fromY: ny, toX: x, toY: y, type: "stack" });
                                    }
                                }
                            }
                        });
                    }
                }
            }
        }
        return validMoves;
    }

    // Main method to determine the next move
    determineMove(board) {
        // Choose the best move based on heuristic evaluation
        return this.chooseBestMove(board);
    }
}
