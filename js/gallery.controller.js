"use strict"

// Gallery Controller

var gKeywords = { happy: 12, "funny puk": 1 }
var gImgs = [
  { id: 1, url: "img/meme-imgs/1.jpg", keywords: ["politics"] },
  { id: 2, url: "img/meme-imgs/2.jpg", keywords: ["cute"] },
  { id: 3, url: "img/meme-imgs/3.jpg", keywords: ["cute"] },
  { id: 4, url: "img/meme-imgs/4.jpg", keywords: ["cute"] },
  { id: 5, url: "img/meme-imgs/5.jpg", keywords: ["funny"] },
  { id: 6, url: "img/meme-imgs/6.jpg", keywords: ["happy"] },
  { id: 7, url: "img/meme-imgs/7.jpg", keywords: ["cute"] },
  { id: 8, url: "img/meme-imgs/8.jpg", keywords: ["funny"] },
  { id: 9, url: "img/meme-imgs/9.jpg", keywords: ["funny"] },
  { id: 10, url: "img/meme-imgs/10.jpg", keywords: ["funny"] },
  { id: 11, url: "img/meme-imgs/11.jpg", keywords: ["sad"] },
  { id: 12, url: "img/meme-imgs/12.jpg", keywords: ["sad"] },
  { id: 13, url: "img/meme-imgs/13.jpg", keywords: ["angry"] },
  { id: 14, url: "img/meme-imgs/14.jpg", keywords: ["funny"] },
  { id: 15, url: "img/meme-imgs/15.jpg", keywords: ["happy"] },
  { id: 16, url: "img/meme-imgs/16.jpg", keywords: ["happy"] },
  { id: 17, url: "img/meme-imgs/17.jpg", keywords: ["angry", "funny"] },
  { id: 18, url: "img/meme-imgs/18.jpg", keywords: ["sad"] },
  { id: 19, url: "img/meme-imgs/19.jpg", keywords: ["cute"] },
  { id: 20, url: "img/meme-imgs/20.jpg", keywords: ["funny"] },
]

function renderGallery() {
  let imgs = getImgs()
  let strHtmls = imgs.map(function (img) {
    return `<img src="${img.url}" onclick="onClickImg(${img.id})">`
  })
  document.querySelector(".gallery").innerHTML = strHtmls.join("")
}

function onClickImg(imgId) {
  gIsLoaded = false
  createMeme(imgId)
  renderMeme()
  document.querySelector(".gallery-container").style.display = "none"
  document.querySelector(".meme-container").style.display = "grid"
}

function onRandomImg() {
  let imgs = getImgs()
  let randomIdx = getRandomInt(0, imgs.length)
  createMeme(imgs[randomIdx].id)
  renderMeme()
  document.querySelector(".gallery-container").style.display = "none"
  document.querySelector(".meme-container").style.display = "grid"
  showPopup("Random image selected")
}

function onUploadImg(ev) {
  let inputFile = ev.target.files[0]
  let newImg = new Image()
  newImg.src = URL.createObjectURL(inputFile)
  newImg.onload = () => {
    gImgs.push({ id: gImgs.length + 1, url: newImg.src, keywords: [] })
    createMeme(gImgs.length, true, newImg.src)
    renderMeme()
  }
}

function onSearch(value, ev) {
  let imgs = getImgs()
  if (value === "all") {
    renderGallery()
    return
  }
  let filteredImgs = imgs.filter(function (img) {
    return img.keywords.some((keyword) => keyword.includes(value))
  })
  let strHtmls = filteredImgs.map(function (img) {
    return `<img src="${img.url}" onclick="onClickImg(${img.id})">`
  })
  document.querySelector(".gallery").innerHTML = strHtmls.join("")

  const clicks = parseInt(ev.dataset.clicks)

  ev.dataset.clicks = clicks + 1
  const fontSize = 1 + clicks * 0.05 + "em"

  ev.style.fontSize = fontSize
}
