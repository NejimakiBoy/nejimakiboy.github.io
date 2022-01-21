const clr = '#ffffff'
let agent = [];

function setup() {
  const canvas = createCanvas(512, 512);
  canvas.parent('p5canvas');
  background(clr);
  colorMode(HSB);
  setupAgents(256);
}

function setupAgents(i) {
  for (let j = 0; j < i; ++j) {
    agent.push([256, 256, 32, color(0, 0, 0)]);
  }
}

function draw() {
  background(clr);
  for (let i = 0; i < agent.length; ++i) {
    noStroke();
    fill(agent[i][3]);
    ellipse(agent[i][0], agent[i][1], agent[i][2]);
    agent[i][0] += random(-8, 8)
    agent[i][1] += random(-8, 8)

    if (agent[i][0] > 512 | agent[i][1] > 512 | agent[i][0] < 0 | agent[i][1] < 0) {
      agent[i][0] = 256;
      agent[i][1] = 256;
      agent[i][2] = random(16, 64);
      agent[i][3] = color(random(0, 360), random(0, 100), random(0, 100));
    }
  }
}