function Vector (x, y) {
  this.x = x
  this.y = y
}
Vector.prototype = {
  constructor: Vector,
  add: function (v) {
    console.assert(v instanceof Vector)
    return new Vector(this.x + v.x, this.y + v.y)
  },
  sub: function (v) {
    console.assert(v instanceof Vector)
    return new Vector(this.x - v.x, this.y - v.y)
  },
  mult: function (v) {
    if (v instanceof Vector) {
      return new Vector(this.x * v.x, this.y * v.y)
    } else {
      return new Vector(this.x * v, this.y * v)
    }
  },
  div: function (v) {
    if (v instanceof Vector) {
      return new Vector(this.x / v.x, this.y / v.y)
    } else {
      return new Vector(this.x / v, this.y / v)
    }
  },
  dot: function (v) {
    console.assert(v instanceof Vector)
    return (this.x * v.x) + (this.y * v.y)
  },
  length: function () {
    return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2))
  },
  normal: function () {
    return this.div(this.length)
  },
  dist: function (v) {
    console.assert(v instanceof Vector)
    return (this.sub(v)).length()
  }
}
document.Vector = Vector
