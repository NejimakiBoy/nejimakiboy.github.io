function setup() {
  let canvas = createCanvas(512, 512);
  canvas.parent('p5canvas');
}

function draw() {
  background('#3babff');

  var h = nf(hour(), 2, 0);
  var m = nf(minute(), 2, 0);
  var s = nf(second(), 2, 0);

  strokeWeight(0);
  textSize(16)


  fill(0)
  text(h + ':' + m + ':' + s, 32, 48);

  fill(0, 0, 0, 64);
  text(h + ':' + m + ':' + s, 40, 56);



  var radS = (s * 6) * Math.PI / 180;

  var radM = (m * 6) * Math.PI / 180;

  var radH = (h * 30) * Math.PI / 180;


  stroke(0);
  strokeWeight(1);

  noFill();
  ellipse(256, 256, 160, 160);

  stroke(0, 0, 0, 64);
  ellipse(256 + 8, 256 + 8, 160, 160);

  stroke(0);
  arc(256, 256, 128, 128, -HALF_PI, radS - HALF_PI);
  stroke(0, 0, 0, 64);
  arc(256 + 8, 256 + 8, 128, 128, -HALF_PI, radS - HALF_PI);

  stroke(0);
  arc(256, 256, 96, 96, -HALF_PI, radM - HALF_PI);
  stroke(0, 0, 0, 64);
  arc(256, 256, 96, 96, -HALF_PI, radM - HALF_PI);

  stroke(0);
  arc(256, 256, 64, 64, -HALF_PI, radH - HALF_PI);
  stroke(0, 0, 0, 64);
  arc(256 + 8, 256 + 8, 64, 64, -HALF_PI, radH - HALF_PI);

  const dist = 96;

  var rad = map(millis(), 0, 500, 0, PI);

  var x = Math.cos(rad) * dist;
  var y = Math.tan(rad) * dist;

  stroke(0);
  ellipse(256 + x, 256 + 128, 32, 32)
  stroke(0, 0, 0, 64);
  ellipse(256 + 8 + x, 256 + 8 + 128, 32, 32)

}