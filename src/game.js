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
    const opponent = [...input[1]][1];

    const board = c.generateBoard(input[2], input[3], null);
    const lenCommands = [...input[1]].slice(2).length;
    const s = input[1];

    const res = c.autoplay(board, s, input[4]);
    console.log(c.boardToString(res.board));

    let move = lenCommands + 1;
    while(res.hasOwnProperty('winner') === false){
        
        // player moves
        if(move % 2 === 1){
            const letter = readlineSync.question('Choose a column letter to drop your piece in\n> ');
            const movePos = c.getEmptyRowCol(res.board, letter);
            // invalid move
            if(movePos === null){
                console.log('Oops, that is not a valid move, try again!');
                continue;
                // res.board = null;
                // res.error = {
                //     "col": letter,
                //     "num": move,
                //     "val": player
                // };
            } else {
                res.board = c.setCell(res.board, movePos.row, movePos.col, player);
                clear();
                console.log(`...dropping in ${letter}`);
                console.log(c.boardToString(res.board));
                if(c.getAvailableColumns(res.board).length <= 0) {
                    console.log('No winner. So sad 😭');
                    break;
                }
            }

            if(movePos !== null && c.hasConsecutiveValues(res.board, movePos.row, movePos.col, input[4])){
                res.winner = player;
            }
            res.lastPieceMoved = player;
            move++;
        // computer moves
        } else {
            readlineSync.question('Press <ENTER> to see computer move');
            const possibleMoves = c.getAvailableColumns(res.board);

            if(possibleMoves.length > 0){
                const letter = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
                const movePos = c.getEmptyRowCol(res.board, letter);
                res.board = c.setCell(res.board, movePos.row, movePos.col, opponent);
                clear();
                console.log(`...dropping in ${letter}`);
                console.log(c.boardToString(res.board));
                if(c.getAvailableColumns(res.board).length <= 0) {
                    console.log('No winner. So sad 😭');
                    break;
                }

                if(movePos !== null && c.hasConsecutiveValues(res.board, movePos.row, movePos.col, input[4])){
                    res.winner = opponent;
                }
                res.lastPieceMoved = opponent;
                move++;
            } else {
                clear();
                console.log(c.boardToString(res.board));
                console.log('No winner. So sad 😭');
            }
        }
        
    }
    console.log(`Winner is ${res.winner}`);
}
// interactive
else {
    let interactiveInput = readlineSync.question('Enter the number of rows, columns, and consecutive "pieces" for win\n(all separated by commas... for example: 6, 7, 4)\n> ');    
    let board;
    let winCon;
    if(interactiveInput){
        interactiveInput = interactiveInput.split(',');
        console.log(`Using row, col and consecutive: ${interactiveInput[0]} ${interactiveInput[1]} ${interactiveInput[2]}\n`);
        board = c.generateBoard(interactiveInput[0], interactiveInput[1], null);
        winCon = interactiveInput[2];
    } else {
        console.log('Using row, col and consecutive: 6 7 4');
        board = c.generateBoard(6, 7, null);
        winCon = 4;
    }

    let players = readlineSync.question('\nEnter two characters that represent the player and computer\n(separated by a comma... for example: (P, C)\n> ');
    let player;
    let opponent;
    if(players){
        players = players.split(',');
        console.log(`Using player and computer characters: ${players[0]} ${players[1]}\n`);
        player = players[0];
        opponent = players[1];
    } else {
        console.log('Using default player and computer characters: 😎 💻');
        player = '😎';
        opponent = '💻';
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
    const res = c.autoplay(board, '', winCon);
    console.log(c.boardToString(res.board));
    let move = initiative === 'P' ? 1 : 0;
    while(res.hasOwnProperty('winner') === false){
        
        // player moves
        if(move % 2 === 1){
            const letter = readlineSync.question('Choose a column letter to drop your piece in\n> ');
            const movePos = c.getEmptyRowCol(res.board, letter);
            // invalid move
            if(movePos === null){
                console.log('Oops, that is not a valid move, try again!');
                continue;
            } else {
                res.board = c.setCell(res.board, movePos.row, movePos.col, player);
                clear();
                console.log(`...dropping in ${letter}`);
                console.log(c.boardToString(res.board));
                if(c.getAvailableColumns(res.board).length <= 0) {
                    console.log('No winner. So sad 😭');
                    break;
                }
            }

            if(movePos !== null && c.hasConsecutiveValues(res.board, movePos.row, movePos.col, winCon)){
                res.winner = player;
            }
            res.lastPieceMoved = player;
            move++;
        // computer moves
        } else {
            readlineSync.question('Press <ENTER> to see computer move');
            const possibleMoves = c.getAvailableColumns(res.board);

            if(possibleMoves.length > 0){
                const letter = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
                const movePos = c.getEmptyRowCol(res.board, letter);
                res.board = c.setCell(res.board, movePos.row, movePos.col, opponent);
                clear();
                console.log(`...dropping in ${letter}`);
                console.log(c.boardToString(res.board));
                if(c.getAvailableColumns(res.board).length <= 0) {
                    console.log('No winner. So sad 😭');
                    break;
                }

                if(movePos !== null && c.hasConsecutiveValues(res.board, movePos.row, movePos.col, winCon)){
                    res.winner = opponent;
                }
                res.lastPieceMoved = opponent;
                move++;
            } else {
                clear();
                console.log(c.boardToString(res.board));
                console.log('No winner. So sad 😭');
            }
        }
        
    }
    console.log(`Winner is ${res.winner}`);
}
