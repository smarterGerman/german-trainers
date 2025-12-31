const textToSpeech = require('@google-cloud/text-to-speech');
const fs = require('fs');
const path = require('path');

const client = new textToSpeech.TextToSpeechClient();

const words = [
  // S words - start (25)
  { text: "die helle Sonne", file: "Sonne_phrase" },
  { text: "gut sehen können", file: "sehen_phrase" },
  { text: "danke sagen", file: "sagen_phrase" },
  { text: "der kalte Saft", file: "Saft_phrase" },
  { text: "laut singen", file: "singen_phrase" },
  { text: "lange suchen", file: "suchen_phrase" },
  { text: "der lange Sommer", file: "Sommer_phrase" },
  { text: "müde sein", file: "sein_phrase" },
  { text: "sehr gut", file: "sehr_phrase" },
  { text: "die linke Seite", file: "Seite_phrase" },
  { text: "nur selten", file: "selten_phrase" },
  { text: "ich komme sofort", file: "sofort_phrase" },
  { text: "keine Sorge", file: "Sorge_phrase" },
  { text: "echt super", file: "super_phrase" },
  { text: "völlig sauber", file: "sauber_phrase" },
  { text: "völlig sicher", file: "sicher_phrase" },
  { text: "ganz sanft", file: "sanft_phrase" },
  { text: "total süß", file: "suess_phrase" },
  { text: "der grüne Salat", file: "Salat_phrase" },
  { text: "am Samstag", file: "Samstag_phrase" },
  { text: "am Sonntag", file: "Sonntag_phrase" },
  { text: "im September", file: "September_phrase" },
  { text: "eine Sekunde", file: "Sekunde_phrase" },
  { text: "die arme Seele", file: "Seele_phrase" },
  { text: "die Nummer Sieben", file: "Sieben_phrase" },

  // S words - middle (15)
  { text: "die rote Nase", file: "Nase_phrase" },
  { text: "die lange Reise", file: "Reise_phrase" },
  { text: "ein Buch lesen", file: "lesen_phrase" },
  { text: "die blaue Hose", file: "Hose_phrase" },
  { text: "die rote Rose", file: "Rose_phrase" },
  { text: "eine alte Vase", file: "Vase_phrase" },
  { text: "der grüne Rasen", file: "Rasen_phrase" },
  { text: "nicht böse", file: "boese_phrase" },
  { text: "ein echter Riese", file: "Riese_phrase" },
  { text: "der gute Käse", file: "Kaese_phrase" },
  { text: "viel Gemüse", file: "Gemuese_phrase" },
  { text: "eine kleine Pause", file: "Pause_phrase" },
  { text: "ganz leise", file: "leise_phrase" },
  { text: "auf neue Weise", file: "Weise_phrase" },
  { text: "eine kleine Blase", file: "Blase_phrase" },

  // S words - end (10)
  { text: "ein altes Haus", file: "Haus_phrase" },
  { text: "die kleine Maus", file: "Maus_phrase" },
  { text: "von dort aus", file: "aus_phrase" },
  { text: "das hohe Gras", file: "Gras_phrase" },
  { text: "ein volles Glas", file: "Glas_phrase" },
  { text: "der letzte Bus", file: "Bus_phrase" },
  { text: "ein neuer Kurs", file: "Kurs_phrase" },
  { text: "der weiße Reis", file: "Reis_phrase" },
  { text: "der halbe Preis", file: "Preis_phrase" },
  { text: "ein großer Kreis", file: "Kreis_phrase" },

  // Z words - start (25)
  { text: "keine Zeit", file: "Zeit_phrase" },
  { text: "zehn Minuten", file: "zehn_phrase" },
  { text: "mal zeigen", file: "zeigen_phrase" },
  { text: "nach Berlin ziehen", file: "ziehen_phrase" },
  { text: "ein kleines Zimmer", file: "Zimmer_phrase" },
  { text: "viel zu groß", file: "zu_phrase" },
  { text: "der letzte Zug", file: "Zug_phrase" },
  { text: "brauner Zucker", file: "Zucker_phrase" },
  { text: "bald zurück", file: "zurueck_phrase" },
  { text: "alle zusammen", file: "zusammen_phrase" },
  { text: "zwei Tage", file: "zwei_phrase" },
  { text: "genau zwischen", file: "zwischen_phrase" },
  { text: "bar zahlen", file: "zahlen_phrase" },
  { text: "die hohe Zahl", file: "Zahl_phrase" },
  { text: "ein weißer Zahn", file: "Zahn_phrase" },
  { text: "die alte Zeitung", file: "Zeitung_phrase" },
  { text: "im Zentrum", file: "Zentrum_phrase" },
  { text: "das große Ziel", file: "Ziel_phrase" },
  { text: "ziemlich gut", file: "ziemlich_phrase" },
  { text: "die gelbe Zitrone", file: "Zitrone_phrase" },
  { text: "ein reiner Zufall", file: "Zufall_phrase" },
  { text: "ganz zufrieden", file: "zufrieden_phrase" },
  { text: "in der Zukunft", file: "Zukunft_phrase" },
  { text: "ganz zuletzt", file: "zuletzt_phrase" },
  { text: "die rote Zunge", file: "Zunge_phrase" },

  // Z words - middle (15) - NEW: z not tz
  { text: "ein gutes Rezept", file: "Rezept_phrase" },
  { text: "am Horizont", file: "Horizont_phrase" },
  { text: "teures Benzin", file: "Benzin_phrase" },
  { text: "die warme Brezel", file: "Brezel_phrase" },
  { text: "der tiefe Ozean", file: "Ozean_phrase" },
  { text: "im Dezember", file: "Dezember_phrase" },
  { text: "die Polizei rufen", file: "Polizei_phrase" },
  { text: "die neue Medizin", file: "Medizin_phrase" },
  { text: "eine echte Prinzessin", file: "Prinzessin_phrase" },
  { text: "ein tolles Konzert", file: "Konzert_phrase" },
  { text: "fünfzig Prozent", file: "Prozent_phrase" },
  { text: "eine Geschichte erzählen", file: "erzaehlen_phrase" },
  { text: "Kinder erziehen", file: "erziehen_phrase" },
  { text: "bitte verzeihen", file: "verzeihen_phrase" },
  { text: "eine Wohnung beziehen", file: "beziehen_phrase" },

  // Z words - end (10)
  { text: "ein großes Herz", file: "Herz_phrase" },
  { text: "großer Schmerz", file: "Schmerz_phrase" },
  { text: "nur kurz", file: "kurz_phrase" },
  { text: "im März", file: "Maerz_phrase" },
  { text: "ein langer Tanz", file: "Tanz_phrase" },
  { text: "ganz genau", file: "ganz_phrase" },
  { text: "voller Stolz", file: "Stolz_phrase" },
  { text: "altes Holz", file: "Holz_phrase" },
  { text: "mehr Salz", file: "Salz_z_phrase" },
  { text: "ein weicher Pelz", file: "Pelz_phrase" }
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

  console.log(`Generating ${words.length} audio files for s-z trainer...`);

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
