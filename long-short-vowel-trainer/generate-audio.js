const textToSpeech = require('@google-cloud/text-to-speech');
const fs = require('fs');
const path = require('path');

const client = new textToSpeech.TextToSpeechClient();

const words = [
  // Long vowels (40)
  { word: "Staat", phrase: "Der deutsche Staat", file: "Staat" },
  { word: "Bahn", phrase: "mit der Bahn fahren", file: "Bahn" },
  { word: "Sohn", phrase: "mein lieber Sohn", file: "Sohn" },
  { word: "Mehl", phrase: "feines Mehl", file: "Mehl" },
  { word: "Zahl", phrase: "eine große Zahl", file: "Zahl" },
  { word: "Wahl", phrase: "die freie Wahl", file: "Wahl" },
  { word: "Schule", phrase: "in der Schule", file: "Schule" },
  { word: "Stuhl", phrase: "ein alter Stuhl", file: "Stuhl" },
  { word: "Ofen", phrase: "der warme Ofen", file: "Ofen" },
  { word: "Boden", phrase: "auf dem Boden", file: "Boden" },
  { word: "lieben", phrase: "ich liebe dich", file: "lieben" },
  { word: "bieten", phrase: "etwas bieten", file: "bieten" },
  { word: "Miete", phrase: "die hohe Miete", file: "Miete" },
  { word: "Tier", phrase: "ein schönes Tier", file: "Tier" },
  { word: "Bier", phrase: "ein kaltes Bier", file: "Bier" },
  { word: "Name", phrase: "mein voller Name", file: "Name" },
  { word: "Laden", phrase: "im kleinen Laden", file: "Laden" },
  { word: "Faden", phrase: "ein roter Faden", file: "Faden" },
  { word: "Regen", phrase: "starker Regen", file: "Regen" },
  { word: "legen", phrase: "auf den Tisch legen", file: "legen" },
  { word: "wohnen", phrase: "hier wohnen wir", file: "wohnen" },
  { word: "Bohne", phrase: "eine grüne Bohne", file: "Bohne" },
  { word: "Sahne", phrase: "frische Sahne", file: "Sahne" },
  { word: "fahren", phrase: "Auto fahren", file: "fahren" },
  { word: "Gefahr", phrase: "große Gefahr", file: "Gefahr" },
  { word: "Jahr", phrase: "ein ganzes Jahr", file: "Jahr" },
  { word: "Uhr", phrase: "die alte Uhr", file: "Uhr" },
  { word: "Kur", phrase: "eine lange Kur", file: "Kur" },
  { word: "Ton", phrase: "ein hoher Ton", file: "Ton" },
  { word: "Hof", phrase: "auf dem Hof", file: "Hof" },
  { word: "Moos", phrase: "weiches Moos", file: "Moos" },
  { word: "Boot", phrase: "ein kleines Boot", file: "Boot" },
  { word: "rot", phrase: "ganz rot", file: "rot" },
  { word: "Brot", phrase: "frisches Brot", file: "Brot" },
  { word: "Tag", phrase: "ein schöner Tag", file: "Tag" },
  { word: "Weg", phrase: "der lange Weg", file: "Weg" },
  { word: "sagen", phrase: "etwas sagen", file: "sagen" },
  { word: "tragen", phrase: "schwer tragen", file: "tragen" },
  { word: "Glas", phrase: "ein volles Glas", file: "Glas" },
  { word: "Spaß", phrase: "viel Spaß", file: "Spass" },
  // Short vowels (40)
  { word: "Stadt", phrase: "die große Stadt", file: "Stadt" },
  { word: "Mann", phrase: "der alte Mann", file: "Mann" },
  { word: "dann", phrase: "und dann", file: "dann" },
  { word: "kommen", phrase: "heute kommen", file: "kommen" },
  { word: "Sommer", phrase: "im heißen Sommer", file: "Sommer" },
  { word: "offen", phrase: "das Fenster ist offen", file: "offen" },
  { word: "hoffen", phrase: "ich hoffe sehr", file: "hoffen" },
  { word: "bitten", phrase: "darum bitten", file: "bitten" },
  { word: "Mitte", phrase: "in der Mitte", file: "Mitte" },
  { word: "Bett", phrase: "im warmen Bett", file: "Bett" },
  { word: "nett", phrase: "sehr nett", file: "nett" },
  { word: "Wetter", phrase: "schönes Wetter", file: "Wetter" },
  { word: "Zimmer", phrase: "ein großes Zimmer", file: "Zimmer" },
  { word: "immer", phrase: "immer wieder", file: "immer" },
  { word: "Nummer", phrase: "die richtige Nummer", file: "Nummer" },
  { word: "Butter", phrase: "frische Butter", file: "Butter" },
  { word: "Mutter", phrase: "meine liebe Mutter", file: "Mutter" },
  { word: "Suppe", phrase: "heiße Suppe", file: "Suppe" },
  { word: "Gruppe", phrase: "eine kleine Gruppe", file: "Gruppe" },
  { word: "Lippe", phrase: "auf der Lippe", file: "Lippe" },
  { word: "Mappe", phrase: "die rote Mappe", file: "Mappe" },
  { word: "Kasse", phrase: "an der Kasse", file: "Kasse" },
  { word: "Tasse", phrase: "eine volle Tasse", file: "Tasse" },
  { word: "Wasser", phrase: "kaltes Wasser", file: "Wasser" },
  { word: "essen", phrase: "etwas essen", file: "essen" },
  { word: "Messer", phrase: "ein scharfes Messer", file: "Messer" },
  { word: "kennen", phrase: "gut kennen", file: "kennen" },
  { word: "rennen", phrase: "schnell rennen", file: "rennen" },
  { word: "Sonne", phrase: "die helle Sonne", file: "Sonne" },
  { word: "können", phrase: "das können wir", file: "koennen" },
  { word: "Bock", phrase: "keinen Bock", file: "Bock" },
  { word: "Stock", phrase: "im ersten Stock", file: "Stock" },
  { word: "Rock", phrase: "ein kurzer Rock", file: "Rock" },
  { word: "Kopf", phrase: "der ganze Kopf", file: "Kopf" },
  { word: "Topf", phrase: "ein großer Topf", file: "Topf" },
  { word: "Gott", phrase: "mein Gott", file: "Gott" },
  { word: "voll", phrase: "ganz voll", file: "voll" },
  { word: "toll", phrase: "wirklich toll", file: "toll" },
  { word: "sollen", phrase: "was sollen wir", file: "sollen" },
  { word: "wollen", phrase: "das wollen wir", file: "wollen" }
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
