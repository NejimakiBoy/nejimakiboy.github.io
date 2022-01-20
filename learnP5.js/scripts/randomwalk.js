var isWalking = true;
const clearColor = '#3babff';

var palette = [[255, 0, 0], [0, 255, 0], [0, 0, 255]];
var palNo = 0;
var headCol = palette[palNo];

var footPrints = [];

var x = 256;
var y = 256;
var r = 64;

function setup() {
  let canvas = createCanvas(512, 512);
  canvas.parent('p5canvas');
  background(clearColor);
}

function mouseClicked() {
  palNo += 1;
  if (palNo > palette.length-1) {
    palNo = 0;
  }

  headCol = palette[palNo];

  if (isWalking == true) {
    isWalking = false;
  }
  else {
    isWalking = true;
  }
}

function draw() {
  if (isWalking == true) {

    strokeWeight(0);
    background(clearColor)
    x += random(-8, 8);
    y += random(-8, 8);
    r += random(-8, 8);

    if (r > 128) {
      r = 128;
    }
    else if (r > 32) {
      r = 32;
    }

    if (y > 512 || y < 0 || x > 512 || x < 0) {
      x = 256;
      y = 256;
    }

    footPrints.push([x, y, r]);

    if (footPrints.length > 128) {
      footPrints.splice(0, 1);
    }

    footPrints.forEach(element => {
      fill(255, 255, 255, 96);
      strokeWeight(0);
      ellipse(element[0], element[1], element[2]);
    });

    for (let i = 0; i < footPrints.length; ++i) {
      strokeWeight(1);
      var a = -1;

      if (i === 0) {
        a = 0;
      }

      line(footPrints[i][0], footPrints[i][1], footPrints[i + a][0], footPrints[i + a][1]);
    }

    fill(headCol[0], headCol[1], headCol[2], 128);
    strokeWeight(0);
    ellipse(x, y, r);
  }
}