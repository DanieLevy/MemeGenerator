'use strict'

// Storage Service

var STORAGE_KEY = 'memesDB'

function saveMeme() {
    // save each meme in local storage
    // give unique id to each meme
    // so i can save multiple memes on local storage and not override.
    var memes = loadFromStorage(STORAGE_KEY)
    if (!memes) memes = []
    var meme = getMeme()
    meme.id = makeId()
    memes.push(meme)
    saveToStorage(STORAGE_KEY, memes)
}

function getMemes() {
    // get all memes from local storage
    console.log('getMemes');
    return loadFromStorage(STORAGE_KEY)
}

function getMemeById(memeId) {
    // get meme by id fro, local storage
    var memes = getMemes()
    var meme = memes.find(function (meme) {
        return meme.id === memeId
    }
    )
    return meme
}

function deleteMeme(memeId) {
    // delete meme by id
    var memes = getMemes()
    var memeIdx = memes.findIndex(function (meme) {
        return meme.id === memeId
    })
    memes.splice(memeIdx, 1)
    saveToStorage(STORAGE_KEY, memes)
}