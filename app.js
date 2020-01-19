class Box {
  constructor (x, y, sideLength) {
    this.x = x
    this.y = y
    this.sideLength = sideLength

    this.isBeingDragged = false
    this.dragPreviousLocation = null

    this.isInsideBox = this.isInsideBox.bind(this)
    this.startDragging = this.startDragging.bind(this)
    this.render = this.render.bind(this)
    this.updateLocation = this.updateLocation.bind(this)
    this.stopDragging = this.stopDragging.bind(this)
  }

  isInsideBox (x, y) {
    return (
      this.x <= x &&
      this.y <= y &&
      this.x + this.sideLength >= x &&
      this.y + this.sideLength >= y
    )
  }

  startDragging (location) {
    this.isBeingDragged = true
    this.dragPreviousLocation = location
  }

  stopDragging () {
    this.isBeingDragged = false
  }

  updateLocation (location) {
    const diffX = location.x - this.dragPreviousLocation.x
    const diffY = location.y - this.dragPreviousLocation.y
    this.x += diffX
    this.y += diffY
    this.dragPreviousLocation = location
  }

  colourByMode () {
    if (this.isBeingDragged) {
      return '#DDD'
    } else {
      return '#000'
    }
  }

  render (ctx) {
    ctx.fillStyle = this.colourByMode()
    ctx.beginPath()
    ctx.rect(this.x, this.y, this.sideLength, this.sideLength)
    ctx.closePath()
    ctx.fill()
  }
}

class CanvasOrchestrator {
  constructor () {
    this.mouseDown = this.mouseDown.bind(this)
    this.mouseMove = this.mouseMove.bind(this)
    this.mouseUp = this.mouseUp.bind(this)
    this.setCanvasLocation = this.setCanvasLocation.bind(this)
    this.render = this.render.bind(this)

    const canvas = document.getElementById('canvas')
    canvas.onmousedown = this.mouseDown
    canvas.onmousemove = this.mouseMove
    canvas.onmouseup = this.mouseUp
    this.canvas = canvas
    this.ctx = canvas.getContext('2d')

    // Capture window size so we can calculate where in the canvas we are.
    this.setCanvasLocation()
    window.onresize = this.setCanvasLocation

    this.draggedBoxes = []
    this.boxes = [
      new Box(10, 30, 20),
      new Box(50, 80, 20),
      new Box(100, 80, 80),
      new Box(200, 40, 50)
    ]

    this.render()
  }

  setCanvasLocation () {
    const windowWidth = window.innerWidth
    const windowHeight = window.innerHeight
    this.canvasStartX = (windowWidth - this.canvas.width) / 2
    this.canvasStartY = (windowHeight - this.canvas.height) / 2
  }

  translateToLocationInCanvas (x, y) {
    return {
      x: x - this.canvasStartX,
      y: y - this.canvasStartY
    }
  }

  eventLocationToCanvasLocation (e) {
    return this.translateToLocationInCanvas(e.clientX, e.clientY)
  }

  mouseDown (e) {
    const location = this.eventLocationToCanvasLocation(e)
    this.boxes.forEach(box => {
      if (box.isInsideBox(location.x, location.y)) {
        box.startDragging(location)
        this.draggedBoxes.push(box)
      }
    })
    this.render()
  }

  mouseMove (e) {
    const location = this.eventLocationToCanvasLocation(e)
    this.draggedBoxes.forEach(box => box.updateLocation(location))
    this.render()
  }

  mouseUp (e) {
    this.draggedBoxes.forEach(box => box.stopDragging())
    this.draggedBoxes = []
    this.render()
  }

  render () {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    this.boxes.forEach(box => {
      box.render(this.ctx)
    })
  }
}

new CanvasOrchestrator()
