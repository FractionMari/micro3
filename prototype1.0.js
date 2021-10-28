// Tone.js parameters:
const gainNode = new Tone.Gain().toDestination();
const pingPong = new Tone.PingPongDelay().connect(gainNode);
const phaser = new Tone.Phaser().connect(gainNode);
const autoWah = new Tone.AutoWah(50, 6, -30).connect(gainNode);

let buttonOn = 3;
let buttonOn2 = false;
let buttonOn3 = false;
let buttonOn4 = false;
let buttonOn5 = false;



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


//const synth = new Tone.FMSynth().connect(gainNode);
//const synth2 = new Tone.DuoSynth().connect(gainNode);

// Other Variables
let newAcc;
let newAcc2;
let inverse = false;
let is_running = false;
let demo_button = document.getElementById("start_demo");


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

// Scales
var scaleSelect = ["G1", "A1","C2", "D2", "F2", "G2", "A2","C3", "D3", "F3", "G3", "A3","C4", "D4", "F4", "G4", "A4", "C5", "D5", "F5", "G5", "A5", "C6"];

// Function for shifting pitch
function pitchShift (pitch, instrument, scale) {
  // const intervalChange = 1;
//   const points = Math.floor(pitch / intervalChange);
const points = pitch;

  if (points >= 20)
  instrument.frequency.value = scale[19];
  else if (points >= 19)
  instrument.frequency.value = scale[18];
  else if (points >= 18)
  instrument.frequency.value = scale[17];
  else if (points >= 17)
  instrument.frequency.value = scale[16];
  else if (points >= 16)
  instrument.frequency.value = scale[15];
  else if (points >= 15)
  instrument.frequency.value = scale[14];
  else if (points >= 14)
  instrument.frequency.value = scale[13];
  else if (points >= 13)
  instrument.frequency.value = scale[12];
  else if (points >= 12)
  instrument.frequency.value = scale[11];
  else if (points >= 11)
  instrument.frequency.value = scale[10];
  else if (points >= 10)
  instrument.frequency.value = scale[9];
  else if (points >= 9)
  instrument.frequency.value = scale[8];  
  else if (points >= 8)
  instrument.frequency.value = scale[7];
  else if (points >= 7)
  instrument.frequency.value = scale[6];
  else if (points >= 6)
  instrument.frequency.value = scale[5];
  else if (points >= 5)
  instrument.frequency.value = scale[4];
  else if (points >= 4)
  instrument.frequency.value = scale[3];
  else if (points >= 3)
  instrument.frequency.value = scale[2];
  else if (points >= 2)
  instrument.frequency.value = scale[1]; 
  else if (points >= 1)
  instrument.frequency.value = scale[0];
      
}


// function for updating values for sensor data
function updateFieldIfNotNull(fieldName, value, precision=2){
    if (value != null)
      document.getElementById(fieldName).innerHTML = value.toFixed(precision);
  }

// Function for handling motion
  function handleMotion(event) {

    // variables for rotation, GUI monitoring and volume control
    let xValue = event.acceleration.x; 
    let yValue = event.acceleration.y; 
    let zValue = event.acceleration.z;
    let totAcc = (Math.abs(xValue) + Math.abs(yValue) + Math.abs(zValue));
    let elem = document.getElementById("myAnimation"); 
    let filterWheel = event.accelerationIncludingGravity.x;
    let pitchWheel = event.accelerationIncludingGravity.y;
    
    // Updating values to HTML
    updateFieldIfNotNull('test_x', event.acceleration.x);
    updateFieldIfNotNull('test_y', event.acceleration.y);
    updateFieldIfNotNull('test_z', event.acceleration.z);
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

    updateFieldIfNotNull('volume_acc', newAcc);
    updateFieldIfNotNull('volume_acc2', newAcc2);
    // Switch between inverted and non-inverted volume-control, 
    // and visual feedback indicated by the opacity of the element in GUI
    if (inverse == false)
    gainNode.gain.rampTo(newAcc2, 0.2);
    //elem.style.opacity = newAcc2; //Uncomment to map the opacity of red dot to motion
    else
    // more smooth change of volume:
    gainNode.gain.rampTo(newAcc, 0.2);
    //elem.style.opacity = newAcc; //Uncomment to map the opacity of red dot to motion
       
    ////////////////////////////////////////////
    ///////// Red Dot Monitoring in GUI ///////
    ///////////////////////////////////////////

    // multiplying with 5 to get values from 0-100
    let xDotValues = (((event.accelerationIncludingGravity.x * -1) + 10) * 5);
    // multiplying with 5 to get values from 0-100
    let yDotValues = ((event.accelerationIncludingGravity.y  + 10) * 5);
    elem.style.top = yDotValues + '%'; 
    elem.style.left = xDotValues + '%'; 

 


    updateFieldIfNotNull('x_dots', xDotValues);
    updateFieldIfNotNull('y_dots', yDotValues);

    ///////////////////////////////////////////////
    /////// Variables for effects and pitch ///////
    ///////////////////////////////////////////////
    // FX2: Filter

    // filter x axis a number between 0 and 8
    let filterXaxis = yDotValues / 8;
/*     var filterScale = generateScaleFunction(-10, 10, 0, 100);
    filterWheel = Math.abs(filterWheel);
    filterWheel = filterScale(filterWheel); */
    // Gives a value between 0 and 6.5
    filterWheel = (filterWheel + 10) / 3;
    updateFieldIfNotNull('filterwheel', filterWheel);
    //autoWah.baseFrequency = filterWheel;
    autoWah.octaves = filterWheel;
    autoWah.Q.value = filterXaxis;

    // Pitch and scale functions
    // Will give a range from 0-20
    pitchWheel = (pitchWheel * -1) + 10;
    updateFieldIfNotNull('pitchwheel', pitchWheel);
    pitchShift(pitchWheel, synth, scaleSelect);
    pitchShift(pitchWheel, synth2, scaleSelect);
    pitchShift(pitchWheel, synth3, scaleSelect);

    // Effects
    
    
    //let harmonicity = pitchWheel / 10;
    //updateFieldIfNotNull('harmonicity', harmonicity);
    //synth2.harmonicity.value = harmonicity;
    phaser.baseFrequency.value = 100;
    phaser.frequency.value = xDotValues;
    phaser.octaves = (yDotValues / 10);

    


    // FX1: pingPong delay
    // for y axis effect, get a value between 0-1
    let pingPongYaxis = (yDotValues / 80);
    let pingPongXaxis = xDotValues / 100;
    //pingPong.delayTime.rampTo(pingPongXaxis,pingPongYaxis);
    //pingPong.delayTime.value = pingPongXaxis + "n";
    pingPong.feedback.value = pingPongYaxis;
    pingPong.wet.value = pingPongXaxis;
    //tremolo.frequency = yDotValues;
    function myTimeout1() {
      buttonOn = 1;
    }

    function myTimeout2() {
      buttonOn = 2;
    }

    function myTimeout3() {
      buttonOn = 3;
    }

    if ((buttonOn == 3) && (yDotValues > 73) && (xDotValues < 33))
    document.getElementById("rectangle").innerHTML = "Scale: 2",
 
    scaleSelect = ["C2", "D2", "E2", "F2", "G2", "A2", "B2", "C3", "D3", "E3", "F3", "G3", "A3", "B3", "C4", "D4", "E4", "F4", "G4", "A4", "B4", "C5", "D5", "E5", "F5"],
    rectangle.style.opacity = 1,
    rectangle.style.background = "#1100ff52",
    setTimeout(myTimeout1, 2000);


    else if 
    ((buttonOn == 1) && (yDotValues > 73) && (xDotValues < 33))
    document.getElementById("rectangle").innerHTML = "Scale: 3",
    scaleSelect = ["C2", "D2", "E2", "Gb2", "Ab2", "Bb2", "C3", "D3", "Gb3", "Ab3", "Bb3", "C4", "D4", "E4", "Gb4", "Ab4", "Bb4", "C5", "D5", "E5", "Gb5", "Ab5", "Bb5", "C6"],
    rectangle.style.opacity = 1,
    rectangle.style.background = "#00ff1552",
    setTimeout(myTimeout2, 2000);


    else if 
    ((buttonOn == 2) && (yDotValues > 73) && (xDotValues < 33))
    document.getElementById("rectangle").innerHTML = "Scale: 1",
    scaleSelect = ["G1", "A1","C2", "D2", "F2", "G2", "A2","C3", "D3", "F3", "G3", "A3","C4", "D4", "F4", "G4", "A4", "C5", "D5", "F5", "G5", "A5", "C6"],
    rectangle.style.opacity = 1,
    rectangle.style.background = "#fffb0052",
    setTimeout(myTimeout3, 2000);


    function myTimeout4() {
      buttonOn2 = false;
    }

    function myTimeout5() {
      buttonOn2 = true;
    }



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

    // Effects on and off

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
      //const synth = new Tone.AMSynth().connect(gainNode);


      synth2.triggerRelease();
      synth.triggerAttack("C4"); 


      window.addEventListener("devicemotion", handleMotion);
      is_running = true;    
  
    }}
    );




let fx1on = false;
let fx2on = false;
let fx3on = false;
