const rows = 4;
const cols = 4;
const gridDiv = document.getElementById("grid");
const scoreDiv = document.getElementById("score");
const resultDiv = document.getElementById("result");
var optionsNum = [];
var index = 0;
var grid = [];
let score = 0;
let old_grid = [];
let colors = {
  2: "#F0F0F0",
  4: "#F0E3D0",
  8: "#FED59B",
  16: "#F8A88B",
  32: "#F8926C",
  64: "#F55855",
  128: "#F5EA55",
  256: "#F5D555",
  512: "#F5D03D",
  1024: "#F6CD29",
  2048: "#FACC17",
};

document.addEventListener("keydown", moveBoard);
createGrid();
function createGrid() {
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      let cell = document.createElement("td");
      cell.classList.add("cell");
      cell.id = index;
      gridDiv.appendChild(cell);
      index++;
    }
    let space = document.createElement("tr");
    gridDiv.appendChild(space);
  }
  getNumbers(2);
}

function getNumbers(number) {
  for (let i = 0; i < number; i++) {
    let randomCell = Math.floor(Math.random() * 100) % 16;
    //console.log(randomCell);
    optionsNum.push(randomCell);
    let chosenCell = document.getElementById(randomCell);
    let randomNumber = Math.random(1) < 0.5 ? 2 : 4;
    chosenCell.innerHTML = randomNumber;
  }
  setGrid();
}

function moveBoard(e) {
  let past = copyGrid(grid);
  let finish = checkWin();
  if (finish == false) {
    switch (e.key) {
      case "ArrowLeft": {
        console.log("left");
        moveLeft(past);
        break;
      }
      case "ArrowRight": {
        console.log("right");
        moveRight(past);

        break;
      }
      case "ArrowUp": {
        console.log("up");
        moveUp(past);
        break;
      }
      case "ArrowDown": {
        console.log("down");
        moveDown(past);
        break;
      }
    }
  }
}

function checkWin() {
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if (grid[i][j] == 2048) {
        return true;
      }
    }
  }
  return false;
}

function copyGrid(grid) {
  let extra = blankGrid();
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      extra[i][j] = grid[i][j];
    }
  }
  return extra;
}

function setGrid() {
  n = 0;
  let arr = [];
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      let cell = document.getElementById(n);
      let num = cell.innerHTML > 0 ? cell.innerHTML : 0;
      // change color for existing numbers
      if (cell.innerHTML > 0) {
        cell.style.backgroundColor = colors[num];
      }
      arr.push(parseInt(num));

      n++;
    }
    grid.push(arr);
    arr = [];
  }
}

function moveRight(past) {
  for (let i = 0; i < rows; i++) {
    grid[i] = slide(grid[i]);
    grid[i] = combine(grid[i]);
    grid[i] = slide(grid[i]);
  }
  let changed = compare(past, grid);
  if (changed) {
    addNumber();
  }
  update();
  checkEnd();
}

function moveLeft(past) {
  for (let i = 0; i < rows; i++) {
    grid[i] = slideLeft(grid[i]);
    grid[i] = combineLeft(grid[i]);
    grid[i] = slideLeft(grid[i]);
  }
  let changed = compare(past, grid);
  if (changed) {
    addNumber();
  }
  update();
  checkEnd();
}

function moveUp(past) {
  grid = flipUp(grid);
  let changed = compare(past, grid);
  if (changed) {
    addNumber();
  }
  update();
  checkEnd();
}
function moveDown(past) {
  grid = flipDown(grid);
  let changed = compare(past, grid);
  if (changed) {
    addNumber();
  }
  update();
  checkEnd();
}

function checkLose() {
  let options = [];
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (grid[i][j] === 0) {
        options.push({
          x: i,
          y: j,
        });
      }
    }
  }
  console.log(options.length);
  if (options.length <= 0) {
    return true;
  } else {
    return false;
  }
}

function checkEnd() {
  if (checkWin()) {
    resultDiv.style.color = "green";
    resultDiv.innerHTML = "Good Job!! you won";
  } // else if (checkLose()) {
  //resultDiv.innerHTML = "Oh No! you lost";
  //}
}

function slide(row) {
  let array = row.filter((val) => val);
  let missing = 4 - array.length;
  let zeros = Array(missing).fill(0);
  array = zeros.concat(array);
  return array;
}

function combine(row) {
  for (let i = 3; i >= 1; i--) {
    let a = row[i];
    let b = row[i - 1];
    if (a == b) {
      row[i] = a + b;
      score += row[i];
      row[i - 1] = 0;
    }
  }
  return row;
}

function slideLeft(row) {
  let array = row.filter((val) => val);
  let missing = 4 - array.length;
  let zeros = Array(missing).fill(0);
  array = array.concat(zeros);
  return array;
}

function combineLeft(row) {
  for (let i = 0; i < rows; i++) {
    let a = row[i];
    let b = row[i + 1];
    if (a == b) {
      row[i] = a + b;
      score += row[i];
      row[i + 1] = 0;
    }
  }
  return row;
}

function update() {
  let num = 0;
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      let cellChanged = document.getElementById(num);
      cellChanged.style.backgroundColor = "";
      if (grid[i][j] !== 0) {
        cellChanged.innerHTML = grid[i][j];
        cellChanged.style.backgroundColor = colors[grid[i][j]];
      } else {
        cellChanged.innerHTML = "";
      }
      num++;
    }
  }
  scoreDiv.innerHTML = "score: " + score;
}

function flipUp(arr) {
  let columns = [];
  let newarr = [];
  for (let i = 0; i < cols; i++) {
    let array = arr.map((x) => x[i]);
    array = slideLeft(array);
    columns.push(array);
  }
  for (let j = 0; j < rows; j++) {
    columns[j] = combineLeft(columns[j]);
    columns[j] = slideLeft(columns[j]);
    //console.log(columns);
  }
  for (let j = 0; j < rows; j++) {
    let arr2 = columns.map((x) => x[j]);
    newarr.push(arr2);
  }
  return newarr;
}

function flipDown(arr) {
  let columns = [];
  let newarr = [];
  for (let i = 0; i < cols; i++) {
    let array = arr.map((x) => x[i]);
    array = slide(array);
    columns.push(array);
  }
  for (let j = 0; j < rows; j++) {
    columns[j] = combine(columns[j]);
    columns[j] = slide(columns[j]);
    //console.log(columns);
  }
  for (let j = 0; j < rows; j++) {
    let arr2 = columns.map((x) => x[j]);
    newarr.push(arr2);
  }
  return newarr;
}

function addNumber() {
  let options = [];
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (grid[i][j] === 0) {
        options.push({
          x: i,
          y: j,
        });
      }
    }
  }

  if (options.length > 0) {
    console.log("new number");
    let spot = Math.floor((Math.random() * 100) % options.length);
    spot = options[spot];
    let r = Math.random(1);
    grid[spot.x][spot.y] = r > 0.1 ? 2 : 4;
  }
}

function blankGrid() {
  return [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];
}

function compare(a, b) {
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if (a[i][j] !== b[i][j]) {
        return true;
      }
    }
  }
  return false;
}
