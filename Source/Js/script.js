let $ = document

//////////////////////////////

// variables /////////////////
const body = $.body
const searchInput = $.querySelector(".search-input")
const searchBtn = $.querySelector(".search-btn")
const searchAlert = $.querySelector(".search-alert")
const wordInfoContainer = $.querySelector(".word-info-container")

// functions ////////////////
// to get user screen height and set it as body min height
function liveUserScreenHeight(){
    let userScreenHeight = visualViewport.height + "px"
    body.style.minHeight = userScreenHeight
}

// to focus on the input if the user pressed the Enter btn
function inputFocus(event){
    if(event.key === "Enter"){
        searchInput.focus()
    }
}

// to send an API reqest to get word info
function sendApiReq() {
    let mainWord = searchInput.value

    hideAlert()

    fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${mainWord}`)
        .then(res => {
            if(res.status === 200){
                return res.json()
            }else{
                wordInfoContainer.classList.remove("slide-show")
                showAlert()
            }
        })
        .then(data => showData(data))
}

// to show input alert
function showAlert(){
    searchAlert.classList.remove("hide")
}

// to hide input alert
function hideAlert(){
    searchAlert.classList.add("hide")
}

// to show API data on the dom
function showData(data){
    wordInfoContainer.innerHTML = ""

    let wordInfo = $.createElement("div")
    wordInfo.className = "word-info"

    wordInfo.insertAdjacentHTML("beforeend" , 
       `<div class="d-flex justify-content-between align-items-center pt-5">
            <div class="word">${data[0].word}</div>
            <i class="audio-icon bi bi-volume-up" onclick="playAudio()"></i>
            <audio class="spelling-audio" src="${data[0].phonetics[0].audio}"></audio>
        </div>
        <div class="part-of-speech-and-spelling">${data[0].meanings[0].partOfSpeech} ${data[0].phonetic}</div>
        <p class="word-discription pe-4 mt-3">${data[0].meanings[0].definitions[0].definition}</p>`
    )

    wordInfoContainer.append(wordInfo)
    wordInfoContainer.classList.add("slide-show")

    searchInput.value = ""
}

// to play the spelling audio file of the word
function playAudio(){
    let audioElem = $.querySelector(".spelling-audio")

    audioElem.play()
}

// eventlisteners /////////////
window.addEventListener("load" , liveUserScreenHeight)
window.addEventListener("resize" , liveUserScreenHeight)
window.addEventListener("keydown" , () => inputFocus(event))
searchBtn.addEventListener("click" , sendApiReq)
