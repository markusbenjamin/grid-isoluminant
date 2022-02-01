var hgLayer, breakupLayer, stimLayer;
var stimSize;
var stimArray;

function setup() {
  createCanvas(windowWidth, windowHeight);
  calculateSizes();
  initialize();

  background(0.5);
}

function initialize() {
  colorMode(HSB, 1);
  rectMode(CENTER);
  noFill();
  noStroke();

  hgLayer = createGraphics(stimSize, stimSize);
  hgLayer.colorMode(HSB, 1);
  hgLayer.rectMode(CENTER);
  hgLayer.background(0.5);
  drawHermannGridToBuffer(7, 1 / 3, stimSize, color(1), color(1), stimSize * 0.5, stimSize * 0.5, true, hgLayer);
  hgLayer.loadPixels();

  breakupLayer = createGraphics(stimSize, stimSize);
  breakupLayer.colorMode(HSB, 1);
  breakupLayer.rectMode(CENTER);
  breakupLayer.background(1);
  breakupLayer.fill(0);
  breakupLayer.noStroke();
  breakupLayer.rect(stimSize * 0.5, stimSize * 0.5, stimSize * 0.25, stimSize * 0.25);
  breakupLayer.loadPixels();

  stimArray = [];
  for(var i=0; i<stimSize; i++){
    stimArray[i] = [];
    for(var j=0; j<stimSize; j++){
      stimArray[i][j] = round(hgLayer.pixels[i+stimSize*j]/255);
    }
  }
}

function windowResized() {
  createCanvas(windowWidth, windowHeight);
  calculateSizes();
  initialize();
}

function calculateSizes() {
  stimSize = round(min(width, height) * 0.05);
}

function draw() {
  background(0.5);
  image(hgLayer, 100, 100);
}

function drawHermannGridToBuffer(n, r, gS, vC, hC, x, y, hOnV, buffer) {
  var sW = (r / (1 + r)) * (1 / n);
  var bW = (1 / (1 + r)) * (1 / n);
  var shrink = 1 / ((n + 1) * sW + n * bW);

  var coords = [];
  for (var i = 1; i <= n + 1; i++) {
    coords.push(sW * (i - 1) + bW * (i - 1) - 0.5);
  }

  buffer.fill(0);
  buffer.rect(x, y, gS, gS);
  buffer.noFill();

  if (hOnV) {
    buffer.fill(vC);
    buffer.stroke(vC);
    for (var i = 1; i <= n + 1; i++) {
      buffer.beginShape();
      buffer.vertex(x + gS * shrink * (coords[i - 1] + sW / 2), y + gS * shrink * (-0.5 + sW / 2 - sW));
      buffer.vertex(x + gS * shrink * (coords[i - 1] - sW / 2), y + gS * shrink * (-0.5 + sW / 2 - sW));
      buffer.vertex(x + gS * shrink * (coords[i - 1] - sW / 2), y + gS * shrink * (0.5 + sW / 2));
      buffer.vertex(x + gS * shrink * (coords[i - 1] + sW / 2), y + gS * shrink * (0.5 + sW / 2));
      buffer.endShape(CLOSE);
    }
  }

  buffer.fill(hC);
  buffer.stroke(hC);
  for (var i = 1; i <= n + 1; i++) {
    buffer.beginShape();
    buffer.vertex(x + gS * shrink * (-0.5 - sW / 2), y + gS * shrink * (coords[i - 1] - sW / 2));
    buffer.vertex(x + gS * shrink * (-0.5 - sW / 2), y + gS * shrink * (coords[i - 1] + sW / 2));
    buffer.vertex(x + gS * shrink * (0.5 + sW / 2), y + gS * shrink * (coords[i - 1] + sW / 2));
    buffer.vertex(x + gS * shrink * (0.5 + sW / 2), y + gS * shrink * (coords[i - 1] - sW / 2));
    buffer.endShape(CLOSE);
  }

  if (hOnV == false) {
    buffer.fill(vC);
    buffer.stroke(vC);
    for (var i = 1; i <= n + 1; i++) {
      buffer.beginShape();
      buffer.vertex(x + gS * shrink * (coords[i - 1] + sW / 2), y + gS * shrink * (-0.5 + sW / 2 - sW));
      buffer.vertex(x + gS * shrink * (coords[i - 1] - sW / 2), y + gS * shrink * (-0.5 + sW / 2 - sW));
      buffer.vertex(x + gS * shrink * (coords[i - 1] - sW / 2), y + gS * shrink * (0.5 + sW / 2));
      buffer.vertex(x + gS * shrink * (coords[i - 1] + sW / 2), y + gS * shrink * (0.5 + sW / 2));
      buffer.endShape(CLOSE);
    }
  }

  buffer.noFill();
  buffer.noStroke();
}