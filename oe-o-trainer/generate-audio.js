const textToSpeech = require('@google-cloud/text-to-speech');
const fs = require('fs');
const path = require('path');

const client = new textToSpeech.TextToSpeechClient();

const words = [
  // ö words (40)
  { word: "Söhne", file: "Soehne" },
  { word: "Töchter", file: "Toechter" },
  { word: "Wörter", file: "Woerter" },
  { word: "Vögel", file: "Voegel" },
  { word: "Köpfe", file: "Koepfe" },
  { word: "Töpfe", file: "Toepfe" },
  { word: "Böden", file: "Boeden" },
  { word: "Löcher", file: "Loecher" },
  { word: "Höfe", file: "Hoefe" },
  { word: "Öl", file: "Oel" },
  { word: "Öfen", file: "Oefen" },
  { word: "König", file: "Koenig" },
  { word: "Löwe", file: "Loewe" },
  { word: "Möbel", file: "Moebel" },
  { word: "Lösung", file: "Loesung" },
  { word: "Größe", file: "Groesse" },
  { word: "Höhe", file: "Hoehe" },
  { word: "schön", file: "schoen" },
  { word: "böse", file: "boese" },
  { word: "möglich", file: "moeglich" },
  { word: "nötig", file: "noetig" },
  { word: "plötzlich", file: "ploetzlich" },
  { word: "öffentlich", file: "oeffentlich" },
  { word: "persönlich", file: "persoenlich" },
  { word: "gewöhnlich", file: "gewoehnlich" },
  { word: "höflich", file: "hoeflich" },
  { word: "fröhlich", file: "froehlich" },
  { word: "größer", file: "groesser" },
  { word: "höher", file: "hoeher" },
  { word: "öffnen", file: "oeffnen" },
  { word: "hören", file: "hoeren" },
  { word: "gehören", file: "gehoeren" },
  { word: "stören", file: "stoeren" },
  { word: "zerstören", file: "zerstoeren" },
  { word: "können", file: "koennen" },
  { word: "möchten", file: "moechten" },
  { word: "zwölf", file: "zwoelf" },
  { word: "völlig", file: "voellig" },
  { word: "östlich", file: "oestlich" },
  { word: "nördlich", file: "noerdlich" },
  // o words (40)
  { word: "Sohn", file: "Sohn" },
  { word: "Tochter", file: "Tochter" },
  { word: "Wort", file: "Wort" },
  { word: "Vogel", file: "Vogel" },
  { word: "Kopf", file: "Kopf" },
  { word: "Topf", file: "Topf" },
  { word: "Boden", file: "Boden" },
  { word: "Loch", file: "Loch" },
  { word: "Hof", file: "Hof" },
  { word: "Ofen", file: "Ofen" },
  { word: "Woche", file: "Woche" },
  { word: "Monat", file: "Monat" },
  { word: "Sommer", file: "Sommer" },
  { word: "Sonne", file: "Sonne" },
  { word: "Morgen", file: "Morgen" },
  { word: "Montag", file: "Montag" },
  { word: "Donner", file: "Donner" },
  { word: "Wohnung", file: "Wohnung" },
  { word: "rot", file: "rot" },
  { word: "groß", file: "gross" },
  { word: "hoch", file: "hoch" },
  { word: "oben", file: "oben" },
  { word: "offen", file: "offen" },
  { word: "voll", file: "voll" },
  { word: "toll", file: "toll" },
  { word: "doch", file: "doch" },
  { word: "noch", file: "noch" },
  { word: "schon", file: "schon" },
  { word: "kommen", file: "kommen" },
  { word: "wohnen", file: "wohnen" },
  { word: "hoffen", file: "hoffen" },
  { word: "kochen", file: "kochen" },
  { word: "kosten", file: "kosten" },
  { word: "folgen", file: "folgen" },
  { word: "wollen", file: "wollen" },
  { word: "sollen", file: "sollen" },
  { word: "Onkel", file: "Onkel" },
  { word: "Ort", file: "Ort" },
  { word: "Ost", file: "Ost" },
  { word: "Nord", file: "Nord" }
];

const audioDir = path.join(__dirname, 'audio');

async function generateAudio(word, filename) {
  const outputPath = path.join(audioDir, `${filename}.mp3`);
  
  if (fs.existsSync(outputPath)) {
    console.log(`Skipping ${filename} (exists)`);
    return;
  }

  const request = {
    input: { text: word },
    voice: {
      languageCode: 'de-DE',
      name: 'de-DE-Chirp3-HD-Algenib'
    },
    audioConfig: {
      audioEncoding: 'MP3',
      speakingRate: 0.9
    }
  };

  try {
    const [response] = await client.synthesizeSpeech(request);
    fs.writeFileSync(outputPath, response.audioContent, 'binary');
    console.log(`Generated: ${filename}`);
  } catch (err) {
    console.error(`Error generating ${filename}:`, err.message);
  }
}

async function main() {
  console.log(`Generating ${words.length} audio files...`);
  
  for (const { word, file } of words) {
    await generateAudio(word, file);
  }
  
  console.log('Done!');
  
  // Create manifest
  const manifest = {
    generated: new Date().toISOString(),
    voice: 'de-DE-Chirp3-HD-Algenib',
    count: words.length,
    files: words.map(w => w.file)
  };
  fs.writeFileSync(path.join(__dirname, 'audio-manifest.json'), JSON.stringify(manifest, null, 2));
}

main();
