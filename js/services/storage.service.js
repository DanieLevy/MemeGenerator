"use strict"

// Storage Service

var STORAGE_KEY = "memesDB"

function saveMeme() {
  let memes = loadFromStorage(STORAGE_KEY)
  if (!memes) memes = []
  let meme = getMeme()
  meme.id = makeId()
  memes.push(meme)
  saveToStorage(STORAGE_KEY, memes)
}

function getMemes() {
  return loadFromStorage(STORAGE_KEY)
}

function getMemeById(memeId) {
  let memes = getMemes()
  let meme = memes.find(function (meme) {
    return meme.id === memeId
  })
  return meme
}

function deleteMeme(memeId) {
  let memes = getMemes()
  let memeIdx = memes.findIndex(function (meme) {
    return meme.id === memeId
  })
  memes.splice(memeIdx, 1)
  saveToStorage(STORAGE_KEY, memes)
}
