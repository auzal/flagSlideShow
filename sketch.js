let imgs = [];
let indexes = [];
let index = 0;

let tempTexture;

let intervalRange = 15000;
let interval = 10000;
let fadeTime = 2000;
let lastChange = 0;
let waitTime = 2000;

let blurShader;
let opacityControl = 1;
let blurFade = 0;

let blurNoise;


let waiting = false;

//let out = false;




function preload(){
  let blurHorizontalShader = loadShader('assets/base.vert', 'assets/blur.frag');
  let blurVerticalShader = loadShader('assets/base.vert', 'assets/blur.frag');
  for(let i = 0 ; i < 11 ; i++){
    let filename = "assets/slide_" + (i+1) + ".jpg";
    imgs[i] = loadImage(filename);
  }
  blurShader = new Blur(blurHorizontalShader, blurVerticalShader);
}


function setup() {
  createCanvas(windowWidth, windowHeight);
  tempTexture = createGraphics(width,height);
  lastChange = millis();
  blurShader.init();

  blurShader.setBlurAmount(blurFade);
  fadeTime = constrain(fadeTime,0,interval/2);
  console.log("loaded " + imgs.length + " images");
  shuffleIndexes();


}

function draw() {
  controlChange();

  blurNoise = noise(frameCount*0.07);
  blurNoise = blurNoise * 0.5;
  blurShader.setBlurAmount(blurNoise + blurFade);
  background(0,0,0);
  tempTexture.background(0);
  tempTexture.tint(255,opacityControl*255*0.75);
  tempTexture.image(imgs[indexes[index]],0,0,width,height);
  blurShader.apply(tempTexture);
  image(blurShader.getResult(), 0,0, width, height);
  //console.log(blurControl);
}


function controlChange(){
  if(!waiting){
    if(millis() - lastChange > interval){
      
        index ++;
        index = index % imgs.length;
        if(index === 0){
          shuffleIndexes();
        }
        lastChange = millis();
        opacityControl = 0;
        waiting = true;
        console.log("index = " + index);
      
    }


    if(millis() - lastChange < fadeTime){
      opacityControl = map(millis() - lastChange, 0, fadeTime, 0, 1);
    // out = false;
    }else if(millis() - lastChange > interval - fadeTime){
      opacityControl = map(millis() - lastChange, interval - fadeTime, interval, 1, 0);
    // out = true;
    }else{
    // out = false;
    }
  }else{
    if(millis() - lastChange > waitTime){
      waiting = false;
      lastChange = millis();
      interval = random(intervalRange, interval * 1.35);
    }
  }

  
  if(opacityControl < 0.5){
    blurFade = 0.5 - opacityControl;
  }else{
    blurFade = 0;
  }

}



function shuffle(array) {
  let currentIndex = array.length,  randomIndex;

  // While there remain elements to shuffle...
  while (currentIndex != 0) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}

function shuffleIndexes(){
  let temp = [];
  temp = [1,2,3,4,5,6,7,8,9];
  temp = shuffle(temp);
  indexes[0]= 0;
  for(let i = 0 ; i < temp.length; i ++){
    indexes[i+1] = temp[i];
  }
  indexes[10] = 10;
  console.log(indexes);
}