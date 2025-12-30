const textToSpeech = require('@google-cloud/text-to-speech');
const fs = require('fs');
const path = require('path');

const client = new textToSpeech.TextToSpeechClient();

const words = [
  // Pronounced H - at word/syllable start (40)
  { word: "Haus", phrase: "ein schönes Haus", file: "Haus" },
  { word: "Hund", phrase: "ein großer Hund", file: "Hund" },
  { word: "Hand", phrase: "meine rechte Hand", file: "Hand" },
  { word: "Herz", phrase: "mein Herz", file: "Herz" },
  { word: "heute", phrase: "heute Morgen", file: "heute" },
  { word: "hier", phrase: "genau hier", file: "hier" },
  { word: "haben", phrase: "Geld haben", file: "haben" },
  { word: "halten", phrase: "fest halten", file: "halten" },
  { word: "helfen", phrase: "gerne helfen", file: "helfen" },
  { word: "holen", phrase: "etwas holen", file: "holen" },
  { word: "Himmel", phrase: "der blaue Himmel", file: "Himmel" },
  { word: "Hilfe", phrase: "schnelle Hilfe", file: "Hilfe" },
  { word: "Hoffnung", phrase: "große Hoffnung", file: "Hoffnung" },
  { word: "Hunger", phrase: "großer Hunger", file: "Hunger" },
  { word: "Hose", phrase: "eine neue Hose", file: "Hose" },
  { word: "Husten", phrase: "starker Husten", file: "Husten" },
  { word: "Haar", phrase: "schönes Haar", file: "Haar" },
  { word: "Hals", phrase: "ein langer Hals", file: "Hals" },
  { word: "Haut", phrase: "weiche Haut", file: "Haut" },
  { word: "Helm", phrase: "ein sicherer Helm", file: "Helm" },
  { word: "Bahnhof", phrase: "am Bahnhof", file: "Bahnhof" },
  { word: "Rathaus", phrase: "das alte Rathaus", file: "Rathaus" },
  { word: "Krankenhaus", phrase: "im Krankenhaus", file: "Krankenhaus" },
  { word: "Kaufhaus", phrase: "ein großes Kaufhaus", file: "Kaufhaus" },
  { word: "Hochhaus", phrase: "ein hohes Hochhaus", file: "Hochhaus" },
  { word: "Gehalt", phrase: "gutes Gehalt", file: "Gehalt" },
  { word: "Verhalten", phrase: "gutes Verhalten", file: "Verhalten" },
  { word: "Inhalt", phrase: "der Inhalt", file: "Inhalt" },
  { word: "anhalten", phrase: "bitte anhalten", file: "anhalten" },
  { word: "aufhören", phrase: "sofort aufhören", file: "aufhoeren" },
  { word: "abholen", phrase: "jemanden abholen", file: "abholen" },
  { word: "Wohnheim", phrase: "im Wohnheim", file: "Wohnheim" },
  { word: "Geheimnis", phrase: "ein großes Geheimnis", file: "Geheimnis" },
  { word: "hinten", phrase: "ganz hinten", file: "hinten" },
  { word: "hinauf", phrase: "nach oben hinauf", file: "hinauf" },
  { word: "hinunter", phrase: "nach unten hinunter", file: "hinunter" },
  { word: "herum", phrase: "rundherum", file: "herum" },
  { word: "heraus", phrase: "schnell heraus", file: "heraus" },
  { word: "herein", phrase: "bitte herein", file: "herein" },
  { word: "hinein", phrase: "tief hinein", file: "hinein" },
  // Silent H - Dehnungs-h after vowels (40)
  { word: "gehen", phrase: "langsam gehen", file: "gehen" },
  { word: "sehen", phrase: "gut sehen", file: "sehen" },
  { word: "stehen", phrase: "hier stehen", file: "stehen" },
  { word: "verstehen", phrase: "gut verstehen", file: "verstehen" },
  { word: "drehen", phrase: "langsam drehen", file: "drehen" },
  { word: "nehmen", phrase: "bitte nehmen", file: "nehmen" },
  { word: "Zahn", phrase: "ein weißer Zahn", file: "Zahn" },
  { word: "Bahn", phrase: "die schnelle Bahn", file: "Bahn" },
  { word: "Sahne", phrase: "frische Sahne", file: "Sahne" },
  { word: "Rahmen", phrase: "im Rahmen", file: "Rahmen" },
  { word: "mehr", phrase: "immer mehr", file: "mehr" },
  { word: "sehr", phrase: "sehr gut", file: "sehr" },
  { word: "Lehre", phrase: "eine gute Lehre", file: "Lehre" },
  { word: "Lehrer", phrase: "mein Lehrer", file: "Lehrer" },
  { word: "Jahr", phrase: "ein ganzes Jahr", file: "Jahr" },
  { word: "wahr", phrase: "ganz wahr", file: "wahr" },
  { word: "fahren", phrase: "schnell fahren", file: "fahren" },
  { word: "Fahrer", phrase: "der Fahrer", file: "Fahrer" },
  { word: "Gefahr", phrase: "große Gefahr", file: "Gefahr" },
  { word: "Erfahrung", phrase: "viel Erfahrung", file: "Erfahrung" },
  { word: "Uhr", phrase: "die alte Uhr", file: "Uhr" },
  { word: "Ohr", phrase: "mein rechtes Ohr", file: "Ohr" },
  { word: "ohne", phrase: "ganz ohne", file: "ohne" },
  { word: "wohnen", phrase: "hier wohnen", file: "wohnen" },
  { word: "Wohnung", phrase: "eine neue Wohnung", file: "Wohnung" },
  { word: "Sohn", phrase: "mein Sohn", file: "Sohn" },
  { word: "Lohn", phrase: "guter Lohn", file: "Lohn" },
  { word: "Bohne", phrase: "eine grüne Bohne", file: "Bohne" },
  { word: "fühlen", phrase: "sich gut fühlen", file: "fuehlen" },
  { word: "Gefühl", phrase: "ein gutes Gefühl", file: "Gefuehl" },
  { word: "kühl", phrase: "angenehm kühl", file: "kuehl" },
  { word: "Stuhl", phrase: "ein alter Stuhl", file: "Stuhl" },
  { word: "Schuh", phrase: "ein neuer Schuh", file: "Schuh" },
  { word: "Kuh", phrase: "eine große Kuh", file: "Kuh" },
  { word: "Ruhe", phrase: "absolute Ruhe", file: "Ruhe" },
  { word: "früh", phrase: "sehr früh", file: "frueh" },
  { word: "Nähe", phrase: "in der Nähe", file: "Naehe" },
  { word: "Reihe", phrase: "eine lange Reihe", file: "Reihe" },
  { word: "Weihnachten", phrase: "frohe Weihnachten", file: "Weihnachten" },
  { word: "zehn", phrase: "genau zehn", file: "zehn" }
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
