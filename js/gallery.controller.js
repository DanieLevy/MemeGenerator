'use strict'

// Gallery Controller

var gKeywords = { 'happy': 12, 'funny puk': 1 }
var gImgs = [
    { id: 1, url: 'img/meme-imgs/1.jpg', keywords: ['politics'] },
    { id: 2, url: 'img/meme-imgs/2.jpg', keywords: ['cute'] },
    { id: 3, url: 'img/meme-imgs/3.jpg', keywords: ['cute'] },
    { id: 4, url: 'img/meme-imgs/4.jpg', keywords: ['cute'] },
    { id: 5, url: 'img/meme-imgs/5.jpg', keywords: ['funny'] },
    { id: 6, url: 'img/meme-imgs/6.jpg', keywords: ['happy'] },
    { id: 7, url: 'img/meme-imgs/7.jpg', keywords: ['cute'] },
    { id: 8, url: 'img/meme-imgs/8.jpg', keywords: ['funny'] },
    { id: 9, url: 'img/meme-imgs/9.jpg', keywords: ['funny'] },
    { id: 10, url: 'img/meme-imgs/10.jpg', keywords: ['funny'] },
    { id: 11, url: 'img/meme-imgs/11.jpg', keywords: ['sad'] },
    { id: 12, url: 'img/meme-imgs/12.jpg', keywords: ['sad'] },
    { id: 13, url: 'img/meme-imgs/13.jpg', keywords: ['angry'] },
    { id: 14, url: 'img/meme-imgs/14.jpg', keywords: ['funny'] },
    { id: 15, url: 'img/meme-imgs/15.jpg', keywords: ['happy'] },
    { id: 16, url: 'img/meme-imgs/16.jpg', keywords: ['happy'] },
    { id: 17, url: 'img/meme-imgs/17.jpg', keywords: ['angry', 'funny'] },
    { id: 18, url: 'img/meme-imgs/18.jpg', keywords: ['sad'] },
    { id: 19, url: 'img/meme-imgs/19.jpg', keywords: ['cute'] },
    { id: 20, url: 'img/meme-imgs/20.jpg', keywords: ['funny'] }
];


function renderGallery() {
    // renders the gallery of images
    var imgs = getImgs()
    var strHtmls = imgs.map(function (img) {
      return `<img src="${img.url}" onclick="onClickImg(${img.id})">`
    })
    document.querySelector(".gallery").innerHTML = strHtmls.join("")
  }

  function onClickImg(imgId) {
    // when an image is clicked, it is set as the meme's selected image
    gIsLoaded = false
    createMeme(imgId)
    renderMeme()
    document.querySelector(".gallery-container").style.display = "none"
    document.querySelector(".meme-container").style.display = "grid"
  }

  function onRandomImg() {
    // when the random button is clicked, a random image is set as the meme's selected image
    var imgs = getImgs()
    var randomIdx = getRandomInt(0, imgs.length)
    createMeme(imgs[randomIdx].id)
    renderMeme()
    document.querySelector(".gallery-container").style.display = "none"
    document.querySelector(".meme-container").style.display = "grid"
  }

  function onUploadImg(ev) {
    // when an image is uploaded, it is set as the meme's selected image
    let inputFile = ev.target.files[0]
    let newImg = new Image()
    newImg.src = URL.createObjectURL(inputFile)
    newImg.onload = () => {
        gImgs.push({ id: (gImgs.length + 1), url: newImg.src, keywords: [] })
        // renderGallery()
        createMeme(gImgs.length, true , newImg.src)
        renderMeme()
        // document.querySelector(".gallery-container").classList.add("hide")
        // document.querySelector(".meme-container").classList.remove("hide")
        }
  }

    function onSearch(value, ev) {
        var imgs = getImgs()
        // if value === all, render all images
        if (value === "all") {
            renderGallery()
            return
        }
        // filter images by keyword
        var filteredImgs = imgs.filter(function (img) {
            return img.keywords.some(keyword => keyword.includes(value))
            }
        )
        var strHtmls = filteredImgs.map(function (img) {
            return `<img src="${img.url}" onclick="onClickImg(${img.id})">`
        }
        )
        document.querySelector(".gallery").innerHTML = strHtmls.join("")

        console.log(ev);
        // incrase the data-click attribute by 1
        const clicks = parseInt(ev.dataset.clicks); 
        ev.dataset.clicks = clicks + 1;
        console.log(ev.dataset.clicks);

        const fontSize = 1 + (clicks * 0.05) + 'em';

        ev.style.fontSize = fontSize;

    }