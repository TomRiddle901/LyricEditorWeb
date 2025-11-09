// ============================
// Lingua
// ============================
const params = new URLSearchParams(window.location.search);
const lang = params.get('lang') || 'it';

function updateLanguage(){
    document.querySelectorAll('[data-it]').forEach(el => {
        el.textContent = (lang==='it') ? el.getAttribute('data-it') : el.getAttribute('data-en');
    });
}

// ============================
// Recupero dati da index.html
// ============================
const title = sessionStorage.getItem('title') || 'Titolo';
const artist = sessionStorage.getItem('artist') || 'Artista';
const album = sessionStorage.getItem('album') || '';
const composer = sessionStorage.getItem('composer') || '';
const by = sessionStorage.getItem('by') || '';
const lyricsIt = sessionStorage.getItem('lyrics-it') || '';
const lyricsEn = sessionStorage.getItem('lyrics-en') || '';

document.getElementById('song-title').textContent = title;

// Trasforma testi in lista <li>
const lyricsListContainer = document.getElementById('lyrics-list');
const itLines = lyricsIt.split(/\r?\n/);
const enLines = lyricsEn.split(/\r?\n/);

for(let i=0;i<Math.max(itLines.length,enLines.length);i++){
    const li = document.createElement('li');
    li.dataset.it = itLines[i] || '';
    li.dataset.en = enLines[i] || '';
    li.dataset.time = '';
    li.textContent = li.dataset.it;
    lyricsListContainer.appendChild(li);
}

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
// Timer automatico
// ============================
let timer = null;

startBtn.addEventListener('click', () => {
    if(!audio) return alert(lang==='it' ? 'Carica prima l\'audio' : 'Load audio first');

    if(!isPlaying){
        audio.play();
        startBtn.textContent = lang==='it' ? 'Pausa' : 'Pause';
        isPlaying = true;
    } else{
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
// Click su linea per rimuovere timestamp
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
    audio ? audio.currentTime = 0 : null;
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

startBtn.addEventListener('click', ()=>{
    if(!isPlaying && audio && audio.ended){
        downloadLRC();
    }
});

function downloadLRC(){
    const lines = Array.from(lyricsListContainer.children);
    let lrc = `[ti:${title}]\n[ar:${artist}]\n[al:${album}]\n[by:${by}]\n[au:${composer}]\n[la:${lang}]\n`;
    lines.forEach(line=>{
        const time = line.dataset.time ? formatTime(line.dataset.time) : '00:00.000';
        lrc += `[${time}] ${line.dataset.it} / ${line.dataset.en}\n`;
    });

    const blob = new Blob([lrc],{type:'text/plain;charset=utf-8'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${audioFileName}.lrc`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}