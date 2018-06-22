// Array of sudoku square objects
var gameModel = [
  { quad: 1, col: 1, row: 1, val: 0 },
  { quad: 1, col: 2, row: 1, val: 0 },
  { quad: 1, col: 3, row: 1, val: 0 },
  { quad: 2, col: 4, row: 1, val: 0 },
  { quad: 2, col: 5, row: 1, val: 0 },
  { quad: 2, col: 6, row: 1, val: 0 },
  { quad: 3, col: 7, row: 1, val: 0 },
  { quad: 3, col: 8, row: 1, val: 0 },
  { quad: 3, col: 9, row: 1, val: 0 },

  { quad: 1, col: 1, row: 2, val: 0 },
  { quad: 1, col: 2, row: 2, val: 0 },
  { quad: 1, col: 3, row: 2, val: 0 },
  { quad: 2, col: 4, row: 2, val: 0 },
  { quad: 2, col: 5, row: 2, val: 0 },
  { quad: 2, col: 6, row: 2, val: 0 },
  { quad: 3, col: 7, row: 2, val: 0 },
  { quad: 3, col: 8, row: 2, val: 0 },
  { quad: 3, col: 9, row: 2, val: 0 },

  { quad: 1, col: 1, row: 3, val: 0 },
  { quad: 1, col: 2, row: 3, val: 0 },
  { quad: 1, col: 3, row: 3, val: 0 },
  { quad: 2, col: 4, row: 3, val: 0 },
  { quad: 2, col: 5, row: 3, val: 0 },
  { quad: 2, col: 6, row: 3, val: 0 },
  { quad: 3, col: 7, row: 3, val: 0 },
  { quad: 3, col: 8, row: 3, val: 0 },
  { quad: 3, col: 9, row: 3, val: 0 },

  { quad: 4, col: 1, row: 4, val: 0 },
  { quad: 4, col: 2, row: 4, val: 0 },
  { quad: 4, col: 3, row: 4, val: 0 },
  { quad: 5, col: 4, row: 4, val: 0 },
  { quad: 5, col: 5, row: 4, val: 0 },
  { quad: 5, col: 6, row: 4, val: 0 },
  { quad: 6, col: 7, row: 4, val: 0 },
  { quad: 6, col: 8, row: 4, val: 0 },
  { quad: 6, col: 9, row: 4, val: 0 },

  { quad: 4, col: 1, row: 5, val: 0 },
  { quad: 4, col: 2, row: 5, val: 0 },
  { quad: 4, col: 3, row: 5, val: 0 },
  { quad: 5, col: 4, row: 5, val: 0 },
  { quad: 5, col: 5, row: 5, val: 0 },
  { quad: 5, col: 6, row: 5, val: 0 },
  { quad: 6, col: 7, row: 5, val: 0 },
  { quad: 6, col: 8, row: 5, val: 0 },
  { quad: 6, col: 9, row: 5, val: 0 },

  { quad: 4, col: 1, row: 6, val: 0 },
  { quad: 4, col: 2, row: 6, val: 0 },
  { quad: 4, col: 3, row: 6, val: 0 },
  { quad: 5, col: 4, row: 6, val: 0 },
  { quad: 5, col: 5, row: 6, val: 0 },
  { quad: 5, col: 6, row: 6, val: 0 },
  { quad: 6, col: 7, row: 6, val: 0 },
  { quad: 6, col: 8, row: 6, val: 0 },
  { quad: 6, col: 9, row: 6, val: 0 },

  { quad: 7, col: 1, row: 7, val: 0 },
  { quad: 7, col: 2, row: 7, val: 0 },
  { quad: 7, col: 3, row: 7, val: 0 },
  { quad: 8, col: 4, row: 7, val: 0 },
  { quad: 8, col: 5, row: 7, val: 0 },
  { quad: 8, col: 6, row: 7, val: 0 },
  { quad: 9, col: 7, row: 7, val: 0 },
  { quad: 9, col: 8, row: 7, val: 0 },
  { quad: 9, col: 9, row: 7, val: 0 },

  { quad: 7, col: 1, row: 8, val: 0 },
  { quad: 7, col: 2, row: 8, val: 0 },
  { quad: 7, col: 3, row: 8, val: 0 },
  { quad: 8, col: 4, row: 8, val: 0 },
  { quad: 8, col: 5, row: 8, val: 0 },
  { quad: 8, col: 6, row: 8, val: 0 },
  { quad: 9, col: 7, row: 8, val: 0 },
  { quad: 9, col: 8, row: 8, val: 0 },
  { quad: 9, col: 9, row: 8, val: 0 },

  { quad: 7, col: 1, row: 9, val: 0 },
  { quad: 7, col: 2, row: 9, val: 0 },
  { quad: 7, col: 3, row: 9, val: 0 },
  { quad: 8, col: 4, row: 9, val: 0 },
  { quad: 8, col: 5, row: 9, val: 0 },
  { quad: 8, col: 6, row: 9, val: 0 },
  { quad: 9, col: 7, row: 9, val: 0 },
  { quad: 9, col: 8, row: 9, val: 0 },
  { quad: 9, col: 9, row: 9, val: 0 }
];

var quadIndex = [
  [[1, 1], [1, 2], [1, 3], [2, 1], [2, 2], [2, 3], [3, 1], [3, 2], [3, 3]],
  [[1, 4], [1, 5], [1, 6], [2, 4], [2, 5], [2, 6], [3, 4], [3, 5], [3, 6]],
  [[1, 7], [1, 8], [1, 9], [2, 7], [2, 8], [2, 9], [3, 7], [3, 8], [3, 9]],
  [[4, 1], [4, 2], [4, 3], [5, 1], [5, 2], [5, 3], [6, 1], [6, 2], [6, 3]],
  [[4, 4], [4, 5], [4, 6], [5, 4], [5, 5], [5, 6], [6, 4], [6, 5], [6, 6]],
  [[4, 7], [4, 8], [4, 9], [5, 7], [5, 8], [5, 9], [6, 7], [6, 8], [6, 9]],
  [[7, 1], [7, 2], [7, 3], [8, 1], [8, 2], [8, 3], [9, 1], [9, 2], [9, 3]],
  [[7, 4], [7, 5], [7, 6], [8, 4], [8, 5], [8, 6], [9, 4], [9, 5], [9, 6]],
  [[7, 7], [7, 8], [7, 9], [8, 7], [8, 8], [8, 9], [9, 7], [9, 8], [9, 9]]
];

var gameArr = JSON.parse(JSON.stringify(gameModel));
var changes = 1;
var gP = 0;
var rS = 0;
var cS = 0;
var qS = 0;

//-------------------------------------------------------------------------------------------------------------------------------//
// Solver Functions
//-------------------------------------------------------------------------------------------------------------------------------//

function solveGame(numStr) {
  changes = 1;
  gP = 0;
  rS = 0;
  cS = 0;
  qS = 0;
  pE = 0;

  strToGame(numStr);

  getPossible();
  rowSolve();

  getPossible();
  colSolve();

  getPossible();
  quadSolve();

  getPossible();
  rowSolve();

  getPossible();
  colSolve();

  getPossible();
  quadSolve();

  getPossible();
  rowSolve();

  getPossible();
  colSolve();

  getPossible();
  quadSolve();

  boardOut();
}

function tableSolve() {
  gameArr = JSON.parse(JSON.stringify(gameModel));
  var str = '';
  for (var i = 0; i < 81; i++) {
    if (document.getElementsByClassName('square-input')[i].value.length === 0) {
      str += '0';
    } else {
      str += document.getElementsByClassName('square-input')[i].value;
    }
  }
  solveGame(str);
  gameArr.forEach(function(square, index) {
    if (square.val != 0) {
      document.getElementsByClassName('square-input')[index].value = square.val;
    } else {
      document.getElementsByClassName('square-input')[index].value = '';
    }
  });
}

// Get possible values for square, solve square if only one exists
function getPossible() {
  changes = 1;
  while (changes > 0) {
    changes = 0;
    gameArr.forEach(function(square) {
      if (square.val === 0) {
        var rowReq = [1, 2, 3, 4, 5, 6, 7, 8, 9];
        var colReq = [1, 2, 3, 4, 5, 6, 7, 8, 9];
        var quadReq = [1, 2, 3, 4, 5, 6, 7, 8, 9];

        // Get all required row values
        gameArr.forEach(function(position) {
          if (position.row === square.row && position.val !== 0) {
            rowReq.splice(rowReq.indexOf(position.val), 1);
          }
        });

        // Get all required column values
        gameArr.forEach(function(position) {
          if (position.col === square.col && position.val !== 0) {
            colReq.splice(colReq.indexOf(position.val), 1);
          }
        });

        // Get all required quadrant values
        gameArr.forEach(function(position) {
          if (position.quad === square.quad && position.val !== 0) {
            quadReq.splice(quadReq.indexOf(position.val), 1);
          }
        });

        // Add all possible values for the square to its "possible" array
        square.possible = common([rowReq, colReq, quadReq]);
      }
    });

    possElim();

    // If only one number is possible for the square, make that the value of the square
    gameArr.forEach(function(square) {
      if (square.possible && square.possible.length === 1) {
        square.val = square.possible[0];
        delete square.possible;
        gP++;
        changes++;
      }
    });
  }
}

function rowSolve() {
  for (x = 1; x <= 9; x++) {
    var nA = gameArr.filter(n => n.row === x);
    //create array of objects of pattern {rowPos : possibility}
    var pA = [];
    nA.forEach(function(n, index) {
      if (n.possible) {
        for (var i = 0; i < n.possible.length; i++) {
          pA.push([index, n.possible[i]]);
        }
      }
    });

    var pA2 = [];

    pA.forEach(function(p) {
      pA2.push(p[1]);
    });

    pA2 = pA2.filter(p => pA2.indexOf(p) === pA2.lastIndexOf(p));

    pA2.forEach(function(p2) {
      pA.forEach(function(p) {
        if (p2 === p[1]) {
          //val of square = p2
          gameArr.forEach(function(game) {
            if (game.val === 0 && game.row === x && game.col === p[0] + 1) {
              game.val = p2;
              delete game.possible;
              rS++;
            }
          });
        }
      });
    });
  }
}

function colSolve() {
  for (x = 1; x <= 9; x++) {
    var nA = gameArr.filter(n => n.col === x);
    //create array of objects of pattern {rowPos : possibility}
    var pA = [];
    nA.forEach(function(n, index) {
      if (n.possible) {
        for (var i = 0; i < n.possible.length; i++) {
          pA.push([index, n.possible[i]]);
        }
      }
    });

    var pA2 = [];

    pA.forEach(function(p) {
      pA2.push(p[1]);
    });

    pA2 = pA2.filter(p => pA2.indexOf(p) === pA2.lastIndexOf(p));

    pA2.forEach(function(p2) {
      pA.forEach(function(p) {
        if (p2 === p[1]) {
          //val of square = p2
          gameArr.forEach(function(game) {
            if (game.val === 0 && game.col === x && game.row === p[0] + 1) {
              game.val = p2;
              delete game.possible;
              cS++;
            }
          });
        }
      });
    });
  }
}

function quadSolve() {
  for (x = 1; x <= 9; x++) {
    var nA = gameArr.filter(n => n.quad === x);

    var pA = [];
    nA.forEach(function(n, index) {
      if (n.possible) {
        for (var i = 0; i < n.possible.length; i++) {
          pA.push([index, n.possible[i]]);
        }
      }
    });

    var pA2 = [];

    pA.forEach(function(p) {
      pA2.push(p[1]);
    });

    pA2 = pA2.filter(p => pA2.indexOf(p) === pA2.lastIndexOf(p));

    pA2.forEach(function(p2) {
      pA.forEach(function(p) {
        if (p2 === p[1]) {
          //val of square = p2
          gameArr.forEach(function(game) {
            if (
              game.val === 0 &&
              game.quad === x &&
              game.row === quadIndex[x - 1][p[0]][0] &&
              game.col === quadIndex[x - 1][p[0]][1]
            ) {
              game.val = p2;
              delete game.possible;
              qS++;
            }
          });
        }
      });
    });
  }
}

// Scan each quadrant - for each required value, see if there is a row or column that it can exclusively fit into in that quadrant,
// then eliminate that value from the possibilities of other blank squares in that row or column.
function possElim() {
  for (x = 1; x <= 9; x++) {
    var nA = gameArr.filter(n => n.quad === x);
    var quadReq = [
      { val: 1, rows: [], columns: [] },
      { val: 2, rows: [], columns: [] },
      { val: 3, rows: [], columns: [] },
      { val: 4, rows: [], columns: [] },
      { val: 5, rows: [], columns: [] },
      { val: 6, rows: [], columns: [] },
      { val: 7, rows: [], columns: [] },
      { val: 8, rows: [], columns: [] },
      { val: 9, rows: [], columns: [] }
    ];

    // get all squares in quadrant
    for (var i = 0; i < 9; i++) {
      if (nA[i].val !== 0) {
        quadReq.splice(quadReq.map(e => e.val).indexOf(nA[i].val), 1);
      }
    }

    // fill quadReq array with possible rows and columns for each required value in the quadrant
    quadReq.forEach(function(req) {
      nA.forEach(function(n) {
        if (n.possible) {
          n.possible.forEach(function(poss) {
            if (req.val === poss) {
              req.rows.push(n.row);
              req.columns.push(n.col);
            }
          });
        }
      });

      req.rows = Array.from(new Set(req.rows));
      req.columns = Array.from(new Set(req.columns));

      // remove conflicting possibilities from other squares in the row in different quadrants
      if (req.rows.length === 1) {
        gameArr.forEach(function(square) {
          if (
            square.row === req.rows[0] &&
            square.quad != x &&
            square.possible
          ) {
            var index = square.possible.indexOf(req.val);
            if (index >= 0) {
              square.possible.splice(index, 1);
              pE++;
            }
          }
        });
      }

      // remove conflicting possibilities from other squares in the column in different quadrants
      if (req.columns.length === 1) {
        gameArr.forEach(function(square) {
          if (
            square.col === req.columns[0] &&
            square.quad != x &&
            square.possible
          ) {
            var index = square.possible.indexOf(req.val);
            if (index >= 0) {
              square.possible.splice(index, 1);
              pE++;
            }
          }
        });
      }
    });
  }

  // If there are two squares with only two numbers, which are the same, those numbers can be removed from every other square in the quadrant
}

//-------------------------------------------------------------------------------------------------------------------------------//
// Helper Functions
//-------------------------------------------------------------------------------------------------------------------------------//

function common(arrays) {
  return arrays.shift().filter(function(v) {
    return arrays.every(function(a) {
      return a.indexOf(v) !== -1;
    });
  });
}

function boardOut() {
  var str = '';
  gameArr.forEach(function(square, index) {
    str +=
      (gameArr[index].row === 4 || gameArr[index].row === 7) &&
      gameArr[index].col === 1
        ? '-'.repeat(21) + '\n'
        : '';
    str += gameArr[index].val;
    str += gameArr[index].col === 3 || gameArr[index].col === 6 ? ' | ' : ' ';
    str += (index + 1) % 9 === 0 ? '\n' : '';
  });
}

function strToGame(str) {
  valArr = String(str)
    .split('')
    .map(n => Number(n));
  if (valArr.length === gameArr.length) {
    for (i = 0; i < gameArr.length; i++) {
      gameArr[i].val = valArr[i];
    }
  } else {
    alert('Only ' + valArr.length + ' numbers entered');
  }
}

function loadFromStr() {
  var str = document.getElementById('puzzle-input').value;
  if (str.length === 81) {
    var arr = str.split('');
    arr.forEach(function(entry, index) {
      if (entry != '0') {
        document.getElementsByClassName('square-input')[index].value = entry;
      } else {
        document.getElementsByClassName('square-input')[index].value = '';
      }
    });
  }
}
