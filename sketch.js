function setup() {
  createCanvas(400, 400);
  colorMode(HSB,1);
  rectMode(CENTER)
  noFill();
  noStroke();
}

function draw() {
  background(1);
  var time = millis();
  fill(map(sin(time/10000),-1,1,0,1),1,1);
  rect(width*0.33,height*0.5,width*0.33,width*0.33);
  fill(map(sin(time/11000),-1,1,0,1),1,1);
  rect(width*0.66,height*0.5,width*0.33,width*0.33);
}