const clr = '#3babff'
let img;

function preload() {
  img = loadImage('../medias/DP-17394-001-cropped-512.jpg');
}

function setup() {
  const canvas = createCanvas(512, 512);
  canvas.parent('p5canvas');
  background(clr);
  image(img, 0, 0,);
  frameRate(30);
}

function draw() {
  for (let i = 0; i < 256; ++i) {
    let x = random(0, 512);
    let y = random(0, 512);
    let col = img.get(x, y);
    noStroke();
    fill(col);
    ellipse(x + random(-16, 16), y + random(-16, 16), random(4, 8));
  }
}
