const textToSpeech = require('@google-cloud/text-to-speech');
const fs = require('fs');
const path = require('path');

const client = new textToSpeech.TextToSpeechClient();

const words = [
  // PF at word start
  { word: "Pferd", phrase: "ein schönes Pferd", file: "Pferd" },
  { word: "Pflanze", phrase: "eine grüne Pflanze", file: "Pflanze" },
  { word: "Pfanne", phrase: "eine heiße Pfanne", file: "Pfanne" },
  { word: "Pfeffer", phrase: "schwarzer Pfeffer", file: "Pfeffer" },
  { word: "Pfeil", phrase: "ein spitzer Pfeil", file: "Pfeil" },
  { word: "Pfund", phrase: "ein halbes Pfund", file: "Pfund" },
  { word: "Pflege", phrase: "gute Pflege", file: "Pflege" },
  { word: "Pflicht", phrase: "eine wichtige Pflicht", file: "Pflicht" },
  { word: "Pfad", phrase: "ein schmaler Pfad", file: "Pfad" },
  { word: "Pfarrer", phrase: "der alte Pfarrer", file: "Pfarrer" },
  { word: "Pfau", phrase: "ein bunter Pfau", file: "Pfau" },
  { word: "Pfeife", phrase: "eine alte Pfeife", file: "Pfeife" },
  { word: "pfeifen", phrase: "laut pfeifen", file: "pfeifen" },
  { word: "pflegen", phrase: "jemanden pflegen", file: "pflegen" },
  { word: "pflücken", phrase: "Blumen pflücken", file: "pfluecken" },
  { word: "Pfote", phrase: "eine große Pfote", file: "Pfote" },
  { word: "Pfropfen", phrase: "ein kleiner Pfropfen", file: "Pfropfen" },
  { word: "Pflaster", phrase: "ein neues Pflaster", file: "Pflaster" },
  { word: "Pflaume", phrase: "eine reife Pflaume", file: "Pflaume" },
  { word: "Pfingsten", phrase: "frohe Pfingsten", file: "Pfingsten" },
  { word: "pflanzen", phrase: "Bäume pflanzen", file: "pflanzen" },
  { word: "Pfennig", phrase: "jeden Pfennig", file: "Pfennig" },
  { word: "Pfütze", phrase: "eine tiefe Pfütze", file: "Pfuetze" },
  { word: "pfui", phrase: "pfui Teufel", file: "pfui" },
  { word: "Pflock", phrase: "ein stabiler Pflock", file: "Pflock" },
  { word: "Pfiff", phrase: "ein lauter Pfiff", file: "Pfiff" },
  { word: "Pforte", phrase: "die große Pforte", file: "Pforte" },
  { word: "Pfosten", phrase: "ein hoher Pfosten", file: "Pfosten" },
  { word: "Pflug", phrase: "ein alter Pflug", file: "Pflug" },
  { word: "pflügen", phrase: "das Feld pflügen", file: "pfluegen" },
  // PF in middle/end
  { word: "Apfel", phrase: "ein roter Apfel", file: "Apfel" },
  { word: "Kopf", phrase: "mein Kopf", file: "Kopf" },
  { word: "Kampf", phrase: "ein harter Kampf", file: "Kampf" },
  { word: "Topf", phrase: "ein großer Topf", file: "Topf" },
  { word: "Strumpf", phrase: "ein warmer Strumpf", file: "Strumpf" },
  { word: "Dampf", phrase: "heißer Dampf", file: "Dampf" },
  { word: "Zopf", phrase: "ein langer Zopf", file: "Zopf" },
  { word: "Sumpf", phrase: "ein tiefer Sumpf", file: "Sumpf" },
  { word: "Schopf", phrase: "ein voller Schopf", file: "Schopf" },
  { word: "Knopf", phrase: "ein kleiner Knopf", file: "Knopf" },
  { word: "Empfang", phrase: "ein freundlicher Empfang", file: "Empfang" },
  { word: "empfehlen", phrase: "herzlich empfehlen", file: "empfehlen" },
  { word: "empfinden", phrase: "stark empfinden", file: "empfinden" },
  { word: "empfangen", phrase: "Gäste empfangen", file: "empfangen" },
  { word: "kämpfen", phrase: "mutig kämpfen", file: "kaempfen" },
  { word: "klopfen", phrase: "leise klopfen", file: "klopfen" },
  { word: "stopfen", phrase: "den Sack stopfen", file: "stopfen" },
  { word: "tropfen", phrase: "langsam tropfen", file: "tropfen" },
  { word: "Tropfen", phrase: "ein kleiner Tropfen", file: "Tropfen2" },
  { word: "schöpfen", phrase: "Wasser schöpfen", file: "schoepfen" },
  { word: "hüpfen", phrase: "fröhlich hüpfen", file: "huepfen" },
  { word: "Kupfer", phrase: "glänzendes Kupfer", file: "Kupfer" },
  { word: "Gipfel", phrase: "der hohe Gipfel", file: "Gipfel" },
  { word: "Wipfel", phrase: "im grünen Wipfel", file: "Wipfel" },
  { word: "Kartoffel", phrase: "eine große Kartoffel", file: "Kartoffel" },
  { word: "schimpfen", phrase: "laut schimpfen", file: "schimpfen" },
  { word: "Schnupfen", phrase: "einen starken Schnupfen", file: "Schnupfen" },
  { word: "schlüpfen", phrase: "schnell schlüpfen", file: "schluepfen" },
  { word: "rümpfen", phrase: "die Nase rümpfen", file: "ruempfen" },
  { word: "Opfer", phrase: "ein großes Opfer", file: "Opfer" },
  { word: "Karpfen", phrase: "ein frischer Karpfen", file: "Karpfen" },
  { word: "Köpfchen", phrase: "ein kleines Köpfchen", file: "Koepfchen" },
  { word: "Äpfel", phrase: "rote Äpfel", file: "Aepfel" },
  { word: "Töpfe", phrase: "viele Töpfe", file: "Toepfe" },
  { word: "Köpfe", phrase: "kluge Köpfe", file: "Koepfe" },
  { word: "Knöpfe", phrase: "bunte Knöpfe", file: "Knoepfe" },
  { word: "Strümpfe", phrase: "warme Strümpfe", file: "Struempfe" },
  { word: "Sümpfe", phrase: "dunkle Sümpfe", file: "Suempfe" },
  { word: "Zöpfe", phrase: "lange Zöpfe", file: "Zoepfe" }
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
