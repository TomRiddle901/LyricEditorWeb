// Rileva elementi
const langSelect = document.getElementById('lang');
const syncLink = document.getElementById('sync-link');
const resetBtn = document.getElementById('reset');

const titolo = document.getElementById('titolo');
const compositore = document.getElementById('compositore');
const artista = document.getElementById('artista');
const album = document.getElementById('album');
const lingua = document.getElementById('lingua');
const by = document.getElementById('by');
const testo = document.getElementById('testo');

// Aggiorna i testi della pagina
function updateLanguage() {
    const lang = localStorage.getItem('lang') || 'it';
    langSelect.value = lang; // imposta la select alla lingua salvata
    document.querySelectorAll('[data-it]').forEach(el => {
        el.textContent = lang === 'it'
            ? el.getAttribute('data-it')
            : el.getAttribute('data-en');
    });
}

// Quando l'utente cambia lingua
langSelect.addEventListener('change', () => {
    const lang = langSelect.value;
    localStorage.setItem('lang', lang); // salva la scelta
    updateLanguage(); // aggiorna i testi
    syncLink.href = `sync.html?lang=${lang}`; // aggiorna il link
});

resetBtn.addEventListener('click', () => {
    const selectedLang = langSelect.value;
    const confirmedText = selectedLang === 'en' ? 'Are you sure you want to reset all fields?' : 'Sei sicuro di voler resettare tutti i campi?';
    if (confirm(confirmedText)){
        titolo.value = '';
        compositore.value = '';
        artista.value = '';
        album.value = '';
        lingua.value = 'it';
        by.value = '';
        testo.value = '';
    }
});

// Pulsante sync
document.getElementById('sync').addEventListener('click', (e) => {
    e.preventDefault();
    // Salva temporaneamente i dati in local storage per usarli su sync.html
    const data = {
        titolo: titolo.value,
        compositore: compositore.value,
        artista: artista.value,
        album: album.value,
        lingua: lingua.value,
        by: by.value,
        testo: testo.value
    };
    localStorage.setItem('songData', JSON.stringify(data));
    window.location.href = 'sync.html';
});

// Placeholder per altri pulsanti
document.getElementById('load').addEventListener('click', () => {
    // Crea input file nascosto
    const inputFile = document.createElement('input');
    inputFile.type = 'file';
    inputFile.accept = '.txt';

    inputFile.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            testo.value = e.target.result;
        };
        reader.readAsText(file, 'utf-8');
    });

    inputFile.click(); // apre il selettore file
});
document.getElementById('stripsec').addEventListener('click', () => {
    let testo = document.getElementById('testo');
    if (!testo.value.trim()){
        const selectedLang = (langSelect && langSelect.value) || localStorage.getItem('lang') || 'it';
        const alertText = selectedLang === 'en' ? 'No text to modify' : 'Nessun testo da modificare';
        alert(alertText);
        return;
    }

    testo.value = testo.value.replace(/\[.*?\]\s*/g, '');
});
document.getElementById('striptags').addEventListener('click', () => {
    let testo = document.getElementById('testo');
    if (!testo.value.trim()){
        const selectedLang = (langSelect && langSelect.value) || localStorage.getItem('lang') || 'it';
        const alertText = selectedLang === 'en' ? 'No text to modify' : 'Nessun testo da modificare';
        alert(alertText);
        return;
    }

    // Rimuove tutti i tag HTML o simili
    testo.value = testo.value.replace(/<[^>]*>/g, '');
});
document.getElementById('export').addEventListener('click', () => {
    const testo = document.getElementById('testo').value.trim();
    if (!testo){
        const selectedLang = (langSelect && langSelect.value) || localStorage.getItem('lang') || 'it';
        const alertText = selectedLang === 'en' ? 'No text to export' : 'Nessun testo da esportare';
        alert(alertText);
        return;
    }

    const titolo = document.getElementById('titolo').value.trim() || 'lyrics';
    const blob = new Blob([testo], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `${titolo}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
});
document.getElementById('pdf').addEventListener('click', () => {
    const { jsPDF } = window.jspdf;
    const testo = document.getElementById('testo').value.trim();
    const titolo = document.getElementById('titolo').value.trim() || 'lyrics';

    if (!testo){
        const selectedLang = (langSelect && langSelect.value) || localStorage.getItem('lang') || 'it';
        const alertText = selectedLang === 'en' ? 'No text to export' : 'Nessun testo da esportare';
        alert(alertText);
        return;
    }

    const pdf = new jsPDF();
    pdf.setFont("Helvetica", "normal");
    pdf.setFontSize(14);
    pdf.text(titolo, 10, 10);
    pdf.setFontSize(12);

    const righe = pdf.splitTextToSize(testo, 100);
    pdf.text(righe, 10, 20);

    pdf.save(`${titolo}.pdf`);
});
document.getElementById('unlimit').addEventListener('click', () => {
    const textarea = document.getElementById('testo');

    textarea.removeAttribute('maxlenght'); // rimuove limite se esiste
    textarea.style.height = 'auto'; // adatta altezza dinamicamente
    textarea.style.overflowY = 'visible' // disattiva scrollbar

    const selectedLang = (langSelect && langSelect.value) || localStorage.getItem('lang') || 'it';
    const alertText = selectedLang === 'en'
        ? 'Character limit removed. You can now write freely'
        : 'Limite di caratteri rimosso. Ora puoi scrivere liberamente';
    alert(alertText);
});
document.getElementById('toupper').addEventListener('click', () => {
    const textarea = document.getElementById('testo');
    textarea.value = textarea.value.toUpperCase();
});
document.getElementById('wordbyword').addEventListener('click', () => {
    const textarea = document.getElementById('testo');
    const testo = textarea.value.trim();

    if (!testo){
        const selectedLang = (langSelect && langSelect.value) || localStorage.getItem('lang') || 'it';
        const alertText = selectedLang === 'en' ? 'No text to modify' : 'Nessun testo da modificare';
        alert(alertText);
        return;
    }

    // Divide il testo in parole
    const parole = testo.split(/\s+/);

    // Mostra le parole una per riga nel textarea (o si potrebbe creare un div dedicato)
    textarea.value = parole.join('\n');
});

// Inizializza la pagina
updateLanguage();
syncLink.href = `sync.html?lang=${langSelect.value}`;