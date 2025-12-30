const textToSpeech = require('@google-cloud/text-to-speech');
const fs = require('fs');
const path = require('path');

const client = new textToSpeech.TextToSpeechClient();

const words = [
  // ä words (40)
  { word: "Männer", phrase: "die Männer dort", en: "men", sound: "ä", file: "Maenner" },
  { word: "Hände", phrase: "meine Hände", en: "hands", sound: "ä", file: "Haende" },
  { word: "Länder", phrase: "viele Länder", en: "countries", sound: "ä", file: "Laender" },
  { word: "Bäcker", phrase: "der Bäcker backt", en: "baker", sound: "ä", file: "Baecker" },
  { word: "Gärten", phrase: "schöne Gärten", en: "gardens", sound: "ä", file: "Gaerten" },
  { word: "Äpfel", phrase: "rote Äpfel", en: "apples", sound: "ä", file: "Aepfel" },
  { word: "Bäume", phrase: "hohe Bäume", en: "trees", sound: "ä", file: "Baeume" },
  { word: "Häuser", phrase: "alte Häuser", en: "houses", sound: "ä", file: "Haeuser" },
  { word: "Räume", phrase: "große Räume", en: "rooms", sound: "ä", file: "Raeume" },
  { word: "Träume", phrase: "schöne Träume", en: "dreams", sound: "ä", file: "Traeume" },
  { word: "Käse", phrase: "guter Käse", en: "cheese", sound: "ä", file: "Kaese" },
  { word: "Mädchen", phrase: "das kleine Mädchen", en: "girl", sound: "ä", file: "Maedchen" },
  { word: "Städte", phrase: "große Städte", en: "cities", sound: "ä", file: "Staedte" },
  { word: "spät", phrase: "Es ist spät.", en: "late", sound: "ä", file: "spaet" },
  { word: "später", phrase: "bis später", en: "later", sound: "ä", file: "spaeter" },
  { word: "nächste", phrase: "die nächste Woche", en: "next", sound: "ä", file: "naechste" },
  { word: "täglich", phrase: "täglich arbeiten", en: "daily", sound: "ä", file: "taeglich" },
  { word: "wählen", phrase: "eine Nummer wählen", en: "to choose", sound: "ä", file: "waehlen" },
  { word: "erzählen", phrase: "eine Geschichte erzählen", en: "to tell", sound: "ä", file: "erzaehlen" },
  { word: "gefährlich", phrase: "sehr gefährlich", en: "dangerous", sound: "ä", file: "gefaehrlich" },
  { word: "ähnlich", phrase: "sehr ähnlich", en: "similar", sound: "ä", file: "aehnlich" },
  { word: "während", phrase: "während der Arbeit", en: "during", sound: "ä", file: "waehrend" },
  { word: "ungefähr", phrase: "ungefähr zehn", en: "approximately", sound: "ä", file: "ungefaehr" },
  { word: "März", phrase: "im März", en: "March", sound: "ä", file: "Maerz" },
  { word: "Bär", phrase: "ein großer Bär", en: "bear", sound: "ä", file: "Baer" },
  { word: "Väter", phrase: "die Väter kommen", en: "fathers", sound: "ä", file: "Vaeter" },
  { word: "Zähne", phrase: "weiße Zähne", en: "teeth", sound: "ä", file: "Zaehne" },
  { word: "Gläser", phrase: "zwei Gläser", en: "glasses", sound: "ä", file: "Glaeser" },
  { word: "Kälte", phrase: "die große Kälte", en: "cold", sound: "ä", file: "Kaelte" },
  { word: "Nähe", phrase: "in der Nähe", en: "nearness", sound: "ä", file: "Naehe" },
  { word: "Stärke", phrase: "große Stärke", en: "strength", sound: "ä", file: "Staerke" },
  { word: "Wärme", phrase: "angenehme Wärme", en: "warmth", sound: "ä", file: "Waerme" },
  { word: "schwächer", phrase: "immer schwächer", en: "weaker", sound: "ä", file: "schwaecher" },
  { word: "stärker", phrase: "viel stärker", en: "stronger", sound: "ä", file: "staerker" },
  { word: "länger", phrase: "viel länger", en: "longer", sound: "ä", file: "laenger" },
  { word: "älter", phrase: "viel älter", en: "older", sound: "ä", file: "aelter" },
  { word: "kälter", phrase: "immer kälter", en: "colder", sound: "ä", file: "kaelter" },
  { word: "wärmer", phrase: "viel wärmer", en: "warmer", sound: "ä", file: "waermer" },
  { word: "häufig", phrase: "sehr häufig", en: "frequent", sound: "ä", file: "haeufig" },
  { word: "fähig", phrase: "dazu fähig", en: "capable", sound: "ä", file: "faehig" },
  // a words (40)
  { word: "Mann", phrase: "der Mann dort", en: "man", sound: "a", file: "Mann" },
  { word: "Hand", phrase: "meine Hand", en: "hand", sound: "a", file: "Hand" },
  { word: "Land", phrase: "ein schönes Land", en: "country", sound: "a", file: "Land" },
  { word: "backen", phrase: "Brot backen", en: "to bake", sound: "a", file: "backen" },
  { word: "Garten", phrase: "im Garten", en: "garden", sound: "a", file: "Garten" },
  { word: "Apfel", phrase: "ein roter Apfel", en: "apple", sound: "a", file: "Apfel" },
  { word: "Baum", phrase: "ein hoher Baum", en: "tree", sound: "a", file: "Baum" },
  { word: "Haus", phrase: "das alte Haus", en: "house", sound: "a", file: "Haus" },
  { word: "Raum", phrase: "ein großer Raum", en: "room", sound: "a", file: "Raum" },
  { word: "Traum", phrase: "ein schöner Traum", en: "dream", sound: "a", file: "Traum" },
  { word: "Abend", phrase: "guten Abend", en: "evening", sound: "a", file: "Abend" },
  { word: "Anfang", phrase: "am Anfang", en: "beginning", sound: "a", file: "Anfang" },
  { word: "Stadt", phrase: "die große Stadt", en: "city", sound: "a", file: "Stadt" },
  { word: "Platz", phrase: "ein freier Platz", en: "place/square", sound: "a", file: "Platz" },
  { word: "Straße", phrase: "die lange Straße", en: "street", sound: "a", file: "Strasse" },
  { word: "Tag", phrase: "ein schöner Tag", en: "day", sound: "a", file: "Tag" },
  { word: "Vater", phrase: "mein Vater", en: "father", sound: "a", file: "Vater" },
  { word: "Zahn", phrase: "ein weißer Zahn", en: "tooth", sound: "a", file: "Zahn" },
  { word: "Glas", phrase: "ein volles Glas", en: "glass", sound: "a", file: "Glas" },
  { word: "kalt", phrase: "sehr kalt", en: "cold", sound: "a", file: "kalt" },
  { word: "nah", phrase: "ganz nah", en: "near", sound: "a", file: "nah" },
  { word: "stark", phrase: "sehr stark", en: "strong", sound: "a", file: "stark" },
  { word: "warm", phrase: "schön warm", en: "warm", sound: "a", file: "warm" },
  { word: "schwach", phrase: "sehr schwach", en: "weak", sound: "a", file: "schwach" },
  { word: "lang", phrase: "sehr lang", en: "long", sound: "a", file: "lang" },
  { word: "alt", phrase: "sehr alt", en: "old", sound: "a", file: "alt" },
  { word: "Arbeit", phrase: "gute Arbeit", en: "work", sound: "a", file: "Arbeit" },
  { word: "Frau", phrase: "die Frau dort", en: "woman", sound: "a", file: "Frau" },
  { word: "Name", phrase: "mein Name", en: "name", sound: "a", file: "Name" },
  { word: "Wasser", phrase: "kaltes Wasser", en: "water", sound: "a", file: "Wasser" },
  { word: "Nacht", phrase: "gute Nacht", en: "night", sound: "a", file: "Nacht" },
  { word: "Sprache", phrase: "eine neue Sprache", en: "language", sound: "a", file: "Sprache" },
  { word: "Jahr", phrase: "dieses Jahr", en: "year", sound: "a", file: "Jahr" },
  { word: "fahren", phrase: "nach Hause fahren", en: "to drive", sound: "a", file: "fahren" },
  { word: "Staat", phrase: "der deutsche Staat", en: "state", sound: "a", file: "Staat" },
  { word: "Arzt", phrase: "ein guter Arzt", en: "doctor", sound: "a", file: "Arzt" },
  { word: "Kraft", phrase: "viel Kraft", en: "power", sound: "a", file: "Kraft" },
  { word: "Praxis", phrase: "in der Praxis", en: "practice", sound: "a", file: "Praxis" },
  { word: "Bahn", phrase: "mit der Bahn", en: "train/railway", sound: "a", file: "Bahn" },
  { word: "Plan", phrase: "ein guter Plan", en: "plan", sound: "a", file: "Plan" }
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
      phrase: w.phrase,
      en: w.en,
      sound: w.sound
    }))
  };

  fs.writeFileSync(
    path.join(__dirname, 'audio-manifest.json'),
    JSON.stringify(manifest, null, 2)
  );
  console.log('Manifest saved.');
}

main().catch(console.error);
