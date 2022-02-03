var hgLayer, buLayer, stimLayer;
var hgArray, breakupArray, stimArray;
var stimSize;
var s1, s2, b1, b2;
var colorChangeMode;

function setup() {
  createCanvas(windowWidth, windowHeight);

  calculateSizes();
  initialize();

  background(0.5);
}

function initialize() {
  colorMode(HSB, 1, 1, 1, 1);
  rectMode(CENTER);
  noFill();
  noStroke();

  hgLayer = createGraphics(stimSize, stimSize);
  hgLayer.colorMode(RGB, 1);
  hgLayer.noSmooth();
  hgLayer.rectMode(CENTER);

  buLayer = createGraphics(stimSize, stimSize);
  buLayer.colorMode(RGB, 1);
  buLayer.noSmooth();
  buLayer.rectMode(CENTER);

  stimLayer = createGraphics(stimSize, stimSize);
  stimLayer.colorMode(RGB, 1);
  stimLayer.noSmooth();
  stimLayer.rectMode(CENTER);

  s1 = color(1);
  s2 = color(1);
  b1 = color(0);
  b2 = color(0);
  colorChangeMode = 0;
}

function windowResized() {
  createCanvas(windowWidth, windowHeight);

  calculateSizes();
  initialize();
}

function calculateSizes() {
  stimSize = round(min(width, height) * 0.3);
}

function draw() {
  background(0.5);

  hgLayer.background(1);
  drawHermannGridToBuffer(7, 1 / 3, stimSize, color(0), color(1), color(1), stimSize * 0.5, stimSize * 0.5, true, hgLayer);
  hgLayer.loadPixels();

  buLayer.background(1);
  buLayer.fill(0);
  buLayer.noStroke();
  buLayer.rect(stimSize * 0.5, stimSize * 0.5, stimSize * 0.5, stimSize * 0.5);
  buLayer.loadPixels();

  stimLayer.background(0.5);

  //street color isoluminant variants
  if (colorChangeMode == 1) {
    var s = 1 / 3;

    var r2fix = 0.2;
    var g2fix = 0.2;
    var rgbArray = hsb2rgb([s, 1, 1]);

    s1HSBArray = rgb2hsb(isoluminantRGBfixRG(rgbArray, mouseX / width, g2fix));
    s2HSBArray = rgb2hsb(isoluminantRGBfixRG(rgbArray, r2fix, mouseY / height));

    s1 = color(s1HSBArray[0], s1HSBArray[1], s1HSBArray[2]);
    s2 = color(s2HSBArray[0], s2HSBArray[1], s2HSBArray[2]);

    var controlLimits = isoluminantRGBfixRGControlLimits(rgbArray, r2fix, g2fix);
    var controlSquareCorners = [
      min(controlLimits[0], controlLimits[1]) * width,
      min(controlLimits[2], controlLimits[3]) * height,
      max(controlLimits[0], controlLimits[1]) * width,
      max(controlLimits[2], controlLimits[3]) * height
    ];
    stroke(1);
    rectMode(CORNERS);
    rect(controlSquareCorners[0], controlSquareCorners[1], controlSquareCorners[2], controlSquareCorners[3]);
    rectMode(CENTER);
    noStroke();
  }
  else if (colorChangeMode == 2) {

    //block color isoluminant variants
    var b = 2 / 3;

    var r2fix = 0.2;
    var g2fix = 0.2;
    var rgbArray = hsb2rgb([b, 1, 1]);

    b1HSBArray = rgb2hsb(isoluminantRGBfixRG(rgbArray, mouseX / width, g2fix));
    b2HSBArray = rgb2hsb(isoluminantRGBfixRG(rgbArray, r2fix, mouseY / height));

    b1 = color(b1HSBArray[0], b1HSBArray[1], b1HSBArray[2]);
    b2 = color(b2HSBArray[0], b2HSBArray[1], b2HSBArray[2]);

    var controlLimits = isoluminantRGBfixRGControlLimits(rgbArray, r2fix, g2fix);
    var controlSquareCorners = [
      min(controlLimits[0], controlLimits[1]) * width,
      min(controlLimits[2], controlLimits[3]) * height,
      max(controlLimits[0], controlLimits[1]) * width,
      max(controlLimits[2], controlLimits[3]) * height
    ];
    stroke(0);
    rectMode(CORNERS);
    rect(controlSquareCorners[0], controlSquareCorners[1], controlSquareCorners[2], controlSquareCorners[3]);
    rectMode(CENTER);
    noStroke();
  }

  for (var i = 0; i < stimSize; i++) {
    for (var j = 0; j < stimSize; j++) {
      var rHG = hgLayer.pixels[4 * (i + stimSize * j) + 0] / 255;
      var rBU = buLayer.pixels[4 * (i + stimSize * j) + 0] / 255;

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

  image(hgLayer, width * 0.5 - stimSize * 0.5, height * 0.5 - stimSize * 0.5 - stimSize);
  image(buLayer, width * 0.5 - stimSize * 0.5 - stimSize, height * 0.5 - stimSize * 0.5);
  image(stimLayer, width * 0.5 - stimSize * 0.5, height * 0.5 - stimSize * 0.5);
}

function keyPressed() {
  if (key == 's' || key == 'S') {
    colorChangeMode++;
    colorChangeMode %= 3;
  }

  if (key == 'e' || key == 'E') {
    loadPixels();
    get(width * 0.5 - stimSize * 0.5 - stimSize, height * 0.5 - stimSize * 0.5 - stimSize, stimSize * 2, stimSize * 2).save("isoluminant_stimulus", "png")
  }
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
  colorMode(HSB, 1, 1, 1, 1);
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
  colorMode(HSB, 1, 1, 1, 1);
  return rgbArray;
}

function isoluminantRGBfixRGControlLimits(rgbArray1, r2, g2) {
  var r1 = rgbArray1[0];
  var g1 = rgbArray1[1];
  var b1 = rgbArray1[2];
  return [
    0.705686 * (-1 + b1 + 2.82464 * g1 - 2.82464 * g2 + 1.41706 * r1),
    0.705686 * (b1 + 2.82464 * g1 - 2.82464 * g2 + 1.41706 * r1),
    0.354027 * (-1 + b1 + 2.82464 * g1 + 1.41706 * r1 - 1.41706 * r2),
    0.354027 * (b1 + 2.82464 * g1 + 1.41706 * r1 - 1.41706 * r2)
  ]
}

function isoluminantRGBfixRG(rgbArray1, r2, g2) {
  var r1 = rgbArray1[0];
  var g1 = rgbArray1[1];
  var b1 = rgbArray1[2];
  var b2 = -4.739336492890995 * (-0.211 * b1 - 0.596 * g1 + 0.596 * g2 - 0.299 * r1 + 0.299 * r2);
  if (0 <= b2 && b2 <= 1) { return [r2, g2, b2, 1] } else { return [0, 0, 0, 1] }
}

function isoluminantRGBfixRB(rgbArray1, r2, b2) {
  var r1 = rgbArray1[0];
  var g1 = rgbArray1[1];
  var b1 = rgbArray1[2];
  var g2 = -1.6778523489932886 * (-0.211 * b1 + 0.211 * b2 - 0.596 * g1 - 0.299 * r1 + 0.299 * r2);
  if (0 <= g2 && g2 <= 1) { return [r2, g2, b2, 1] } else { return [0, 0, 0, 1] }
}

function isoluminantRGBfixGB(rgbArray1, g2, b2) {
  var r1 = rgbArray1[0];
  var g1 = rgbArray1[1];
  var b1 = rgbArray1[2];
  var r2 = -3.3444816053511706 * (-0.211 * b1 + 0.211 * b2 - 0.596 * g1 + 0.596 * g2 - 0.299 * r1);
  if (0 <= r2 && r2 <= 1) { return [r2, g2, b2, 1] } else { return [0, 0, 0, 1] }
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