'use strict'

// Meme Generator Service

var gMeme;
var gIsLoaded = false

function createMeme(imgId, uploaded = false, newImgUrl = '') {
    gMeme = {
        selectedImgId: imgId,
        selectedLineIdx: 0,
        lines: [{
            txt: getRandomWords(),
            // txt: 'Enter text here',
            size: 50,
            align: 'center',
            color: 'white',
            strokeColor: 'black',
            font: 'Impact',
            posX: 275,
            posY: 100,
        }],
        stickers: [],
        uploaded: uploaded,
        newImgUrl: newImgUrl
    }
}

function getImgs() {
    return gImgs;
}

function getMeme() {
    if (gIsLoaded) return gLoadedMeme
    return gMeme;
}

function addLine(text) {
    gMeme.lines.push({
        txt: text,
        size: 50,
        align: 'center',
        color: 'white',
        strokeColor: 'black',
        font: 'Impact',
        posX: 275,
        posY: 450
    });
}

function deleteLine(lineIdx) {
    gMeme.lines.splice(lineIdx, 1);
}

function changeText(text, lineIdx) {
    gMeme.lines[lineIdx].txt = text;
}

function changeAlign(align, lineIdx) {
    gMeme.lines[lineIdx].align = align
}

function changeFontSize(diff, lineIdx) {
    gMeme.lines[lineIdx].size += diff;
    gMeme.lines[lineIdx].posY -= diff / 2
}

function changeFont(font, lineIdx) {
    gMeme.lines[lineIdx].font = font;
}

function changeFontColor(color, lineIdx) {
    gMeme.lines[lineIdx].color = color;
}

function changeStrokeColor(color, lineIdx) {
    gMeme.lines[lineIdx].strokeColor = color;
}

function switchLine() {
    if (gMeme.selectedLineIdx === gMeme.lines.length - 1) { // if last line
        gMeme.selectedLineIdx = 0; // switch to first line
    } else {
        gMeme.selectedLineIdx++; // switch to next line
    }
    return gMeme.selectedLineIdx;
}

// UTILS service functions

function getSelectedLine() {
    if (gIsLoaded) {
        return gLoadedMeme.lines[gLoadedMeme.selectedLineIdx]
    } else {
        return gMeme.lines[gMeme.selectedLineIdx]
    }
}

function setSelectedLine(lineIdx) {
    if (gIsLoaded) {
        gLoadedMeme.selectedLineIdx = lineIdx;
    } else {
        gMeme.selectedLineIdx = lineIdx;
    }
}

function getSelectedLineIdx() {
    if (gIsLoaded) {
        return gLoadedMeme.selectedLineIdx
    } else {
        return gMeme.selectedLineIdx
    }
}