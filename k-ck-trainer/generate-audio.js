const textToSpeech = require('@google-cloud/text-to-speech');
const fs = require('fs');
const path = require('path');

const client = new textToSpeech.TextToSpeechClient();

const words = [
  // CK words - after SHORT vowel (50)
  { text: "frische Brötchen backen", file: "Backen_phrase" },
  { text: "weißer Zucker", file: "Zucker_phrase" },
  { text: "ein dicker Stock", file: "Stock_phrase" },
  { text: "eine warme Decke", file: "Decke_phrase" },
  { text: "eine alte Brücke", file: "Bruecke_phrase" },
  { text: "ein großes Stück", file: "Stueck_phrase" },
  { text: "viel Glück", file: "Glueck_phrase" },
  { text: "ein schneller Blick", file: "Blick_phrase" },
  { text: "sehr dick", file: "dick_phrase" },
  { text: "um die Ecke", file: "Ecke_phrase" },
  { text: "früh wecken", file: "wecken_phrase" },
  { text: "ein roter Fleck", file: "Fleck_phrase" },
  { text: "ein großer Schreck", file: "Schreck_phrase" },
  { text: "den Schlüssel stecken", file: "stecken_phrase" },
  { text: "der eigentliche Zweck", file: "Zweck_phrase" },
  { text: "den Knopf drücken", file: "druecken_phrase" },
  { text: "der ganze Rücken", file: "Ruecken_phrase" },
  { text: "ein Paket schicken", file: "schicken_phrase" },
  { text: "eine neue Jacke", file: "Jacke_phrase" },
  { text: "den Koffer packen", file: "packen_phrase" },
  { text: "eine scharfe Hacke", file: "Hacke_phrase" },
  { text: "eine kleine Schnecke", file: "Schnecke_phrase" },
  { text: "das tiefe Becken", file: "Becken_phrase" },
  { text: "eine bunte Socke", file: "Socke_phrase" },
  { text: "eine blonde Locke", file: "Locke_phrase" },
  { text: "ganz trocken", file: "trocken_phrase" },
  { text: "ein alter Bock", file: "Bock_phrase" },
  { text: "unter großem Druck", file: "Druck_phrase" },
  { text: "teurer Schmuck", file: "Schmuck_phrase" },
  { text: "ein kurzer Ruck", file: "Ruck_phrase" },
  { text: "eine kleine Mücke", file: "Muecke_phrase" },
  { text: "eine große Lücke", file: "Luecke_phrase" },
  { text: "mit den Schultern zucken", file: "zucken_phrase" },
  { text: "ein guter Trick", file: "Trick_phrase" },
  { text: "das Baby wickeln", file: "wickeln_phrase" },
  { text: "ein kleiner Pickel", file: "Pickel_phrase" },
  { text: "aus reinem Nickel", file: "Nickel_phrase" },
  { text: "den Ball kicken", file: "kicken_phrase" },
  { text: "gebratener Speck", file: "Speck_phrase" },
  { text: "das Eis lecken", file: "lecken_phrase" },
  { text: "nicht erschrecken", file: "erschrecken_phrase" },
  { text: "etwas Neues entdecken", file: "entdecken_phrase" },
  { text: "sich gut verstecken", file: "verstecken_phrase" },
  { text: "in die Hocke gehen", file: "Hocke_phrase" },
  { text: "die große Glocke", file: "Glocke_phrase" },
  { text: "ein neuer Block", file: "Block_phrase" },
  { text: "ein großer Schock", file: "Schock_phrase" },
  { text: "ein kurzer Rock", file: "Rock_phrase" },
  { text: "Hockey spielen", file: "Hockey_phrase" },
  { text: "ein kleiner Dackel", file: "Dackel_phrase" },

  // K words - after LONG vowel (20)
  { text: "ein großer Haken", file: "Haken_phrase" },
  { text: "laute Musik", file: "Musik_phrase" },
  { text: "den Pokal gewinnen", file: "Pokal_phrase" },
  { text: "eine große Fabrik", file: "Fabrik_phrase" },
  { text: "keine Panik", file: "Panik_phrase" },
  { text: "harte Kritik", file: "Kritik_phrase" },
  { text: "klare Logik", file: "Logik_phrase" },
  { text: "die alte Republik", file: "Republik_phrase" },
  { text: "moderne Technik", file: "Technik_phrase" },
  { text: "eine kluge Taktik", file: "Taktik_phrase" },
  { text: "die ganze Thematik", file: "Thematik_phrase" },
  { text: "einfache Mechanik", file: "Mechanik_phrase" },
  { text: "die Botanik studieren", file: "Botanik_phrase" },
  { text: "schöne Keramik", file: "Keramik_phrase" },
  { text: "echte Komik", file: "Komik_phrase" },
  { text: "in die Klinik gehen", file: "Klinik_phrase" },
  { text: "medizinische Ethik", file: "Ethik_phrase" },
  { text: "die Klassik lieben", file: "Klassik_phrase" },
  { text: "eine gute Optik", file: "Optik_phrase" },
  { text: "schöne Grafik", file: "Grafik_phrase" },

  // K words - after DIPHTHONG (10)
  { text: "ein langer Streik", file: "Streik_phrase" },
  { text: "Physik lernen", file: "Physik_phrase" },
  { text: "im Barock", file: "Barock_phrase" },
  { text: "deutsche Politik", file: "Politik_phrase" },
  { text: "ein buntes Mosaik", file: "Mosaik_phrase" },
  { text: "echte Romantik", file: "Romantik_phrase" },
  { text: "alte Mystik", file: "Mystik_phrase" },
  { text: "die neue Statistik", file: "Statistik_phrase" },
  { text: "pure Dramatik", file: "Dramatik_phrase" },
  { text: "gute Akustik", file: "Akustik_phrase" },

  // K words - after CONSONANT (20)
  { text: "auf dem Markt", file: "Markt_phrase" },
  { text: "ein großes Werk", file: "Werk_phrase" },
  { text: "ein schöner Park", file: "Park_phrase" },
  { text: "zur Bank gehen", file: "Bank_phrase" },
  { text: "vielen Dank", file: "Dank_phrase" },
  { text: "sehr stark", file: "stark_phrase" },
  { text: "ganz dunkel", file: "dunkel_phrase" },
  { text: "ein tolles Geschenk", file: "Geschenk_phrase" },
  { text: "ein wichtiger Punkt", file: "Punkt_phrase" },
  { text: "der kleine Enkel", file: "Enkel_phrase" },
  { text: "der nette Onkel", file: "Onkel_phrase" },
  { text: "der linke Schenkel", file: "Schenkel_phrase" },
  { text: "der große Henkel", file: "Henkel_phrase" },
  { text: "ein neuer Artikel", file: "Artikel_phrase" },
  { text: "ein kleiner Funke", file: "Funke_phrase" },
  { text: "ein großer Schrank", file: "Schrank_phrase" },
  { text: "sehr krank", file: "krank_phrase" },
  { text: "ein guter Gedanke", file: "Gedanke_phrase" },
  { text: "innere Stärke", file: "Staerke_phrase" },
  { text: "eine weiße Wolke", file: "Wolke_phrase" }
];

const voiceConfig = {
  languageCode: 'de-DE',
  name: 'de-DE-Chirp3-HD-Algenib'
};

async function generateAudio(text, filename) {
  const outputPath = path.join(__dirname, 'audio', filename + '.mp3');

  if (fs.existsSync(outputPath)) {
    console.log(`Skipping ${filename} (exists)`);
    return;
  }

  const request = {
    input: { text },
    voice: voiceConfig,
    audioConfig: { audioEncoding: 'MP3', speakingRate: 0.9 }
  };

  const [response] = await client.synthesizeSpeech(request);
  fs.writeFileSync(outputPath, response.audioContent);
  console.log(`Generated: ${filename}.mp3`);
}

async function main() {
  const audioDir = path.join(__dirname, 'audio');
  if (!fs.existsSync(audioDir)) {
    fs.mkdirSync(audioDir, { recursive: true });
  }

  console.log(`Generating ${words.length} audio files for k-ck trainer...`);

  for (const w of words) {
    await generateAudio(w.text, w.file);
  }

  // Create manifest
  const manifest = {
    generated: new Date().toISOString(),
    voice: 'de-DE-Chirp3-HD-Algenib',
    count: words.length,
    files: words.map(w => w.file)
  };
  fs.writeFileSync(path.join(__dirname, 'audio-manifest.json'), JSON.stringify(manifest, null, 2));

  console.log('Done!');
}

main().catch(console.error);
