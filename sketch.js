var hgLayer, buLayer, isoLayer, noisoLayer, wireframeLayer;
var stimSize;
var s1, s2, b1, b2;
var colorChangeMode;
var base;

function preload() {
  base = loadImage("/base_5.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  s1 = color(1);
  s2 = color(1);
  b1 = color(0);
  b2 = color(0);
  colorChangeMode = 0;

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

  wireframeLayer = createGraphics(stimSize, stimSize);
  wireframeLayer.colorMode(RGB, 1);
  wireframeLayer.noSmooth();
  wireframeLayer.rectMode(CENTER);

  isoLayer = createGraphics(stimSize, stimSize);
  isoLayer.colorMode(RGB, 1);
  isoLayer.noSmooth();
  isoLayer.rectMode(CENTER);

  noisoLayer = createGraphics(stimSize, stimSize);
  noisoLayer.colorMode(RGB, 1);
  noisoLayer.noSmooth();
  noisoLayer.rectMode(CENTER);

  hgLayer.background(1);
  drawHermannGridToBuffer(7, 1 / 3, stimSize, color(0), color(1), color(1), stimSize * 0.5, stimSize * 0.5, true, hgLayer);
  hgLayer.loadPixels();
  buffer2BW(hgLayer);

  buLayer.background(1);
  base.resize(stimSize, stimSize);
  buLayer.image(base, 0, 0);
  buLayer.loadPixels();
  buffer2BW(buLayer);

  wireframeLayer.background(0.5);
  var hgEdges = edgedetection(hgLayer);
  for (var i = 0; i < hgEdges.length; i++) {
    for (var j = 0; j < hgEdges[i].length; j++) {
      if (hgEdges[i][j] != 0.5) {
        wireframeLayer.set(i, j, color(0, 1, 1));
      }
    }
  }
  wireframeLayer.updatePixels();
  var buEdges = edgedetection(buLayer);
  for (var i = 0; i < buEdges.length; i++) {
    for (var j = 0; j < buEdges[i].length; j++) {
      if (buEdges[i][j] != 0.5) {
        wireframeLayer.set(i, j, color(1 / 3, 1, 1));
      }
    }
  }
  wireframeLayer.updatePixels();
}

function windowResized() {
  createCanvas(windowWidth, windowHeight);

  calculateSizes();
  initialize();
}

function calculateSizes() {
  stimSize = round(min(width, height) * 0.45);
}

function draw() {
  background(0.5);
  isoLayer.background(0.5);
  noisoLayer.background(0.5);

  if (colorChangeMode == 1) {
    //street color isoluminant variants
    var s = 1 / 3;

    var r2fix = 0;
    var b2fix = 0.2;
    var rgbArray = hsb2rgb([s, 1, 1]);

    s1HSBArray = rgb2hsb(isoluminantRGBfixRB(rgbArray, mouseX / width, b2fix));
    s2HSBArray = rgb2hsb(isoluminantRGBfixRB(rgbArray, r2fix, mouseY / height));

    s1 = color(s1HSBArray[0], s1HSBArray[1], s1HSBArray[2]);
    s2 = color(s2HSBArray[0], s2HSBArray[1], s2HSBArray[2]);

    var controlLimits = isoluminantRGBfixRBControlLimits(rgbArray, r2fix, b2fix);
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
    var b = 0;

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
        if (round(rBU) == 0) { //breakup
          isoLayer.set(i, j, b1);
        }
        else {
          isoLayer.set(i, j, b2);
        }
        noisoLayer.set(i, j, b2);
      }
      if (round(rHG) == 1) {
        if (round(rBU) == 0) {//breakup
          isoLayer.set(i, j, s1);
        }
        else {
          isoLayer.set(i, j, s2);
        }
        noisoLayer.set(i, j, s2);
      }
    }
  }
  isoLayer.updatePixels();
  noisoLayer.updatePixels();

  image(buLayer, width * 0.5, height * 0.5 - stimSize);
  image(wireframeLayer, width * 0.5 - stimSize, height * 0.5 - stimSize);
  image(noisoLayer, width * 0.5 - stimSize, height * 0.5);
  image(isoLayer, width * 0.5, height * 0.5);
}

function keyPressed() {
  if (key == 's' || key == 'S') {
    colorChangeMode++;
    colorChangeMode %= 3;
  }

  if (key == 'e' || key == 'E') {
    loadPixels();
    get(width * 0.5 - stimSize, height * 0.5 - stimSize, stimSize * 2, stimSize * 2).save("isoluminant_stimulus", "png")
  }
}

function buffer2BW(buffer) {
  for (var i = 0; i < buffer.width; i++) {
    for (var j = 0; j < buffer.height; j++) {
      var pixel = buffer.get(i, j);
      buffer.set(i, j, color(ceil(pixel[0] / 255)));
    }
  }
  buffer.updatePixels();
}

function edgedetection(buffer) {
  var convolvedX = convolve(pixelArrax2imageArray(buffer), [[-1, 0, 1], [-2, 0, 2], [-1, 0, 1]]);
  var convolvedY = convolve(pixelArrax2imageArray(buffer), [[-1, -2, -1], [0, 0, 0], [1, 2, 1]]);

  var edgeArray = [];
  for (var i = 0; i < convolvedX.length; i++) {
    edgeArray[i] = [];
    for (var j = 0; j < convolvedY.length; j++) {
      if ((convolvedX[i][j] + convolvedY[i][j]) / 2 != 0.5) {
        edgeArray[i][j] = 1;
      }
      else {
        edgeArray[i][j] = 0.5;
      }
    }
  }

  return edgeArray;
}

function pixelArrax2imageArray(buffer) {
  buffer.loadPixels();
  var imageArray = [];

  for (var i = 0; i < buffer.width; i++) {
    imageArray[i] = [];
    for (var j = 0; j < buffer.width; j++) {
      imageArray[i][j] = round(buffer.pixels[4 * (i + buffer.width * j) + 0] / 255);
    }
  }

  return imageArray;
}

function convolve(imageArray, convolutionArray) {
  var convolved = [];

  var maxSum = 1;
  var minSum = 0;
  for (var i = 1; i < imageArray.length - 1; i++) {
    convolved[i - 1] = [];
    for (var j = 1; j < imageArray[i].length - 1; j++) {
      var sum = 0;
      for (var k = 0; k < 3; k++) {
        for (var l = 0; l < 3; l++) {
          sum += imageArray[i + k - 1][j + l - 1] * convolutionArray[k][l];
        }
      }
      convolved[i - 1][j - 1] = sum;
      if (maxSum < sum) {
        maxSum = sum;
      }
      if (sum < minSum) {
        minSum = sum;
      }
    }
  }

  var normalized = [];
  for (var i = 0; i < convolved.length; i++) {
    normalized[i] = [];
    for (var j = 0; j < convolved[i].length; j++) {
      normalized[i][j] = map(convolved[i][j], minSum, maxSum, 0, 1);
    }
  }

  return normalized;
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

function isoluminantRGBfixRBControlLimits(rgbArray1, r2, b2) {
  var r1 = rgbArray1[0];
  var g1 = rgbArray1[1];
  var b1 = rgbArray1[2];
  return [
    1.99331 * (-1 + 0.354027 * b1 - 0.354027 * b2 + g1 + 0.501678 * r1),
    1.99331 * (0.354027 * b1 - 0.354027 * b2 + g1 + 0.501678 * r1),
    2.82464 * (-1 + 0.354027 * b1 + g1 + 0.501678 * r1 - 0.501678 * r2),
    2.82464 * (0.354027 * b1 + g1 + 0.501678 * r1 - 0.501678 * r2)
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