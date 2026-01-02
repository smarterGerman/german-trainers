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
  { word: "rot", phrase: "ganz rot", rtype: "uvular" },
  { word: "Regen", phrase: "der Regen", rtype: "uvular" },
  { word: "reisen", phrase: "zu reisen", rtype: "uvular" },
  { word: "richtig", phrase: "ganz richtig", rtype: "uvular" },
  { word: "rufen", phrase: "zu rufen", rtype: "uvular" },
  { word: "ruhig", phrase: "ganz ruhig", rtype: "uvular" },
  { word: "Reis", phrase: "der Reis", rtype: "uvular" },
  { word: "Recht", phrase: "das Recht", rtype: "uvular" },
  { word: "Rad", phrase: "das Rad", rtype: "uvular" },
  { word: "Raum", phrase: "der Raum", rtype: "uvular" },
  { word: "Brot", phrase: "das Brot", rtype: "uvular" },
  { word: "Bruder", phrase: "der Bruder", rtype: "uvular" },
  { word: "braun", phrase: "ganz braun", rtype: "uvular" },
  { word: "bringen", phrase: "zu bringen", rtype: "uvular" },
  { word: "Brille", phrase: "die Brille", rtype: "uvular" },
  { word: "fragen", phrase: "zu fragen", rtype: "uvular" },
  { word: "Frau", phrase: "die Frau", rtype: "uvular" },
  { word: "frei", phrase: "ganz frei", rtype: "uvular" },
  { word: "Freund", phrase: "der Freund", rtype: "uvular" },
  { word: "froh", phrase: "ganz froh", rtype: "uvular" },
  { word: "grün", phrase: "ganz grün", rtype: "uvular" },
  { word: "groß", phrase: "ganz groß", rtype: "uvular" },
  { word: "Gruppe", phrase: "die Gruppe", rtype: "uvular" },
  { word: "Gras", phrase: "das Gras", rtype: "uvular" },
  { word: "Grund", phrase: "der Grund", rtype: "uvular" },
  { word: "Preis", phrase: "der Preis", rtype: "uvular" },
  { word: "Problem", phrase: "das Problem", rtype: "uvular" },
  { word: "Programm", phrase: "das Programm", rtype: "uvular" },
  { word: "Prozent", phrase: "zehn Prozent", rtype: "uvular" },
  { word: "tragen", phrase: "zu tragen", rtype: "uvular" },
  { word: "treffen", phrase: "zu treffen", rtype: "uvular" },
  { word: "trinken", phrase: "zu trinken", rtype: "uvular" },
  { word: "trocken", phrase: "ganz trocken", rtype: "uvular" },
  { word: "Traum", phrase: "der Traum", rtype: "uvular" },
  { word: "drei", phrase: "eins zwei drei", rtype: "uvular" },
  { word: "drin", phrase: "da drin", rtype: "uvular" },
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
  { word: "hier", phrase: "hier bitte", rtype: "vocalic" },
  { word: "Bier", phrase: "das Bier", rtype: "vocalic" },
  { word: "Tier", phrase: "das Tier", rtype: "vocalic" },
  { word: "wir", phrase: "und wir?", rtype: "vocalic" },
  { word: "mir", phrase: "und mir?", rtype: "vocalic" },
  { word: "dir", phrase: "und dir?", rtype: "vocalic" },
  { word: "Uhr", phrase: "die Uhr", rtype: "vocalic" },
  { word: "nur", phrase: "nur das", rtype: "vocalic" },
  { word: "der", phrase: "der Mann", rtype: "vocalic" },
  { word: "wer", phrase: "wer ist das?", rtype: "vocalic" },
  { word: "sehr", phrase: "sehr gut", rtype: "vocalic" },
  { word: "mehr", phrase: "noch mehr", rtype: "vocalic" },
  { word: "Jahr", phrase: "das Jahr", rtype: "vocalic" },
  { word: "war", phrase: "das war gut", rtype: "vocalic" },
  { word: "wahr", phrase: "echt wahr?", rtype: "vocalic" },
  { word: "gar", phrase: "gar nicht", rtype: "vocalic" },
  { word: "vor", phrase: "vor dem Haus", rtype: "vocalic" },
  { word: "für", phrase: "für dich", rtype: "vocalic" },
  { word: "Tür", phrase: "die Tür", rtype: "vocalic" },
  { word: "oder", phrase: "ja oder nein?", rtype: "vocalic" },
  { word: "aber", phrase: "aber ja!", rtype: "vocalic" },
  { word: "über", phrase: "über dem Tisch", rtype: "vocalic" },
  { word: "unter", phrase: "unter dem Bett", rtype: "vocalic" },
  { word: "hinter", phrase: "hinter dem Haus", rtype: "vocalic" },
  { word: "immer", phrase: "immer wieder", rtype: "vocalic" },
  { word: "besser", phrase: "viel besser", rtype: "vocalic" },
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
