const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')
const fps = 20
const startSpeed = 75
const gameSize = new document.Vector(500, 800)
var playing = false
var score

var circlesList
var linesList
var speed

function Circle (pos, radius, color) {
  this.pos = pos
  this.radius = radius
  this.color = color
}
Circle.prototype = {
  constructor: Circle,
  move: function () {
    this.pos = new document.Vector(this.pos.x, this.pos.y + speed / fps)
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

function Line (start, xDirection) {
  this.start = start
  this.pos = start
  this.xDirection = xDirection
}
Line.prototype = {
  constructor: Line,
  active: true,
  move: function () {
    this.start = new document.Vector(this.start.x, this.start.y + speed / fps)
    if (this.active) {
      this.pos = new document.Vector(this.pos.x + this.xDirection * speed / fps, this.pos.y)
    } else {
      this.pos = new document.Vector(this.pos.x, this.pos.y + speed / fps)
    }
  },
  shouldIDie: function () {
    if (this.active) {
      var colliding = false
      var th = this
      circlesList.forEach(function (circle) {
        if (th.pos.dist(circle.pos) < circle.radius) {
          colliding = true
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
  },
  split: function () {
    if (this.active) {
      if (this.xDirection === 0) {
        this.active = false
        linesList.push(new Line(this.pos, -1))
        linesList.push(new Line(this.pos, 1))
      } else {
        linesList.push(new Line(this.pos, -this.xDirection))
      }
    }
  }
}

function randomCircle () {
  if (!playing) { return }
  circlesList.push(new Circle(new document.Vector(Math.random() * gameSize.x, 0), Math.random() * 20 + 50, '#FF0000'))
  setTimeout(randomCircle, 100000 / speed) // at 50 speed, new circle every 2 seconds
}
var intervals = []

function gameLose () {
  playing = false
  intervals.forEach(function (interval) {
    clearInterval(interval)
  })
  intervals = []
  document.getElementById('gameoverscore').innerHTML = Math.floor(score)
  document.getElementById('playingwindow').style.visibility = 'hidden'
  document.getElementById('gameoverwindow').style.visibility = 'visible'
}

var backgroundTint = '#00FF00'
function turn () {
  score += 10 / fps // each second adds 10 to the score
  document.getElementById('score').innerHTML = Math.floor(score)

  ctx.fillStyle = backgroundTint
  ctx.fillRect(0, 0, gameSize.x, gameSize.y)

  var i, obj
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

  if (linesList.length === 0) {
    gameLose()
  }
}

function init () {
  document.getElementById('initialwindow').style.visibility = 'hidden'
  document.getElementById('playingwindow').style.visibility = 'visible'
  document.getElementById('gameoverwindow').style.visibility = 'hidden'
  score = 0
  speed = startSpeed
  playing = true
  circlesList = []
  linesList = []
  linesList.push(new Line(new document.Vector(gameSize.x / 2, gameSize.y), 0))
  linesList[0].pos = linesList[0].pos.add(new document.Vector(0, -50))
  intervals.push(setInterval(turn, 1000 / fps))
  intervals.push(setInterval(function () { speed++ }, 1000))
  randomCircle()
}
console.log(init) // to get rid of the goddamn "defined but never used" error

var debounce = true
document.addEventListener('keydown', function (key) {
  if (key.code === 'Space') {
    if (debounce && playing) {
      debounce = false
      linesList.forEach(function (line) {
        line.split()
      })
      backgroundTint = '#FF9900'
      setTimeout(function () { debounce = true; backgroundTint = '#00FF00' }, 50000 / speed)
    }
  }
})
