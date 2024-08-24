document.addEventListener('DOMContentLoaded', initializeBoard);

function initializeBoard() {
    const initialPositions = {
        a1: 'rook', b1: 'knight', c1: 'bishop', d1: 'queen', e1: 'king', f1: 'bishop', g1: 'knight', h1: 'rook',
        a2: 'pawn', b2: 'pawn', c2: 'pawn', d2: 'pawn', e2: 'pawn', f2: 'pawn', g2: 'pawn', h2: 'pawn',
        a7: 'pawn', b7: 'pawn', c7: 'pawn', d7: 'pawn', e7: 'pawn', f7: 'pawn', g7: 'pawn', h7: 'pawn',
        a8: 'rook', b8: 'knight', c8: 'bishop', d8: 'queen', e8: 'king', f8: 'bishop', g8: 'knight', h8: 'rook'
    };

    Object.keys(initialPositions).forEach(position => {
        const cell = document.getElementById(position);
        const piece = initialPositions[position];
        const pieceElement = document.createElement('div');
        pieceElement.classList.add('piece', piece, position.startsWith('a') || position.startsWith('b') ? 'white' : 'black');
        cell.appendChild(pieceElement);
    });

    document.getElementById('startButton').addEventListener('click', startVoiceRecognition);
    document.getElementById('resetButton').addEventListener('click', resetGame);
}

function startVoiceRecognition() {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'en-US';

    recognition.onresult = function(event) {
        const command = event.results[0][0].transcript;
        processCommand(command);
    };

    recognition.start();
}

function processCommand(command) {
    const regex = /move\s+(pawn|rook|knight|bishop|queen|king)?\s*from\s+([a-h][1-8])\s+to\s+([a-h][1-8])/i;
    const match = command.match(regex);
    
    if (match) {
        const piece = match[1] || "";  
        const from = match[2].toLowerCase();
        const to = match[3].toLowerCase();

        if (validateMove(piece, from, to)) {
            movePiece(piece, from, to);
        } else {
            provideFeedback("Invalid move. Please try again.");
        }
    } else {
        provideFeedback("Invalid command. Please use the correct format.");
    }
}

function validateMove(piece, from, to) {
    const fromCell = document.getElementById(from);
    const toCell = document.getElementById(to);
    const pieceElement = fromCell.querySelector('.piece');

    if (!pieceElement) return false;
    
    const isCorrectPiece = piece === "" || pieceElement.classList.contains(piece);
    if (!isCorrectPiece) return false;

    return true;
}

function movePiece(piece, from, to) {
    const fromCell = document.getElementById(from);
    const toCell = document.getElementById(to);
    const pieceElement = fromCell.querySelector('.piece');

    if (pieceElement) {
        toCell.innerHTML = ''; // Remove any piece on the destination
        toCell.appendChild(pieceElement);
    }
}

function resetGame() {
    document.getElementById('chessboard').innerHTML = ''; // Clear the board
    initializeBoard(); // Reinitialize the board
}

function provideFeedback(message) {
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(message);
    synth.speak(utterance);
}
