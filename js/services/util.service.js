"use strict"

// Util Service

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min
}

function makeId(length = 3) {
  let txt = ""
  let possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
  for (let i = 0; i < length; i++) {
    txt += possible.charAt(Math.floor(Math.random() * possible.length))
  }
  return txt
}

function saveToStorage(key, val) {
  let str = JSON.stringify(val)
  localStorage.setItem(key, str)
}

function loadFromStorage(key) {
  let str = localStorage.getItem(key)
  return JSON.parse(str)
}

function getRandomWords(length = 3) {
  let words = [
    "All",
    "I",
    "want",
    "for",
    "Christmas",
    "is",
    "you",
    "I",
    "dont",
    "want",
    "a",
    "lot",
    "for",
    "Christmas",
    "There",
    "is",
    "just",
    "one",
    "thing",
    "I",
    "need",
    "I",
    "dont",
    "care",
    "about",
    "the",
    "presents",
    "Underneath",
    "the",
    "Christmas",
    "tree",
    "I",
    "just",
    "want",
    "you",
    "for",
    "my",
    "own",
    "More",
    "than",
    "you",
    "could",
    "ever",
    "know",
    "Make",
    "my",
    "wish",
    "come",
    "true",
    "All",
    "I",
    "want",
    "for",
    "Christmas",
    "is",
    "you",
    "You",
    "baby",
    "Oh",
    "I",
    "wont",
    "ask",
    "for",
    "much",
    "this",
    "Christmas",
    "I",
    "wont",
    "even",
    "wish",
    "for",
    "snow",
    "And",
    "I",
    "I",
    "just",
    "wanna",
    "keep",
    "on",
    "waiting",
    "Underneath",
  ]
  let txt = ""
  for (let i = 0; i < length; i++) {
    let randomIdx = getRandomInt(0, words.length)
    txt += words[randomIdx] + " "
  }
  return txt
}

function showPopup(msg) {
  let elPopup = document.querySelector(".popup")
  elPopup.innerText = msg
  elPopup.classList.add("show")
  setTimeout(hidePopup, 3000)
}

function hidePopup() {
  let elPopup = document.querySelector(".popup")
  elPopup.classList.remove("show")
}
