// This prototype is an app for android and iOs phones, which uses
// accelerometer and gyroscoe data to control a loop. 
// The prototype was developed by Mari Lesteberg 
// from Janury - June 2021, supported by RITMO / University of Oslo


// Functioning prototype 1: Tone.js 15. February
// The oscillator version with new code + adding the Tone.js library.


// 11. februar: including the Tone.js to improve sound quality
//1. og 2. mars: creating a loop function
//16. april: making it work for iOS

// 4. may
// visuals update and update with the new and better QOM

// 26. mai

// 9. august:
// working on a new version that is stripped down regarding buttons and attributes. 
// Will try to enable sound to appear instantly, to enable motion sensor when page is 
// loaded

// 18. august
// tidying up, and trying to create a more musical loop rather than random?

// 8. october Finishing the second iteration. applying some viusal feedback.


// Tone.js parameters:
const gainNode = new Tone.Gain().toDestination();

const pitchChange = new Tone.PitchShift().connect(gainNode);
const pingPong = new Tone.PingPongDelay().connect(pitchChange);
pingPong.wet.value = 0.2;
const autoWah = new Tone.Reverb().connect(pingPong);
//reverb.dampening = 1000;

//reverb.wet.value = 0.2;
//const autoWah = new Tone.AutoWah(100, 5, -10).connect(reverb);
//autoWah.Q.value = 9;
//autoWah.wet.value = 0.2;
let buttonOn = false;
let buttonOn2 = false;
let buttonOn3 = false;
let buttonOn4 = false;
let buttonOn5 = false;

let synth4pitch;

    // bass
    let synth0 = new Tone.AMSynth({
        volume: -9,
        oscillator: {
          type: "sine9"
        },
    });

    // harmony
    let synth = new Tone.DuoSynth({
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



      });
    let synth2 = new Tone.Synth({
        volume: -9,
        oscillator: {
          type: "sine3"
        },
        envelope: {
          attack: 0.1,
          decay: 0.3,
          sustain: 0.4,
          release: 0.8,
        }/* ,
        filterEnvelope: {
          attack: 0.01,
          decay: 0.7,
          sustain: 0.1,
          release: 0.8,
          baseFrequency: 300,
          octaves: 4
        } */
      });
  //  const synth3 = new Tone.PluckSynth();
    const synth3 = new Tone.Synth({
        volume: -9,
        oscillator: {
          type: "sine6"
        },
        envelope: {
          attack: 0.1,
          decay: 0.3,
          sustain: 0.4,
          release: 0.5,
        }/* ,
        filterEnvelope: {
          attack: 0.001,
          decay: 0.7,
          sustain: 0.1,
          release: 0.8,
          baseFrequency: 300,
          octaves: 4
        } */
      });

      // melody synth: 
      let synth4 = new Tone.Synth({
        volume: 1,
        oscillator: {
            type: "sine7"
        },
        envelope: {
          attack: 0.1,
          decay: 0.3,
          sustain: 0.4,
          release: 0.5,
        }/* ,
        filterEnvelope: {
          attack: 0.001,
          decay: 0.7,
          sustain: 0.1,
          release: 0.8,
          baseFrequency: 300,
          octaves: 4
        } */
      });

    const synth5 = new Tone.MembraneSynth({
        envelope: {
            attack: 0.9,
            decay: 0.6,
            sustain: 0.4,
            release: 0.5,
          },
       volume: -7
    }).connect(gainNode);

    // Hi hat:
    const synth6 = new Tone.MetalSynth({
        envelope: {
            attack: 0.1,
            decay: 0.2,
            sustain: 0.1,
            release: 0.1,
          },
       volume: -15,
    }
    ).connect(gainNode);


    let synth7 = new Tone.DuoSynth({
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

// Other Variables
let newAcc;
let newAcc2;
// let inverse = true;
let is_running = false;
let demo_button = document.getElementById("start_demo");



gainNode.gain.value = 0.5;
  // Random tone generator 
  const freq = note => 2 ** (note / 12) * 440; // 440 is the frequency of A4
  // the bitwise Or does the same as Math.floor
  //const notes = [-12, -10,  -8, -7,  -5, -3 , -1,0, 2, 4, 5, 7, 9, 11, 12]; // Close to your 100, 400, 1600 and 6300
//   const notes = [7, 9, 12, 14, 16, 19]; 
//   const notes2 = [0, 2, 4,  7, 9, 12]; 
//   const notes3 = [-8, -5, -3 ,0, 2, 4]; 
// const notes3 = [-8, -5, -3 ,0, 2, 4,  7, 9, 12, 14, 16, 19];

const notes3 = [6, 8, 10, 11, 13, 15]; 
const notes2 = [-4, -2, -1,  1, 3, 5]; 
const notes = [-18, -16, -14 ,-13, -11, -9, -7, -6];



const notes3_1 = [5, 7, 9, 10, 12, 14]; 
const notes2_1 = [-5, -3, -2,  0, 2, 4]; 
const notes_1 = [-19, -17, -15 ,-14, -12, -10, -8 ,-7]; 

const pentaNotes3 = [3, 6, 8, 11, 13, 15]; 
const pentaNotes2 = [-8, -6 , -4, -1,  1, 3, 6]; 
const pentaNotes = [-20, -18, -16, -13 ,-11, -8, -6, -4 ,-1]; 

const pentaNotes6 = [7, 9, 12, 14, 16, 19]; 
const pentaNotes5 = [-0, -2 , 4, 7,  9, 12]; 
const pentaNotes4 = [-17, -15, -12 ,-10, -8, -5, -3 , 0]; 

const wholeNotes3 = [10, 12, 14, 16, 18, 20]; 
const wholeNotes2 = [-2 , 0, 2,  4, 6, 8]; 
const wholeNotes = [-20 ,-18, -16, -14, -12 ,-10]; 

const wholeNotes6 = [11, 13, 15, 17, 19, 21]; 
const wholeNotes5 = [-1 , 1, 3,  5, 7, 9]; 
const wholeNotes4 = [-21 ,-19, -17, -15, -13 ,-11]; 

// harmonic scales
const harmNotes3 = [8, 9, 12, 14, 16, 17, 18];
const harmNotes2 = [-2, -1, 2, 4, 6, 7, 8];
const harmNotes = [-12, -11, -8, -6, -4, -3, -2]



  let randomArray = [];
  let randomArray2 = [];
  let randomArray3 = [];
  let randomArray6 = [];
  let randomHiHatArray = [];
  let randomDrumArray = [];
  let randomMelodyArray = [];

  // creating a random rhythm
  function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }

  function getRandomInt2(max) {
    return Math.floor(Math.random() * max);
  }

 



  const random0 = getRandomInt(15) + 2;
  const randomScale = getRandomInt(14);
  const randomTimbre = getRandomInt2(8);
  const randomTimbre2 = getRandomInt2(8);
  const randomTimbre3 = getRandomInt2(8);
  const randomTempo = getRandomInt(12);

  console.log(randomTimbre);
  console.log(randomTimbre2);
  console.log(randomTimbre3);
  if ((randomTimbre == 0) || ( randomTimbre == 7 ))
  synth4.oscillator.type = "fmsine";
  else if ((randomTimbre == 1) || ( randomTimbre == 6 ))
  synth4.oscillator.type = "pwm";
  else if ((randomTimbre == 2) || ( randomTimbre == 5 ))
  synth4.oscillator.type = "pulse";
  else if ((randomTimbre == 3) || ( randomTimbre == 4 ))
  synth4 = new Tone.Sampler({
    urls: {
      Ab3: "samples/2Ab3.mp3",
      Ab2: "samples/2Ab2.mp3",
    },
  
  
  });
  //console.log(randomTimbre, synth4.oscillator.type);


// Random musical instrument:

if ((randomTimbre2 == 0) || ( randomTimbre2 == 7 ))
synth = new Tone.Sampler({
	urls: {
		A1: "A1.mp3",
		A2: "A2.mp3",
	},
	baseUrl: "https://tonejs.github.io/audio/casio/",

}),

synth0 = new Tone.Sampler({
	urls: {
		A1: "A1.mp3",
		A2: "A2.mp3",
	},
	baseUrl: "https://tonejs.github.io/audio/casio/",

});

else if ((randomTimbre2 == 1) || ( randomTimbre2 == 6 ))
synth = new Tone.Sampler({
	urls: {
		Ab3: "samples/Ab3.mp3",
		Db3: "samples/Db3.mp3",
	},


}),

synth0 = new Tone.Sampler({
	urls: {
		Ab3: "samples/Ab3.mp3",
		Db3: "samples/Db3.mp3",
	},


});
else if ((randomTimbre2 == 2) || ( randomTimbre2 == 5 ))
synth = new Tone.Sampler({
	urls: {
		Ab3: "samples/2Ab3.mp3",
		Ab2: "samples/2Ab2.mp3",
	},


}),

synth0 = new Tone.Sampler({
	urls: {
		Ab3: "samples/2Ab3.mp3",
		Ab2: "samples/2Ab2.mp3",
	},


});
else if ((randomTimbre2 == 3) || ( randomTimbre2 == 4 ))
synth = new Tone.Sampler({
	urls: {
		G1: "samples/3G1.mp3",
		G2: "samples/3G2.mp3",
	},


}),

synth0 = new Tone.Sampler({
	urls: {
		G1: "samples/3G1.mp3",
		G2: "samples/3G2.mp3",
	},


});
//console.log(randomTimbre, synth4.oscillator.type);

if ((randomTempo == 0) || ( randomTempo == 5 ))
Tone.Transport.bpm.value = 40;
  else if ((randomTempo == 1) || ( randomTempo == 6 ))
  Tone.Transport.bpm.value = 60;
  else if ((randomTempo == 2) || ( randomTempo == 7 ))
  Tone.Transport.bpm.value = 90;
  else if ((randomTempo == 3) || ( randomTempo == 8 ))
  Tone.Transport.bpm.value = 120;
  else if ((randomTempo == 4) || ( randomTempo == 9 ))
  Tone.Transport.bpm.value = 50;
  



  document.getElementById("timeSign").innerHTML =
  "Time signature: " + "<br>" + random0 + " / 16";

  document.getElementById("tempo").innerHTML =
  "BPM: " + "<br>" + Tone.Transport.bpm.value;

  let scaleNotes = [];
  let scaleNotes2 = [];
  let scaleNotes3 = [];

  if ((randomScale == 0) || ( randomScale == 13 ))
  scaleNotes = pentaNotes,
  scaleNotes2 = pentaNotes2,
  scaleNotes3 = pentaNotes3,
  document.getElementById("scale").innerHTML =
  "Scale: pentatone";
  else if ((randomScale == 1) || ( randomScale == 12 ))
  scaleNotes = wholeNotes,
  scaleNotes2 = wholeNotes2,
  scaleNotes3 = wholeNotes3,
  document.getElementById("scale").innerHTML =
  "Scale: wholetone";
  else if ((randomScale == 2) || ( randomScale == 11 ))
  scaleNotes = notes_1,
  scaleNotes2 = notes2_1,
  scaleNotes3 = notes3_1,
  document.getElementById("scale").innerHTML =
  "Scale: diatonic2";
  else if ((randomScale == 3) || ( randomScale == 10 ))
  scaleNotes = harmNotes,
  scaleNotes2 = harmNotes2,
  scaleNotes3 = harmNotes3,
  document.getElementById("scale").innerHTML =
  "Scale: double harmonic";

  else if ((randomScale == 4) || ( randomScale == 9 ))
  scaleNotes = notes,
  scaleNotes2 = notes2,
  scaleNotes3 = notes3,
  document.getElementById("scale").innerHTML =
  "Scale: diatonic";

  else if ((randomScale == 5) || ( randomScale == 8 ))
  scaleNotes = wholeNotes4,
  scaleNotes2 = wholeNotes5,
  scaleNotes3 = wholeNotes6,
  document.getElementById("scale").innerHTML =
  "Scale: wholetone2";
  //console.log(random0);
  

  else if ((randomScale == 6) || ( randomScale == 7 ))
  scaleNotes = pentaNotes4,
  scaleNotes2 = pentaNotes5,
  scaleNotes3 = pentaNotes6,
  document.getElementById("scale").innerHTML =
  "Scale: pentatone2";
  //console.log(random0);
  

  function createRandomness() {
   
    for (var i = 0; i < random0; i += 1) {

      const randomNote = () => scaleNotes[Math.random() * scaleNotes.length | 0]; 
  
      let random = freq(randomNote());
      randomArray.push(random);
  
  
      const randomNote2 = () => scaleNotes2[Math.random() * scaleNotes2.length | 0]; 
     let random2 = freq(randomNote2());
     randomArray2.push(random2);
  
     const randomNote3 = () => scaleNotes3[Math.random() * scaleNotes3.length | 0]; 
     let random3 = freq(randomNote3());
     randomArray3.push(random3);
     console.log(randomArray);
     console.log(random);

     const randomNote6 = () => scaleNotes[Math.random() * scaleNotes.length | 0]; 
     let random6 = freq(randomNote6());
     randomArray6.push(random6);

     
   

     let random4 = getRandomInt(10);
     let random5 = getRandomInt(14);
     let randomMelody = getRandomInt(14);

      if (random4 < 4)
      randomHiHatArray.push(("C1 C1").split(" ")),
      randomMelodyArray.push(random);
      if (random4 == 1)
      randomHiHatArray.push(("C1 C1").split(" ")),
      randomMelodyArray.push((0 + " " + random).split(" "));
      if (random4 > 7)
      randomHiHatArray.push(("C2 C2").split(" ")),
      randomMelodyArray.push((random + " " + random6).split(" "));

      if (random4 == 6)
      randomHiHatArray.push("C1"),
      randomMelodyArray.push(random6);

      if (random4 == 5)
      randomHiHatArray.push("C1"),
      randomMelodyArray.push((random6 + " " + random6).split(" "));

      if (random4 == 4)
      randomHiHatArray.push(("C1").split(" ")),
      randomMelodyArray.push((random + " " + random2).split(" "));

      else
      randomHiHatArray.push("C1"),
      randomMelodyArray.push((random + " " + random2 + " " + random6).split(" "));

      if (random5 > 10)
      randomDrumArray.push(("C1 C1").split(" "));
      if (random5 == 1)
      randomDrumArray.push(("C1 C1 C1").split(" "));
      if (random5 > 8)
      randomDrumArray.push("F2");
      if (random5 > 4)
      randomDrumArray.push(("C1 F2").split(" "));
      else
      randomDrumArray.push("C1")



  };


                  
  }




/* var pattern = new Tone.Pattern(function(time, note){
	synth.triggerAttackRelease(note, 0.5);
}, randomArray);
var pattern2 = new Tone.Pattern(function(time, note){
	synth2.triggerAttackRelease(note, 0.5);
}, randomArray2);
var pattern3 = new Tone.Pattern(function(time, note){
	synth3.triggerAttackRelease(note, 0.5);
}, randomArray3);

var pattern5 = new Tone.Pattern(function(time, note){
	synth5.triggerAttackRelease(note, 0.5);
}, ["C1", ["D1", "D1"], "E3", "C1"]);

pattern.start();
pattern2.start();
pattern3.start();
pattern5.start();
pattern.mute = false;
pattern2.mute = true;
pattern3.mute = true;
pattern5.mute = false; */


// With this function the values won't go below a threshold 
function clamp(min, max, val) {
  return Math.min(Math.max(min, +val), max);
}

//Scaling any incoming number
function generateScaleFunction(prevMin, prevMax, newMin, newMax) {
var offset = newMin - prevMin,
    scale = (newMax - newMin) / (prevMax - prevMin);
  return function (x) {
      return offset + scale * x;
      };
};

// function for updating values for sensor data
function updateFieldIfNotNull(fieldName, value, precision=2){
    if (value != null)
      document.getElementById(fieldName).innerHTML = value.toFixed(precision);
  }


  function handleMotion(event) {

    
// variables for rotation, GUI monitoring and volume control
    let xValue = event.acceleration.x; 
    let yValue = event.acceleration.y; 
    let zValue = event.acceleration.z;
    let totAcc = (Math.abs(xValue) + Math.abs(yValue) + Math.abs(zValue));
    let elem = document.getElementById("myAnimation"); 
 

    ///////////////////////////////////////////////
    /////////////// VOLUME VARIABLES //////////////
    ///////////////////////////////////////////////

    // Scaling values for inverted volume-control
    var fn = generateScaleFunction(0.3, 3, 0.9, 0.1);
    newAcc = fn(totAcc);
    newAcc = (clamp(0, 0.9, newAcc));
    let tempo = Math.floor(newAcc * 150);

    // Scaling values for non-inverted volume-control
    var fn2 = generateScaleFunction(0.3, 3, 0, 0.9);
    newAcc2 = fn2(totAcc);
    newAcc2 = (clamp(0, 0.9, newAcc2));
    let tempo2 = Math.floor(newAcc2 * 100);

    // Switch between inverted and non-inverted volume-control, 
    // and visual feedback indicated by the opacity of the element in GUI

    //gainNode.gain.rampTo(newAcc2, 0.1);
    //Tone.Transport.bpm.rampTo(tempo, 0.5);

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
      



    //autoWah.baseFrequency = yDotValues;
    pingPong.delayTime = xDotValues / 100;
   // autoWah.octaves = (xDotValues / 20) + 5;


    ///////////////////////////////////////////////
    /////// Variables for effects and pitch ///////
    ///////////////////////////////////////////////
    // Filter
    var filterScale = generateScaleFunction(-10, 10, 10, 300);
   
        // Effects
        

      //  phaser.frequency.value = xDotValues / 2;
      //  phaser.octaves = (yDotValues / 20);
      //  phaser.wet.value = yDotValues / 100;
      let pingPongYaxis = (yDotValues / 100);
      let pingPongXaxis = xDotValues / 200;
      //pingPong.delayTime.rampTo(pingPongXaxis,pingPongYaxis);
      //pingPong.delayTime.value = pingPongXaxis + "n";
    //  pingPong.feedback.value = pingPongYaxis;
   //   pingPong.wet.value = pingPongXaxis;
     //   pitchShift.pitch = Math.floor(((yDotValues * -1) + 75) / 10);
        
        function myTimeout1() {
          buttonOn = true;
        }
    
        function myTimeout2() {
          buttonOn = false;
        }

        function myTimeout3() {
          buttonOn2 = true;
        }
    
        function myTimeout4() {
          buttonOn2 = false;
        }

        function myTimeout5() {
          buttonOn3 = true;
        }
    
        function myTimeout6() {
          buttonOn3 = false;
        }
    


        // On and off Pattern1
        if ((buttonOn == false) && (yDotValues < 15) && (xDotValues > 75))
        document.getElementById("rectangle6").innerHTML = "Synth1: on",

        synth.connect(autoWah),
        synth0.connect(autoWah),
        rectangle6.style.opacity = 1,
        rectangle6.style.background = "#1100ff52",

        setTimeout(myTimeout1, 2000);
        //updateFieldIfNotNull('pitchwheel', pitchShift.pitch);

        else if ((buttonOn == true) && (yDotValues < 15) && (xDotValues > 75))
        document.getElementById("rectangle6").innerHTML = "Synth1: off",

        synth.disconnect(autoWah),
        synth0.disconnect(autoWah),
        rectangle6.style.opacity = 0.2,
        setTimeout(myTimeout2, 2000);

        if ((buttonOn2 == false) &&(yDotValues < 50) && (yDotValues > 32) && (xDotValues > 75))
        document.getElementById("rectangle7").innerHTML = "Synth2: on",
        synth2.connect(autoWah),
        synth3.connect(autoWah),
        rectangle7.style.opacity = 1,
        rectangle7.style.background = "#1100ff52",
        setTimeout(myTimeout3, 2000);

        else if ((buttonOn2 == true) &&(yDotValues < 50) && (yDotValues > 32) && (xDotValues > 75))
        document.getElementById("rectangle7").innerHTML = "Synth2: off",
        synth2.disconnect(autoWah),
        synth3.disconnect(autoWah),
        rectangle7.style.opacity = 0.2,
        setTimeout(myTimeout4, 2000);


        // On and off Pattern3
        if ((buttonOn3 == false) &&(yDotValues < 80) && (yDotValues > 62) && (xDotValues > 75))
        document.getElementById("rectangle8").innerHTML = "Melody: on",
        synth4.connect(autoWah),
        synth5.connect(autoWah),
        rectangle8.style.opacity = 1,
        rectangle8.style.background = "#1100ff52",
        setTimeout(myTimeout5, 2000);

        else if ((buttonOn3 == true) &&(yDotValues < 80) && (yDotValues > 62) && (xDotValues > 75))
        document.getElementById("rectangle8").innerHTML = "Melody: off",
        synth4.disconnect(autoWah),
        synth5.disconnect(autoWah),
        rectangle8.style.opacity = 0.2,
        setTimeout(myTimeout6, 2000);

/*         // On and off Pattern2
        if ((yDotValues < 50) && (yDotValues > 32) && (xDotValues > 75))
        pattern2.mute = true;

        else if ((yDotValues > 80) && (xDotValues < 80))
        pattern2.mute = false;

    
        // On and off Pattern3
        if ((yDotValues < 80) && (yDotValues > 62) && (xDotValues > 75))
        pattern3.mute = false;

        else if (yDotValues > 100)
        pattern3.mute = true; */


        let gainValue = (((event.accelerationIncludingGravity.y * -1)  + 10) / 50);
        synth4pitch = Math.abs((yDotValues * -1) * 2);

        pitchChangePitch = Math.floor((yDotValues / 2) - 25);


       // gainNode.gain.rampTo(gainValue, 0.3);
        

    }
 


    document.getElementById("looper1").addEventListener("click", function() {
          if(this.className == ''){
          
                   // Request permission for iOS 13+ devices
                   if (
                    DeviceMotionEvent &&
                    typeof DeviceMotionEvent.requestPermission === "function"
                  ) {
                    DeviceMotionEvent.requestPermission();
                  }
      


      this.className = "is-playing";
      this.innerHTML = "";
      


      const seq0 = new Tone.Sequence((time, note) => {
        synth0.triggerAttackRelease(note, 2, time);
        // subdivisions are given as subarrays
    }, randomArray).start(0);
    seq0.playbackRate = 0.5;
    
    const seq = new Tone.Sequence((time, note) => {
        synth.triggerAttackRelease(note, 2, time);
        // subdivisions are given as subarrays
    }, randomArray).start(0);
    seq.playbackRate = 0.5;
    
    const seq2 = new Tone.Sequence((time, note) => {
       synth2.triggerAttackRelease(note, 0.8, time);
       // subdivisions are given as subarrays
    }, randomArray2).start(0);
    
    const seq3 = new Tone.Sequence((time, note) => {
       synth3.triggerAttackRelease(note, 0.8, time);
       // subdivisions are given as subarrays
    }, randomArray3).start(0);
    
    const seq4 = new Tone.Sequence((time, note) => {
    synth4.triggerAttackRelease(note, 0.3, time);
    // subdivisions are given as subarrays
    }, randomMelodyArray).start(0);
    seq4.playbackRate = 0.5;
    
    const pattern6 = new Tone.Sequence(function(time, note){
    synth6.triggerAttackRelease(note, 0.9);
    }, randomHiHatArray).start();
    pattern6.playbackRate = 0.5;
    
    const pattern5 = new Tone.Sequence(function(time, note){
    synth5.triggerAttackRelease(note, 0.9);
    }, randomDrumArray).start();
    pattern5.playbackRate = 0.5;

      window.addEventListener("devicemotion", handleMotion);
      Tone.Transport.start();
      Tone.start();
}
          else{

            function myFunction() {
              pitchChange.pitch = 0;
            }


    pitchChange.pitch = pitchChangePitch,
     setTimeout(myFunction, 2000);
       


    
  }}
  );



