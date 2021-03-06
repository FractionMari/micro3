/* 

MIT License

Copyright (c) 2021 Mari Lesteberg

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.*/


// This is the third iteration of the Micro prototypes that were developed for
// the Micro project at RITMO Centre for Interdisciplinary Studies in Rhythm, 
// Time and Motion at the University of Oslo and later used as a part of a 
// Master thesis.

// This prototype is an app for android and iOs phones, which uses
// accelerometer and gyroscope data to play notes and activate effects.
// The prototype was developed by Mari Lesteberg 

// from Janury - June 2021, supported by RITMO / University of Oslo
// From June - December 2021 further developed as as part of a Master's thesis.


// userAgent for detection of operating system
var userAgent = navigator.userAgent || navigator.vendor || window.opera;


// Tone.js parameters:
const gainNode = new Tone.Gain().toDestination();
const pingPong = new Tone.PingPongDelay().connect(gainNode);
const phaser = new Tone.Phaser().connect(gainNode);
const autoWah = new Tone.AutoWah(50, 6, -30).connect(gainNode);


// Synths

// synth 1
const synth = new Tone.DuoSynth({
  volume: -19,
  voice0: {
      oscillator: {
          type: "fmsawtooth",
        },
      envelope: {
          attack: 0.9,
          decay: 0.3,
          sustain: 1,
          release: 0.9,
      },
      filter: {
          Q: 17,
          frequency: 850,
      },
  },

  voice1: {
      oscillator: {
          type: "pulse",
        },
  },
}).connect(gainNode);

// synth 2
const synth2 = new Tone.Synth({
  volume: -9,
  oscillator: {
    type: "sine6"
  },
  envelope: {
    attack: 0.1,
    decay: 0.3,
    sustain: 0.4,
    release: 0.5,
  }
}).connect(gainNode);

// synth 3
const synth3 = new Tone.Synth({
  volume: -9,
  oscillator: {
    type: "square6"
  },
  envelope: {
    attack: 0.1,
    decay: 0.3,
    sustain: 0.4,
    release: 0.5,
  }
}).connect(gainNode);

// Scales
var scaleSelect = ["G1", "A1","C2", "D2", "F2", "G2", "A2","C3", "D3", "F3", "G3", "A3","C4", "D4", "F4", "G4", "A4", "C5", "D5", "F5", "G5", "A5", "C6"];

// Other Variables
let newAcc;
let newAcc2;
let inverse = false;
let is_running = false;
let demo_button = document.getElementById("start_demo");

// variables for button on and off
let buttonOn = 3;
let buttonOn2 = false;
let buttonOn3 = false;
let buttonOn4 = false;
let buttonOn5 = false;


// With this function the values won't go below a threshold  (borrowed from this StackOverflow conversation: https://stackoverflow.com/questions/5842747/how-can-i-use-javascript-to-limit-a-number-between-a-min-max-value/54464006)
function clamp(min, max, val) {
  return Math.min(Math.max(min, +val), max);
}

//Scaling any incoming number (borrowed from this StackOverflow conversation: https://stackoverflow.com/questions/36387135/scale-changing-number-to-a-range-using-javascript)
function generateScaleFunction(prevMin, prevMax, newMin, newMax) {
var offset = newMin - prevMin,
    scale = (newMax - newMin) / (prevMax - prevMin);
  return function (x) {
      return offset + scale * x;
      };
};


// Function for shifting pitch
function pitchShift (pitch, instrument, scale) {

const points = pitch;

  if (points >= 20)
  instrument.frequency.value = scale[19],
  document.getElementById("synthNote").innerHTML = scale[19];
  else if (points >= 19)
  instrument.frequency.value = scale[18],
  document.getElementById("synthNote").innerHTML = scale[18];
  else if (points >= 18)
  instrument.frequency.value = scale[17],
  document.getElementById("synthNote").innerHTML = scale[17];
  else if (points >= 17)
  instrument.frequency.value = scale[16],
  document.getElementById("synthNote").innerHTML = scale[16];
  else if (points >= 16)
  instrument.frequency.value = scale[15],
  document.getElementById("synthNote").innerHTML = scale[15];
  else if (points >= 15)
  instrument.frequency.value = scale[14],
  document.getElementById("synthNote").innerHTML = scale[14];
  else if (points >= 14)
  instrument.frequency.value = scale[13],
  document.getElementById("synthNote").innerHTML = scale[13];
  else if (points >= 13)
  instrument.frequency.value = scale[12],
  document.getElementById("synthNote").innerHTML = scale[12];
  else if (points >= 12)
  instrument.frequency.value = scale[11],
  document.getElementById("synthNote").innerHTML = scale[11];
  else if (points >= 11)
  instrument.frequency.value = scale[10],
  document.getElementById("synthNote").innerHTML = scale[10];
  else if (points >= 10)
  instrument.frequency.value = scale[9],
  document.getElementById("synthNote").innerHTML = scale[9];
  else if (points >= 9)
  instrument.frequency.value = scale[8],
  document.getElementById("synthNote").innerHTML = scale[8]; 
  else if (points >= 8)
  instrument.frequency.value = scale[7],
  document.getElementById("synthNote").innerHTML = scale[7];
  else if (points >= 7)
  instrument.frequency.value = scale[6],
  document.getElementById("synthNote").innerHTML = scale[6];
  else if (points >= 6)
  instrument.frequency.value = scale[5],
  document.getElementById("synthNote").innerHTML = scale[5];
  else if (points >= 5)
  instrument.frequency.value = scale[4],
  document.getElementById("synthNote").innerHTML = scale[4];
  else if (points >= 4)
  instrument.frequency.value = scale[3],
  document.getElementById("synthNote").innerHTML = scale[3];
  else if (points >= 3)
  instrument.frequency.value = scale[2],
  document.getElementById("synthNote").innerHTML = scale[2];
  else if (points >= 2)
  instrument.frequency.value = scale[1],
  document.getElementById("synthNote").innerHTML = scale[1];
  else if (points >= 1)
  instrument.frequency.value = scale[0],
  document.getElementById("synthNote").innerHTML = scale[0];
      
}


// function for updating values for sensor data
function updateFieldIfNotNull(fieldName, value, precision=2){
    if (value != null)
      document.getElementById(fieldName).innerHTML = value.toFixed(precision);
  }

// Function for handling motion
  function handleMotion(event) {

    ////////////////////////////////////////////
    ///////// Blue Dot Monitoring in GUI ///////
    ///////////////////////////////////////////
   

   // iOs devices flip the gyroscope axis, so thanks to this thread to be able to adapt
   // to diffrent OSes:
    // https://stackoverflow.com/questions/21741841/detecting-ios-android-operating-system
    //// Both x and Y axis: multiplying with 5 to get values from 0-100 ////

    let xDotValues;
    let yDotValues;
    let zValue;
    let pitchWheel = event.accelerationIncludingGravity.y;

  if (/windows phone/i.test(userAgent)) {
    xDotValues = ((event.accelerationIncludingGravity.x + 10) * 5);
    yDotValues = (((event.accelerationIncludingGravity.y * -1)  + 10) * 5);
    zValue = event.acceleration.z - 0.3;
    pitchWheel = pitchWheel + 10;
  }

  if (/android/i.test(userAgent)) {
    xDotValues = ((event.accelerationIncludingGravity.x + 10) * 5);
    yDotValues = (((event.accelerationIncludingGravity.y * -1)  + 10) * 5);
    zValue = event.acceleration.z - 0.3;
    pitchWheel = pitchWheel + 10;
  }

  // iOS detection from: http://stackoverflow.com/a/9039885/177710
  if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
    xDotValues = (((event.accelerationIncludingGravity.x * -1) + 10) * 5);
    yDotValues = ((event.accelerationIncludingGravity.y  + 10) * 5);
    zValue = event.acceleration.z;
    pitchWheel = (pitchWheel * -1) + 10;
  }


    // variables for rotation, GUI monitoring and volume control
    let xValue = event.acceleration.x; 
    let yValue = event.acceleration.y; 
    
    // this variable calculate the total quantity of motion:
    let totAcc = (Math.abs(xValue) + Math.abs(yValue) + Math.abs(zValue));
    let elem = document.getElementById("myAnimation"); 

    
    
    // Updating values to HTML
    updateFieldIfNotNull('test_x', xValue);
    updateFieldIfNotNull('test_y', yValue);
    updateFieldIfNotNull('test_z', zValue);
    updateFieldIfNotNull('total_acc', totAcc);

    updateFieldIfNotNull('Accelerometer_gx', event.accelerationIncludingGravity.x);
    updateFieldIfNotNull('Accelerometer_gy', event.accelerationIncludingGravity.y);
    updateFieldIfNotNull('Accelerometer_gz', event.accelerationIncludingGravity.z);

    ///////////////////////////////////////////////
    /////////////// VOLUME VARIABLES //////////////
    ///////////////////////////////////////////////

    // Scaling values for inverted volume-control
    var fn = generateScaleFunction(0.3, 0.6, 0.7, 0);
    newAcc = fn(totAcc);
    newAcc = (clamp(0, 0.7, newAcc));

    // Scaling values for non-inverted volume-control
    var fn2 = generateScaleFunction(0.3, 0.6, 0, 0.7);
    newAcc2 = fn2(totAcc);
    newAcc2 = (clamp(0, 0.7, newAcc2));



    // Switch between inverted and non-inverted volume-control, 
    // and visual feedback indicated by the opacity of the element in GUI
    if (inverse == false)
    gainNode.gain.rampTo(newAcc2, 0.3);
    //elem.style.opacity = newAcc2; //Uncomment to map the opacity of blue dot to motion
    else
    // more smooth change of volume:
    gainNode.gain.rampTo(newAcc, 0.3);
    //elem.style.opacity = newAcc; //Uncomment to map the opacity of blue dot to motion
       

    elem.style.top = yDotValues + '%'; 
    elem.style.left = xDotValues + '%'; 


    // Updating values to HTML
    updateFieldIfNotNull('volume_acc', newAcc);
    updateFieldIfNotNull('volume_acc2', newAcc2);
    updateFieldIfNotNull('x_dots', xDotValues);
    updateFieldIfNotNull('y_dots', yDotValues);

    ///////////////////////////////////////////////
    /////// Variables for effects and pitch ///////
    ///////////////////////////////////////////////
  
    // filter x axis a number between 0 and 8
    let filterWheel = event.accelerationIncludingGravity.x;
    let filterXaxis = yDotValues / 8;
    // Gives a value between 0 and 6.5
    filterWheel = (filterWheel + 10) / 3;
    
    // Autowah effects
    autoWah.octaves = filterWheel;
    autoWah.Q.value = filterXaxis;

    // Phaser effects
    phaser.baseFrequency.value = 100;
    phaser.frequency.value = xDotValues;
    phaser.octaves = (yDotValues / 10);

    // PingPong effects
    let pingPongYaxis = (yDotValues / 80);
    let pingPongXaxis = xDotValues / 100;

    pingPong.feedback.value = pingPongYaxis;
    pingPong.wet.value = pingPongXaxis;


    // Selection of pitch based on selected scale and instrument:
    pitchShift(pitchWheel, synth, scaleSelect);
    pitchShift(pitchWheel, synth2, scaleSelect);
    pitchShift(pitchWheel, synth3, scaleSelect);

    // update values to HTML  
    updateFieldIfNotNull('filterwheel', filterWheel);
    updateFieldIfNotNull('pitchwheel', pitchWheel);

    // function for timeout of the air motion "buttons"
    function myTimeout1() {
      buttonOn = 1;
    }

    function myTimeout2() {
      buttonOn = 2;
    }

    function myTimeout3() {
      buttonOn = 3;
    }

    function myTimeout4() {
      buttonOn2 = false;
    }

    function myTimeout5() {
      buttonOn2 = true;
    }

    function myTimeout6() {
      buttonOn3 = false;
    }

    function myTimeout7() {
      buttonOn3 = true;
    }

    function myTimeout8() {
      buttonOn4 = false;
    }

    function myTimeout9() {
      buttonOn4 = true;
    }

    function myTimeout10() {
      buttonOn5 = false;
    }

    function myTimeout11() {
      buttonOn5 = true;
    }



    // function for changing scales with air motion "buttons"
    if ((buttonOn == 3) && (yDotValues > 73) && (xDotValues < 33))
    document.getElementById("rectangle").innerHTML = "Scale: diatonic",
 
    scaleSelect = ["C2", "D2", "E2", "F2", "G2", "A2", "B2", "C3", "D3", "E3", "F3", "G3", "A3", "B3", "C4", "D4", "E4", "F4", "G4", "A4", "B4", "C5", "D5", "E5", "F5"],
    rectangle.style.opacity = 1,
    rectangle.style.background = "#1100ff52",
    setTimeout(myTimeout1, 2000);


    else if 
    ((buttonOn == 1) && (yDotValues > 73) && (xDotValues < 33))
    document.getElementById("rectangle").innerHTML = "Scale: wholetone",
    scaleSelect = ["C2", "D2", "E2", "Gb2", "Ab2", "Bb2", "C3", "D3", "Gb3", "Ab3", "Bb3", "C4", "D4", "E4", "Gb4", "Ab4", "Bb4", "C5", "D5", "E5", "Gb5", "Ab5", "Bb5", "C6"],
    rectangle.style.opacity = 1,
    rectangle.style.background = "#00ff1552",
    setTimeout(myTimeout2, 2000);


    else if 
    ((buttonOn == 2) && (yDotValues > 73) && (xDotValues < 33))
    document.getElementById("rectangle").innerHTML = "Scale: pentatone",
    scaleSelect = ["G1", "A1","C2", "D2", "F2", "G2", "A2","C3", "D3", "F3", "G3", "A3","C4", "D4", "F4", "G4", "A4", "C5", "D5", "F5", "G5", "A5", "C6"],
    rectangle.style.opacity = 1,
    rectangle.style.background = "#fffb0052",
    setTimeout(myTimeout3, 2000);



    // On and off inverse mode
    if ((buttonOn2 == true) && (yDotValues > 73) && (xDotValues > 58))
    document.getElementById("rectangle2").innerHTML = "Inverse: Off",
    inverse = false,
    rectangle2.style.opacity = 0.2,
    setTimeout(myTimeout4, 2000);


    else if 
    ((buttonOn2 == false) && (yDotValues > 73) && (xDotValues > 58))
    document.getElementById("rectangle2").innerHTML = "Inverse: On",
    inverse = true,
    rectangle2.style.opacity = 1,
    rectangle2.style.background = "#1100ff52",
    setTimeout(myTimeout5, 2000);


    ////////////////////////////////////
    //////// Effects on and off ////////
    ///////////////////////////////////


// ping pong effect
    if ((buttonOn3 == true) && (yDotValues < 20) && (xDotValues > 70))
    document.getElementById("rectangle3").innerHTML = "FX1: OFF",
    synth.disconnect(pingPong),
    synth2.disconnect(pingPong),
    synth3.disconnect(pingPong),
    rectangle3.style.opacity = 0.2,
    setTimeout(myTimeout6, 2000);


    else if 
    ((buttonOn3 == false) && (yDotValues < 13) && (xDotValues > 70))
    document.getElementById("rectangle3").innerHTML = "FX1: ON",
    synth.connect(pingPong),
    synth2.connect(pingPong),
    synth3.connect(pingPong),
    rectangle3.style.opacity = 1,
    rectangle3.style.background = "#1100ff52",
    setTimeout(myTimeout7, 2000);

// auto wah effect
    if ((buttonOn4 == true) && (yDotValues < 30) && (yDotValues > 20) && (xDotValues > 70))
    document.getElementById("rectangle4").innerHTML = "FX2: OFF",
    synth.disconnect(autoWah),
    synth2.disconnect(autoWah),
    synth3.disconnect(autoWah),
    rectangle4.style.opacity = 0.2,

    setTimeout(myTimeout8, 2000);


    else if 
    ((buttonOn4 == false) && (yDotValues < 30) && (yDotValues > 20) && (xDotValues > 70))
    document.getElementById("rectangle4").innerHTML = "FX2: ON",
    synth.connect(autoWah),
    synth2.connect(autoWah),
    synth3.connect(autoWah),
    rectangle4.style.opacity = 1,
    rectangle4.style.background = "#1100ff52",
    setTimeout(myTimeout9, 2000);

// phaser effect
    if ((buttonOn5 == true) && (yDotValues < 50) && (yDotValues > 40) && (xDotValues > 70))
    document.getElementById("rectangle5").innerHTML = "FX3: OFF",
    synth.disconnect(phaser),
    synth2.disconnect(phaser),
    synth3.disconnect(phaser),
    rectangle5.style.opacity = 0.2,
    setTimeout(myTimeout10, 2000);


    else if 
    ((buttonOn5 == false) && (yDotValues < 50) && (yDotValues > 40) && (xDotValues > 70))
    document.getElementById("rectangle5").innerHTML = "FX3: ON",
    synth.connect(phaser),
    synth2.connect(phaser),
    synth3.connect(phaser),
    rectangle5.style.opacity = 1,
    rectangle5.style.background = "#1100ff52",
    setTimeout(myTimeout11, 2000);
    }




// button that fills whole screen
  document.getElementById("looper1").addEventListener("click", function(){

    // Request permission for iOS 13+ devices
    if (
      DeviceMotionEvent &&
      typeof DeviceMotionEvent.requestPermission === "function"
    ) {
      DeviceMotionEvent.requestPermission();
    }
    
    
    if(this.className == 'is-playing3'){
      this.className = "";
      this.innerHTML = "Synth: OFF"
      synth.triggerRelease();
      synth2.triggerRelease();
      synth3.triggerRelease();


      window.removeEventListener("devicemotion", handleMotion);
      is_running = false;

  
    }else if (this.className == 'is-playing2')
        
    {

      this.className = "is-playing";
      this.innerHTML = "Synth 2: ON";

      synth.triggerRelease();
      synth2.triggerAttack("C4"); 
      window.addEventListener("devicemotion", handleMotion);
      is_running = true;  

    }else if (this.className == 'is-playing')
        
    {

      this.className = "is-playing3";
      this.innerHTML = "Synth 3: ON";

      synth2.triggerRelease();
      synth3.triggerAttack("C4"); 
      window.addEventListener("devicemotion", handleMotion);
      is_running = true;  
  
    }else{



      this.className = "is-playing2";
      this.innerHTML = "Synth 1: ON";

      synth2.triggerRelease();
      synth.triggerAttack("C4"); 


      window.addEventListener("devicemotion", handleMotion);
      is_running = true;    
  
    }}
    );


