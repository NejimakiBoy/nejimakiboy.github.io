const clr = '#3babff'

const gridSize = 8;

function setup() {
  const canvas = createCanvas(512, 512);
  canvas.parent('p5canvas');
  background(clr);
  colorMode(HSB);
  frameRate(2);
}

function draw() {
  for (let y = 0; y <= 256 - gridSize; y += gridSize) {
    for (let x = 0; x <= 256 - gridSize; x += gridSize) {
      let col = color(random(0, 360), random(0, 60), random(80, 100));
      fill(col);
      noStroke();
      rect(x, y, gridSize);
    }
  }

  for (let y = 256; y <= 512; y += gridSize) {
    for (let x = 0; x <= 256 - gridSize; x += gridSize) {
      let col = color(206, random(80, 100), random(60, 100));
      fill(col);
      noStroke();
      rect(x, y, gridSize);
    }
  }

  for (let y = 0; y <= 256 - gridSize; y += gridSize) {
    for (let x = 256; x <= 512; x += gridSize) {
      let col = color(40, random(0, 100), 100);
      fill(col);
      noStroke();
      rect(x, y, gridSize);
    }
  }

  for (let y = 256; y <= 512; y += gridSize) {
    for (let x = 256; x <= 512; x += gridSize) {
      let col = color(random(100, 200), random(50, 80), random(20, 60));
      fill(col);
      noStroke();
      rect(x, y, gridSize);
    }
  }
}

