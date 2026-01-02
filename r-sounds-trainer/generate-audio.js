const textToSpeech = require('@google-cloud/text-to-speech');
const fs = require('fs');
const path = require('path');

const client = new textToSpeech.TextToSpeechClient();

// Filename = phrase with spaces→underscores, lowercase, umlauts→ue/ae/oe
function phraseToFilename(phrase) {
  return phrase
    .toLowerCase()
    .replace(/ü/g, 'ue')
    .replace(/ö/g, 'oe')
    .replace(/ä/g, 'ae')
    .replace(/ß/g, 'ss')
    .replace(/ /g, '_');
}

// All words with their phrases (nouns get articles, verbs get "zu", small words as-is)
const words = [
  // UVULAR R - at beginning or after consonant (40)
  { word: "rot", phrase: "rot", rtype: "uvular" },
  { word: "Regen", phrase: "der Regen", rtype: "uvular" },
  { word: "reisen", phrase: "zu reisen", rtype: "uvular" },
  { word: "richtig", phrase: "richtig", rtype: "uvular" },
  { word: "rufen", phrase: "zu rufen", rtype: "uvular" },
  { word: "ruhig", phrase: "ruhig", rtype: "uvular" },
  { word: "Reis", phrase: "der Reis", rtype: "uvular" },
  { word: "Recht", phrase: "das Recht", rtype: "uvular" },
  { word: "Rad", phrase: "das Rad", rtype: "uvular" },
  { word: "Raum", phrase: "der Raum", rtype: "uvular" },
  { word: "Brot", phrase: "das Brot", rtype: "uvular" },
  { word: "Bruder", phrase: "der Bruder", rtype: "uvular" },
  { word: "braun", phrase: "braun", rtype: "uvular" },
  { word: "bringen", phrase: "zu bringen", rtype: "uvular" },
  { word: "Brille", phrase: "die Brille", rtype: "uvular" },
  { word: "fragen", phrase: "zu fragen", rtype: "uvular" },
  { word: "Frau", phrase: "die Frau", rtype: "uvular" },
  { word: "frei", phrase: "frei", rtype: "uvular" },
  { word: "Freund", phrase: "der Freund", rtype: "uvular" },
  { word: "froh", phrase: "froh", rtype: "uvular" },
  { word: "grün", phrase: "grün", rtype: "uvular" },
  { word: "groß", phrase: "groß", rtype: "uvular" },
  { word: "Gruppe", phrase: "die Gruppe", rtype: "uvular" },
  { word: "Gras", phrase: "das Gras", rtype: "uvular" },
  { word: "Grund", phrase: "der Grund", rtype: "uvular" },
  { word: "Preis", phrase: "der Preis", rtype: "uvular" },
  { word: "Problem", phrase: "das Problem", rtype: "uvular" },
  { word: "Programm", phrase: "das Programm", rtype: "uvular" },
  { word: "Prozent", phrase: "Prozent", rtype: "uvular" },
  { word: "tragen", phrase: "zu tragen", rtype: "uvular" },
  { word: "treffen", phrase: "zu treffen", rtype: "uvular" },
  { word: "trinken", phrase: "zu trinken", rtype: "uvular" },
  { word: "trocken", phrase: "trocken", rtype: "uvular" },
  { word: "Traum", phrase: "der Traum", rtype: "uvular" },
  { word: "drei", phrase: "drei", rtype: "uvular" },
  { word: "drin", phrase: "drin", rtype: "uvular" },
  { word: "Schrift", phrase: "die Schrift", rtype: "uvular" },
  { word: "sprechen", phrase: "zu sprechen", rtype: "uvular" },
  { word: "Straße", phrase: "die Straße", rtype: "uvular" },
  { word: "Strom", phrase: "der Strom", rtype: "uvular" },
  // VOCALIC R - at end of syllable (40)
  { word: "Vater", phrase: "der Vater", rtype: "vocalic" },
  { word: "Mutter", phrase: "die Mutter", rtype: "vocalic" },
  { word: "Schwester", phrase: "die Schwester", rtype: "vocalic" },
  { word: "Lehrer", phrase: "der Lehrer", rtype: "vocalic" },
  { word: "Fahrer", phrase: "der Fahrer", rtype: "vocalic" },
  { word: "Arbeiter", phrase: "der Arbeiter", rtype: "vocalic" },
  { word: "Finger", phrase: "der Finger", rtype: "vocalic" },
  { word: "Wasser", phrase: "das Wasser", rtype: "vocalic" },
  { word: "Zimmer", phrase: "das Zimmer", rtype: "vocalic" },
  { word: "hier", phrase: "hier", rtype: "vocalic" },
  { word: "Bier", phrase: "das Bier", rtype: "vocalic" },
  { word: "Tier", phrase: "das Tier", rtype: "vocalic" },
  { word: "wir", phrase: "wir", rtype: "vocalic" },
  { word: "mir", phrase: "mir", rtype: "vocalic" },
  { word: "dir", phrase: "dir", rtype: "vocalic" },
  { word: "Uhr", phrase: "die Uhr", rtype: "vocalic" },
  { word: "nur", phrase: "nur", rtype: "vocalic" },
  { word: "der", phrase: "der", rtype: "vocalic" },
  { word: "wer", phrase: "wer", rtype: "vocalic" },
  { word: "sehr", phrase: "sehr", rtype: "vocalic" },
  { word: "mehr", phrase: "mehr", rtype: "vocalic" },
  { word: "Jahr", phrase: "das Jahr", rtype: "vocalic" },
  { word: "war", phrase: "war", rtype: "vocalic" },
  { word: "wahr", phrase: "wahr", rtype: "vocalic" },
  { word: "gar", phrase: "gar", rtype: "vocalic" },
  { word: "vor", phrase: "vor", rtype: "vocalic" },
  { word: "für", phrase: "für", rtype: "vocalic" },
  { word: "Tür", phrase: "die Tür", rtype: "vocalic" },
  { word: "oder", phrase: "oder", rtype: "vocalic" },
  { word: "aber", phrase: "aber", rtype: "vocalic" },
  { word: "über", phrase: "über", rtype: "vocalic" },
  { word: "unter", phrase: "unter", rtype: "vocalic" },
  { word: "hinter", phrase: "hinter", rtype: "vocalic" },
  { word: "immer", phrase: "immer", rtype: "vocalic" },
  { word: "besser", phrase: "besser", rtype: "vocalic" },
  { word: "Wetter", phrase: "das Wetter", rtype: "vocalic" },
  { word: "Körper", phrase: "der Körper", rtype: "vocalic" },
  { word: "Sommer", phrase: "der Sommer", rtype: "vocalic" },
  { word: "Nummer", phrase: "die Nummer", rtype: "vocalic" }
];

const voiceConfig = {
  languageCode: 'de-DE',
  name: 'de-DE-Chirp3-HD-Achernar'
};

async function generateAudio(phrase, filename) {
  const ssml = `<speak><lang xml:lang="de-DE">${phrase}</lang><break time="300ms"/></speak>`;

  const request = {
    input: { ssml },
    voice: voiceConfig,
    audioConfig: {
      audioEncoding: 'MP3',
      speakingRate: 0.9
    }
  };

  const [response] = await client.synthesizeSpeech(request);
  const outputPath = path.join(__dirname, 'audio', filename + '.mp3');
  fs.writeFileSync(outputPath, response.audioContent);
  console.log(`Generated: ${filename}.mp3 ("${phrase}")`);
}

async function main() {
  const audioDir = path.join(__dirname, 'audio');
  if (!fs.existsSync(audioDir)) {
    fs.mkdirSync(audioDir, { recursive: true });
  }

  // Clear old audio files
  const oldFiles = fs.readdirSync(audioDir).filter(f => f.endsWith('.mp3'));
  for (const f of oldFiles) {
    fs.unlinkSync(path.join(audioDir, f));
    console.log(`Deleted old: ${f}`);
  }

  console.log(`\nGenerating ${words.length} audio files...`);
  console.log(`Voice: ${voiceConfig.name}`);
  console.log(`Speaking rate: 0.9 (10% slower)`);
  console.log('');

  for (const w of words) {
    const filename = phraseToFilename(w.phrase);
    await generateAudio(w.phrase, filename);
  }

  console.log('');
  console.log('Done!');

  const manifest = {
    generated: new Date().toISOString(),
    voice: voiceConfig.name,
    speakingRate: 0.9,
    totalWords: words.length,
    words: words.map(w => ({
      word: w.word,
      file: phraseToFilename(w.phrase),
      phrase: w.phrase,
      rtype: w.rtype
    }))
  };

  fs.writeFileSync(
    path.join(__dirname, 'audio-manifest.json'),
    JSON.stringify(manifest, null, 2)
  );
  console.log('Manifest saved.');
}

main().catch(console.error);
