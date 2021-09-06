let myShape
let liveeqn
let eqn
let plainTeXEqn
let asciiEqn
let canv

function setup() {
  canv = createCanvas(400, 400)
  stroke(60)
  strokeWeight(3)
  noFill()
  noLoop()
  let btn = { add:function(){saveCanvas(canv, "supershape", "png")}}
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
    beginShape()
    for (let angle = 0; angle < this.circumnavigations * TWO_PI; angle += 0.02) {
      this.r = this.calcRadius(angle)
      let x = this.radius * this.r * cos(angle)
      let y = this.radius * this.r * sin(angle)

      vertex(x, y)
    }
    endShape(CLOSE)
    katex.render(this.equation, liveeqn.elt)
    asciiEqn.html("Plain ASCII code for the equation: <br /><code>" + this.asciieq + "</code>")
    plainTeXEqn.html("LaTeX code for the equation (can be pasted into GeoGebra): <br /><code>" + this.equation + "</code>")
  }
}

function draw() {
  background(109, 158, 116)
  translate(width / 2, height / 2)
  myShape.display()
}
