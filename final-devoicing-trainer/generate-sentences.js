const textToSpeech = require('@google-cloud/text-to-speech');
const fs = require('fs');
const path = require('path');

const client = new textToSpeech.TextToSpeechClient();

// All phrases - main phrase + hint (plural/related form where applicable)
const phrases = [
  // === ENDS IN D (sounds like t) ===
  { word: "Hund", phrase: "ein großer Hund", hint: "große Hunde", file: "Hund_phrase", hintFile: "Hunde_phrase" },
  { word: "Kind", phrase: "ein kleines Kind", hint: "kleine Kinder", file: "Kind_phrase", hintFile: "Kinder_phrase" },
  { word: "Freund", phrase: "mein bester Freund", hint: "meine besten Freunde", file: "Freund_phrase", hintFile: "Freunde_phrase" },
  { word: "Mund", phrase: "der offene Mund", hint: "die offenen Münder", file: "Mund_phrase", hintFile: "Muender_phrase" },
  { word: "Wand", phrase: "die weiße Wand", hint: "die weißen Wände", file: "Wand_phrase", hintFile: "Waende_phrase" },
  { word: "Hand", phrase: "eine starke Hand", hint: "starke Hände", file: "Hand_phrase", hintFile: "Haende_phrase" },
  { word: "Land", phrase: "ein fremdes Land", hint: "fremde Länder", file: "Land_phrase", hintFile: "Laender_phrase" },
  { word: "Bild", phrase: "ein schönes Bild", hint: "schöne Bilder", file: "Bild_phrase", hintFile: "Bilder_phrase" },
  { word: "Geld", phrase: "viel Geld", hint: "viele Gelder", file: "Geld_phrase", hintFile: "Gelder_phrase" },
  { word: "Feld", phrase: "das grüne Feld", hint: "die grünen Felder", file: "Feld_phrase", hintFile: "Felder_phrase" },
  { word: "Pferd", phrase: "ein schnelles Pferd", hint: "schnelle Pferde", file: "Pferd_phrase", hintFile: "Pferde_phrase" },
  { word: "Rad", phrase: "ein neues Rad", hint: "neue Räder", file: "Rad_phrase", hintFile: "Raeder_phrase" },
  { word: "Bad", phrase: "ein warmes Bad", hint: "warme Bäder", file: "Bad_phrase", hintFile: "Baeder_phrase" },
  { word: "Abend", phrase: "ein schöner Abend", hint: "schöne Abende", file: "Abend_phrase", hintFile: "Abende_phrase" },
  { word: "Herd", phrase: "der heiße Herd", hint: "die heißen Herde", file: "Herd_phrase", hintFile: "Herde_phrase" },
  { word: "Hemd", phrase: "ein weißes Hemd", hint: "weiße Hemden", file: "Hemd_phrase", hintFile: "Hemden_phrase" },
  { word: "Lied", phrase: "ein schönes Lied", hint: "schöne Lieder", file: "Lied_phrase", hintFile: "Lieder_phrase" },
  { word: "Kleid", phrase: "ein rotes Kleid", hint: "rote Kleider", file: "Kleid_phrase", hintFile: "Kleider_phrase" },
  { word: "Strand", phrase: "am schönen Strand", hint: "schöne Strände", file: "Strand_phrase", hintFile: "Straende_phrase" },
  { word: "Sand", phrase: "weicher Sand", hint: "im Sande", file: "Sand_phrase", hintFile: "Sande_phrase" },
  { word: "Grund", phrase: "ein guter Grund", hint: "gute Gründe", file: "Grund_phrase", hintFile: "Gruende_phrase" },
  { word: "Wald", phrase: "ein dunkler Wald", hint: "dunkle Wälder", file: "Wald_phrase", hintFile: "Waelder_phrase" },
  { word: "Held", phrase: "ein großer Held", hint: "große Helden", file: "Held_phrase", hintFile: "Helden_phrase" },
  { word: "Gold", phrase: "reines Gold", hint: "goldene Ringe", file: "Gold_phrase", hintFile: "goldene_phrase" },
  { word: "Mond", phrase: "der volle Mond", hint: "viele Monde", file: "Mond_phrase", hintFile: "Monde_phrase" },
  { word: "Rind", phrase: "ein großes Rind", hint: "große Rinder", file: "Rind_phrase", hintFile: "Rinder_phrase" },
  { word: "Wind", phrase: "starker Wind", hint: "starke Winde", file: "Wind_phrase", hintFile: "Winde_phrase" },
  { word: "Feind", phrase: "ein alter Feind", hint: "alte Feinde", file: "Feind_phrase", hintFile: "Feinde_phrase" },

  // === ENDS IN T (sounds like t, spelled t) - no hints needed ===
  { word: "Brot", phrase: "frisches Brot", hint: null, file: "Brot_phrase", hintFile: null },
  { word: "Wort", phrase: "ein kurzes Wort", hint: null, file: "Wort_phrase", hintFile: null },
  { word: "Ort", phrase: "ein schöner Ort", hint: null, file: "Ort_phrase", hintFile: null },
  { word: "Sport", phrase: "viel Sport", hint: null, file: "Sport_phrase", hintFile: null },
  { word: "Rat", phrase: "ein guter Rat", hint: null, file: "Rat_phrase", hintFile: null },
  { word: "Blatt", phrase: "ein grünes Blatt", hint: null, file: "Blatt_phrase", hintFile: null },
  { word: "Stadt", phrase: "eine große Stadt", hint: null, file: "Stadt_phrase", hintFile: null },
  { word: "Nacht", phrase: "eine lange Nacht", hint: null, file: "Nacht_phrase", hintFile: null },
  { word: "Macht", phrase: "große Macht", hint: null, file: "Macht_phrase", hintFile: null },
  { word: "Licht", phrase: "helles Licht", hint: null, file: "Licht_phrase", hintFile: null },
  { word: "Gesicht", phrase: "ein freundliches Gesicht", hint: null, file: "Gesicht_phrase", hintFile: null },
  { word: "Frucht", phrase: "eine reife Frucht", hint: null, file: "Frucht_phrase", hintFile: null },
  { word: "Flucht", phrase: "die schnelle Flucht", hint: null, file: "Flucht_phrase", hintFile: null },
  { word: "Sucht", phrase: "eine starke Sucht", hint: null, file: "Sucht_phrase", hintFile: null },
  { word: "Sicht", phrase: "gute Sicht", hint: null, file: "Sicht_phrase", hintFile: null },
  { word: "Gewicht", phrase: "hohes Gewicht", hint: null, file: "Gewicht_phrase", hintFile: null },

  // === ENDS IN B (sounds like p) ===
  { word: "lieb", phrase: "so lieb", hint: "sie lieben", file: "lieb_phrase", hintFile: "lieben_phrase" },
  { word: "Dieb", phrase: "ein gemeiner Dieb", hint: "gemeine Diebe", file: "Dieb_phrase", hintFile: "Diebe_phrase" },
  { word: "halb", phrase: "nur halb", hint: "die Hälfte", file: "halb_phrase", hintFile: "Haelfte_phrase" },
  { word: "gelb", phrase: "ganz gelb", hint: "die gelben", file: "gelb_phrase", hintFile: "gelben_phrase" },
  { word: "Korb", phrase: "ein voller Korb", hint: "volle Körbe", file: "Korb_phrase", hintFile: "Koerbe_phrase" },
  { word: "Urlaub", phrase: "im Urlaub", hint: "viele Urlaube", file: "Urlaub_phrase", hintFile: "Urlaube_phrase" },
  { word: "Staub", phrase: "viel Staub", hint: "sehr staubig", file: "Staub_phrase", hintFile: "staubig_phrase" },
  { word: "Trieb", phrase: "ein starker Trieb", hint: "starke Triebe", file: "Trieb_phrase", hintFile: "Triebe_phrase" },
  { word: "Leib", phrase: "der ganze Leib", hint: "die Leiber", file: "Leib_phrase", hintFile: "Leiber_phrase" },
  { word: "Betrieb", phrase: "ein großer Betrieb", hint: "große Betriebe", file: "Betrieb_phrase", hintFile: "Betriebe_phrase" },
  { word: "Verb", phrase: "ein starkes Verb", hint: "starke Verben", file: "Verb_phrase", hintFile: "Verben_phrase" },
  { word: "Grab", phrase: "ein altes Grab", hint: "alte Gräber", file: "Grab_phrase", hintFile: "Graeber_phrase" },
  { word: "Stab", phrase: "ein langer Stab", hint: "lange Stäbe", file: "Stab_phrase", hintFile: "Staebe_phrase" },
  { word: "taub", phrase: "fast taub", hint: "die Tauben", file: "taub_phrase", hintFile: "Tauben_phrase" },
  { word: "Laub", phrase: "buntes Laub", hint: "im Laube", file: "Laub_phrase", hintFile: "Laube_phrase" },

  // === ENDS IN P (sounds like p, spelled p) - no hints needed ===
  { word: "Kopf", phrase: "ein kluger Kopf", hint: null, file: "Kopf_phrase", hintFile: null },
  { word: "Topf", phrase: "ein großer Topf", hint: null, file: "Topf_phrase", hintFile: null },
  { word: "Kampf", phrase: "ein harter Kampf", hint: null, file: "Kampf_phrase", hintFile: null },
  { word: "Dampf", phrase: "heißer Dampf", hint: null, file: "Dampf_phrase", hintFile: null },
  { word: "Strumpf", phrase: "ein warmer Strumpf", hint: null, file: "Strumpf_phrase", hintFile: null },
  { word: "Sumpf", phrase: "ein tiefer Sumpf", hint: null, file: "Sumpf_phrase", hintFile: null },
  { word: "Rumpf", phrase: "der starke Rumpf", hint: null, file: "Rumpf_phrase", hintFile: null },
  { word: "Zopf", phrase: "ein langer Zopf", hint: null, file: "Zopf_phrase", hintFile: null },

  // === ENDS IN G (sounds like k) ===
  { word: "Tag", phrase: "ein langer Tag", hint: "lange Tage", file: "Tag_phrase", hintFile: "Tage_phrase" },
  { word: "Weg", phrase: "ein weiter Weg", hint: "weite Wege", file: "Weg_phrase", hintFile: "Wege_phrase" },
  { word: "Zug", phrase: "der schnelle Zug", hint: "die schnellen Züge", file: "Zug_phrase", hintFile: "Zuege_phrase" },
  { word: "Flug", phrase: "ein langer Flug", hint: "lange Flüge", file: "Flug_phrase", hintFile: "Fluege_phrase" },
  { word: "Berg", phrase: "ein hoher Berg", hint: "hohe Berge", file: "Berg_phrase", hintFile: "Berge_phrase" },
  { word: "Krieg", phrase: "der letzte Krieg", hint: "die letzten Kriege", file: "Krieg_phrase", hintFile: "Kriege_phrase" },
  { word: "Sieg", phrase: "ein großer Sieg", hint: "große Siege", file: "Sieg_phrase", hintFile: "Siege_phrase" },
  { word: "Erfolg", phrase: "ein toller Erfolg", hint: "tolle Erfolge", file: "Erfolg_phrase", hintFile: "Erfolge_phrase" },
  { word: "Vertrag", phrase: "ein neuer Vertrag", hint: "neue Verträge", file: "Vertrag_phrase", hintFile: "Vertraege_phrase" },
  { word: "Schlag", phrase: "ein harter Schlag", hint: "harte Schläge", file: "Schlag_phrase", hintFile: "Schlaege_phrase" },
  { word: "Betrug", phrase: "ein großer Betrug", hint: "viele Betrüge", file: "Betrug_phrase", hintFile: "Betruege_phrase" },
  { word: "Zeug", phrase: "das ganze Zeug", hint: "viele Zeugen", file: "Zeug_phrase", hintFile: "Zeugen_phrase" },
  { word: "Ausflug", phrase: "ein schöner Ausflug", hint: "schöne Ausflüge", file: "Ausflug_phrase", hintFile: "Ausfluege_phrase" },
  { word: "Bezug", phrase: "ein direkter Bezug", hint: "direkte Bezüge", file: "Bezug_phrase", hintFile: "Bezuege_phrase" },
  { word: "Anzug", phrase: "ein neuer Anzug", hint: "neue Anzüge", file: "Anzug_phrase", hintFile: "Anzuege_phrase" },
  { word: "Aufzug", phrase: "der langsame Aufzug", hint: "die Aufzüge", file: "Aufzug_phrase", hintFile: "Aufzuege_phrase" },
  { word: "Verlag", phrase: "ein großer Verlag", hint: "große Verlage", file: "Verlag_phrase", hintFile: "Verlage_phrase" },
  { word: "Beitrag", phrase: "ein wichtiger Beitrag", hint: "wichtige Beiträge", file: "Beitrag_phrase", hintFile: "Beitraege_phrase" },
  { word: "Antrag", phrase: "ein neuer Antrag", hint: "neue Anträge", file: "Antrag_phrase", hintFile: "Antraege_phrase" },
  { word: "Auftrag", phrase: "ein großer Auftrag", hint: "große Aufträge", file: "Auftrag_phrase", hintFile: "Auftraege_phrase" },

  // === ENDS IN K (sounds like k, spelled k) - no hints needed ===
  { word: "Blick", phrase: "ein kurzer Blick", hint: null, file: "Blick_phrase", hintFile: null },
  { word: "Glück", phrase: "viel Glück", hint: null, file: "Glueck_phrase", hintFile: null },
  { word: "Stück", phrase: "ein großes Stück", hint: null, file: "Stueck_phrase", hintFile: null },
  { word: "Druck", phrase: "hoher Druck", hint: null, file: "Druck_phrase", hintFile: null },
  { word: "Truck", phrase: "ein großer Truck", hint: null, file: "Truck_phrase", hintFile: null },
  { word: "Stock", phrase: "ein dicker Stock", hint: null, file: "Stock_phrase", hintFile: null },
  { word: "Block", phrase: "ein schwerer Block", hint: null, file: "Block_phrase", hintFile: null },
  { word: "Schock", phrase: "ein großer Schock", hint: null, file: "Schock_phrase", hintFile: null },
  { word: "Rock", phrase: "ein kurzer Rock", hint: null, file: "Rock_phrase", hintFile: null },
  { word: "Trick", phrase: "ein guter Trick", hint: null, file: "Trick_phrase", hintFile: null },
  { word: "Lack", phrase: "roter Lack", hint: null, file: "Lack_phrase", hintFile: null },
  { word: "Pack", phrase: "ein schweres Pack", hint: null, file: "Pack_phrase", hintFile: null },
  { word: "Sack", phrase: "ein voller Sack", hint: null, file: "Sack_phrase", hintFile: null },
  { word: "Geschmack", phrase: "guter Geschmack", hint: null, file: "Geschmack_phrase", hintFile: null },
  { word: "Zweck", phrase: "ein klarer Zweck", hint: null, file: "Zweck_phrase", hintFile: null },
  { word: "Schreck", phrase: "ein großer Schreck", hint: null, file: "Schreck_phrase", hintFile: null },
];

const audioDir = path.join(__dirname, 'audio');

async function generateAudio(text, filename) {
  const outputPath = path.join(audioDir, `${filename}.mp3`);

  if (fs.existsSync(outputPath)) {
    console.log(`Skipping ${filename} (exists)`);
    return;
  }

  const request = {
    input: { text },
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
  // Count total files to generate
  let total = 0;
  for (const item of phrases) {
    total++; // main phrase
    if (item.hint) total++; // hint phrase
  }
  console.log(`Generating up to ${total} audio files...`);

  for (const item of phrases) {
    // Generate main phrase
    await generateAudio(item.phrase, item.file);
    // Generate hint phrase if exists
    if (item.hint && item.hintFile) {
      await generateAudio(item.hint, item.hintFile);
    }
  }

  console.log('Done!');

  // Create manifest
  const manifest = {
    generated: new Date().toISOString(),
    voice: 'de-DE-Chirp3-HD-Algenib',
    count: phrases.length,
    phrases: phrases
  };
  fs.writeFileSync(path.join(__dirname, 'phrases-manifest.json'), JSON.stringify(manifest, null, 2));
}

main();
