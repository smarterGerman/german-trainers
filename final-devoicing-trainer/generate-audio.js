const textToSpeech = require('@google-cloud/text-to-speech');
const fs = require('fs');
const path = require('path');

const client = new textToSpeech.TextToSpeechClient();

const words = [
  // DEVOICED words (40)
  { word: "Hund", phrase: "der treue Hund", file: "Hund" },
  { word: "Kind", phrase: "das kleine Kind", file: "Kind" },
  { word: "Freund", phrase: "mein bester Freund", file: "Freund" },
  { word: "Mund", phrase: "der offene Mund", file: "Mund" },
  { word: "Wand", phrase: "an der Wand", file: "Wand" },
  { word: "Hand", phrase: "meine rechte Hand", file: "Hand" },
  { word: "Land", phrase: "ein schönes Land", file: "Land" },
  { word: "Bild", phrase: "ein altes Bild", file: "Bild" },
  { word: "Geld", phrase: "viel Geld", file: "Geld" },
  { word: "Feld", phrase: "auf dem Feld", file: "Feld" },
  { word: "Pferd", phrase: "ein schnelles Pferd", file: "Pferd" },
  { word: "Rad", phrase: "das runde Rad", file: "Rad" },
  { word: "Bad", phrase: "ein warmes Bad", file: "Bad" },
  { word: "Grad", phrase: "zwanzig Grad", file: "Grad" },
  { word: "lieb", phrase: "sehr lieb", file: "lieb" },
  { word: "Dieb", phrase: "der böse Dieb", file: "Dieb" },
  { word: "halb", phrase: "nur halb", file: "halb" },
  { word: "gelb", phrase: "ganz gelb", file: "gelb" },
  { word: "Korb", phrase: "ein voller Korb", file: "Korb" },
  { word: "Urlaub", phrase: "im Urlaub", file: "Urlaub" },
  { word: "Staub", phrase: "viel Staub", file: "Staub" },
  { word: "Laub", phrase: "buntes Laub", file: "Laub" },
  { word: "Tag", phrase: "ein schöner Tag", file: "Tag" },
  { word: "Weg", phrase: "der lange Weg", file: "Weg" },
  { word: "Zug", phrase: "der schnelle Zug", file: "Zug" },
  { word: "Flug", phrase: "ein langer Flug", file: "Flug" },
  { word: "Berg", phrase: "ein hoher Berg", file: "Berg" },
  { word: "Krieg", phrase: "im Krieg", file: "Krieg" },
  { word: "Sieg", phrase: "der große Sieg", file: "Sieg" },
  { word: "Schlag", phrase: "ein harter Schlag", file: "Schlag" },
  { word: "Betrug", phrase: "ein großer Betrug", file: "Betrug" },
  { word: "Erfolg", phrase: "viel Erfolg", file: "Erfolg" },
  { word: "Vertrag", phrase: "der neue Vertrag", file: "Vertrag" },
  { word: "Antrag", phrase: "ein wichtiger Antrag", file: "Antrag" },
  { word: "Verband", phrase: "ein fester Verband", file: "Verband" },
  { word: "Abend", phrase: "guten Abend", file: "Abend" },
  { word: "Jugend", phrase: "in der Jugend", file: "Jugend" },
  { word: "Werbung", phrase: "viel Werbung", file: "Werbung" },
  { word: "Zeitung", phrase: "die heutige Zeitung", file: "Zeitung" },
  { word: "Ordnung", phrase: "in Ordnung", file: "Ordnung" },
  // VOICED words (40)
  { word: "Hunde", phrase: "die treuen Hunde", file: "Hunde" },
  { word: "Kinder", phrase: "die kleinen Kinder", file: "Kinder" },
  { word: "Freunde", phrase: "meine besten Freunde", file: "Freunde" },
  { word: "Hände", phrase: "beide Hände", file: "Haende" },
  { word: "Bilder", phrase: "alte Bilder", file: "Bilder" },
  { word: "Gelder", phrase: "öffentliche Gelder", file: "Gelder" },
  { word: "Pferde", phrase: "schnelle Pferde", file: "Pferde" },
  { word: "lieben", phrase: "ich liebe dich", file: "lieben" },
  { word: "Diebe", phrase: "die bösen Diebe", file: "Diebe" },
  { word: "gelbe", phrase: "die gelbe Blume", file: "gelbe" },
  { word: "halbe", phrase: "die halbe Stunde", file: "halbe" },
  { word: "geben", phrase: "etwas geben", file: "geben" },
  { word: "leben", phrase: "gut leben", file: "leben" },
  { word: "Tage", phrase: "alle Tage", file: "Tage" },
  { word: "Wege", phrase: "neue Wege", file: "Wege" },
  { word: "Berge", phrase: "hohe Berge", file: "Berge" },
  { word: "fragen", phrase: "etwas fragen", file: "fragen" },
  { word: "tragen", phrase: "schwer tragen", file: "tragen" },
  { word: "sagen", phrase: "etwas sagen", file: "sagen" },
  { word: "fliegen", phrase: "hoch fliegen", file: "fliegen" },
  { word: "siegen", phrase: "immer siegen", file: "siegen" },
  { word: "Erfolge", phrase: "große Erfolge", file: "Erfolge" },
  { word: "Abende", phrase: "schöne Abende", file: "Abende" },
  { word: "Räder", phrase: "große Räder", file: "Raeder" },
  { word: "Bäder", phrase: "warme Bäder", file: "Baeder" },
  { word: "Länder", phrase: "viele Länder", file: "Laender" },
  { word: "Wände", phrase: "weiße Wände", file: "Waende" },
  { word: "Felder", phrase: "grüne Felder", file: "Felder" },
  { word: "binden", phrase: "fest binden", file: "binden" },
  { word: "finden", phrase: "etwas finden", file: "finden" },
  { word: "werden", phrase: "besser werden", file: "werden" },
  { word: "reden", phrase: "viel reden", file: "reden" },
  { word: "laden", phrase: "etwas laden", file: "laden" },
  { word: "baden", phrase: "im Meer baden", file: "baden" },
  { word: "billig", phrase: "sehr billig", file: "billig" },
  { word: "fertig", phrase: "fast fertig", file: "fertig" },
  { word: "fleißig", phrase: "sehr fleißig", file: "fleissig" },
  { word: "ruhig", phrase: "ganz ruhig", file: "ruhig" },
  { word: "lustig", phrase: "sehr lustig", file: "lustig" },
  { word: "Munde", phrase: "im Munde", file: "Munde" }
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
