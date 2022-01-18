function setup() {
  let canvas = createCanvas(512, 512);
  canvas.parent('p5canvas');
}

function draw(now) {
  background('#3babff');

  var h = nf(hour(), 2, 0);
  var m = nf(minute(), 2, 0);
  var s = nf(second(), 2, 0);

  fill(1.0)
  strokeWeight(0);
  textSize(16)

  text(h + ':' + m + ':' + s, 32, 48);

  var radS = (s * 6) * Math.PI / 180;

  var radM = (m * 6) * Math.PI / 180;

  var radH = (h * 30) * Math.PI / 180;


  stroke(0);
  strokeWeight(1);

  noFill()
  ellipse(256, 256, 160, 160)
  arc(256, 256, 128, 128, -HALF_PI, radS - HALF_PI);
  arc(256, 256, 96, 96, -HALF_PI, radM - HALF_PI);
  arc(256, 256, 64, 64, -HALF_PI, radH - HALF_PI);

  const dist = 96;

  var rad = map(millis(), 0, 500, 0, PI);

  var x = Math.cos(rad) * dist;
  var y = Math.tan(rad) * dist;

  ellipse(256 + x, 256 + 128, 32, 32)

}