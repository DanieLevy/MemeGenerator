"use strict"

// myMeme Controller

var gMemes
var ctx
var gLoadedMeme = null

function loadMemes() {
  gMemes = getMemes()
  if (!gMemes) gMemes = []
}

function renderMemes() {
  const memeGallery = document.querySelector(".my-memes-gallery")
  const memes = gMemes.map((meme) => {
    const id = `meme-${meme.id}`
    return `
            <div class="meme-preview">
                <canvas id="${id}" width="200" height="200"></canvas>
                <button onclick="onDeleteMeme('${meme.id}')">Delete</button>
                <button onclick="onEditMeme('${meme.id}')">Edit</button>
            </div>
        `
  })
  memeGallery.innerHTML = memes.join("")
  gMemes.forEach((meme) => {
    renderMyMeme(meme)
  })
}

function renderMyMeme(meme) {
  var img = new Image()

  var id = `meme-${meme.id}`
  img.src = `img/meme-imgs/${meme.selectedImgId}.jpg`
  var canvas = document.getElementById(id)

  img.onload = () => {
    ctx = canvas.getContext("2d")
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

    const xScale = canvas.width / 500
    const yScale = canvas.height / 500

    meme.lines.forEach((line) => {
      const scaledPosX = line.posX * xScale
      const scaledPosY = line.posY * yScale
      drawMyText(
        line.txt,
        scaledPosX,
        scaledPosY,
        line.size * xScale,
        line.align,
        line.color,
        line.strokeColor,
        line.strokeWidth,
        line.font
      )
    })
  }
}

function drawMyText(
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
  ctx.lineWidth = strokeWidth
  ctx.strokeStyle = strokeColor
  ctx.fillStyle = color
  ctx.font = `${size}px ${font}`
  ctx.textAlign = align
  ctx.fillText(text, x, y)
  ctx.strokeText(text, x, y)
}

function onDeleteMeme(memeId) {
  let ask = confirm("Are you sure you want to delete this meme?")
  if (!ask) return
  deleteMeme(memeId)
  loadMemes()
  renderMemes()
  showPopup("Meme deleted! ❌")
}

function onEditMeme(memeId) {
  let meme = getMemeById(memeId)
  gIsLoaded = true
  gLoadedMeme = meme
  renderMeme()

  document.querySelector(".gallery-container").style.display = "none"
  document.querySelector(".meme-container").style.display = "grid"
  document.querySelector(".my-memes-container").style.display = "none"
}
