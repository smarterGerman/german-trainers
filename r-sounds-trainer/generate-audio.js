const textToSpeech = require('@google-cloud/text-to-speech');
const fs = require('fs');
const path = require('path');

const client = new textToSpeech.TextToSpeechClient();

const words = [
  // UVULAR R - at beginning or after consonant (40)
  { word: "rot", phrase: "ganz rot", file: "rot" },
  { word: "Regen", phrase: "starker Regen", file: "Regen" },
  { word: "reisen", phrase: "gern reisen", file: "reisen" },
  { word: "richtig", phrase: "ganz richtig", file: "richtig" },
  { word: "rufen", phrase: "laut rufen", file: "rufen" },
  { word: "ruhig", phrase: "ganz ruhig", file: "ruhig" },
  { word: "Reis", phrase: "weißer Reis", file: "Reis" },
  { word: "Recht", phrase: "das Recht", file: "Recht" },
  { word: "Rad", phrase: "ein großes Rad", file: "Rad" },
  { word: "Raum", phrase: "ein großer Raum", file: "Raum" },
  { word: "Brot", phrase: "frisches Brot", file: "Brot" },
  { word: "Bruder", phrase: "mein Bruder", file: "Bruder" },
  { word: "braun", phrase: "ganz braun", file: "braun" },
  { word: "bringen", phrase: "etwas bringen", file: "bringen" },
  { word: "Brille", phrase: "meine Brille", file: "Brille" },
  { word: "fragen", phrase: "etwas fragen", file: "fragen" },
  { word: "Frau", phrase: "die Frau", file: "Frau" },
  { word: "frei", phrase: "ganz frei", file: "frei" },
  { word: "Freund", phrase: "mein Freund", file: "Freund" },
  { word: "froh", phrase: "sehr froh", file: "froh" },
  { word: "grün", phrase: "ganz grün", file: "gruen" },
  { word: "groß", phrase: "sehr groß", file: "gross" },
  { word: "Gruppe", phrase: "eine Gruppe", file: "Gruppe" },
  { word: "Gras", phrase: "grünes Gras", file: "Gras" },
  { word: "Grund", phrase: "der Grund", file: "Grund" },
  { word: "Preis", phrase: "der Preis", file: "Preis" },
  { word: "Problem", phrase: "ein Problem", file: "Problem" },
  { word: "Programm", phrase: "das Programm", file: "Programm" },
  { word: "Prozent", phrase: "zehn Prozent", file: "Prozent" },
  { word: "tragen", phrase: "schwer tragen", file: "tragen" },
  { word: "treffen", phrase: "sich treffen", file: "treffen" },
  { word: "trinken", phrase: "etwas trinken", file: "trinken" },
  { word: "trocken", phrase: "ganz trocken", file: "trocken" },
  { word: "Traum", phrase: "ein Traum", file: "Traum" },
  { word: "drei", phrase: "genau drei", file: "drei" },
  { word: "drin", phrase: "da drin", file: "drin" },
  { word: "Schrift", phrase: "eine Schrift", file: "Schrift" },
  { word: "sprechen", phrase: "laut sprechen", file: "sprechen" },
  { word: "Straße", phrase: "die Straße", file: "Strasse" },
  { word: "Strom", phrase: "der Strom", file: "Strom" },
  // VOCALIC R - at end of syllable (40)
  { word: "Vater", phrase: "mein Vater", file: "Vater" },
  { word: "Mutter", phrase: "meine Mutter", file: "Mutter" },
  { word: "Bruder", phrase: "sein Bruder", file: "Bruder2" },
  { word: "Schwester", phrase: "meine Schwester", file: "Schwester" },
  { word: "Lehrer", phrase: "der Lehrer", file: "Lehrer" },
  { word: "Fahrer", phrase: "der Fahrer", file: "Fahrer" },
  { word: "Arbeiter", phrase: "der Arbeiter", file: "Arbeiter" },
  { word: "Finger", phrase: "mein Finger", file: "Finger" },
  { word: "Wasser", phrase: "kaltes Wasser", file: "Wasser" },
  { word: "Zimmer", phrase: "mein Zimmer", file: "Zimmer" },
  { word: "hier", phrase: "genau hier", file: "hier" },
  { word: "Bier", phrase: "ein Bier", file: "Bier" },
  { word: "Tier", phrase: "ein Tier", file: "Tier" },
  { word: "wir", phrase: "wir alle", file: "wir" },
  { word: "mir", phrase: "gib mir", file: "mir" },
  { word: "dir", phrase: "für dir", file: "dir" },
  { word: "Uhr", phrase: "die Uhr", file: "Uhr" },
  { word: "nur", phrase: "nur so", file: "nur" },
  { word: "der", phrase: "der Mann", file: "der" },
  { word: "wer", phrase: "wer ist", file: "wer" },
  { word: "sehr", phrase: "sehr gut", file: "sehr" },
  { word: "mehr", phrase: "viel mehr", file: "mehr" },
  { word: "Jahr", phrase: "ein Jahr", file: "Jahr" },
  { word: "war", phrase: "es war", file: "war" },
  { word: "wahr", phrase: "ganz wahr", file: "wahr" },
  { word: "gar", phrase: "gar nicht", file: "gar" },
  { word: "vor", phrase: "da vor", file: "vor" },
  { word: "für", phrase: "für dich", file: "fuer" },
  { word: "Tür", phrase: "die Tür", file: "Tuer" },
  { word: "oder", phrase: "ja oder nein", file: "oder" },
  { word: "aber", phrase: "aber ja", file: "aber" },
  { word: "über", phrase: "da über", file: "ueber" },
  { word: "unter", phrase: "da unter", file: "unter" },
  { word: "hinter", phrase: "da hinter", file: "hinter" },
  { word: "immer", phrase: "immer wieder", file: "immer" },
  { word: "besser", phrase: "viel besser", file: "besser" },
  { word: "Wetter", phrase: "das Wetter", file: "Wetter" },
  { word: "Körper", phrase: "mein Körper", file: "Koerper" },
  { word: "Sommer", phrase: "im Sommer", file: "Sommer" },
  { word: "Nummer", phrase: "die Nummer", file: "Nummer" }
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
