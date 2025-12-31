const textToSpeech = require('@google-cloud/text-to-speech');
const fs = require('fs');
const path = require('path');

const client = new textToSpeech.TextToSpeechClient();

const words = [
  // New P words - phrases
  { text: "ein schickes Top", file: "Top_phrase" },
  { text: "ein kleiner Shop", file: "Shop_phrase" },
  { text: "ein kurzer Stopp", file: "Stopp_phrase" },
  { text: "ein guter Tipp", file: "Tipp_phrase" },
  { text: "ein cooler Typ", file: "Typ_phrase" },
  { text: "deutscher Pop", file: "Pop_phrase" },
  { text: "ein neuer Laptop", file: "Laptop_phrase" },
  { text: "ein kurzer Clip", file: "Clip_phrase" },
  { text: "ein langer Trip", file: "Trip_phrase" },
  { text: "ein weißer Slip", file: "Slip_phrase" },
  { text: "ein kleiner Chip", file: "Chip_phrase" },
  { text: "süßer Sirup", file: "Sirup_phrase" },
  { text: "roter Ketchup", file: "Ketchup_phrase" },
  { text: "eine neue App", file: "App_phrase" },
  { text: "deutscher Rap", file: "Rap_phrase" },
  { text: "ein totaler Flop", file: "Flop_phrase" },
  { text: "ein wichtiger Prop", file: "Prop_phrase" },
  { text: "ein deutsches Startup", file: "Startup_phrase" },
  { text: "schönes Makeup", file: "Makeup_phrase" },
  { text: "ein wichtiges Backup", file: "Backup_phrase" },
  // New P words - hints
  { text: "schicke Tops", file: "Tops_phrase" },
  { text: "kleine Shops", file: "Shops_phrase" },
  { text: "kurze Stopps", file: "Stopps_phrase" },
  { text: "gute Tipps", file: "Tipps_phrase" },
  { text: "coole Typen", file: "Typen_phrase" },
  { text: "viel Pop", file: "Pop_hint_phrase" },
  { text: "neue Laptops", file: "Laptops_phrase" },
  { text: "kurze Clips", file: "Clips_phrase" },
  { text: "lange Trips", file: "Trips_phrase" },
  { text: "weiße Slips", file: "Slips_phrase" },
  { text: "kleine Chips", file: "Chips_phrase" },
  { text: "süße Sirupe", file: "Sirupe_phrase" },
  { text: "viel Ketchup", file: "Ketchup_hint_phrase" },
  { text: "neue Apps", file: "Apps_phrase" },
  { text: "viel Rap", file: "Rap_hint_phrase" },
  { text: "totale Flops", file: "Flops_phrase" },
  { text: "wichtige Props", file: "Props_phrase" },
  { text: "deutsche Startups", file: "Startups_phrase" },
  { text: "viel Makeup", file: "Makeup_hint_phrase" },
  { text: "wichtige Backups", file: "Backups_phrase" }
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

  console.log(`Generating ${words.length} audio files for new P words...`);

  for (const w of words) {
    await generateAudio(w.text, w.file);
  }

  console.log('Done!');
}

main().catch(console.error);
