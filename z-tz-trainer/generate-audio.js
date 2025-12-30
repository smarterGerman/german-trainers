const textToSpeech = require('@google-cloud/text-to-speech');
const fs = require('fs');
const path = require('path');

const client = new textToSpeech.TextToSpeechClient();

const words = [
  // Z words - after long vowels, diphthongs, consonants, at word start
  { word: "Zeit", phrase: "die schöne Zeit", file: "Zeit" },
  { word: "Zug", phrase: "der schnelle Zug", file: "Zug" },
  { word: "Zahl", phrase: "eine große Zahl", file: "Zahl" },
  { word: "Zimmer", phrase: "ein helles Zimmer", file: "Zimmer" },
  { word: "zehn", phrase: "genau zehn", file: "zehn" },
  { word: "zwei", phrase: "nur zwei", file: "zwei" },
  { word: "zwischen", phrase: "genau zwischen", file: "zwischen" },
  { word: "Zucker", phrase: "weißer Zucker", file: "Zucker" },
  { word: "Ziel", phrase: "ein klares Ziel", file: "Ziel" },
  { word: "Zone", phrase: "die ruhige Zone", file: "Zone" },
  { word: "zeigen", phrase: "etwas zeigen", file: "zeigen" },
  { word: "zusammen", phrase: "alle zusammen", file: "zusammen" },
  { word: "zuerst", phrase: "immer zuerst", file: "zuerst" },
  { word: "zurück", phrase: "wieder zurück", file: "zurueck" },
  { word: "tanzen", phrase: "gerne tanzen", file: "tanzen" },
  { word: "Herz", phrase: "mein Herz", file: "Herz" },
  { word: "kurz", phrase: "ganz kurz", file: "kurz" },
  { word: "Arzt", phrase: "der gute Arzt", file: "Arzt" },
  { word: "Salz", phrase: "etwas Salz", file: "Salz" },
  { word: "Holz", phrase: "hartes Holz", file: "Holz" },
  { word: "ganz", phrase: "nicht ganz", file: "ganz" },
  { word: "Tanz", phrase: "ein schöner Tanz", file: "Tanz" },
  { word: "Grenze", phrase: "die sichere Grenze", file: "Grenze" },
  { word: "Pflanze", phrase: "eine grüne Pflanze", file: "Pflanze" },
  { word: "schwarz", phrase: "ganz schwarz", file: "schwarz" },
  { word: "Schmerz", phrase: "starker Schmerz", file: "Schmerz" },
  { word: "einzeln", phrase: "jeder einzeln", file: "einzeln" },
  { word: "Kerze", phrase: "eine helle Kerze", file: "Kerze" },
  { word: "Wurzel", phrase: "die tiefe Wurzel", file: "Wurzel" },
  { word: "Kreuz", phrase: "das rote Kreuz", file: "Kreuz" },
  { word: "Reiz", phrase: "ein großer Reiz", file: "Reiz" },
  { word: "heizen", phrase: "das Haus heizen", file: "heizen" },
  { word: "reizen", phrase: "jemanden reizen", file: "reizen" },
  { word: "Weizen", phrase: "goldener Weizen", file: "Weizen" },
  { word: "Kauz", phrase: "ein komischer Kauz", file: "Kauz" },
  { word: "Schnauze", phrase: "die nasse Schnauze", file: "Schnauze" },
  { word: "Pelz", phrase: "ein weicher Pelz", file: "Pelz" },
  { word: "Stolz", phrase: "großer Stolz", file: "Stolz" },
  { word: "Schmalz", phrase: "frisches Schmalz", file: "Schmalz" },
  { word: "Walzer", phrase: "ein langsamer Walzer", file: "Walzer" },
  // TZ words - after short vowels
  { word: "Katze", phrase: "die kleine Katze", file: "Katze" },
  { word: "sitzen", phrase: "ruhig sitzen", file: "sitzen" },
  { word: "Platz", phrase: "ein freier Platz", file: "Platz" },
  { word: "setzen", phrase: "sich setzen", file: "setzen" },
  { word: "Hitze", phrase: "große Hitze", file: "Hitze" },
  { word: "Netz", phrase: "ein starkes Netz", file: "Netz" },
  { word: "Schatz", phrase: "mein Schatz", file: "Schatz" },
  { word: "Witz", phrase: "ein guter Witz", file: "Witz" },
  { word: "Blitz", phrase: "ein heller Blitz", file: "Blitz" },
  { word: "Satz", phrase: "ein kurzer Satz", file: "Satz" },
  { word: "Mütze", phrase: "eine warme Mütze", file: "Muetze" },
  { word: "Spitze", phrase: "an der Spitze", file: "Spitze" },
  { word: "Schmutz", phrase: "viel Schmutz", file: "Schmutz" },
  { word: "putzen", phrase: "die Zähne putzen", file: "putzen" },
  { word: "nutzen", phrase: "die Zeit nutzen", file: "nutzen" },
  { word: "Schutz", phrase: "guter Schutz", file: "Schutz" },
  { word: "Pfütze", phrase: "eine tiefe Pfütze", file: "Pfuetze" },
  { word: "Tatze", phrase: "eine große Tatze", file: "Tatze" },
  { word: "kratzen", phrase: "leicht kratzen", file: "kratzen" },
  { word: "schwitzen", phrase: "stark schwitzen", file: "schwitzen" },
  { word: "stützen", phrase: "jemanden stützen", file: "stuetzen" },
  { word: "schätzen", phrase: "sehr schätzen", file: "schaetzen" },
  { word: "Gesetz", phrase: "das neue Gesetz", file: "Gesetz" },
  { word: "letzt", phrase: "das letzte Mal", file: "letzt" },
  { word: "jetzt", phrase: "gerade jetzt", file: "jetzt" },
  { word: "benutzen", phrase: "täglich benutzen", file: "benutzen" },
  { word: "Absatz", phrase: "ein langer Absatz", file: "Absatz" },
  { word: "Ersatz", phrase: "als Ersatz", file: "Ersatz" },
  { word: "Ansatz", phrase: "ein guter Ansatz", file: "Ansatz" },
  { word: "Zusatz", phrase: "ohne Zusatz", file: "Zusatz" },
  { word: "Besitzer", phrase: "der neue Besitzer", file: "Besitzer" },
  { word: "glitzern", phrase: "hell glitzern", file: "glitzern" },
  { word: "Pfötchen", phrase: "ein kleines Pfötchen", file: "Pfoetchen" },
  { word: "Kätzchen", phrase: "ein süßes Kätzchen", file: "Kaetzchen" },
  { word: "Schätzchen", phrase: "mein Schätzchen", file: "Schaetzchen" },
  { word: "Plätzchen", phrase: "leckere Plätzchen", file: "Plaetzchen" },
  { word: "wetzen", phrase: "das Messer wetzen", file: "wetzen" },
  { word: "hetzen", phrase: "schnell hetzen", file: "hetzen" },
  { word: "flitzen", phrase: "schnell flitzen", file: "flitzen" },
  { word: "Klotz", phrase: "ein schwerer Klotz", file: "Klotz" }
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
