// require your module, connectmoji
// require any other modules that you need, like clear and readline-sync
const readlineSync = require('readline-sync');
const clear = require('clear');
const c = require('./connectmoji.js');

const input = process.argv[2] ? process.argv[2].split(',') : undefined;


// scripted moves
if(input){
    readlineSync.question('Press <ENTER> to start game');
    const player = input[0];
    const opponent = input[1][1];

    const board = c.generateBoard(input[2], input[3], null);
    const s = input[1];

    const res = c.autoplay(board, s, input[4]);
    console.log(c.boardToString(res.board));

    let move = 1;
    while(res.hasOwnProperty('winner') === false){
        const letter = readlineSync.question('Choose a column letter to drop your piece in\n> ');
        const movePos = c.getEmptyRowCol(board, letter);
        if(movePos === null){
            res.board = null;
            res.error = {
                "col": letter,
                "num": move,
                "val": player
            };
        } else {
            res.board = c.setCell(res.board, movePos.row, movePos.col, player);
            console.log(`Dropping in ${letter}`);
            console.log(c.boardToString(res.board));
        }

        if(movePos !== null && c.hasConsecutiveValues(board, movePos.row, movePos.col, input[4])){
            res.winner = player;
        }
        res.lastPieceMoved = player;
        move++;
    }
    console.log(`Winner is ${res.winner}`);
}
// interactive
else {
    let interactiveInput = readlineSync.question('Enter the number of rows, columns, and consecutive "pieces" for win\n(all separated by commas... for example: 6, 7, 4)\n> ');    
    if(interactiveInput){
        interactiveInput = interactiveInput.split(',');
        console.log(`Using row, col and consecutive: ${interactiveInput[0]} ${interactiveInput[1]} ${interactiveInput[2]}\n`);
        const board = c.generateBoard(interactiveInput[0], interactiveInput[1], null);
        const winCon = interactiveInput[2];
    } else {
        console.log('Using row, col and consecutive: 6 7 4');
        const board = c.generateBoard(6, 7, null);
        const winCon = 4;
    }

    let players = readlineSync.question('\nEnter two characters that represent the player and computer\n(separated by a comma... for example: (P, C)\n> ');
    if(players){
        players = players.split(',');
        console.log(`Using player and computer characters: ${players[0]} ${players[1]}\n`);
        const player = players[0];
        const opponent = players[1];
    } else {
        console.log('Using default player and computer characters: 😎 💻');
        const player = '😎';
        const opponent = '💻';
    }

    let initiative = readlineSync.question('\nWho goes first, (P)layer or (C)omputer?\n> ');
    if(initiative) {
        if(initiative === 'P') {
            console.log('Player goes first');
        } else {
            console.log('Computer goes first');
        }
    } else {
        console.log('Player goes first');
        initiative = 'P';
    }
    readlineSync.question('Press <ENTER> to start game');
}
