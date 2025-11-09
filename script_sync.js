// ============================
// Lingua
// ============================
const params = new URLSearchParams(window.location.search);
const lang = params.get('lang') || 'it';

function updateLanguage() {
    document.querySelectorAll('[data-it]').forEach(el => {
        el.textContent = (lang==='it') ? el.getAttribute('data-it') : el.getAttribute('data-en');
    });
}
updateLanguage();

// ============================
// Recupera dati da sessionStorage
// ============================
const songData = JSON.parse(sessionStorage.getItem('songData') || '{}');
document.getElementById('song-title').textContent = songData.titolo || 'Titolo';

const lyricsListContainer = document.getElementById('lyrics-list');
const lines = songData.testo ? songData.testo.split(/\r?\n/) : [];

lines.forEach(line => {
    const li = document.createElement('li');
    li.dataset.it = line;
    li.dataset.en = line; // se hai la traduzione, sostituire qui
    li.dataset.time = '';
    li.textContent = li.dataset.it;
    lyricsListContainer.appendChild(li);
});

// ============================
// Riferimenti
// ============================
const startBtn = document.getElementById('start');
const nextBtn = document.getElementById('next-line');
const resetBtn = document.getElementById('reset');
const loadAudioBtn = document.getElementById('load-audio');

let audio = null;
let audioFileName = 'song';
let isPlaying = false;
let currentLine = 0;

// ============================
// Caricamento audio
// ============================
loadAudioBtn.addEventListener('click', () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'audio/*';
    input.onchange = e => {
        const file = e.target.files[0];
        if(file){
            audioFileName = file.name.replace(/\.[^/.]+$/, "");
            audio = new Audio(URL.createObjectURL(file));
            audio.addEventListener('ended', () => {
                isPlaying = false;
                startBtn.textContent = lang==='it' ? 'Scarica LRC' : 'Download LRC';
            });
            alert(lang==='it' ? 'Audio caricato' : 'Audio loaded');
        }
    };
    input.click();
});

// ============================
// Play / Pausa
// ============================
startBtn.addEventListener('click', () => {
    if(!audio) return alert(lang==='it' ? 'Carica prima l\'audio' : 'Load audio first');

    if(!isPlaying){
        audio.play();
        startBtn.textContent = lang==='it' ? 'Pausa' : 'Pause';
        isPlaying = true;
    } else {
        audio.pause();
        startBtn.textContent = lang==='it' ? 'Play' : 'Play';
        isPlaying = false;
    }
});

// ============================
// Next Line
// ============================
nextBtn.addEventListener('click', () => {
    if(!isPlaying) return;
    const line = lyricsListContainer.children[currentLine];
    if(line){
        const time = audio.currentTime;
        line.dataset.time = time;
        line.innerHTML = `<b>${line.dataset.it}</b> <span style="opacity:0.6;">[${formatTime(time)}]</span>`;
        currentLine++;
    }
});

// ============================
// Click su riga per rimuovere timestamp
// ============================
Array.from(lyricsListContainer.children).forEach((line,i)=>{
    line.addEventListener('click', ()=>{
        if(line.querySelector('b')){
            line.textContent = line.dataset.it;
            if(i<currentLine) currentLine = i;
            if(audio) audio.currentTime = line.dataset.time ? line.dataset.time : 0;
        }
    });
});

// ============================
// Reset
// ============================
resetBtn.addEventListener('click', ()=>{
    if(audio) audio.pause();
    isPlaying = false;
    currentLine = 0;
    if(audio) audio.currentTime = 0;
    startBtn.textContent = lang==='it' ? 'Start / Pausa' : 'Start / Pause';
    Array.from(lyricsListContainer.children).forEach(line=>{
        line.textContent = line.dataset.it;
        line.dataset.time = '';
    });
});

// ============================
// Download LRC
// ============================
function formatTime(time){
    const min = Math.floor(time/60).toString().padStart(2,'0');
    const sec = (time%60).toFixed(3).padStart(6,'0');
    return `${min}:${sec}`;
}

function downloadLRC(){
    let lrc = `[ti:${songData.titolo || ''}]\n[ar:${songData.artista || ''}]\n[al:${songData.album || ''}]\n[by:${songData.by || ''}]\n[au:${songData.compositore || ''}]\n[la:${songData.lingua || 'IT'}]\n`;
    Array.from(lyricsListContainer.children).forEach(line=>{
        const time = line.dataset.time ? formatTime(line.dataset.time) : '00:00.000';
        lrc += `[${time}] ${line.dataset.it} / ${line.dataset.en}\n`;
    });

    const blob = new Blob([lrc],{type:'text/plain;charset=utf-8'});
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${audioFileName}.lrc`;
    a.click();
}

// Scarica automaticamente LRC quando audio finisce e si clicca Start/Pause
startBtn.addEventListener('click', ()=>{
    if(!isPlaying && audio && audio.ended){
        downloadLRC();
    }
});
