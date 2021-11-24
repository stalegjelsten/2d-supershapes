let myShape
let liveeqn
let eqn
let plainTeXEqn
let asciiEqn
let canv
let fourierX;
let fourierY;

function setup() {
  canv = createCanvas(400, 400)
  stroke(60)
  strokeWeight(3)
  noFill()
  noLoop()
  let btn = { add:function(){saveCanvas(canv, "supershape", "png")}}
  let btn2 = { add:function(){stopAudio()}}
  liveeqn = createP('')
  liveeqn.position(width/2-170, height);
  myShape = new SuperShape(1, 1, 1, 4, 1, 1, 100)
  let gui = new dat.GUI()
  gui.add(myShape, "m", 0, 20, 0.1).onChange(redraw)
  gui.add(myShape, "n1", -5, 10, 0.1).onChange(redraw)
  gui.add(myShape, "n2", -5, 10, 0.1).onChange(redraw)
  gui.add(myShape, "n3", -5, 10, 0.1).onChange(redraw)
  gui.add(myShape, "a", -5, 10, 0.1).onChange(redraw)
  gui.add(myShape, "b", -5, 10, 0.1).onChange(redraw)
  gui.add(myShape, "circumnavigations", 1, 20, 1).onChange(redraw)
  gui.add(myShape, "radius", 0, 200, 5).onFinishChange(redraw)
  gui.add(btn, "add").name("Save image")
  gui.add(btn2, "add").name("Stop Audio")
  eqn = createP('<img src="https://cdn.jsdelivr.net/gh/stalegjelsten/2d-supershapes@master/svgs/510d395cbc490aab4c993e0d3c901f22.svg?invert_in_darkmode" align=middle width=309.62586269999997pt height=55.85645175pt/></p>')
  eqn.style('align', 'center')
  eqn.position(width/2-170, height+70)
  plainTeXEqn = createP()
  plainTeXEqn.style('width', width+"px")
  plainTeXEqn.style('margin', "15px")
  plainTeXEqn.position(0,height+220)
  asciiEqn = createP()
  asciiEqn.style('width', width+"px")
  asciiEqn.style('margin', "15px")
  asciiEqn.position(0,height+150)
}

class SuperShape {
  constructor(n1, n2, n3, m, a, b, radius) {
    this.n1 = n1
    this.n2 = n2
    this.n3 = n3
    this.m = m
    this.a = a
    this.b = b
    this.r = 1
    this.radius = radius
    this.circumnavigations = 1
    this.equation = ""
    this.asciieq = ""
    this.x = []
    this.y = []
  }

  calcRadius(theta) {
    let p1 = abs(1 / this.a * cos(theta * this.m / 4)) ** this.n2
    let p2 = abs(1 / this.b * sin(theta * this.m / 4)) ** this.n3
    let ans = pow(p1 + p2, 1 / this.n1)
    this.equation = "r = \\left({\\left\\lvert \\frac{\\cos{\\left(\\frac{"+ this.m.toPrecision(2) + "}{4} \\theta\\right)}}{" + this.a + "} \\right\\rvert ^{" + this.n2.toPrecision(2) + "}" 
    this.equation += "+ \\left\\lvert \\frac{\\sin{\\left(\\frac{"+ this.m.toPrecision(2) + "}{4} \\theta\\right)}}{" + this.a + "} \\right\\rvert ^{" + this.n3.toPrecision(2) + "}}\\right)^{-\\frac{1}{" + this.n1.toPrecision(2) + "}}" 
    this.asciieq = "r(theta) = ( |(cos((" + this.m.toPrecision(2) + " theta) / 4)) / " + this.a.toPrecision(2) + "|^(" + this.n2.toPrecision(2) + ") + |(sin((" + this.m.toPrecision(2) + " theta) / 4)) / " + this.b.toPrecision(2) + " |^(" + this.n3.toPrecision(2) + "))^(-1/(" + this.n1.toPrecision(2) + ")"

    if (ans === 0) {
      return 0
    }
    return (1 / ans)
  }

  display() {
    this.x = []
    this.y = []
    _objects = []
    _objCur = []
    let count = 0
    beginShape()
    for (let angle = 0; angle < this.circumnavigations * TWO_PI; angle += 0.02) {
      this.r = this.calcRadius(angle)
      let x1 = this.radius * this.r * cos(angle)
      let y1 = this.radius * this.r * sin(angle)
      count +=1
      if (count == 1) {
        _objCur.push({x: x1, y: y1})
        count = 0
      }
      vertex(x1, y1)
    }
    endShape(CLOSE)
    _objects.push(_objCur)
    // fourierX = dft(this.x);
    // fourierY = dft(this.y);
    
        
    // beginShape()
    // for (let i = 0; i < fourierX.length; i++) {
    //   vertex(fourierX[i], fourierY[i])
    // }
    // endShape(CLOSE)
  
    // fourierX.sort((a, b) => b.amp - a.amp);
    // fourierY.sort((a, b) => b.amp - a.amp);

    katex.render(this.equation, liveeqn.elt)
    asciiEqn.html("Plain ASCII code for the equation: <br /><code>" + this.asciieq + "</code>")
    plainTeXEqn.html("LaTeX code for the equation (can be pasted into GeoGebra): <br /><code>" + this.equation + "</code>")
  }
}

function draw() {
  background(109, 158, 116)
  translate(width / 2, height / 2)
  myShape.display()
  updateAudio()
}

// let oscillatorsX = []
// let oscillatorsY = []
// function updateMyAudio() {
//   oscillatorsX = []
//   oscillatorsY = []
//   for (i = 0; i < fourierX.length; i++) {
//     oscillatorsX.push(new SineOscillator(fourierX[i].amp, fourierX[i].freq, fourierX[i].phase, "x"))
//     oscillatorsY.push(new SineOscillator(fourierY[i].amp, fourierY[i].freq, fourierY[i].phase, "y"))

//   }

// }

var _audioBuf;
var _audioCtx = new (window.AudioContext || window.webkitAudioContext)();
var _freq = 110; 
var _frameCount;
var _source = null;
var _objCur = [];           // An object is an array of points
var _objects = [_objCur];   // Array of objects

var MaxDist = 5;
var OvrSmp = 8;

function updateAudio() {
  if (_source != null) _source.stop();
  _frameCount = Math.round(_audioCtx.sampleRate / _freq);
  _audioBuf = _audioCtx.createBuffer(2, _frameCount, _audioCtx.sampleRate);
  _source = _audioCtx.createBufferSource();

  var bufL = _audioBuf.getChannelData(0);
  var bufR = _audioBuf.getChannelData(1);
  generateWaveFormsFromPoints(bufL, bufR, _frameCount);
  _source.buffer = _audioBuf;
  _source.connect(_audioCtx.destination);
  _source.loop = true;
  _source.start();
}

function getPathLen() {
  var len = 0;
  _objects.forEach(function (obj) {
    for (var i = 0; i < obj.length - 1; ++i) {
      var p0 = obj[i];
      var p1 = obj[i + 1];
      len += Math.sqrt(Math.pow((p1.x-p0.x),2)+Math.pow(p1.y-p0.y,2))
    }
  });
  return len;
}

function interpolateInto(bufOvr, buf, len) {
  var i, j, s, acc = 0;

  // Interpolate
  for (i = 0; i < len; ++i) {
    var posOvr = (i * OvrSmp) - (OvrSmp / 2);
    acc = 0;
    for (j = 0; j < OvrSmp; ++j) {
      var k = posOvr + j;
      s = (k < 0) ? bufOvr[bufOvr.length + k] : bufOvr[k];
      acc += s;
    }
    buf[i] = acc / OvrSmp;
  }
}
function generateWaveFormsFromPoints(buf0, buf1, len) {
  var pos = 0;  // Position in buffers
  var segSmpCnt;

  // Create temporary overampling buffers
  var lenOvr = len * OvrSmp;
  var buf0Ovr = new Array(lenOvr);
  var buf1Ovr = new Array(lenOvr);

  // First of all determine the length of the whole path
  var lenPath = getPathLen();

  // Loop through objects
  var objCnt = (_objCur.length < 2) ? _objects.length - 1 : _objects.length; // Omit current object if empty
  for (var k = 0; k < objCnt; ++k) {
    let obj = _objects[k];
    // Loop through segments of object
    for (var j = 0; j < obj.length - 1; ++j) {
      var p0 = obj[j];
      var p1 = obj[j + 1];
      
      var lenSeg = Math.sqrt(Math.pow((p1.x-p0.x),2)+Math.pow(p1.y-p0.y,2))

      // Number of samples in segment:
      if ((k == (objCnt - 1)) && (j == (obj.length - 2))) segSmpCnt = lenOvr - pos; // Special last segment treatment
      else segSmpCnt = Math.round((lenSeg / lenPath) * lenOvr);
      // Draw segment
      for (var i = 0; i < segSmpCnt; i++) {
        buf0Ovr[pos + i] = (2.0 * ((p0.x / width) + ((p1.x / width) - (p0.x / width)) * (i / segSmpCnt)));
        buf1Ovr[pos + i] = (2.0 - (2.0 * ((p0.y / height) + ((p1.y / height) - (p0.y / height)) * (i / segSmpCnt)))) - 2.0;
      }
      pos += segSmpCnt;
    }
  }

  // Interpolate result into audio buffers
  interpolateInto(buf0Ovr, buf0, len);
  interpolateInto(buf1Ovr, buf1, len);
}

function stopAudio() {
  if (_source != null) {_source.stop(); _source = null}
}

// function dft(x) {
//   const X = [];
//   const N = x.length;
//   for (let k = 0; k < N; k++) {
//     let re = 0;
//     let im = 0;
//     for (let n = 0; n < N; n++) {
//       const phi = (TWO_PI * k * n) / N;
//       re += x[n] * cos(phi);
//       im -= x[n] * sin(phi);
//     }
//     re = re / N;
//     im = im / N;

//     let freq = k;
//     let amp = sqrt(re * re + im * im);
//     let phase = atan2(im, re);
//     X[k] = { re, im, freq, amp, phase };
//   }
//   return X;
// } 


// class SineOscillator {
//   constructor(amp, freq, phase, channel) {
//       this.p5osc = new p5.Oscillator("sine")
//       this.p5osc.amp(amp)
//       this.p5osc.freq(freq)
//       this.p5osc.phase(phase)
//       if (channel == "x") {
//         this.p5osc.pan(-1.0)
//       } else {
//         this.p5osc.pan(1.0)
//         this.p5osc.freq(freq+HALF_PI)
//       }
//       this.p5osc.start()
//   }
// 
// }
updateAudio()
