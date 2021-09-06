let myShape;
let div;
let eqn;
let plainTextEqn;

function setup() {
  createCanvas(400, 400)
  stroke(60)
  frameRate(10)
  strokeWeight(3)
  noFill()
  // noLoop()
  div = createP('');
  div.position(width/2-170, height);
  myShape = new SuperShape(1, 1, 1, 4, 1, 1, 100)
  let gui = new dat.GUI()
  gui.add(myShape, "m", 0, 20, 0.1)
  gui.add(myShape, "radius", 0, 200, 5)
  gui.add(myShape, "n1", 0, 10, 0.1)
  gui.add(myShape, "n2", 0, 10, 0.1)
  gui.add(myShape, "n3", 0, 10, 0.1)
  gui.add(myShape, "a", 1, 10, 1)
  gui.add(myShape, "b", 1, 10, 1)
  gui.add(myShape, "circumnavigations", 1, 20, 1)
  eqn = createP('<img src="https://cdn.jsdelivr.net/gh/stalegjelsten/2d-supershapes@master/svgs/510d395cbc490aab4c993e0d3c901f22.svg?invert_in_darkmode" align=middle width=309.62586269999997pt height=55.85645175pt/></p>')
  eqn.style('align', 'center')
  eqn.position(width/2-170, height+70)
  plainTextEqn = createP()
  plainTextEqn.style('width', width+"px")
  plainTextEqn.position(0,height+150)
  // myShape.changed(draw)
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
  }

  calcRadius(theta) {
    let p1 = abs(1 / this.a * cos(theta * this.m / 4)) ** this.n2
    let p2 = abs(1 / this.b * sin(theta * this.m / 4)) ** this.n3
    let ans = pow(p1 + p2, 1 / this.n1)
    this.equation = "r(\\theta) = \\left({\\left\\lvert \\frac{\\cos{\\left(\\frac{"+ this.m.toPrecision(2) + "}{4} \\theta\\right)}}{" + this.a + "} \\right\\rvert ^{" + this.n2.toPrecision(2) + "}" 
    this.equation += "+ \\left\\lvert \\frac{\\sin{\\left(\\frac{"+ this.m.toPrecision(2) + "}{4} \\theta\\right)}}{" + this.a + "} \\right\\rvert ^{" + this.n3.toPrecision(2) + "}}\\right)^{-\\frac{1}{" + this.n1.toPrecision(2) + "}}" 
    if (ans === 0) {
      return 0
    }
    return (1 / ans)
  }

  display() {
    beginShape()
    for (let angle = 0; angle < this.circumnavigations * TWO_PI; angle += 0.02) {
      this.r = this.calcRadius(angle)
      let x = this.radius * this.r * cos(angle)
      let y = this.radius * this.r * sin(angle)

      vertex(x, y)
    }
    endShape(CLOSE)
    katex.render(this.equation, div.elt)
    plainTextEqn.html("<code>" + this.equation + "</code>")
  }
}

function draw() {
  background(109, 158, 116)
  translate(width / 2, height / 2)
  myShape.display()
}

// function mouseMoved() {
//   redraw(60);
// }

// function keyPressed() {
//   redraw(60);
// }

// function mouseIsPressed() {
//   redraw(60);
// }
// function mouseReleased() {
//   redraw(60);
// }