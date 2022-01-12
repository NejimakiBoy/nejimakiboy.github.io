function setup() {
  let canvas = createCanvas(512, 512);
  canvas.parent('p5canvas');
}

function draw() {
  background('#3babff');

  noFill();

  arc(64, 64, 48, 48, 0, TWO_PI);
  arc(64 * 2, 64, 48, 48, 0, PI + HALF_PI + QUARTER_PI, PIE);
  arc(64 * 3, 64, 48, 48, 0, PI + HALF_PI, PIE);
  arc(64 * 4, 64, 48, 48, 0, PI + QUARTER_PI, PIE);
  arc(64 * 5, 64, 48, 48, 0, PI, PIE);
  arc(64 * 6, 64, 48, 48, 0, HALF_PI + QUARTER_PI, PIE);
  arc(64 * 7, 64, 48, 48, 0, HALF_PI, PIE);

  ellipse(64, 64 * 2, 48, 48);
  rect(128 - 24, 128 - 24, 48, 48);
  triangle(64 * 3, 104, (64 * 3) - 24, (64 * 2) + 24, (64 * 3) + 24, (64 * 2) + 24);
  line((64 * 4) - 24, 128 - 24, (64 * 4) + 16, (64 * 2) + 24);

  square(64 - 24, (64 * 3 - 24), 48);
  square(128 - 24, (64 * 3 - 24), 48, 10);
  square((64 * 3) - 24, (64 * 3 - 24), 48, 15, 10, 5, 0);

  quad((64*2)-32, (64*4)-16, (64*2)+24, (64*4)-24, (64*3)+24, (64*4)+24, 64-24, (64*4)+8);

  push();
  strokeWeight(4);
  point(64, 64*5);
  pop();
}

// 512 256 128 64 32 16