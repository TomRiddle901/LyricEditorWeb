# Lyric Editor / Lyric Editor

Lyric Editor è un’applicazione web per scrivere, modificare e sincronizzare testi di canzoni con tracce audio.  
Permette di aggiungere timestamp, visualizzare il testo in grassetto durante la riproduzione, e esportare il file sincronizzato in formato LRC.

Lyric Editor is a web application to write, edit, and synchronize song lyrics with audio tracks.  
It allows adding timestamps, highlighting the text in bold during playback, and exporting the synchronized lyrics in LRC format.

## Funzionalità principali / Main Features

- Editor del testo della canzone con supporto multilingua (IT / EN)  
  Song lyrics editor with multilingual support (IT / EN)
- Sincronizzazione con file audio (mp3, wav, ecc.)  
  Audio file synchronization (mp3, wav, etc.)
- Timer per i timestamp  
  Timer for timestamps
- Evidenziazione del testo linea per linea  
  Line-by-line text highlighting
- Possibilità di rimuovere timestamp cliccando sulle linee  
  Ability to remove timestamps by clicking on lines
- Esportazione del file LRC con metadati: titolo, artista, album, compositore, lingua, BY  
  Export LRC file with metadata: title, artist, album, composer, language, BY
- Il file LRC ha lo stesso nome del file audio caricato  
  The LRC file will have the same name as the uploaded audio file

## Come usare / How to Use

1. Aprire `index.html` nel browser  
   Open `index.html` in the browser
2. Inserire le informazioni della canzone e il testo  
   Enter the song details and lyrics
3. Cliccare **Sincronizza con la musica** per aprire la pagina `sync.html`  
   Click **Sync with Music** to open the `sync.html` page
4. Caricare l’audio e sincronizzare il testo cliccando **Start / Pausa** e **Prossima linea**  
   Upload the audio and synchronize the lyrics by clicking **Start / Pause** and **Next Line**
5. Alla fine della sincronizzazione, cliccare **Scarica LRC** per salvare il file  
   At the end of the synchronization, click **Download LRC** to save the file

## Tecnologie utilizzate / Technologies Used

- HTML5
- CSS3
- JavaScript

## Struttura file / File Structure

- `index.html` → Editor testo canzone / Song lyrics editor
- `sync.html` → Sincronizzazione con audio / Audio synchronization
- `script_index.js` → Logica editor testo / Text editor logic
- `script_sync.js` → Logica sincronizzazione / Synchronization logic
- `style_index.css` → Stili per editor / Styles for editor
- `style_sync.css` → Stili per sincronizzazione / Styles for synchronization
- `Assets/` → Icone e risorse statiche / Icons and static resources

## Licenza / License

Questo progetto è open source.  
This project is open source.
