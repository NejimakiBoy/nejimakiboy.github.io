function setup() {
  let canvas = createCanvas(512, 512);
  canvas.parent('p5canvas');
  background('#3babff');
}

function mouseMoved() {
  stroke(1, 1, 1, 50);
  line(pmouseX, pmouseY, mouseX, mouseY);
}

function mousePressed() {
  stroke(mouseX, mouseY, 0);
  line(mouseX + 16, mouseY, 512, mouseY);
  line(mouseX - 16, mouseY, 0, mouseY);

  
  line(mouseX, mouseY  + 16, mouseX, 512);
  line(mouseX, mouseY - 16, mouseX, 0);

  noFill();
  ellipse(mouseX, mouseY, 16);

}

function draw() {
  if (mouseIsPressed) {
    if (mouseButton === RIGHT) {
      background ('#3babff')
    }
  }
}

// 512 256 128 64 32 16