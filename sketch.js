// A 2D SuperShape Generator written by Ståle Gjelsten
// Hosted at: https://stalegjelsten.github.io/2d-supershapes/
//
// The source code for the audio playback is mostly stolen from 
// http://bummsn.de/osc_txt/ (written by reddit.com/u/thomerow)
//

let myShape
let liveEquation
let renderedEquationImage
let plainTeXEquation
let asciiEquation
let canv

function setup() {
  canv = createCanvas(400, 400)
  stroke(60)
  strokeWeight(3)
  noFill()
  noLoop()

  myShape = new SuperShape(1, 1, 1, 4, 1, 1, 100)

  let gui = new dat.GUI()
  let saveButton = { add: function () { saveCanvas(canv, "supershape", "png") } }
  gui.add(myShape, "m", 0, 20, 0.1).onChange(redraw)
  gui.add(myShape, "n1", -5, 10, 0.1).onChange(redraw)
  gui.add(myShape, "n2", -5, 10, 0.1).onChange(redraw)
  gui.add(myShape, "n3", -5, 10, 0.1).onChange(redraw)
  gui.add(myShape, "a", -5, 10, 0.1).onChange(redraw)
  gui.add(myShape, "b", -5, 10, 0.1).onChange(redraw)
  gui.add(myShape, "circumnavigations", 1, 20, 1).name("# of 🔁").onChange(redraw)
  gui.add(myShape, "resolution", 10, 1000, 1).onChange(redraw)
  gui.add(myShape, "radius", 0, 200, 5).onFinishChange(redraw)
  // gui.add(myShape, "freq", 20, 20000, 1).onFinishChange(redraw)
  gui.add(saveButton, "add").name("Save image")
  gui.add(myShape, "playing").name("Play audio").onFinishChange(redraw)

  liveEquation = createP('')
  liveEquation.position(width / 2 - 170, height)
  renderedEquationImage = createP('<img src="https://cdn.jsdelivr.net/gh/stalegjelsten/2d-supershapes@master/svgs/510d395cbc490aab4c993e0d3c901f22.svg?invert_in_darkmode" align=middle width=309.62586269999997pt height=55.85645175pt/></p>')
  renderedEquationImage.style('align', 'center')
  renderedEquationImage.position(width / 2 - 170, height + 70)
  plainTeXEquation = createP()
  plainTeXEquation.style('width', width + "px")
  plainTeXEquation.style('margin', "15px")
  plainTeXEquation.position(0, height + 220)
  asciiEquation = createP()
  asciiEquation.style('width', width + "px")
  asciiEquation.style('margin', "15px")
  asciiEquation.position(0, height + 150)
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
    this.freq = 110
    this.resolution = 157
    this.radius = radius
    this.circumnavigations = 1
    this.equation = ""
    this.asciieq = ""
    this.playing = false
    this.x = []
    this.y = []
  }

  calcRadius(theta) {
    let p1 = abs(1 / this.a * cos(theta * this.m / 4)) ** this.n2
    let p2 = abs(1 / this.b * sin(theta * this.m / 4)) ** this.n3
    let ans = pow(p1 + p2, 1 / this.n1)
    this.equation = "r = \\left({\\left\\lvert \\frac{\\cos{\\left(\\frac{" + this.m.toPrecision(2) + "}{4} \\theta\\right)}}{" + this.a + "} \\right\\rvert ^{" + this.n2.toPrecision(2) + "}"
    this.equation += "+ \\left\\lvert \\frac{\\sin{\\left(\\frac{" + this.m.toPrecision(2) + "}{4} \\theta\\right)}}{" + this.a + "} \\right\\rvert ^{" + this.n3.toPrecision(2) + "}}\\right)^{-\\frac{1}{" + this.n1.toPrecision(2) + "}}"
    this.asciieq = "r(theta) = ( |(cos((" + this.m.toPrecision(2) + " theta) / 4)) / " + this.a.toPrecision(2) + "|^(" + this.n2.toPrecision(2) + ") + |(sin((" + this.m.toPrecision(2) + " theta) / 4)) / " + this.b.toPrecision(2) + " |^(" + this.n3.toPrecision(2) + "))^(-1/(" + this.n1.toPrecision(2) + ")"

    if (ans === 0) {
      return 0
    }
    return (1 / ans)
  }

  display() {
    this.x = []
    this.y = []
    beginShape()
    for (let angle = 0; angle < this.circumnavigations * TWO_PI; angle += TWO_PI / this.resolution) {
      this.r = this.calcRadius(angle)
      let x = this.radius * this.r * cos(angle)
      let y = this.radius * this.r * sin(angle)
      this.x.push(x)
      this.y.push(y)
      vertex(x, y)
    }
    endShape(CLOSE)
    katex.render(this.equation, liveEquation.elt)
    asciiEquation.html("Plain ASCII code for the equation: <br /><code>" + this.asciieq + "</code>")
    plainTeXEquation.html("LaTeX code for the equation (can be pasted into GeoGebra): <br /><code>" + this.equation + "</code>")
  }
}

function draw() {
  background(109, 158, 116)
  translate(width / 2, height / 2)
  myShape.display()
  if (source != null) source.stop()
  if (myShape.playing === true) {
    updateAudio()
  } else {
    if (source != null) { source.stop(); source = null }
  }
}

let audioBuffer
let audioCtx = new window.AudioContext || window.webkitAudioContext
let frameCount
let source = null

let maxDistance = 5
let overSampling = 8

function updateAudio() {
  frameCount = Math.round(audioCtx.sampleRate / myShape.freq)
  audioBuffer = audioCtx.createBuffer(2, frameCount, audioCtx.sampleRate)
  source = audioCtx.createBufferSource()

  let bufferLeft = audioBuffer.getChannelData(0)
  let bufferRight = audioBuffer.getChannelData(1)
  generateWaveFormsFromPoints(bufferLeft, bufferRight, frameCount)
  source.buffer = audioBuffer
  source.connect(audioCtx.destination)
  source.loop = true
  source.start()
  myShape.playing = true
}

function getPathLength() {
  let len = 0
  for (let i = 0; i < myShape.x.length - 1; i++) {
    len += Math.hypot(myShape.x[i + 1] - myShape.x[i], myShape.y[i + 1] - myShape.y[i])
  }
  return len
}

function interpolateInto(bufferOversampled, buffer, length) {
  let i, j, s, acc = 0

  // Interpolate
  for (i = 0; i < length; ++i) {
    let posOversampling = (i * overSampling) - (overSampling / 2)
    acc = 0
    for (j = 0; j < overSampling; ++j) {
      let k = posOversampling + j
      s = (k < 0) ? bufferOversampled[bufferOversampled.length + k] : bufferOversampled[k]
      acc += s
    }
    buffer[i] = acc / overSampling
  }
}

function generateWaveFormsFromPoints(buf0, buf1, len) {
  let pos = 0;  // Position in buffers
  let segmentSampleCount

  // Create temporary overampling buffers
  let lenOversampling = len * overSampling
  let bufferLOversampled = new Array(lenOversampling)
  let bufferROversampled = new Array(lenOversampling)

  // First of all determine the length of the whole path
  let lenPath = getPathLength()

  for (let j = 0; j < myShape.x.length - 1; ++j) {
    let p0 = { x: myShape.x[j], y: myShape.y[j] }
    let p1 = { x: myShape.x[j + 1], y: myShape.y[j + 1] }

    let lenSegment = Math.hypot(p1.x - p0.x, p1.y - p0.y)

    // Number of samples in segment:
    if (j == (myShape.x.length - 2)) {
      segmentSampleCount = lenOversampling - pos; // Special last segment treatment
    } else {
      segmentSampleCount = Math.round((lenSegment / lenPath) * lenOversampling)
    }

    // Draw segment
    for (let i = 0; i < segmentSampleCount; i++) {
      bufferLOversampled[pos + i] = (2.0 * ((p0.x / width) + ((p1.x / width) - (p0.x / width)) * (i / segmentSampleCount)))
      bufferROversampled[pos + i] = (2.0 - (2.0 * ((p0.y / height) + ((p1.y / height) - (p0.y / height)) * (i / segmentSampleCount)))) - 2.0
    }
    pos += segmentSampleCount
  }

  // Interpolate result into audio buffers
  interpolateInto(bufferLOversampled, buf0, len)
  interpolateInto(bufferROversampled, buf1, len)
}
