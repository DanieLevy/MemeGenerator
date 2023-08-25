"use strict"

// Meme Generator Controller
// var gCurrSticker
var gElCanvas
var gCtx
var gCurrImg
var gCurrLine = null
var gIsLineClicked = false
var gTouchEvs = ["touchstart", "touchmove", "touchend"]


function onInit() {
  gElCanvas = document.querySelector("#meme-canvas")
  gCtx = gElCanvas.getContext("2d")

  renderGallery()
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
    gIsLineClicked = true
    gCurrLine = getSelectedLine()
    document.querySelector("#text-input").value = gCurrLine.txt
  } else if (isStickerClicked(pos)) {
  } else if (isCanvasClicked(pos)) {
    setSelectedLine(-1)
  }
}

function onMove(ev) {
  const pos = getEvPos(ev)
  if (gIsLineClicked) {
    moveLine(pos)
    renderMeme()
  }
}

function onUp() {
  gIsLineClicked = false
  //   gCurrSticker = null
  // gCurrLine = null
}

function getEvPos(ev) {
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
  let meme = getMeme()
  let line = meme.lines.find((line) => {
    return (
      clickedPos.x >= line.posX - gCtx.measureText(line.txt).width / 2 &&
      clickedPos.x <= line.posX + gCtx.measureText(line.txt).width / 2 &&
      clickedPos.y >= line.posY - line.size &&
      clickedPos.y <= line.posY
    )
  })
  if (line) {
    setSelectedLine(meme.lines.indexOf(line))
    renderMeme()

    return true
  }
  return false
}

function isStickerClicked(clickedPos) {
  let meme = getMeme()
  let sticker = meme.stickers.find((sticker) => {
    return (
      clickedPos.x >= sticker.posX &&
      clickedPos.x <= sticker.posX + sticker.size &&
      clickedPos.y >= sticker.posY &&
      clickedPos.y <= sticker.posY + sticker.size
    )
  })
  if (sticker) {
    setSelectedSticker(meme.stickers.indexOf(sticker))
    return true
  }
  return false
}

function isCanvasClicked(clickedPos) {
  let meme = getMeme()
  let canvas = {
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
  let elContainer = document.querySelector("#meme-canvas")
  gElCanvas.width = elContainer.offsetWidth
  gElCanvas.height = elContainer.offsetHeight
}

function renderMeme() {
  let meme = getMeme()
  let x = getSelectedLineIdx()
  if (gIsLoaded) meme = gLoadedMeme

  let img = new Image()

  if (meme.uploaded) img.src = `${meme.newImgUrl}`
  else img.src = `img/meme-imgs/${meme.selectedImgId}.jpg`

  img.onload = () => {
    let ratio = img.width / img.height
    let imgWidth = gElCanvas.width
    let imgHeight = imgWidth / ratio
    if (imgHeight > gElCanvas.height) {
      imgHeight = gElCanvas.height
      imgWidth = imgHeight * ratio
    }
    const imgRatio = img.width / img.height
    const canvasRatio = gElCanvas.width / gElCanvas.height

    let renderWidth, renderHeight
    if (imgRatio < canvasRatio) {
      renderWidth = gElCanvas.width
      renderHeight = gElCanvas.width / imgRatio
    } else {
      renderWidth = gElCanvas.height * imgRatio
      renderHeight = gElCanvas.height
    }
    // gElCanvas.width = img.width;
    // gElCanvas.height = img.height;

    gCtx.drawImage(img, 0, 0, img.width, img.height)
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
    let line = getSelectedLine()
    if (line) {
      let textWidth = gCtx.measureText(line.txt).width
      let textHeight = line.size
      let textX = line.posX - textWidth / 2
      let textY = line.posY - textHeight
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
  gCtx.lineWidth = strokeWidth
  gCtx.strokeStyle = strokeColor
  gCtx.fillStyle = color
  gCtx.font = `${size}px ${font}`
  gCtx.textAlign = align
  gCtx.fillText(text, x, y)
  gCtx.strokeText(text, x, y)
}

function onAddLine() {
  let text = document.querySelector("#text-input").value
  if (!text) return showPopup("❗Please enter text")
  addLine(text)
  renderMeme()
  showPopup("✅ Line added!")
}

function onDeleteLine() {
  let lineIdx = getSelectedLineIdx()
  deleteLine(lineIdx)
  renderMeme()
  showPopup("❌ Line deleted!")
}

function onTextChange(text) {
  let line = getSelectedLine()
  if (line) {
    changeText(text, getSelectedLineIdx())
    renderMeme()
  } else {
    showPopup("❗Please select a line.")
  }
}

function onAlignText(align) {
  let line = getSelectedLine()
  if (!line) return showPopup("❗Please select a line.")
  changeAlign(align, getSelectedLineIdx())
  renderMeme()
}

function onFontSizeChange(diff) {
  let line = getSelectedLine()
  if (!line) return showPopup("❗Please select a line.")
  changeFontSize(diff, getSelectedLineIdx())
  renderMeme()
}

function onFontChange(font) {
  let line = getSelectedLine()
  if (!line) return showPopup("❗Please select a line.")
  changeFont(font, getSelectedLineIdx())
  renderMeme()
}

function onFontColorChange(color) {
  let line = getSelectedLine()
  if (!line) return showPopup("❗Please select a line.")
  changeFontColor(color, getSelectedLineIdx())
  renderMeme()
}

function onStrokeColorChange(color) {
  let line = getSelectedLine()
  if (!line) return showPopup("❗Please select a line.")
  changeStrokeColor(color, getSelectedLineIdx())
  renderMeme()
}

function onSwitchLine(diff) {
  let line = getSelectedLine()
  if (!line) return showPopup("❗Please select a line.")
  let newLineIdx = switchLine(diff)
  setSelectedLine(newLineIdx)
  renderMeme()
}

function moveLine(pos) {
  gCurrLine.posX = pos.x
  gCurrLine.posY = pos.y
}

function onClickGallery() {
  document.querySelector(".gallery-container").style.display = "grid"
  document.querySelector(".meme-container").style.display = "none"
  document.querySelector(".my-memes-container").style.display = "none"
}

function onClickMyMemes() {
  document.querySelector(".my-memes-container").style.display = "grid"
  document.querySelector(".meme-container").style.display = "none"
  document.querySelector(".gallery-container").style.display = "none"
}

function onDownloadMeme() {
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
    setSelectedLine(-1)
    renderMeme()
  }
  setTimeout(downloadMeme, 100)
  showPopup("✅ Meme downloaded!")
}

function downloadMeme() {
  const link = document.getElementById("hiddenLink")

  let imgContent = gElCanvas.toDataURL("image/jpeg")
  link.href = imgContent
  link.download = "my-meme.jpg"
  link.click()
}

function onSaveMeme() {
  saveMeme()
  loadMemes()
  renderMemes()
  showPopup("✅ Meme saved!")
}
