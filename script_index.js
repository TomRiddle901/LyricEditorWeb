// ============================
// Riferimenti agli elementi
// ============================
const langSelect = document.getElementById('lang');
const syncBtn = document.getElementById('sync');
const resetBtn = document.getElementById('reset');
const titolo = document.getElementById('titolo');
const compositore = document.getElementById('compositore');
const artista = document.getElementById('artista');
const album = document.getElementById('album');
const lingua = document.getElementById('lingua');
const by = document.getElementById('by');
const testo = document.getElementById('testo');

// ============================
// Gestione lingua
// ============================
function updateLanguage() {
    const lang = localStorage.getItem('lang') || 'it';
    langSelect.value = lang;
    document.querySelectorAll('[data-it]').forEach(el => {
        el.textContent = lang === 'it' ? el.getAttribute('data-it') : el.getAttribute('data-en');
    });
}
updateLanguage();

langSelect.addEventListener('change', () => {
    const lang = langSelect.value;
    localStorage.setItem('lang', lang);
    updateLanguage();
});

// ============================
// Reset dei campi
// ============================
resetBtn.addEventListener('click', () => {
    const lang = langSelect.value;
    const confirmText = lang === 'it' ? 'Sei sicuro di voler resettare tutti i campi?' : 'Are you sure you want to reset all fields?';
    if (confirm(confirmText)) {
        titolo.value = '';
        compositore.value = '';
        artista.value = '';
        album.value = '';
        lingua.value = 'it';
        by.value = '';
        testo.value = '';
    }
});

// ============================
// Pulsante Sync
// ============================
syncBtn.addEventListener('click', () => {
    const data = {
        titolo: titolo.value,
        compositore: compositore.value,
        artista: artista.value,
        album: album.value,
        lingua: lingua.value,
        by: by.value,
        testo: testo.value
    };
    sessionStorage.setItem('songData', JSON.stringify(data));
    const lang = langSelect.value;
    window.location.href = `sync.html?lang=${lang}`;
});

// ============================
// Altri pulsanti editor (load, strip, export, pdf, toupper, ecc.)
// ============================
// Carica testo
document.getElementById('load').addEventListener('click', () => {
    const inputFile = document.createElement('input');
    inputFile.type = 'file';
    inputFile.accept = '.txt';
    inputFile.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = ev => testo.value = ev.target.result;
        reader.readAsText(file, 'utf-8');
    });
    inputFile.click();
});

// Rimuovi sezioni [xx:xx] ecc.
document.getElementById('stripsec').addEventListener('click', () => {
    if (!testo.value.trim()) return alert((langSelect.value==='it'?'Nessun testo da modificare':'No text to modify'));
    testo.value = testo.value.replace(/\[.*?\]\s*/g, '');
});

// Rimuovi tag HTML
document.getElementById('striptags').addEventListener('click', () => {
    if (!testo.value.trim()) return alert((langSelect.value==='it'?'Nessun testo da modificare':'No text to modify'));
    testo.value = testo.value.replace(/<[^>]*>/g, '');
});

// Esporta TXT
document.getElementById('export').addEventListener('click', () => {
    if (!testo.value.trim()) return alert((langSelect.value==='it'?'Nessun testo da esportare':'No text to export'));
    const fileName = titolo.value.trim() || 'lyrics';
    const blob = new Blob([testo.value], {type:'text/plain'});
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${fileName}.txt`;
    a.click();
});

// abc > ABC
document.getElementById('toupper').addEventListener('click', () => {
    testo.value = testo.value.toUpperCase();
});

// Parola per parola
document.getElementById('wordbyword').addEventListener('click', () => {
    if (!testo.value.trim()) return alert((langSelect.value==='it'?'Nessun testo da modificare':'No text to modify'));
    testo.value = testo.value.split(/\s+/).join('\n');
});