// implement your functions here
// ...don't forget to export functions!

// grabbing required modules
const readlineSync = require('readline-sync');
const clear = require('clear');
const wcwidth = require('wcwidth');

function generateBoard(rows, cols, fill=null) {
    return {
        data: new Array(rows * cols).fill(fill),
        rows,
        cols
    };
}

function rowColToIndex(board, row, col) {
    return (board.cols * row) + col;
}

function indexToRowCol(board, i) {
    return {
        row: Math.floor(i / board.cols),
        col: i % board.cols
    };
}

function setCell(board, row, col, value) {
    const newBoard = {
        data: [...board.data],
        rows: board.rows,
        cols: board.cols
    };

    newBoard.data[rowColToIndex(board, row, col)] = value;
    return newBoard;
}

function setCells(board, ...moves) {
    let newBoard = {
        data: [...board.data],
        rows: board.rows,
        cols: board.cols
    };

    for(const {row: row, col: col, val: val} of moves) {
        newBoard = setCell(newBoard, row, col, val);
    }

    return newBoard;
}

function boardToString(board) {
    let retStr = '';
    for(let curRow = 0; curRow < board.rows; curRow++) { 
        retStr += '|';
        for(let curCol = 0; curCol < board.cols; curCol++) {
            const curCell = board.data[rowColToIndex(board, curRow, curCol)];
            if(curCell === null) {
                retStr += '    |';
            }
            else {
                let toPrint = ` ${curCell}`;
                const toPrintLen = 1 + wcwidth(curCell); // defines 'actual' width
                const toAppend = Math.max(0, 4 - toPrintLen);
                for(let i = 0; i < toAppend; i++) {
                    toPrint += ' ';
                }
                toPrint += '|';
                retStr += toPrint;
            }
        }
        retStr += '\n';
    }

    // print letter bar at bottom
    retStr += '|';
    for(let i = 0; i < board.cols; i++) {
        if(i !== board.cols - 1) {
            retStr += '----+';
        }
        else {
            retStr += '----|';
        }
    }
    retStr += '\n|';
    for(let i = 0; i < board.cols; i++) {
        retStr += ` ${String.fromCharCode(65 + i)}  |`;
    }

    return retStr;
}

function letterToCol(letter) {
    const charCode = letter.charCodeAt(0);
    if (letter.length > 1) { return null; }
    return charCode < 65 || charCode > 90 ? null : charCode - 65;
}

function getEmptyRowCol(board, letter, empty=null) {
    const col = letterToCol(letter);
    if (col === null) { return null; }
    if (col + 1 > board.cols) { return null; }

    // let curIdx = col;
    // while(curIdx < board.data.length) {
    //     if(board.data[curIdx] !== empty) {
    //         if (curIdx - board.cols < 0) { return null; }
    //         return indexToRowCol(board, curIdx - board.cols);
    //     }
    //     curIdx += board.cols;
    // }
    // return {row: board.cols, col: col};

    let curIdx = rowColToIndex(board, board.rows - 1, col);
    let highestOccupied = -1; // sentinel
    while(curIdx >= 0) {
        if(board.data[curIdx] !== empty) {
            highestOccupied = curIdx;
            curIdx -= board.cols;
        } else {
            curIdx -= board.cols;
        }
    }

    if(highestOccupied === col) {
        return null;
    } else if (highestOccupied === -1) {
        return indexToRowCol(board, rowColToIndex(board, board.rows -1, col));
    } else {
        return highestOccupied - board.cols >= 0 ? indexToRowCol(board, highestOccupied - board.cols) : null; 
    }
}

function getAvailableColumns(board) {
    const availCols = [];
    for(let i = 0; i < board.cols; i++) {
        const letter = String.fromCharCode(i + 65);
        if(getEmptyRowCol(board, letter) !== null) {
            availCols.push(letter);
        }
    }
    return availCols;
}

function hasConsecutiveValues(board, row, col, n) {
    const idx = rowColToIndex(board, row, col);
    const val = board.data[idx];

    let count = 1;
    let current = idx - board.cols; // might break edge cases
    // vert check
    while(current >= 0){
        // keep checking 'upwards' until no match
        if(board.data[current] === val) {
            count++;
            current -= board.cols;
        } else {
            break;
        }

        if(count >= n) { return true; }
    }

    current = idx + board.cols;
    while(current < board.data.length) {
        // keep checking 'downwards' until no match
        if(board.data[current] === val) {
            count++;
            current += board.cols;
        } else {
            break;
        }

        if(count >= n) { return true; }
    }
    if(count >= n) { return true; }

    // horiz check
    count = 1;
    current = idx - 1;
    const leftBound = idx - (idx % board.cols); //8
    const rightBound = idx + (board.cols - 1) - (idx % board.cols);
    // check left
    while(current >= leftBound){
        if(board.data[current] === val) {
            count++;
            current--;
        } else {
            break;
        }

        if(count >= n) { return true; }
    }

    current = idx + 1;
    // check right
    while(current <= rightBound){
        if(board.data[current] === val){
            count++;
            current++;
        } else {
            break;
        }

        if(count >= n) { return true; }
    }
    if(count >= n) { return true; }

    // ascending diag check
    // indices of asc diagonally-adjacent cells appear 
    // at intervals equal to board.cols - 1
    count = 1;
    current = idx - (board.cols - 1);
    let lastRow = indexToRowCol(board, idx).row;

    // check upper right
    while(current >= 0 && indexToRowCol(board, current).row !== lastRow){
        if(board.data[current] === val){
            count++;
            lastRow = indexToRowCol(board, current).row;
            current -= (board.cols - 1);
        } else {
            break;
        }

        if(count === n) { return true; }
    }
    current = idx + (board.cols - 1);
    lastRow = indexToRowCol(board, idx).row;

    // check lower left
    while(current < board.data.length && indexToRowCol(board, current).row !== lastRow){
        if(board.data[current] === val){
            count++;
            lastRow = indexToRowCol(board, current).row;
            current += (board.cols - 1);
        } else {
            break;
        }

        if(count === n) { return true; }
    }
    if(count === n) { return true; }

    // desc diag check
    // indices of desc diagonally-adjacent cells appear 
    // at intervals equal to board.cols + 1
    count = 1;
    current = idx - (board.cols + 1);
    lastRow = indexToRowCol(board, idx).row;
    // check upper left
    while(current >= 0 && indexToRowCol(board, current).row !== lastRow){
        if(board.data[current] === val){
            count++;
            lastRow = indexToRowCol(board, current).row;
            current -= (board.cols + 1);
        } else {
            break;
        }

        if(count === n) { return true; }
    }
    current = idx + (board.cols + 1);
    lastRow = indexToRowCol(board, idx).row;

    // check lower right
    while(current < board.data.length && indexToRowCol(board, current).row !== lastRow){
        if(board.data[current] === val){
            count++;
            lastRow = indexToRowCol(board, current).row;
            current += (board.cols + 1);
        } else {
            break;
        }

        if(count === n) { return true; }
    }
    if(count === n) { return true; }
    return false;

}

function autoplay(board, s, numConsecutive) {
    let res = {};
    return res;
}

module.exports = {
    generateBoard,
    rowColToIndex,
    indexToRowCol,
    setCell,
    setCells,
    boardToString,
    letterToCol,
    getEmptyRowCol,
    getAvailableColumns,
    hasConsecutiveValues,
    autoplay
};