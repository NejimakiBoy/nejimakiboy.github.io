const clr = '#3babff'

function setup() {
  const canvas = createCanvas(512, 512);
  canvas.parent('p5canvas');
  background(clr);
}

function mouseDragged() {
  for (let i = 0; i < 10; i++) {
    fill(0, 0, 0, random(100));
    noStroke();
    ellipse(mouseX + random(-20, 20), mouseY + random(-20, 20), random(10))
  }
}