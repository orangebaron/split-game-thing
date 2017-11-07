const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')
const fps = 1
var speed = 5
const gameSize = new document.Vector(500, 800)

const speedVec = new document.Vector(0, speed / fps)
var circlesList = []
var linesList = []

function Circle (pos, radius, color) {
  this.pos = pos
  this.radius = radius
  this.color = color
}
Circle.prototype = {
  constructor: Circle,
  move: function () {
    this.pos = this.pos.add(speedVec)
  },
  shouldIDie: function () {
    return this.pos.y > this.radius + gameSize.y
  },
  render: function () {
    ctx.fillStyle = this.color
    ctx.beginPath()
    ctx.arc(this.pos.x, this.pos.y, this.radius, 0, Math.PI * 2)
    ctx.fill()
  }
}

function Line (start, direction) {
  this.start = start
  this.pos = start
  this.direction = direction
}
Line.prototype = {
  constructor: Line,
  active: true,
  move: function () {
    console.log(this)
    this.pos = this.pos.add(speedVec)
    this.start = this.start.add(speedVec)
    if (this.active) {
      this.pos = this.pos.add(this.direction)
    }
  },
  shouldIDie: function () {
    if (this.active) {
      var colliding = true
      circlesList.forEach(function (circle) {
        if (this.pos.dist(circle.pos) < circle.radius) {
          colliding = false
        }
      })
      if (colliding || this.pos.x > gameSize.x || this.pos.x < 0) {
        this.active = false
      }
    }
    if (!this.active && this.pos.y > gameSize.y) {
      return true
    }
  },
  render: function () {
    ctx.strokeStyle = '#000000'
    ctx.lineWidth = 10
    ctx.beginPath()
    ctx.moveTo(this.start.x, this.start.y)
    ctx.lineTo(this.pos.x, this.pos.y)
    ctx.stroke()
  }
}

function randomCircle () {
  circlesList.push(new Circle(new document.Vector(Math.random() * gameSize.x, 0), Math.random() * 20, '#FF0000'))
}
var intervals = []

function gameLose () {
  window.alert('L')
  intervals.forEach(function (interval) {
    clearInterval(interval)
  })
}

function turn () {
  ctx.fillStyle = '#FFFFFF'
  ctx.fillRect(0, 0, gameSize.x, gameSize.y)

  var i, obj
  for (i = 0; i < circlesList.length; i++) {
    obj = circlesList[i]
    obj.move()
    if (obj.shouldIDie()) {
      circlesList.splice(i, 1)
      i--
    } else {
      obj.render()
    }
  }
  for (i = 0; i < linesList.length; i++) {
    obj = linesList[i]
    obj.move()
    if (obj.shouldIDie()) {
      linesList.splice(i, 1)
      i--
    } else {
      obj.render()
    }
  }

  if (linesList.length === 0) {
    gameLose()
  }
}

function init () {
  linesList.push(new Line(new document.Vector(gameSize.x / 2, gameSize.y), new document.Vector(0, -10)))
  linesList[0].pos += linesList[0].direction * 3
  intervals.push(setInterval(randomCircle, 2000))
  intervals.push(setInterval(turn, 1000 / fps))
}

init()
