function setup() {
  let canvas = createCanvas(512, 512);
  canvas.parent('p5canvas');
  background(64);
}

function draw() {
  background(random(64, 96));

  var h = nf(hour(), 2, 0);
  var m = nf(minute(), 2, 0);
  var s = nf(second(), 2, 0);

  fill(1.0)
  strokeWeight(0);
  textSize(16)

  text(h + ':' + m + ':' + s, 32 - 8 + random(0, 8), 48 - 8 + random(0, 8));

  var radS = (s * 6) * Math.PI / 180;
  var radM = (m * 6) * Math.PI / 180;
  var radH = (h * 30) * Math.PI / 180;

  stroke(0);
  strokeWeight(1);

  const rand8 = -8 + random(0, 8);

  noFill()
  ellipse(256 - 8 + random(0, 8), 256 - 8 + random(0, 8), 160 - 8 + random(0, 8), 160 - 8 + random(0, 8))
  arc(256 - 8 + random(0, 8), 256 - 8 + random(0, 8), 128 - 8 + random(0, 8), 128 - 8 + random(0, 8), -HALF_PI, radS - HALF_PI);
  arc(256 - 8 + random(0, 8), 256 - 8 + random(0, 8), 96 - 8 + random(0, 8), 96 - 8 + random(0, 8), -HALF_PI, radM - HALF_PI);
  arc(256 - 8 + random(0, 8), 256 - 8 + random(0, 8), 64 - 8 + random(0, 8), 64 - 8 + random(0, 8), -HALF_PI, radH - HALF_PI);

  const dist = 96;

  var rad = map(millis(), 0, 500, 0, PI);

  var x = Math.cos(rad) * dist;
  var y = Math.tan(rad) * dist;

  ellipse(256 + x - 8 + random(0, 8), 256 + 128 - 8 + random(0, 8), 32 - 8 + random(0, 8), 32 - 8 + random(0, 8))
}