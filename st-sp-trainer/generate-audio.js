const textToSpeech = require('@google-cloud/text-to-speech');
const fs = require('fs');
const path = require('path');

const client = new textToSpeech.TextToSpeechClient();

const words = [
  // SCHT/SCHP - st/sp at syllable beginning (40)
  { word: "Stadt", phrase: "die große Stadt", file: "Stadt" },
  { word: "Straße", phrase: "die lange Straße", file: "Strasse" },
  { word: "stark", phrase: "sehr stark", file: "stark" },
  { word: "Stein", phrase: "ein großer Stein", file: "Stein" },
  { word: "stehen", phrase: "hier stehen", file: "stehen" },
  { word: "Stelle", phrase: "eine gute Stelle", file: "Stelle" },
  { word: "Stimme", phrase: "eine laute Stimme", file: "Stimme" },
  { word: "Stock", phrase: "im ersten Stock", file: "Stock" },
  { word: "Strom", phrase: "der elektrische Strom", file: "Strom" },
  { word: "Stück", phrase: "ein kleines Stück", file: "Stueck" },
  { word: "Spiel", phrase: "ein schönes Spiel", file: "Spiel" },
  { word: "sprechen", phrase: "laut sprechen", file: "sprechen" },
  { word: "Sprache", phrase: "eine neue Sprache", file: "Sprache" },
  { word: "spät", phrase: "sehr spät", file: "spaet" },
  { word: "Sport", phrase: "viel Sport", file: "Sport" },
  { word: "Spaß", phrase: "viel Spaß", file: "Spass" },
  { word: "sparen", phrase: "Geld sparen", file: "sparen" },
  { word: "spielen", phrase: "Fußball spielen", file: "spielen" },
  { word: "Spiegel", phrase: "ein großer Spiegel", file: "Spiegel" },
  { word: "Spinne", phrase: "eine kleine Spinne", file: "Spinne" },
  { word: "verstehen", phrase: "gut verstehen", file: "verstehen" },
  { word: "bestellen", phrase: "etwas bestellen", file: "bestellen" },
  { word: "entstehen", phrase: "Probleme entstehen", file: "entstehen" },
  { word: "vorstellen", phrase: "sich vorstellen", file: "vorstellen" },
  { word: "anstatt", phrase: "anstatt dessen", file: "anstatt" },
  { word: "besprechen", phrase: "das besprechen", file: "besprechen" },
  { word: "versprechen", phrase: "das versprechen", file: "versprechen" },
  { word: "entsprechen", phrase: "dem entsprechen", file: "entsprechen" },
  { word: "Stuhl", phrase: "ein bequemer Stuhl", file: "Stuhl" },
  { word: "Studium", phrase: "das Studium", file: "Studium" },
  { word: "studieren", phrase: "Medizin studieren", file: "studieren" },
  { word: "Stern", phrase: "ein heller Stern", file: "Stern" },
  { word: "sterben", phrase: "niemals sterben", file: "sterben" },
  { word: "Steuer", phrase: "hohe Steuer", file: "Steuer" },
  { word: "stellen", phrase: "eine Frage stellen", file: "stellen" },
  { word: "stoppen", phrase: "sofort stoppen", file: "stoppen" },
  { word: "stolz", phrase: "sehr stolz", file: "stolz" },
  { word: "Strand", phrase: "am Strand", file: "Strand" },
  { word: "Sprung", phrase: "ein großer Sprung", file: "Sprung" },
  { word: "Spruch", phrase: "ein guter Spruch", file: "Spruch" },
  // ST/SP - not at syllable beginning (40)
  { word: "fest", phrase: "ganz fest", file: "fest" },
  { word: "Gast", phrase: "ein netter Gast", file: "Gast" },
  { word: "Last", phrase: "eine schwere Last", file: "Last" },
  { word: "Lust", phrase: "große Lust", file: "Lust" },
  { word: "Kunst", phrase: "moderne Kunst", file: "Kunst" },
  { word: "Wurst", phrase: "eine gute Wurst", file: "Wurst" },
  { word: "Durst", phrase: "großer Durst", file: "Durst" },
  { word: "bist", phrase: "du bist", file: "bist" },
  { word: "ist", phrase: "es ist", file: "ist" },
  { word: "fast", phrase: "fast fertig", file: "fast" },
  { word: "Wespe", phrase: "eine kleine Wespe", file: "Wespe" },
  { word: "Kasper", phrase: "der lustige Kasper", file: "Kasper" },
  { word: "Knospe", phrase: "eine junge Knospe", file: "Knospe" },
  { word: "Fenster", phrase: "das offene Fenster", file: "Fenster" },
  { word: "Schwester", phrase: "meine Schwester", file: "Schwester" },
  { word: "Meister", phrase: "der alte Meister", file: "Meister" },
  { word: "Küste", phrase: "an der Küste", file: "Kueste" },
  { word: "Liste", phrase: "eine lange Liste", file: "Liste" },
  { word: "Westen", phrase: "im Westen", file: "Westen" },
  { word: "Osten", phrase: "im Osten", file: "Osten" },
  { word: "kosten", phrase: "viel kosten", file: "kosten" },
  { word: "Kasten", phrase: "ein großer Kasten", file: "Kasten" },
  { word: "Posten", phrase: "ein wichtiger Posten", file: "Posten" },
  { word: "Frost", phrase: "starker Frost", file: "Frost" },
  { word: "Rost", phrase: "viel Rost", file: "Rost" },
  { word: "Post", phrase: "die Post kommt", file: "Post" },
  { word: "Obst", phrase: "frisches Obst", file: "Obst" },
  { word: "selbst", phrase: "ich selbst", file: "selbst" },
  { word: "sonst", phrase: "sonst nichts", file: "sonst" },
  { word: "ernst", phrase: "ganz ernst", file: "ernst" },
  { word: "hast", phrase: "du hast", file: "hast" },
  { word: "musst", phrase: "du musst", file: "musst" },
  { word: "kannst", phrase: "du kannst", file: "kannst" },
  { word: "willst", phrase: "du willst", file: "willst" },
  { word: "sollst", phrase: "du sollst", file: "sollst" },
  { word: "Hast", phrase: "die große Hast", file: "Hast2" },
  { word: "Mast", phrase: "ein hoher Mast", file: "Mast" },
  { word: "Brust", phrase: "die breite Brust", file: "Brust" },
  { word: "Frist", phrase: "eine kurze Frist", file: "Frist" },
  { word: "Geist", phrase: "ein böser Geist", file: "Geist" }
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
