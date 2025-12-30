const textToSpeech = require('@google-cloud/text-to-speech');
const fs = require('fs');
const path = require('path');

const client = new textToSpeech.TextToSpeechClient();

const words = [
  // NG words
  { word: "lang", phrase: "sehr lang", file: "lang" },
  { word: "Schlange", phrase: "eine lange Schlange", file: "Schlange" },
  { word: "singen", phrase: "schön singen", file: "singen" },
  { word: "bringen", phrase: "etwas bringen", file: "bringen" },
  { word: "springen", phrase: "hoch springen", file: "springen" },
  { word: "Finger", phrase: "mein Finger", file: "Finger" },
  { word: "Hunger", phrase: "großer Hunger", file: "Hunger" },
  { word: "jung", phrase: "sehr jung", file: "jung" },
  { word: "Junge", phrase: "ein kleiner Junge", file: "Junge" },
  { word: "Zunge", phrase: "die rote Zunge", file: "Zunge" },
  { word: "Klang", phrase: "ein schöner Klang", file: "Klang" },
  { word: "Gang", phrase: "ein langer Gang", file: "Gang" },
  { word: "Gesang", phrase: "lauter Gesang", file: "Gesang" },
  { word: "Zwang", phrase: "ohne Zwang", file: "Zwang" },
  { word: "Anfang", phrase: "am Anfang", file: "Anfang" },
  { word: "Empfang", phrase: "guter Empfang", file: "Empfang" },
  { word: "Umgang", phrase: "im Umgang", file: "Umgang" },
  { word: "Zugang", phrase: "freier Zugang", file: "Zugang" },
  { word: "Eingang", phrase: "am Eingang", file: "Eingang" },
  { word: "Ausgang", phrase: "der Ausgang", file: "Ausgang" },
  { word: "Ring", phrase: "ein goldener Ring", file: "Ring" },
  { word: "Ding", phrase: "ein komisches Ding", file: "Ding" },
  { word: "eng", phrase: "zu eng", file: "eng" },
  { word: "Menge", phrase: "eine große Menge", file: "Menge" },
  { word: "Enge", phrase: "in der Enge", file: "Enge" },
  { word: "streng", phrase: "sehr streng", file: "streng" },
  { word: "Stange", phrase: "eine lange Stange", file: "Stange" },
  { word: "Wange", phrase: "die rote Wange", file: "Wange" },
  { word: "Mange", phrase: "aus Mange", file: "Mange" },
  { word: "hängen", phrase: "an der Wand hängen", file: "haengen" },
  { word: "fangen", phrase: "den Ball fangen", file: "fangen" },
  { word: "anfangen", phrase: "neu anfangen", file: "anfangen" },
  { word: "empfangen", phrase: "Gäste empfangen", file: "empfangen" },
  { word: "gelungen", phrase: "gut gelungen", file: "gelungen" },
  { word: "gezwungen", phrase: "dazu gezwungen", file: "gezwungen" },
  { word: "gesungen", phrase: "laut gesungen", file: "gesungen" },
  { word: "gesprungen", phrase: "hoch gesprungen", file: "gesprungen" },
  { word: "Achtung", phrase: "Achtung bitte", file: "Achtung" },
  { word: "Ordnung", phrase: "in Ordnung", file: "Ordnung" },
  { word: "Hoffnung", phrase: "große Hoffnung", file: "Hoffnung" },
  // NK words
  { word: "danke", phrase: "vielen Dank, danke", file: "danke" },
  { word: "Bank", phrase: "die alte Bank", file: "Bank" },
  { word: "trinken", phrase: "Wasser trinken", file: "trinken" },
  { word: "denken", phrase: "genau denken", file: "denken" },
  { word: "schenken", phrase: "ein Geschenk schenken", file: "schenken" },
  { word: "sinken", phrase: "langsam sinken", file: "sinken" },
  { word: "winken", phrase: "freundlich winken", file: "winken" },
  { word: "Schrank", phrase: "ein großer Schrank", file: "Schrank" },
  { word: "krank", phrase: "sehr krank", file: "krank" },
  { word: "Dank", phrase: "vielen Dank", file: "Dank" },
  { word: "Gedanke", phrase: "ein guter Gedanke", file: "Gedanke" },
  { word: "Geschenk", phrase: "ein schönes Geschenk", file: "Geschenk" },
  { word: "Punkt", phrase: "der letzte Punkt", file: "Punkt" },
  { word: "dunkel", phrase: "ganz dunkel", file: "dunkel" },
  { word: "Onkel", phrase: "mein Onkel", file: "Onkel" },
  { word: "Enkel", phrase: "mein Enkel", file: "Enkel" },
  { word: "Schinken", phrase: "leckerer Schinken", file: "Schinken" },
  { word: "Funke", phrase: "ein kleiner Funke", file: "Funke" },
  { word: "Stunk", phrase: "großer Stunk", file: "Stunk" },
  { word: "Trunk", phrase: "ein kühler Trunk", file: "Trunk" },
  { word: "blinken", phrase: "hell blinken", file: "blinken" },
  { word: "stinken", phrase: "furchtbar stinken", file: "stinken" },
  { word: "hinken", phrase: "leicht hinken", file: "hinken" },
  { word: "lenken", phrase: "das Auto lenken", file: "lenken" },
  { word: "senken", phrase: "die Preise senken", file: "senken" },
  { word: "schwenken", phrase: "die Fahne schwenken", file: "schwenken" },
  { word: "Zink", phrase: "aus Zink", file: "Zink" },
  { word: "Link", phrase: "ein guter Link", file: "Link" },
  { word: "links", phrase: "nach links", file: "links" },
  { word: "Anker", phrase: "ein schwerer Anker", file: "Anker" },
  { word: "blanko", phrase: "ein blanko Formular", file: "blanko" },
  { word: "Bunker", phrase: "ein alter Bunker", file: "Bunker" },
  { word: "Klinke", phrase: "die Türklinke", file: "Klinke" },
  { word: "Planke", phrase: "eine alte Planke", file: "Planke" },
  { word: "Ranke", phrase: "eine grüne Ranke", file: "Ranke" },
  { word: "Schranke", phrase: "die geschlossene Schranke", file: "Schranke" },
  { word: "Schwank", phrase: "ein lustiger Schwank", file: "Schwank" },
  { word: "wanken", phrase: "leicht wanken", file: "wanken" },
  { word: "zanken", phrase: "laut zanken", file: "zanken" },
  { word: "Franke", phrase: "ein echter Franke", file: "Franke" }
];

const voiceConfig = {
  languageCode: 'de-DE',
  name: 'de-DE-Chirp3-HD-Algenib'
};

async function generateAudio(text, filename) {
  const request = {
    input: { text },
    voice: voiceConfig,
    audioConfig: { audioEncoding: 'MP3' }
  };

  const [response] = await client.synthesizeSpeech(request);
  const outputPath = path.join(__dirname, 'audio', filename + '.mp3');
  fs.writeFileSync(outputPath, response.audioContent);
  console.log(`Generated: ${filename}.mp3`);
}

async function main() {
  const audioDir = path.join(__dirname, 'audio');
  if (!fs.existsSync(audioDir)) {
    fs.mkdirSync(audioDir, { recursive: true });
  }

  console.log(`Generating ${words.length} audio files...`);

  for (const w of words) {
    await generateAudio(w.phrase, w.file);
  }

  console.log('Done!');

  const manifest = {
    generated: new Date().toISOString(),
    voice: voiceConfig.name,
    words: words.map(w => ({
      word: w.word,
      file: w.file,
      phrase: w.phrase
    }))
  };

  fs.writeFileSync(
    path.join(__dirname, 'audio-manifest.json'),
    JSON.stringify(manifest, null, 2)
  );
  console.log('Manifest saved.');
}

main().catch(console.error);
