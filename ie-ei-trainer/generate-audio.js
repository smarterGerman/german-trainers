/**
 * Generate audio files for ie/ei trainer
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
  // ie words (50)
  { word: "Liebe", phrase: "die große Liebe", en: "the great love", sound: "ie" },
  { word: "Bier", phrase: "ein kaltes Bier", en: "a cold beer", sound: "ie" },
  { word: "Tier", phrase: "ein wildes Tier", en: "a wild animal", sound: "ie" },
  { word: "Papier", phrase: "weißes Papier", en: "white paper", sound: "ie" },
  { word: "Spiel", phrase: "ein lustiges Spiel", en: "a fun game", sound: "ie" },
  { word: "Ziel", phrase: "das Ziel erreichen", en: "reach the goal", sound: "ie" },
  { word: "viel", phrase: "viel zu tun", en: "much to do", sound: "ie" },
  { word: "Spiegel", phrase: "in den Spiegel schauen", en: "look in the mirror", sound: "ie" },
  { word: "Beispiel", phrase: "zum Beispiel", en: "for example", sound: "ie" },
  { word: "wieder", phrase: "wieder da sein", en: "be back again", sound: "ie" },
  { word: "niemand", phrase: "niemand ist da", en: "nobody is there", sound: "ie" },
  { word: "Frieden", phrase: "Frieden schließen", en: "make peace", sound: "ie" },
  { word: "Miete", phrase: "die Miete zahlen", en: "pay the rent", sound: "ie" },
  { word: "Brief", phrase: "einen Brief schreiben", en: "write a letter", sound: "ie" },
  { word: "tief", phrase: "tief atmen", en: "breathe deeply", sound: "ie" },
  { word: "lieben", phrase: "jemanden lieben", en: "love someone", sound: "ie" },
  { word: "sieben", phrase: "sieben Tage", en: "seven days", sound: "ie" },
  { word: "bieten", phrase: "Hilfe bieten", en: "offer help", sound: "ie" },
  { word: "fliegen", phrase: "nach Berlin fliegen", en: "fly to Berlin", sound: "ie" },
  { word: "liegen", phrase: "im Bett liegen", en: "lie in bed", sound: "ie" },
  { word: "ziehen", phrase: "an der Tür ziehen", en: "pull on the door", sound: "ie" },
  { word: "fliehen", phrase: "vor Gefahr fliehen", en: "flee from danger", sound: "ie" },
  { word: "riechen", phrase: "gut riechen", en: "smell good", sound: "ie" },
  { word: "schieben", phrase: "den Wagen schieben", en: "push the cart", sound: "ie" },
  { word: "Dieb", phrase: "der Dieb flieht", en: "the thief flees", sound: "ie" },
  { word: "Lied", phrase: "ein schönes Lied", en: "a beautiful song", sound: "ie" },
  { word: "Krieg", phrase: "Krieg und Frieden", en: "war and peace", sound: "ie" },
  { word: "Sieg", phrase: "der große Sieg", en: "the great victory", sound: "ie" },
  { word: "fließen", phrase: "das Wasser fließt", en: "the water flows", sound: "ie" },
  { word: "gießen", phrase: "Blumen gießen", en: "water the flowers", sound: "ie" },
  { word: "schießen", phrase: "ein Tor schießen", en: "score a goal", sound: "ie" },
  { word: "Zwiebel", phrase: "eine Zwiebel schneiden", en: "cut an onion", sound: "ie" },
  { word: "Riese", phrase: "ein großer Riese", en: "a big giant", sound: "ie" },
  { word: "Wiese", phrase: "auf der Wiese spielen", en: "play in the meadow", sound: "ie" },
  { word: "diese", phrase: "diese Woche", en: "this week", sound: "ie" },
  { word: "Knie", phrase: "auf die Knie fallen", en: "fall to the knees", sound: "ie" },
  { word: "Energie", phrase: "voller Energie sein", en: "be full of energy", sound: "ie" },
  { word: "Familie", phrase: "meine Familie", en: "my family", sound: "ie" },
  { word: "studieren", phrase: "Medizin studieren", en: "study medicine", sound: "ie" },
  { word: "passieren", phrase: "was ist passiert", en: "what happened", sound: "ie" },
  { word: "regieren", phrase: "das Land regieren", en: "govern the country", sound: "ie" },
  { word: "probieren", phrase: "etwas probieren", en: "try something", sound: "ie" },
  { word: "verlieren", phrase: "das Spiel verlieren", en: "lose the game", sound: "ie" },
  { word: "frieren", phrase: "im Winter frieren", en: "be cold in winter", sound: "ie" },
  { word: "hier", phrase: "hier bin ich", en: "here I am", sound: "ie" },
  { word: "vier", phrase: "vier Uhr", en: "four o'clock", sound: "ie" },
  { word: "wir", phrase: "wir gehen", en: "we go", sound: "ie" },
  { word: "Stiefel", phrase: "die Stiefel anziehen", en: "put on the boots", sound: "ie" },
  { word: "Fieber", phrase: "hohes Fieber haben", en: "have a high fever", sound: "ie" },
  { word: "niedrig", phrase: "sehr niedrig", en: "very low", sound: "ie" },
  // ei words (50)
  { word: "Stein", phrase: "ein schwerer Stein", en: "a heavy stone", sound: "ei" },
  { word: "Bein", phrase: "das Bein tut weh", en: "the leg hurts", sound: "ei" },
  { word: "klein", phrase: "ein kleines Kind", en: "a small child", sound: "ei" },
  { word: "mein", phrase: "mein Haus", en: "my house", sound: "ei" },
  { word: "dein", phrase: "dein Auto", en: "your car", sound: "ei" },
  { word: "sein", phrase: "sein Bruder", en: "his brother", sound: "ei" },
  { word: "kein", phrase: "kein Problem", en: "no problem", sound: "ei" },
  { word: "allein", phrase: "ganz allein", en: "all alone", sound: "ei" },
  { word: "Wein", phrase: "ein Glas Wein", en: "a glass of wine", sound: "ei" },
  { word: "Schwein", phrase: "das Schwein grunzt", en: "the pig grunts", sound: "ei" },
  { word: "Verein", phrase: "im Verein spielen", en: "play in the club", sound: "ei" },
  { word: "Zeit", phrase: "keine Zeit haben", en: "have no time", sound: "ei" },
  { word: "Arbeit", phrase: "zur Arbeit gehen", en: "go to work", sound: "ei" },
  { word: "Freiheit", phrase: "Freiheit und Gleichheit", en: "freedom and equality", sound: "ei" },
  { word: "breit", phrase: "eine breite Straße", en: "a wide street", sound: "ei" },
  { word: "weit", phrase: "sehr weit weg", en: "very far away", sound: "ei" },
  { word: "Seite", phrase: "auf der Seite liegen", en: "lie on the side", sound: "ei" },
  { word: "Leiter", phrase: "die Leiter steigen", en: "climb the ladder", sound: "ei" },
  { word: "Meister", phrase: "der deutsche Meister", en: "the German champion", sound: "ei" },
  { word: "Geist", phrase: "der heilige Geist", en: "the holy spirit", sound: "ei" },
  { word: "heißen", phrase: "wie heißen Sie", en: "what is your name", sound: "ei" },
  { word: "wissen", phrase: "ich weiß es nicht", en: "I don't know", sound: "ei" },
  { word: "beißen", phrase: "der Hund beißt", en: "the dog bites", sound: "ei" },
  { word: "reisen", phrase: "um die Welt reisen", en: "travel around the world", sound: "ei" },
  { word: "weisen", phrase: "den Weg weisen", en: "show the way", sound: "ei" },
  { word: "preisen", phrase: "Gott preisen", en: "praise God", sound: "ei" },
  { word: "Reis", phrase: "Reis mit Gemüse", en: "rice with vegetables", sound: "ei" },
  { word: "Kreis", phrase: "einen Kreis zeichnen", en: "draw a circle", sound: "ei" },
  { word: "Preis", phrase: "der beste Preis", en: "the best price", sound: "ei" },
  { word: "Eis", phrase: "ein Eis essen", en: "eat an ice cream", sound: "ei" },
  { word: "heiß", phrase: "es ist heiß", en: "it is hot", sound: "ei" },
  { word: "weiß", phrase: "weiß wie Schnee", en: "white as snow", sound: "ei" },
  { word: "Fleisch", phrase: "frisches Fleisch", en: "fresh meat", sound: "ei" },
  { word: "gleich", phrase: "gleich fertig", en: "almost done", sound: "ei" },
  { word: "vielleicht", phrase: "vielleicht morgen", en: "maybe tomorrow", sound: "ei" },
  { word: "reich", phrase: "reich und berühmt", en: "rich and famous", sound: "ei" },
  { word: "weich", phrase: "weich und warm", en: "soft and warm", sound: "ei" },
  { word: "Teich", phrase: "am Teich sitzen", en: "sit by the pond", sound: "ei" },
  { word: "Leiche", phrase: "eine Leiche finden", en: "find a corpse", sound: "ei" },
  { word: "Zeichen", phrase: "ein gutes Zeichen", en: "a good sign", sound: "ei" },
  { word: "erreichen", phrase: "das Ziel erreichen", en: "reach the goal", sound: "ei" },
  { word: "vergleichen", phrase: "Preise vergleichen", en: "compare prices", sound: "ei" },
  { word: "schreiben", phrase: "einen Brief schreiben", en: "write a letter", sound: "ei" },
  { word: "bleiben", phrase: "zu Hause bleiben", en: "stay at home", sound: "ei" },
  { word: "treiben", phrase: "Sport treiben", en: "do sports", sound: "ei" },
  { word: "Leib", phrase: "Leib und Seele", en: "body and soul", sound: "ei" },
  { word: "Weib", phrase: "ein altes Weib", en: "an old woman", sound: "ei" },
  { word: "Scheibe", phrase: "eine Scheibe Brot", en: "a slice of bread", sound: "ei" },
  { word: "zwei", phrase: "zwei Kinder", en: "two children", sound: "ei" },
  { word: "drei", phrase: "drei Mal", en: "three times", sound: "ei" }
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
  console.log('German ie/ei Audio Generator (with phrases)');
  console.log('Using Google Cloud TTS - Chirp3 HD Algenib Voice');
  console.log('='.repeat(60));
  console.log();

  let successCount = 0;
  let errorCount = 0;

  for (const item of words) {
    const { word, phrase, sound } = item;
    const safeName = sanitizeFilename(word);

    console.log(`Processing: "${phrase}" (${sound})`);

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
