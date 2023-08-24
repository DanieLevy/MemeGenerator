"use strict"

// Meme Generator Controller
var gElCanvas
var gCtx
var gCurrImg
var gCurrLine = null
var gIsLineClicked = false
var gCurrSticker
var gCurrColor
var gCurrFont
var gCurrAlign
var gCurrStrokeColor
var gCurrStrokeWidth
var gCurrFontSize
var gCurrFontFamily

var gTouchEvs = ["touchstart", "touchmove", "touchend"]

function onInit() {
  renderGallery()
  
  // intialize the canvas board #meme-canvas
  gElCanvas = document.querySelector("#meme-canvas")
  gCtx = gElCanvas.getContext("2d")
  
  addListeners()
  loadMemes()
  renderMemes()
}

function addListeners() {
  addMouseListeners()
  addTouchListeners()
  window.addEventListener("resize", () => {
    resizeCanvas()
    renderMeme()
  })
}

function addMouseListeners() {
  gElCanvas.addEventListener("mousemove", onMove)
  gElCanvas.addEventListener("mousedown", onDown)
  gElCanvas.addEventListener("mouseup", onUp)
}

function addTouchListeners() {
  gElCanvas.addEventListener("touchmove", onMove)
  gElCanvas.addEventListener("touchstart", onDown)
  gElCanvas.addEventListener("touchend", onUp)
}

function onDown(ev) {
  const pos = getEvPos(ev)
  if (isLineClicked(pos)) {
    console.log("line clicked")
    gIsLineClicked = true
    gCurrLine = getSelectedLine()
    document.querySelector("#text-input").value = gCurrLine.txt
  } else if (isStickerClicked(pos)) {
    // gCurrSticker = getSelectedSticker()
  } else if (isCanvasClicked(pos)) {
    console.log("canvas clicked")

    setSelectedLine(-1)
    // setSelectedSticker(-1)
  }
}

function onMove(ev) {
  // when the mouse is moved, the selected line or sticker is moved
  const pos = getEvPos(ev)
  if (gIsLineClicked) {
    moveLine(pos)
    renderMeme()
  }
}

function onUp() {
  // when the mouse is up, the selected line or sticker is set to null
  gIsLineClicked = false
  //   gCurrSticker = null
  // gCurrLine = null
}

function getEvPos(ev) {
  // returns the position of the mouse or touch
  var pos = {
    x: ev.offsetX,
    y: ev.offsetY,
  }
  if (gTouchEvs.includes(ev.type)) {
    ev.preventDefault()
    ev = ev.changedTouches[0]
    pos = {
      x: ev.pageX - ev.target.offsetLeft - ev.target.clientLeft,
      y: ev.pageY - ev.target.offsetTop - ev.target.clientTop,
    }
  }
  return pos
}

function isLineClicked(clickedPos) {
  // returns true if the mouse is clicked on a line
  var meme = getMeme()
  var line = meme.lines.find((line) => {
    return (
      clickedPos.x >= line.posX - gCtx.measureText(line.txt).width / 2 &&
      clickedPos.x <= line.posX + gCtx.measureText(line.txt).width / 2 &&
      clickedPos.y >= line.posY - line.size &&
      clickedPos.y <= line.posY
    )
  })
  if (line) {
    // change line.hasBorder to true or false
    setSelectedLine(meme.lines.indexOf(line))
    line.hasBorder = !line.hasBorder
    renderMeme()

    return true
  }
  return false
}

function isStickerClicked(clickedPos) {
  // returns true if the mouse is clicked on a sticker
  var meme = getMeme()
  var sticker = meme.stickers.find((sticker) => {
    return (
      clickedPos.x >= sticker.posX &&
      clickedPos.x <= sticker.posX + sticker.size &&
      clickedPos.y >= sticker.posY &&
      clickedPos.y <= sticker.posY + sticker.size
    )
  })
  if (sticker) {
    setSelectedSticker(meme.stickers.indexOf(sticker))
    console.log("sticker", sticker)
    return true
  }
  return false
}

function isCanvasClicked(clickedPos) {
  var meme = getMeme()
  var canvas = {
    posX: 0,
    posY: 0,
    size: gElCanvas.width,
  }
  if (
    clickedPos.x >= canvas.posX &&
    clickedPos.x <= canvas.posX + canvas.size &&
    clickedPos.y >= canvas.posY &&
    clickedPos.y <= canvas.posY + canvas.size
  ) {
    setSelectedLine(-1)
    document.querySelector("#text-input").value = ""
    renderMeme()
    return true
  }
  return false
}

function resizeCanvas() {
    var elContainer = document.querySelector('#meme-canvas')
    gElCanvas.width = elContainer.offsetWidth
    gElCanvas.height = elContainer.offsetHeight
}


function renderMeme() {
  // renders an image on the canvas and a line of text on top of it
  var meme = getMeme()
  var x = getSelectedLineIdx()
    console.log("x", x)
    if (gIsLoaded) meme = gLoadedMeme

  var img = new Image()

  if (meme.uploaded) img.src = `${meme.newImgUrl}`
  else img.src = `img/meme-imgs/${meme.selectedImgId}.jpg`

  img.onload = () => {
    // calculate the ratio of the original image size and scale the rendered image accordingly:
    var ratio = img.width / img.height
    var imgWidth = gElCanvas.width
    var imgHeight = imgWidth / ratio
    if (imgHeight > gElCanvas.height) {
        imgHeight = gElCanvas.height
        imgWidth = imgHeight * ratio
    }
    const imgRatio = img.width / img.height;
    const canvasRatio = gElCanvas.width / gElCanvas.height;
  
    let renderWidth, renderHeight;
    if(imgRatio < canvasRatio) {
        renderWidth = gElCanvas.width;
      renderHeight = gElCanvas.width / imgRatio;
    } else {
      renderWidth = gElCanvas.height * imgRatio;  
      renderHeight = gElCanvas.height;
    }
    // gElCanvas.width = img.width;
    // gElCanvas.height = img.height;
  
    gCtx.drawImage(img, 0, 0, img.width, img.height);
    // gCtx.drawImage(img, 0, 0, imgWidth, imgHeight)
    meme.lines.forEach((line) => {
      drawText(
        line.txt,
        line.posX,
        line.posY,
        line.size,
        line.align,
        line.color,
        line.strokeColor,
        line.strokeWidth,
        line.font
      )
    })
    var line = getSelectedLine()
    if (line) {
      var textWidth = gCtx.measureText(line.txt).width
      var textHeight = line.size
      var textX = line.posX - textWidth / 2
      var textY = line.posY - textHeight
      if (line.align === "left") {
          textX = line.posX
          }
      if (line.align === "right") {
          textX = line.posX - textWidth
          }
      gCtx.beginPath()
      gCtx.rect(textX, textY, textWidth, textHeight)
      gCtx.strokeStyle = "black"
      gCtx.stroke()
    }

  }
}


function drawText(
  text,
  x,
  y,
  size,
  align,
  color,
  strokeColor,
  strokeWidth,
  font
) {
  // draws a line of text on the canvas
// take care of changing the font size, font family, font color, stroke color, stroke width and alignment
    gCtx.lineWidth = strokeWidth
    gCtx.strokeStyle = strokeColor
    gCtx.fillStyle = color
    gCtx.font = `${size}px ${font}`
    gCtx.textAlign = align
    gCtx.fillText(text, x, y)
    gCtx.strokeText(text, x, y)
}

function onAddLine() {
  // adds a line of text to the meme
  //   if input is empty, return
  var text = document.querySelector("#text-input").value
  if (!text) return console.log("no text")

  addLine(text)
  renderMeme()
}

function onDeleteLine() {
  // delete the selected line from the meme
  var lineIdx = getSelectedLineIdx()
  deleteLine(lineIdx)
  renderMeme()
}

function onTextChange(text) {
  // if line selected, changes the text of the selected line
  var line = getSelectedLine()
  if (line) {
    changeText(text, getSelectedLineIdx())
    renderMeme()
  } else {
    console.log("no line selected")
  }
}

function onAlignText(align) {
  // if line selected, changes the alignment of the selected line

  var line = getSelectedLine()
  if (!line) return console.log("no line selected")

  changeAlign(align, getSelectedLineIdx())
  renderMeme()
}

function onFontSizeChange(diff) {
  // if line selected, changes the font size of the selected line
  var line = getSelectedLine()
    if (!line) return console.log("no line selected")
    changeFontSize(diff, getSelectedLineIdx())
    renderMeme()
}

function onFontChange(font) {
    // if line selected, changes the font of the selected line
    var line = getSelectedLine()
    if (!line) return console.log("no line selected")
    changeFont(font, getSelectedLineIdx())
    renderMeme()
}

function onFontColorChange(color) {
    // if line selected, changes the font color of the selected line
    var line = getSelectedLine()
    if (!line) return console.log("no line selected")
    changeFontColor(color, getSelectedLineIdx())
    renderMeme()
}

function onStrokeColorChange(color) {
    // if line selected, changes the stroke color of the selected line
    var line = getSelectedLine()
    if (!line) return console.log("no line selected")
    changeStrokeColor(color, getSelectedLineIdx())
    renderMeme()
} 

// write onSwitchLine function that get 1 or -1 and switch the selected line
// validate that he selected line
// validate that the lineIdx is not out of bounds

function onSwitchLine(diff) {
    // if line selected, switches the selected line
    var line = getSelectedLine()
    if (!line) return console.log("no line selected")
    // switchLine(diff, getSelectedLineIdx())
// using switchLine function that do the same as the commented code above
// he returns the new selected line index
    var newLineIdx = switchLine(diff)
    setSelectedLine(newLineIdx)
    // log
    console.log('newLineIdx', newLineIdx)
    renderMeme()
}


function moveLine(pos) {
  // moves the selected line to the mouse position
  gCurrLine.posX = pos.x
  gCurrLine.posY = pos.y
}

function onClickGallery() {
  document.querySelector(".gallery-container").style.display = 'grid';
  document.querySelector(".meme-container").style.display = 'none';
    document.querySelector(".my-memes").style.display = 'none';
}

function onClickMyMemes() {
    document.querySelector(".my-memes").style.display = 'grid';
    document.querySelector(".meme-container").style.display = 'none';
    document.querySelector(".gallery-container").style.display = 'none';
}



function onDownloadMeme() {
    // click inside the canvas to remove the border
    var canvas = {
        posX: 0,
        posY: 0,
        size: gElCanvas.width,
        }
    var clickedPos = {
        x: canvas.posX + 1,
        y: canvas.posY + 1,
        }
    if (isCanvasClicked(clickedPos)) {
        console.log("canvas clicked")
        setSelectedLine(-1)
        renderMeme()
        }
    setTimeout(downloadMeme, 100)
    }

    function downloadMeme() {
        const link = document.getElementById('hiddenLink');

        var imgContent = gElCanvas.toDataURL('image/jpeg');
        link.href = imgContent
        link.download = 'my-meme.jpg';
        link.click();
    }

    function onSaveMeme() {
        saveMeme()
        renderMemes()
    }