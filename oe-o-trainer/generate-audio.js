const textToSpeech = require('@google-cloud/text-to-speech');
const fs = require('fs');
const path = require('path');

const client = new textToSpeech.TextToSpeechClient();

// 80 words with phrases for natural pronunciation
const words = [
  // ö words (40)
  { word: "schön", phrase: "Das ist schön.", en: "beautiful", sound: "ö", file: "schoen" },
  { word: "hören", phrase: "Ich kann dich hören.", en: "to hear", sound: "ö", file: "hoeren" },
  { word: "Körper", phrase: "der ganze Körper", en: "body", sound: "ö", file: "Koerper" },
  { word: "mögen", phrase: "Ich mag das.", en: "to like", sound: "ö", file: "moegen" },
  { word: "möglich", phrase: "Das ist möglich.", en: "possible", sound: "ö", file: "moeglich" },
  { word: "können", phrase: "Wir können das.", en: "can/be able", sound: "ö", file: "koennen" },
  { word: "König", phrase: "der alte König", en: "king", sound: "ö", file: "Koenig" },
  { word: "Königin", phrase: "die schöne Königin", en: "queen", sound: "ö", file: "Koenigin" },
  { word: "böse", phrase: "Er ist böse.", en: "angry/evil", sound: "ö", file: "boese" },
  { word: "Böden", phrase: "die Böden im Haus", en: "floors", sound: "ö", file: "Boeden" },
  { word: "Töne", phrase: "schöne Töne", en: "sounds/tones", sound: "ö", file: "Toene" },
  { word: "Töchter", phrase: "meine Töchter", en: "daughters", sound: "ö", file: "Toechter" },
  { word: "Söhne", phrase: "ihre Söhne", en: "sons", sound: "ö", file: "Soehne" },
  { word: "Wörter", phrase: "neue Wörter", en: "words", sound: "ö", file: "Woerter" },
  { word: "Völker", phrase: "verschiedene Völker", en: "peoples/nations", sound: "ö", file: "Voelker" },
  { word: "Vögel", phrase: "Die Vögel singen.", en: "birds", sound: "ö", file: "Voegel" },
  { word: "Köpfe", phrase: "viele Köpfe", en: "heads", sound: "ö", file: "Koepfe" },
  { word: "Köche", phrase: "gute Köche", en: "cooks", sound: "ö", file: "Koeche" },
  { word: "Löffel", phrase: "ein großer Löffel", en: "spoon", sound: "ö", file: "Loeffel" },
  { word: "Löwe", phrase: "der starke Löwe", en: "lion", sound: "ö", file: "Loewe" },
  { word: "lösen", phrase: "das Problem lösen", en: "to solve", sound: "ö", file: "loesen" },
  { word: "Öl", phrase: "etwas Öl", en: "oil", sound: "ö", file: "Oel" },
  { word: "öffnen", phrase: "die Tür öffnen", en: "to open", sound: "ö", file: "oeffnen" },
  { word: "öffentlich", phrase: "ein öffentlicher Platz", en: "public", sound: "ö", file: "oeffentlich" },
  { word: "östlich", phrase: "östlich von hier", en: "eastern", sound: "ö", file: "oestlich" },
  { word: "Österreich", phrase: "Ich fahre nach Österreich.", en: "Austria", sound: "ö", file: "Oesterreich" },
  { word: "größer", phrase: "viel größer", en: "bigger", sound: "ö", file: "groesser" },
  { word: "größte", phrase: "der größte Mann", en: "biggest", sound: "ö", file: "groesste" },
  { word: "nötig", phrase: "Das ist nötig.", en: "necessary", sound: "ö", file: "noetig" },
  { word: "plötzlich", phrase: "plötzlich war es da", en: "suddenly", sound: "ö", file: "ploetzlich" },
  { word: "persönlich", phrase: "ganz persönlich", en: "personal", sound: "ö", file: "persoenlich" },
  { word: "gewöhnlich", phrase: "wie gewöhnlich", en: "usually", sound: "ö", file: "gewoehnlich" },
  { word: "fördern", phrase: "Kinder fördern", en: "to promote", sound: "ö", file: "foerdern" },
  { word: "stören", phrase: "Bitte nicht stören.", en: "to disturb", sound: "ö", file: "stoeren" },
  { word: "zerstören", phrase: "alles zerstören", en: "to destroy", sound: "ö", file: "zerstoeren" },
  { word: "Höhe", phrase: "in großer Höhe", en: "height", sound: "ö", file: "Hoehe" },
  { word: "höher", phrase: "immer höher", en: "higher", sound: "ö", file: "hoeher" },
  { word: "höchste", phrase: "der höchste Berg", en: "highest", sound: "ö", file: "hoechste" },
  { word: "röten", phrase: "sich röten", en: "to redden", sound: "ö", file: "roeten" },
  { word: "Frösche", phrase: "kleine Frösche", en: "frogs", sound: "ö", file: "Froesche" },
  // o words (40)
  { word: "Brot", phrase: "frisches Brot", en: "bread", sound: "o", file: "Brot" },
  { word: "groß", phrase: "sehr groß", en: "big", sound: "o", file: "gross" },
  { word: "rot", phrase: "ganz rot", en: "red", sound: "o", file: "rot" },
  { word: "Sohn", phrase: "mein Sohn", en: "son", sound: "o", file: "Sohn" },
  { word: "Tochter", phrase: "meine Tochter", en: "daughter", sound: "o", file: "Tochter" },
  { word: "Wort", phrase: "ein Wort", en: "word", sound: "o", file: "Wort" },
  { word: "Boden", phrase: "auf dem Boden", en: "floor", sound: "o", file: "Boden" },
  { word: "Ton", phrase: "ein hoher Ton", en: "sound/tone", sound: "o", file: "Ton" },
  { word: "Vogel", phrase: "ein kleiner Vogel", en: "bird", sound: "o", file: "Vogel" },
  { word: "Volk", phrase: "das deutsche Volk", en: "people/nation", sound: "o", file: "Volk" },
  { word: "Kopf", phrase: "mein Kopf tut weh", en: "head", sound: "o", file: "Kopf" },
  { word: "Koch", phrase: "ein guter Koch", en: "cook", sound: "o", file: "Koch" },
  { word: "hoch", phrase: "sehr hoch", en: "high", sound: "o", file: "hoch" },
  { word: "noch", phrase: "noch einmal", en: "still/yet", sound: "o", file: "noch" },
  { word: "doch", phrase: "Das stimmt doch.", en: "but/however", sound: "o", file: "doch" },
  { word: "Loch", phrase: "ein großes Loch", en: "hole", sound: "o", file: "Loch" },
  { word: "kochen", phrase: "Ich koche gern.", en: "to cook", sound: "o", file: "kochen" },
  { word: "Woche", phrase: "diese Woche", en: "week", sound: "o", file: "Woche" },
  { word: "Frosch", phrase: "ein grüner Frosch", en: "frog", sound: "o", file: "Frosch" },
  { word: "Ohr", phrase: "mein linkes Ohr", en: "ear", sound: "o", file: "Ohr" },
  { word: "ohne", phrase: "ohne dich", en: "without", sound: "o", file: "ohne" },
  { word: "oben", phrase: "da oben", en: "above", sound: "o", file: "oben" },
  { word: "Obst", phrase: "frisches Obst", en: "fruit", sound: "o", file: "Obst" },
  { word: "oder", phrase: "ja oder nein", en: "or", sound: "o", file: "oder" },
  { word: "Ort", phrase: "an diesem Ort", en: "place", sound: "o", file: "Ort" },
  { word: "Osten", phrase: "im Osten", en: "east", sound: "o", file: "Osten" },
  { word: "Opa", phrase: "mein lieber Opa", en: "grandpa", sound: "o", file: "Opa" },
  { word: "Oma", phrase: "meine liebe Oma", en: "grandma", sound: "o", file: "Oma" },
  { word: "Onkel", phrase: "mein Onkel kommt", en: "uncle", sound: "o", file: "Onkel" },
  { word: "toll", phrase: "Das ist toll!", en: "great", sound: "o", file: "toll" },
  { word: "voll", phrase: "ganz voll", en: "full", sound: "o", file: "voll" },
  { word: "wollen", phrase: "Wir wollen das.", en: "to want", sound: "o", file: "wollen" },
  { word: "sollen", phrase: "Was sollen wir tun?", en: "should", sound: "o", file: "sollen" },
  { word: "Sonne", phrase: "die warme Sonne", en: "sun", sound: "o", file: "Sonne" },
  { word: "kommen", phrase: "Sie kommen bald.", en: "to come", sound: "o", file: "kommen" },
  { word: "Sommer", phrase: "im Sommer", en: "summer", sound: "o", file: "Sommer" },
  { word: "Morgen", phrase: "guten Morgen", en: "morning", sound: "o", file: "Morgen" },
  { word: "morgen", phrase: "bis morgen", en: "tomorrow", sound: "o", file: "morgen" },
  { word: "Sport", phrase: "Ich mache Sport.", en: "sport", sound: "o", file: "Sport" },
  { word: "vor", phrase: "vor dem Haus", en: "before/in front of", sound: "o", file: "vor" }
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

  // Save manifest
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
