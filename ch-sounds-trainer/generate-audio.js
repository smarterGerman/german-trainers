/**
 * Generate audio files for ch-sounds (ich/ach) trainer
 * Uses Google Cloud Text-to-Speech with Chirp3 HD voice
 * Uses short German phrases to ensure proper German pronunciation
 *
 * Prerequisites:
 *   1. npm install @google-cloud/text-to-speech
 *   2. Set GOOGLE_APPLICATION_CREDENTIALS env var to your service account JSON
 *
 * Usage:
 *   GOOGLE_APPLICATION_CREDENTIALS="/path/to/credentials.json" node generate-audio.js
 */

const textToSpeech = require('@google-cloud/text-to-speech');
const fs = require('fs');
const path = require('path');
const util = require('util');

// All words with short German phrases to force German pronunciation
const words = [
  // ich-Laut (40 words)
  { word: "ich", phrase: "ich bin hier", en: "I am here", sound: "ich" },
  { word: "mich", phrase: "für mich bitte", en: "for me please", sound: "ich" },
  { word: "dich", phrase: "ich sehe dich", en: "I see you", sound: "ich" },
  { word: "sich", phrase: "er freut sich", en: "he is happy", sound: "ich" },
  { word: "nicht", phrase: "das geht nicht", en: "that doesn't work", sound: "ich" },
  { word: "Licht", phrase: "mach das Licht an", en: "turn on the light", sound: "ich" },
  { word: "Gesicht", phrase: "ein freundliches Gesicht", en: "a friendly face", sound: "ich" },
  { word: "Geschichte", phrase: "eine lange Geschichte", en: "a long story", sound: "ich" },
  { word: "wichtig", phrase: "das ist wichtig", en: "that is important", sound: "ich" },
  { word: "richtig", phrase: "ja, das ist richtig", en: "yes, that is correct", sound: "ich" },
  { word: "möchten", phrase: "was möchten Sie", en: "what would you like", sound: "ich" },
  { word: "Bücher", phrase: "viele Bücher lesen", en: "read many books", sound: "ich" },
  { word: "Küche", phrase: "in der Küche kochen", en: "cook in the kitchen", sound: "ich" },
  { word: "Mädchen", phrase: "das kleine Mädchen", en: "the little girl", sound: "ich" },
  { word: "sprechen", phrase: "Deutsch sprechen lernen", en: "learn to speak German", sound: "ich" },
  { word: "brechen", phrase: "das Glas brechen", en: "break the glass", sound: "ich" },
  { word: "stechen", phrase: "die Biene kann stechen", en: "the bee can sting", sound: "ich" },
  { word: "Becher", phrase: "ein voller Becher", en: "a full cup", sound: "ich" },
  { word: "Löcher", phrase: "viele kleine Löcher", en: "many small holes", sound: "ich" },
  { word: "Köcher", phrase: "Pfeil und Köcher", en: "arrow and quiver", sound: "ich" },
  { word: "Milch", phrase: "kalte Milch trinken", en: "drink cold milk", sound: "ich" },
  { word: "welch", phrase: "welch ein Tag", en: "what a day", sound: "ich" },
  { word: "solch", phrase: "solch ein Glück", en: "such luck", sound: "ich" },
  { word: "durch", phrase: "durch die Stadt gehen", en: "walk through the city", sound: "ich" },
  { word: "Kirche", phrase: "die alte Kirche", en: "the old church", sound: "ich" },
  { word: "Lerche", phrase: "die Lerche singt", en: "the lark sings", sound: "ich" },
  { word: "München", phrase: "ich wohne in München", en: "I live in Munich", sound: "ich" },
  { word: "Mönch", phrase: "der alte Mönch", en: "the old monk", sound: "ich" },
  { word: "gleich", phrase: "ich komme gleich", en: "I'm coming right away", sound: "ich" },
  { word: "weich", phrase: "das Bett ist weich", en: "the bed is soft", sound: "ich" },
  { word: "reich", phrase: "sehr reich werden", en: "become very rich", sound: "ich" },
  { word: "Teich", phrase: "Fische im Teich", en: "fish in the pond", sound: "ich" },
  { word: "leicht", phrase: "das ist leicht", en: "that is easy", sound: "ich" },
  { word: "vielleicht", phrase: "ja, vielleicht morgen", en: "yes, maybe tomorrow", sound: "ich" },
  { word: "Zeichen", phrase: "ein gutes Zeichen", en: "a good sign", sound: "ich" },
  { word: "euch", phrase: "ich danke euch", en: "I thank you all", sound: "ich" },
  { word: "Bäuche", phrase: "dicke Bäuche haben", en: "have big bellies", sound: "ich" },
  { word: "feucht", phrase: "das Handtuch ist feucht", en: "the towel is damp", sound: "ich" },
  { word: "Gerücht", phrase: "nur ein Gerücht", en: "just a rumor", sound: "ich" },
  { word: "Gedicht", phrase: "ein schönes Gedicht", en: "a beautiful poem", sound: "ich" },
  // ach-Laut (40 words)
  { word: "acht", phrase: "um acht Uhr", en: "at eight o'clock", sound: "ach" },
  { word: "Nacht", phrase: "gute Nacht sagen", en: "say good night", sound: "ach" },
  { word: "Macht", phrase: "große Macht haben", en: "have great power", sound: "ach" },
  { word: "machen", phrase: "Hausaufgaben machen", en: "do homework", sound: "ach" },
  { word: "lachen", phrase: "laut lachen müssen", en: "have to laugh out loud", sound: "ach" },
  { word: "wachen", phrase: "die ganze Nacht wachen", en: "stay awake all night", sound: "ach" },
  { word: "Sache", phrase: "eine gute Sache", en: "a good thing", sound: "ach" },
  { word: "Sprache", phrase: "die deutsche Sprache", en: "the German language", sound: "ach" },
  { word: "Dach", phrase: "auf dem Dach sitzen", en: "sit on the roof", sound: "ach" },
  { word: "Bach", phrase: "der kleine Bach fließt", en: "the small stream flows", sound: "ach" },
  { word: "flach", phrase: "das Land ist flach", en: "the land is flat", sound: "ach" },
  { word: "schwach", phrase: "ich bin noch schwach", en: "I am still weak", sound: "ach" },
  { word: "nach", phrase: "nach Hause gehen", en: "go home", sound: "ach" },
  { word: "Fach", phrase: "mein Lieblingsfach", en: "my favorite subject", sound: "ach" },
  { word: "noch", phrase: "noch ein Kaffee bitte", en: "another coffee please", sound: "ach" },
  { word: "doch", phrase: "ja doch, natürlich", en: "yes indeed, of course", sound: "ach" },
  { word: "hoch", phrase: "der Berg ist hoch", en: "the mountain is high", sound: "ach" },
  { word: "Koch", phrase: "der Koch kocht gut", en: "the cook cooks well", sound: "ach" },
  { word: "kochen", phrase: "Abendessen kochen", en: "cook dinner", sound: "ach" },
  { word: "Woche", phrase: "nächste Woche komme ich", en: "I'm coming next week", sound: "ach" },
  { word: "Tochter", phrase: "meine Tochter ist zehn", en: "my daughter is ten", sound: "ach" },
  { word: "Loch", phrase: "ein tiefes Loch", en: "a deep hole", sound: "ach" },
  { word: "Buch", phrase: "ein gutes Buch lesen", en: "read a good book", sound: "ach" },
  { word: "Tuch", phrase: "ein warmes Tuch", en: "a warm cloth", sound: "ach" },
  { word: "Kuchen", phrase: "leckeren Kuchen backen", en: "bake delicious cake", sound: "ach" },
  { word: "suchen", phrase: "die Schlüssel suchen", en: "look for the keys", sound: "ach" },
  { word: "besuchen", phrase: "Freunde besuchen gehen", en: "go visit friends", sound: "ach" },
  { word: "versuchen", phrase: "es nochmal versuchen", en: "try again", sound: "ach" },
  { word: "Geruch", phrase: "ein guter Geruch", en: "a good smell", sound: "ach" },
  { word: "Besuch", phrase: "Besuch bekommen", en: "have visitors", sound: "ach" },
  { word: "Fluch", phrase: "ein alter Fluch", en: "an old curse", sound: "ach" },
  { word: "Bruch", phrase: "ein Bruch im Bein", en: "a fracture in the leg", sound: "ach" },
  { word: "auch", phrase: "ich auch, danke", en: "me too, thanks", sound: "ach" },
  { word: "Bauch", phrase: "mein Bauch tut weh", en: "my stomach hurts", sound: "ach" },
  { word: "Rauch", phrase: "der Rauch steigt auf", en: "the smoke rises", sound: "ach" },
  { word: "brauchen", phrase: "ich brauche Hilfe", en: "I need help", sound: "ach" },
  { word: "rauchen", phrase: "nicht rauchen bitte", en: "no smoking please", sound: "ach" },
  { word: "tauchen", phrase: "im Meer tauchen", en: "dive in the sea", sound: "ach" },
  { word: "Schlauch", phrase: "der Gartenschlauch", en: "the garden hose", sound: "ach" },
  { word: "Strauch", phrase: "ein grüner Strauch", en: "a green shrub", sound: "ach" }
];

// Create output directory
const audioDir = path.join(__dirname, 'audio');
fs.mkdirSync(audioDir, { recursive: true });

// Initialize client
const client = new textToSpeech.TextToSpeechClient();

// Voice configuration - Chirp3 HD Algenib (German male)
const voiceConfig = {
  languageCode: 'de-DE',
  name: 'de-DE-Chirp3-HD-Algenib'
};

// Audio config
const audioConfig = {
  audioEncoding: 'MP3',
  speakingRate: 0.9,
  pitch: 0
};

// Sanitize filename (handle umlauts)
function sanitizeFilename(word) {
  return word
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue')
    .replace(/ß/g, 'ss')
    .replace(/Ä/g, 'Ae')
    .replace(/Ö/g, 'Oe')
    .replace(/Ü/g, 'Ue');
}

// Generate audio for a single text
async function generateAudio(text, outputPath) {
  const request = {
    input: { text },
    voice: voiceConfig,
    audioConfig
  };

  try {
    const [response] = await client.synthesizeSpeech(request);
    const writeFile = util.promisify(fs.writeFile);
    await writeFile(outputPath, response.audioContent, 'binary');
    console.log(`  Generated: ${outputPath}`);
    return true;
  } catch (error) {
    console.error(`  ERROR generating ${outputPath}: ${error.message}`);
    return false;
  }
}

// Main function
async function main() {
  console.log('='.repeat(60));
  console.log('German ch-sounds (ich/ach) Audio Generator (with phrases)');
  console.log('Using Google Cloud TTS - Chirp3 HD Algenib Voice');
  console.log('='.repeat(60));
  console.log();

  let successCount = 0;
  let errorCount = 0;

  for (const item of words) {
    const { word, phrase, sound } = item;
    const safeName = sanitizeFilename(word);

    console.log(`Processing: "${phrase}" (${sound}-Laut)`);

    const audioPath = path.join(audioDir, `${safeName}.mp3`);
    if (await generateAudio(phrase, audioPath)) {
      successCount++;
    } else {
      errorCount++;
    }

    // Small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  console.log();
  console.log('='.repeat(60));
  console.log(`Complete! Generated ${successCount} files, ${errorCount} errors`);
  console.log(`Audio directory: ${audioDir}`);
  console.log('='.repeat(60));

  // Generate manifest JSON for the widget
  const manifest = {
    generated: new Date().toISOString(),
    voice: voiceConfig.name,
    words: words.map(w => ({
      word: w.word,
      phrase: w.phrase,
      en: w.en,
      sound: w.sound,
      file: `audio/${sanitizeFilename(w.word)}.mp3`
    }))
  };

  fs.writeFileSync(
    path.join(__dirname, 'audio-manifest.json'),
    JSON.stringify(manifest, null, 2)
  );
  console.log(`Manifest written to: ${path.join(__dirname, 'audio-manifest.json')}`);
}

main().catch(console.error);
