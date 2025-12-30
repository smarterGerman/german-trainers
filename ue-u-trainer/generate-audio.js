/**
 * Generate audio files for ü/u trainer
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
  // ü words (40)
  { word: "über", phrase: "über den Wolken", en: "above the clouds", vowel: "ü" },
  { word: "üben", phrase: "jeden Tag üben", en: "practice every day", vowel: "ü" },
  { word: "Übung", phrase: "eine gute Übung", en: "a good exercise", vowel: "ü" },
  { word: "Tür", phrase: "die Tür ist offen", en: "the door is open", vowel: "ü" },
  { word: "für", phrase: "für dich", en: "for you", vowel: "ü" },
  { word: "natürlich", phrase: "ja, natürlich", en: "yes, of course", vowel: "ü" },
  { word: "Büro", phrase: "im Büro arbeiten", en: "work in the office", vowel: "ü" },
  { word: "Bürger", phrase: "die Bürger der Stadt", en: "the citizens of the city", vowel: "ü" },
  { word: "Bücher", phrase: "viele Bücher lesen", en: "read many books", vowel: "ü" },
  { word: "Küche", phrase: "in der Küche kochen", en: "cook in the kitchen", vowel: "ü" },
  { word: "kühl", phrase: "es ist kühl draußen", en: "it's cool outside", vowel: "ü" },
  { word: "Kühlschrank", phrase: "im Kühlschrank", en: "in the fridge", vowel: "ü" },
  { word: "Frühstück", phrase: "zum Frühstück essen", en: "eat for breakfast", vowel: "ü" },
  { word: "früh", phrase: "früh am Morgen", en: "early in the morning", vowel: "ü" },
  { word: "Frühjahr", phrase: "im Frühjahr blühen", en: "bloom in spring", vowel: "ü" },
  { word: "Frühling", phrase: "der Frühling kommt", en: "spring is coming", vowel: "ü" },
  { word: "grün", phrase: "das Gras ist grün", en: "the grass is green", vowel: "ü" },
  { word: "Gemüse", phrase: "frisches Gemüse", en: "fresh vegetables", vowel: "ü" },
  { word: "müde", phrase: "ich bin müde", en: "I am tired", vowel: "ü" },
  { word: "Mühe", phrase: "mit viel Mühe", en: "with much effort", vowel: "ü" },
  { word: "Müll", phrase: "den Müll rausbringen", en: "take out the trash", vowel: "ü" },
  { word: "München", phrase: "ich wohne in München", en: "I live in Munich", vowel: "ü" },
  { word: "Mütze", phrase: "eine warme Mütze", en: "a warm cap", vowel: "ü" },
  { word: "Mütter", phrase: "die Mütter und Kinder", en: "the mothers and children", vowel: "ü" },
  { word: "Hüte", phrase: "schöne Hüte tragen", en: "wear nice hats", vowel: "ü" },
  { word: "Hügel", phrase: "auf dem Hügel stehen", en: "stand on the hill", vowel: "ü" },
  { word: "Hüfte", phrase: "die Hüfte bewegen", en: "move the hip", vowel: "ü" },
  { word: "fühlen", phrase: "sich gut fühlen", en: "feel good", vowel: "ü" },
  { word: "führen", phrase: "den Weg führen", en: "lead the way", vowel: "ü" },
  { word: "Füße", phrase: "kalte Füße haben", en: "have cold feet", vowel: "ü" },
  { word: "fünf", phrase: "fünf Minuten warten", en: "wait five minutes", vowel: "ü" },
  { word: "fünfzig", phrase: "fünfzig Euro kosten", en: "cost fifty euros", vowel: "ü" },
  { word: "Glück", phrase: "viel Glück wünschen", en: "wish good luck", vowel: "ü" },
  { word: "glücklich", phrase: "sehr glücklich sein", en: "be very happy", vowel: "ü" },
  { word: "Brücke", phrase: "über die Brücke gehen", en: "walk over the bridge", vowel: "ü" },
  { word: "Stück", phrase: "ein Stück Kuchen", en: "a piece of cake", vowel: "ü" },
  { word: "zurück", phrase: "komm bald zurück", en: "come back soon", vowel: "ü" },
  { word: "dünn", phrase: "sehr dünn geschnitten", en: "cut very thin", vowel: "ü" },
  { word: "würde", phrase: "ich würde gern", en: "I would like to", vowel: "ü" },
  { word: "wünschen", phrase: "sich etwas wünschen", en: "wish for something", vowel: "ü" },
  // u words (40)
  { word: "und", phrase: "du und ich", en: "you and I", vowel: "u" },
  { word: "um", phrase: "um acht Uhr", en: "at eight o'clock", vowel: "u" },
  { word: "unter", phrase: "unter dem Tisch", en: "under the table", vowel: "u" },
  { word: "unser", phrase: "unser Haus ist groß", en: "our house is big", vowel: "u" },
  { word: "uns", phrase: "komm zu uns", en: "come to us", vowel: "u" },
  { word: "Uhr", phrase: "es ist zehn Uhr", en: "it's ten o'clock", vowel: "u" },
  { word: "Urlaub", phrase: "im Urlaub sein", en: "be on vacation", vowel: "u" },
  { word: "Buch", phrase: "ein gutes Buch lesen", en: "read a good book", vowel: "u" },
  { word: "Kuchen", phrase: "leckeren Kuchen backen", en: "bake delicious cake", vowel: "u" },
  { word: "suchen", phrase: "etwas suchen", en: "search for something", vowel: "u" },
  { word: "besuchen", phrase: "Freunde besuchen", en: "visit friends", vowel: "u" },
  { word: "versuchen", phrase: "es nochmal versuchen", en: "try again", vowel: "u" },
  { word: "Schule", phrase: "in die Schule gehen", en: "go to school", vowel: "u" },
  { word: "Stuhl", phrase: "auf dem Stuhl sitzen", en: "sit on the chair", vowel: "u" },
  { word: "Hund", phrase: "der Hund bellt", en: "the dog barks", vowel: "u" },
  { word: "Mund", phrase: "den Mund öffnen", en: "open the mouth", vowel: "u" },
  { word: "rund", phrase: "der Ball ist rund", en: "the ball is round", vowel: "u" },
  { word: "Stunde", phrase: "eine Stunde warten", en: "wait an hour", vowel: "u" },
  { word: "Kunde", phrase: "der Kunde kauft ein", en: "the customer is shopping", vowel: "u" },
  { word: "Grund", phrase: "ohne Grund weinen", en: "cry without reason", vowel: "u" },
  { word: "gesund", phrase: "bleib gesund", en: "stay healthy", vowel: "u" },
  { word: "Fuß", phrase: "zu Fuß gehen", en: "go on foot", vowel: "u" },
  { word: "Gruppe", phrase: "eine große Gruppe", en: "a large group", vowel: "u" },
  { word: "Mutter", phrase: "meine Mutter kocht", en: "my mother cooks", vowel: "u" },
  { word: "Butter", phrase: "Brot mit Butter", en: "bread with butter", vowel: "u" },
  { word: "Hut", phrase: "einen Hut tragen", en: "wear a hat", vowel: "u" },
  { word: "gut", phrase: "das ist gut", en: "that is good", vowel: "u" },
  { word: "Blut", phrase: "rotes Blut fließt", en: "red blood flows", vowel: "u" },
  { word: "Mut", phrase: "Mut haben", en: "have courage", vowel: "u" },
  { word: "Flug", phrase: "der Flug ist pünktlich", en: "the flight is on time", vowel: "u" },
  { word: "Zug", phrase: "mit dem Zug fahren", en: "travel by train", vowel: "u" },
  { word: "genug", phrase: "das ist genug", en: "that is enough", vowel: "u" },
  { word: "Durst", phrase: "großen Durst haben", en: "be very thirsty", vowel: "u" },
  { word: "Wurst", phrase: "eine leckere Wurst", en: "a tasty sausage", vowel: "u" },
  { word: "Kurs", phrase: "einen Kurs besuchen", en: "take a course", vowel: "u" },
  { word: "Kultur", phrase: "deutsche Kultur", en: "German culture", vowel: "u" },
  { word: "Natur", phrase: "die schöne Natur", en: "the beautiful nature", vowel: "u" },
  { word: "Figur", phrase: "eine gute Figur", en: "a good figure", vowel: "u" },
  { word: "Musik", phrase: "laute Musik hören", en: "listen to loud music", vowel: "u" },
  { word: "Minute", phrase: "eine Minute warten", en: "wait a minute", vowel: "u" }
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
  console.log('German ü/u Audio Generator (with phrases)');
  console.log('Using Google Cloud TTS - Chirp3 HD Algenib Voice');
  console.log('='.repeat(60));
  console.log();

  let successCount = 0;
  let errorCount = 0;

  for (const item of words) {
    const { word, phrase, vowel } = item;
    const safeName = sanitizeFilename(word);

    console.log(`Processing: "${phrase}" (${vowel})`);

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
      vowel: w.vowel,
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
