var hgLayer, buLayer, stimLayer;
var hgArray, breakupArray, stimArray;
var stimSize;
var s1, s2, b1, b2;

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
  hgLayer.colorMode(RGB, 1);
  hgLayer.noSmooth();
  hgLayer.rectMode(CENTER);
  hgLayer.background(1);
  drawHermannGridToBuffer(7, 1 / 3, stimSize, color(0), color(1), color(1), stimSize * 0.5, stimSize * 0.5, true, hgLayer);
  hgLayer.loadPixels();

  buLayer = createGraphics(stimSize, stimSize);
  buLayer.colorMode(RGB, 1);
  buLayer.noSmooth();
  buLayer.rectMode(CENTER);
  buLayer.background(1);
  buLayer.fill(0);
  buLayer.noStroke();
  buLayer.rect(stimSize * 0.5, stimSize * 0.5, stimSize * 0.5, stimSize * 0.5);
  buLayer.loadPixels();

  stimLayer = createGraphics(stimSize, stimSize);
  stimLayer.colorMode(RGB, 1);
  stimLayer.noSmooth();
  stimLayer.rectMode(CENTER);
  stimLayer.background(0.5);

  s1 = color(1 / 3 - 0.1, 1, 0.25);
  s2 = color(1 / 3 + 0.1, 1, 0.25);
  b1 = color(2 / 3 - 0.1, 1, 0.75);
  b2 = color(2 / 3 + 0.1, 1, 0.75);

  for (var i = 0; i < stimSize; i++) {
    for (var j = 0; j < stimSize; j++) {
      var rHG = hgLayer.pixels[4 * (i + stimSize * j) + 0] / 255;
      var gHG = hgLayer.pixels[4 * (i + stimSize * j) + 1] / 255;
      var bHG = hgLayer.pixels[4 * (i + stimSize * j) + 2] / 255;
      var aHG = hgLayer.pixels[4 * (i + stimSize * j) + 3] / 255;

      var rBU = buLayer.pixels[4 * (i + stimSize * j) + 0] / 255;
      var gBU = buLayer.pixels[4 * (i + stimSize * j) + 1] / 255;
      var bBU = buLayer.pixels[4 * (i + stimSize * j) + 2] / 255;
      var aBU = buLayer.pixels[4 * (i + stimSize * j) + 3] / 255;

      if (round(rHG) == 0) {
        if (round(rBU) == 0) {
          stimLayer.set(i, j, b1);
        }
        else {
          stimLayer.set(i, j, b2);
        }
      }
      if (round(rHG) == 1) {
        if (round(rBU) == 0) {
          stimLayer.set(i, j, s1);
        }
        else {
          stimLayer.set(i, j, s2);
        }
      }
    }
  }
  stimLayer.updatePixels();
}

function windowResized() {
  createCanvas(windowWidth, windowHeight);

  calculateSizes();
  initialize();
}

function calculateSizes() {
  stimSize = round(min(width, height) * 0.33);
}

function draw() {
  background(0.5);
  image(hgLayer, 100, 100 + stimSize);
  image(buLayer, 100 + stimSize, 100);
  image(stimLayer, 100 + stimSize, 100 + stimSize);

  /*var r = 0;
  var g = 1;
  var b = 0;
  fill(color(r, g, b));
  ellipse(3 * 100 + 2 * stimSize, 100 + stimSize, 200, 200);*/
}

function rgb2hsb(rgbArray) {
  var r = rgbArray[0] * 255;
  var g = rgbArray[1] * 255;
  var b = rgbArray[2] * 255;
  var a = rgbArray[3] * 255;

  colorMode(RGB, 255);
  var hsbArray = [
    hue([r, g, b, a]) / 360,
    saturation([r, g, b, a]) / 100,
    brightness([r, g, b, a])
  ]
  colorMode(HSB, 1);
  return hsbArray;
}

function hsb2rgb(hsbArray) {
  var h = hsbArray[0] * 360;
  var s = hsbArray[1] * 100;
  var b = hsbArray[2];
  colorMode(HSB, 360, 100, 1, 1);
  var rgbArray = [
    red([h, s, b]) / 255,
    green([h, s, b]) / 255,
    blue([h, s, b]) / 255,
    1
  ]
  colorMode(HSB, 1);
  return rgbArray;
}

function isoluminantRGBfixRG(r1, g1, b1, r2, g2) {
  return [
    r2,
    g2,
    -4.739336492890995 * (-0.211 * b1 - 0.596 * g1 + 0.596 * g2 - 0.299 * r1 + 0.299 * r2),
    1
  ]
}

function isoluminantRGBfixRB(r1, g1, b1, r2, b2) {
  return [
    r2,
    -1.6778523489932886 * (-0.211 * b1 + 0.211 * b2 - 0.596 * g1 - 0.299 * r1 + 0.299 * r2),
    b2,
    1
  ]

}

function isoluminantRGBfixGB(r1, g1, b1, g2, b2) {
  return [
    -3.3444816053511706 * (-0.211 * b1 + 0.211 * b2 - 0.596 * g1 + 0.596 * g2 - 0.299 * r1),
    g2,
    b2,
    1
  ]
}

function drawHermannGridToBuffer(n, r, gS, bC, vC, hC, x, y, hOnV, buffer) {
  var sW = (r / (1 + r)) * (1 / n);
  var bW = (1 / (1 + r)) * (1 / n);
  var shrink = 1 / ((n + 1) * sW + n * bW);

  var coords = [];
  for (var i = 1; i <= n + 1; i++) {
    coords.push(sW * (i - 1) + bW * (i - 1) - 0.5);
  }

  buffer.fill(bC);
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