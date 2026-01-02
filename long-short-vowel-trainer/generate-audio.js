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

const words = [
  // MINIMAL PAIRS - Nouns
  { word: "Staat", phrase: "der Staat" },
  { word: "Stadt", phrase: "die Stadt" },
  { word: "Miete", phrase: "die Miete" },
  { word: "Mitte", phrase: "die Mitte" },
  { word: "Beet", phrase: "das Beet" },
  { word: "Bett", phrase: "das Bett" },
  { word: "Hüte", phrase: "die Hüte" },
  { word: "Hütte", phrase: "die Hütte" },
  { word: "Höhle", phrase: "die Höhle" },
  { word: "Hölle", phrase: "die Hölle" },
  { word: "Stahl", phrase: "der Stahl" },
  { word: "Stall", phrase: "der Stall" },
  { word: "Schal", phrase: "der Schal" },
  { word: "Schall", phrase: "der Schall" },
  { word: "Ton", phrase: "der Ton" },
  { word: "Tonne", phrase: "die Tonne" },
  { word: "Sohn", phrase: "der Sohn" },
  { word: "Sonne", phrase: "die Sonne" },
  { word: "Wahn", phrase: "der Wahn" },
  { word: "Wanne", phrase: "die Wanne" },
  { word: "Mut", phrase: "der Mut" },
  { word: "Mutter", phrase: "die Mutter" },
  { word: "Ruhm", phrase: "der Ruhm" },
  { word: "Rum", phrase: "der Rum" },
  { word: "Mus", phrase: "das Mus" },
  { word: "Muss", phrase: "das Muss" },
  // MINIMAL PAIRS - Verbs
  { word: "bieten", phrase: "zu bieten" },
  { word: "bitten", phrase: "zu bitten" },
  { word: "raten", phrase: "zu raten" },
  { word: "Ratten", phrase: "die Ratten" },
  // Long vowels - Nouns
  { word: "Weg", phrase: "der Weg" },
  { word: "Ofen", phrase: "der Ofen" },
  { word: "Bahn", phrase: "die Bahn" },
  { word: "Mehl", phrase: "das Mehl" },
  { word: "Zahl", phrase: "die Zahl" },
  { word: "Wahl", phrase: "die Wahl" },
  { word: "Schule", phrase: "die Schule" },
  { word: "Stuhl", phrase: "der Stuhl" },
  { word: "Boden", phrase: "der Boden" },
  { word: "Tier", phrase: "das Tier" },
  { word: "Bier", phrase: "das Bier" },
  { word: "Name", phrase: "der Name" },
  { word: "Laden", phrase: "der Laden" },
  { word: "Regen", phrase: "der Regen" },
  { word: "Bohne", phrase: "die Bohne" },
  { word: "Sahne", phrase: "die Sahne" },
  { word: "Jahr", phrase: "das Jahr" },
  { word: "Uhr", phrase: "die Uhr" },
  { word: "Hof", phrase: "der Hof" },
  { word: "Boot", phrase: "das Boot" },
  { word: "Brot", phrase: "das Brot" },
  { word: "Tag", phrase: "der Tag" },
  // Long vowels - Verbs
  { word: "lieben", phrase: "zu lieben" },
  { word: "wohnen", phrase: "zu wohnen" },
  { word: "fahren", phrase: "zu fahren" },
  { word: "legen", phrase: "zu legen" },
  { word: "tragen", phrase: "zu tragen" },
  { word: "sagen", phrase: "zu sagen" },
  // Short vowels - Nouns
  { word: "Kamm", phrase: "der Kamm" },
  { word: "Mann", phrase: "der Mann" },
  { word: "Sommer", phrase: "der Sommer" },
  { word: "Wetter", phrase: "das Wetter" },
  { word: "Zimmer", phrase: "das Zimmer" },
  { word: "Nummer", phrase: "die Nummer" },
  { word: "Butter", phrase: "die Butter" },
  { word: "Suppe", phrase: "die Suppe" },
  { word: "Gruppe", phrase: "die Gruppe" },
  { word: "Lippe", phrase: "die Lippe" },
  { word: "Mappe", phrase: "die Mappe" },
  { word: "Kasse", phrase: "die Kasse" },
  { word: "Tasse", phrase: "die Tasse" },
  { word: "Wasser", phrase: "das Wasser" },
  { word: "Messer", phrase: "das Messer" },
  { word: "Bock", phrase: "der Bock" },
  { word: "Stock", phrase: "der Stock" },
  { word: "Rock", phrase: "der Rock" },
  { word: "Kopf", phrase: "der Kopf" },
  { word: "Topf", phrase: "der Topf" },
  { word: "Gott", phrase: "der Gott" },
  { word: "Schnitt", phrase: "der Schnitt" },
  { word: "Schritt", phrase: "der Schritt" },
  { word: "Müll", phrase: "der Müll" },
  { word: "Sinn", phrase: "der Sinn" },
  { word: "Tipp", phrase: "der Tipp" },
  { word: "Schiff", phrase: "das Schiff" },
  { word: "Pflicht", phrase: "die Pflicht" },
  { word: "Knopf", phrase: "der Knopf" },
  { word: "Schloss", phrase: "das Schloss" },
  { word: "Fluss", phrase: "der Fluss" },
  { word: "Kuss", phrase: "der Kuss" },
  // Short vowels - Verbs
  { word: "kommen", phrase: "zu kommen" },
  { word: "hoffen", phrase: "zu hoffen" },
  { word: "essen", phrase: "zu essen" },
  { word: "kennen", phrase: "zu kennen" },
  { word: "rennen", phrase: "zu rennen" },
  { word: "schwimmen", phrase: "zu schwimmen" },
  { word: "treffen", phrase: "zu treffen" }
];

const voiceConfig = {
  languageCode: 'de-DE',
  name: 'de-DE-Chirp3-HD-Achernar'
};

async function generateAudio(phrase, filename) {
  // Add trailing pause to prevent cut-off
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

  console.log(`Generating ${words.length} audio files...`);
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
