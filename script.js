document.addEventListener('DOMContentLoaded', () => {
    const boardElement = document.getElementById('game-board');
    const statusElement = document.getElementById('status');
    const restartBtn = document.getElementById('restart-btn');
    const cells = document.querySelectorAll('.cell');

    let board = Array(9).fill(null);
    let currentPlayer = 'X'; // Human is X
    let gameActive = true;

    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Cols
        [0, 4, 8], [2, 4, 6]             // Diagonals
    ];

    function handleCellClick(e) {
        const clickedCell = e.target;
        const clickedIndex = parseInt(clickedCell.getAttribute('data-index'));

        if (board[clickedIndex] !== null || !gameActive || currentPlayer === 'O') {
            return;
        }

        makeMove(clickedIndex, 'X');

        if (gameActive) {
            // Wait a bit then let AI move
            setTimeout(aiMove, 500);
        }
    }

    function makeMove(index, player) {
        board[index] = player;
        cells[index].innerText = player;
        cells[index].classList.add(player.toLowerCase());

        if (checkWin(player)) {
            statusElement.innerText = `Player ${player} Wins!`;
            gameActive = false;
            return;

        }

        if (checkDraw()) {
            statusElement.innerText = "It's a Draw!";
            gameActive = false;
            return;
        }

        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        statusElement.innerText = `Player ${currentPlayer}'s Turn`;
    }

    function aiMove() {
        if (!gameActive) return;

        // Simple AI: Randomly pick an empty cell
        const availableIndices = board.map((val, idx) => val === null ? idx : null).filter(val => val !== null);

        if (availableIndices.length > 0) {
            const randomIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)];
            makeMove(randomIndex, 'O');
        }
    }

    function checkWin(player) {
        return winPatterns.some(pattern => {
            return pattern.every(index => board[index] === player);
        });
    }

    function checkDraw() {
        return board.every(cell => cell !== null);
    }

    function resetGame() {
        board = Array(9).fill(null);
        currentPlayer = 'X';
        gameActive = true;

        statusElement.innerText = "Player X's Turn";
        cells.forEach(cell => {
            cell.innerText = '';
            cell.classList.remove('x', 'o');
        });
    }

    cells.forEach(cell => cell.addEventListener('click', handleCellClick));
    restartBtn.addEventListener('click', resetGame);
});
