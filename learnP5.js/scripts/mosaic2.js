const clr = '#3babff'
let img;
const maxSize = 8;

function preload() {
  img = loadImage('../medias/DP-17394-001-cropped-512.jpg');
}

function setup() {
  const canvas = createCanvas(512, 512);
  canvas.parent('p5canvas');
  background(clr);
  image(img, 0, 0);
  frameRate(15);
}

function draw() {
  image(img, 0, 0);

  for (let y = maxSize; y < 512; y += maxSize) {
    for (let x = maxSize; x < 512; x += maxSize) {
      let col = img.get(x + random(-maxSize*2, maxSize*2), y + random(-maxSize*2, maxSize*2));
      fill(col);
      noStroke();
      let d = dist(x, y, mouseX, mouseY);
      d = d * 0.05;
      if (d > maxSize) {
        d = maxSize;
      }
      ellipse(x, y, d);
    }
  }
}