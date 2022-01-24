const rows = 17;

let cells = new Array(rows);

const maegin = 32;

let size = 8;

const clr = '#3babff'

function setup() {
  let canvas = createCanvas(512, 512);
  canvas.parent('p5canvas');
  background(clr);
  frameRate(15);

  for (let y = 0; y < rows; ++y) {
    cells[y] = new Array(rows)
    for (let x = 0; x < rows; ++x) {
      cells[y][x] = size;
    }
  }
}

function mouseDragged() {
  let x = round(mouseX / maegin);
  let y = round(mouseY / maegin);

  if (x < 0) {
    x = 0;
  }
  else if (x >= rows) {
    x = rows
  }

  if (y < 0) {
    y = 0;
  }
  else if (y >= rows) {
    y = rows
  }

  cells[y][x] += 4;
}

function draw() {
  background(clr);

  for (let y = 0; y < rows; ++y) {
    for (let x = 0; x < rows; ++x) {
      noFill();
      ellipse(x*maegin, y*maegin, cells[y][x]);
    }
  }
}