const textToSpeech = require('@google-cloud/text-to-speech');
const fs = require('fs');
const path = require('path');

const client = new textToSpeech.TextToSpeechClient();

const words = [
  // -e endings (20)
  { word: "Tasse", phrase: "eine volle Tasse", file: "Tasse" },
  { word: "Lampe", phrase: "eine helle Lampe", file: "Lampe" },
  { word: "Frage", phrase: "eine gute Frage", file: "Frage" },
  { word: "Straße", phrase: "eine lange Straße", file: "Strasse" },
  { word: "Schule", phrase: "die alte Schule", file: "Schule" },
  { word: "Kirche", phrase: "die kleine Kirche", file: "Kirche" },
  { word: "Küche", phrase: "die neue Küche", file: "Kueche" },
  { word: "Brücke", phrase: "die alte Brücke", file: "Bruecke" },
  { word: "Tasche", phrase: "meine große Tasche", file: "Tasche" },
  { word: "Woche", phrase: "diese Woche", file: "Woche" },
  { word: "Reise", phrase: "eine lange Reise", file: "Reise" },
  { word: "Sprache", phrase: "die deutsche Sprache", file: "Sprache" },
  { word: "Sache", phrase: "eine wichtige Sache", file: "Sache" },
  { word: "Katze", phrase: "die kleine Katze", file: "Katze" },
  { word: "Mütze", phrase: "eine warme Mütze", file: "Muetze" },
  { word: "Blume", phrase: "eine schöne Blume", file: "Blume" },
  { word: "Sonne", phrase: "die helle Sonne", file: "Sonne" },
  { word: "Erde", phrase: "die ganze Erde", file: "Erde" },
  { word: "Seite", phrase: "die linke Seite", file: "Seite" },
  { word: "Hilfe", phrase: "schnelle Hilfe", file: "Hilfe" },
  // -en endings (20)
  { word: "gehen", phrase: "langsam gehen", file: "gehen" },
  { word: "kommen", phrase: "bald kommen", file: "kommen" },
  { word: "laufen", phrase: "schnell laufen", file: "laufen" },
  { word: "schlafen", phrase: "gut schlafen", file: "schlafen" },
  { word: "sprechen", phrase: "laut sprechen", file: "sprechen" },
  { word: "essen", phrase: "etwas essen", file: "essen" },
  { word: "trinken", phrase: "Wasser trinken", file: "trinken" },
  { word: "Garten", phrase: "im Garten", file: "Garten" },
  { word: "Wagen", phrase: "ein neuer Wagen", file: "Wagen" },
  { word: "Boden", phrase: "der harte Boden", file: "Boden" },
  { word: "Regen", phrase: "starker Regen", file: "Regen" },
  { word: "Laden", phrase: "ein kleiner Laden", file: "Laden" },
  { word: "Faden", phrase: "ein dünner Faden", file: "Faden" },
  { word: "Ofen", phrase: "ein heißer Ofen", file: "Ofen" },
  { word: "Hafen", phrase: "der große Hafen", file: "Hafen" },
  { word: "Kuchen", phrase: "ein leckerer Kuchen", file: "Kuchen" },
  { word: "Rücken", phrase: "mein Rücken", file: "Ruecken" },
  { word: "Knochen", phrase: "ein harter Knochen", file: "Knochen" },
  { word: "Schatten", phrase: "im Schatten", file: "Schatten" },
  { word: "Westen", phrase: "im Westen", file: "Westen" },
  // -el endings (20)
  { word: "Artikel", phrase: "ein langer Artikel", file: "Artikel" },
  { word: "Handel", phrase: "freier Handel", file: "Handel" },
  { word: "Mittel", phrase: "ein gutes Mittel", file: "Mittel" },
  { word: "Vögel", phrase: "kleine Vögel", file: "Voegel" },
  { word: "Löffel", phrase: "ein großer Löffel", file: "Loeffel" },
  { word: "Schlüssel", phrase: "mein Schlüssel", file: "Schluessel" },
  { word: "Himmel", phrase: "der blaue Himmel", file: "Himmel" },
  { word: "Tunnel", phrase: "ein langer Tunnel", file: "Tunnel" },
  { word: "Mantel", phrase: "ein warmer Mantel", file: "Mantel" },
  { word: "Deckel", phrase: "der runde Deckel", file: "Deckel" },
  { word: "Gürtel", phrase: "ein brauner Gürtel", file: "Guertel" },
  { word: "Zettel", phrase: "ein kleiner Zettel", file: "Zettel" },
  { word: "Möbel", phrase: "neue Möbel", file: "Moebel" },
  { word: "Rätsel", phrase: "ein schweres Rätsel", file: "Raetsel" },
  { word: "Esel", phrase: "ein grauer Esel", file: "Esel" },
  { word: "Insel", phrase: "eine kleine Insel", file: "Insel" },
  { word: "Würfel", phrase: "ein roter Würfel", file: "Wuerfel" },
  { word: "Gipfel", phrase: "der hohe Gipfel", file: "Gipfel" },
  { word: "Stiefel", phrase: "schwarze Stiefel", file: "Stiefel" },
  { word: "Apfel", phrase: "ein roter Apfel", file: "Apfel" },
  // -er endings (20)
  { word: "Lehrer", phrase: "mein Lehrer", file: "Lehrer" },
  { word: "Wasser", phrase: "kaltes Wasser", file: "Wasser" },
  { word: "Fenster", phrase: "das offene Fenster", file: "Fenster" },
  { word: "besser", phrase: "viel besser", file: "besser" },
  { word: "Finger", phrase: "mein Finger", file: "Finger" },
  { word: "Hunger", phrase: "großer Hunger", file: "Hunger" },
  { word: "Bruder", phrase: "mein Bruder", file: "Bruder" },
  { word: "Mutter", phrase: "meine Mutter", file: "Mutter" },
  { word: "Vater", phrase: "mein Vater", file: "Vater" },
  { word: "Schwester", phrase: "meine Schwester", file: "Schwester" },
  { word: "Kinder", phrase: "kleine Kinder", file: "Kinder" },
  { word: "Zimmer", phrase: "mein Zimmer", file: "Zimmer" },
  { word: "Sommer", phrase: "im Sommer", file: "Sommer" },
  { word: "Winter", phrase: "im Winter", file: "Winter" },
  { word: "Butter", phrase: "frische Butter", file: "Butter" },
  { word: "Tochter", phrase: "meine Tochter", file: "Tochter" },
  { word: "Messer", phrase: "ein scharfes Messer", file: "Messer" },
  { word: "Teller", phrase: "ein leerer Teller", file: "Teller" },
  { word: "Koffer", phrase: "mein Koffer", file: "Koffer" },
  { word: "Körper", phrase: "der ganze Körper", file: "Koerper" }
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
