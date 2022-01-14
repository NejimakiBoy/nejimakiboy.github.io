function setup() {
  let canvas = createCanvas(512, 512);
  canvas.parent('p5canvas');
  background('##ffffff');
}

function mouseClicked() {
  for (let i = 0; i < 10; ++i) {
    const radius = Math.pow(2, i + 1);
    noFill();
    ellipse(mouseX, mouseY, radius);
    console.log(radius);
  }
}

function draw() {
}
