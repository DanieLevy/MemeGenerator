"use strict"

var gMemes
var ctx 
var gLoadedMeme = null

// myMeme Controller

function loadMemes() {
  // load the memes from local storage, and set them in the gMemes array
  gMemes = getMemes()
  console.log("loadMemes")
  if (!gMemes) gMemes = []
  console.log("gMemes", gMemes)
}

function renderMemes() {
  // render the memes gallery
  const memeGallery = document.querySelector(".my-memes-gallery")
  const memes = gMemes.map((meme) => {
    console.log("meme1", meme)
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
  // renders an image on the canvas and a line of text on top of it
  var img = new Image()

  var id = `meme-${meme.id}`
  img.src = `img/meme-imgs/${meme.selectedImgId}.jpg`
  var canvas = document.getElementById(id)
  
  img.onload = () => {

      ctx = canvas.getContext("2d")
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

      const xScale = canvas.width / 500 ;
      const yScale = canvas.height / 500 ;
      
      meme.lines.forEach((line) => {
        const scaledPosX = line.posX * xScale;
        const scaledPosY = line.posY * yScale;
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
    // delete a meme from the gMemes array
    deleteMeme(memeId)
    loadMemes()
    renderMemes()
    }

    function onEditMeme(memeId) {
        // edit a meme from the gMemes array
        console.log('onEditMeme')
        console.log('memeId', memeId);
        var meme = getMemeById(memeId)
        console.log('meme', meme);
        gIsLoaded = true
        gLoadedMeme = meme
        renderMeme()

        document.querySelector(".gallery-container").style.display = "none"
        document.querySelector(".meme-container").style.display = "grid"
        document.querySelector(".my-memes").style.display = 'none';
    }