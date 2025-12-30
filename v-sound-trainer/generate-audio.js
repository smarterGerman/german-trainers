const textToSpeech = require('@google-cloud/text-to-speech');
const fs = require('fs');
const path = require('path');

const client = new textToSpeech.TextToSpeechClient();

const words = [
  // /f/ sound - native German words (40)
  { word: "Vater", phrase: "mein Vater", file: "Vater" },
  { word: "Vogel", phrase: "ein kleiner Vogel", file: "Vogel" },
  { word: "viel", phrase: "sehr viel", file: "viel" },
  { word: "von", phrase: "von mir", file: "von" },
  { word: "vor", phrase: "vor dem Haus", file: "vor" },
  { word: "voll", phrase: "ganz voll", file: "voll" },
  { word: "vier", phrase: "die Zahl vier", file: "vier" },
  { word: "vielleicht", phrase: "ja vielleicht", file: "vielleicht" },
  { word: "Volk", phrase: "das deutsche Volk", file: "Volk" },
  { word: "verstehen", phrase: "gut verstehen", file: "verstehen" },
  { word: "vergessen", phrase: "nicht vergessen", file: "vergessen" },
  { word: "verlieren", phrase: "etwas verlieren", file: "verlieren" },
  { word: "versprechen", phrase: "fest versprechen", file: "versprechen" },
  { word: "versuchen", phrase: "es versuchen", file: "versuchen" },
  { word: "Verkehr", phrase: "viel Verkehr", file: "Verkehr" },
  { word: "Vertrag", phrase: "ein neuer Vertrag", file: "Vertrag" },
  { word: "Verein", phrase: "ein großer Verein", file: "Verein" },
  { word: "Vergangenheit", phrase: "die Vergangenheit", file: "Vergangenheit" },
  { word: "Verantwortung", phrase: "große Verantwortung", file: "Verantwortung" },
  { word: "Verbindung", phrase: "eine gute Verbindung", file: "Verbindung" },
  { word: "Vorschlag", phrase: "ein guter Vorschlag", file: "Vorschlag" },
  { word: "Vorsicht", phrase: "Vorsicht bitte", file: "Vorsicht" },
  { word: "Vorteil", phrase: "ein großer Vorteil", file: "Vorteil" },
  { word: "Vorstellung", phrase: "die Vorstellung", file: "Vorstellung" },
  { word: "Vorname", phrase: "mein Vorname", file: "Vorname" },
  { word: "vorne", phrase: "ganz vorne", file: "vorne" },
  { word: "vorher", phrase: "kurz vorher", file: "vorher" },
  { word: "vorbei", phrase: "schon vorbei", file: "vorbei" },
  { word: "vorstellen", phrase: "sich vorstellen", file: "vorstellen" },
  { word: "vorkommen", phrase: "oft vorkommen", file: "vorkommen" },
  { word: "Vetter", phrase: "mein Vetter", file: "Vetter" },
  { word: "Vieh", phrase: "das Vieh", file: "Vieh" },
  { word: "völlig", phrase: "völlig richtig", file: "voellig" },
  { word: "vierzehn", phrase: "genau vierzehn", file: "vierzehn" },
  { word: "vierzig", phrase: "schon vierzig", file: "vierzig" },
  { word: "Viertel", phrase: "ein Viertel", file: "Viertel" },
  { word: "verbieten", phrase: "streng verbieten", file: "verbieten" },
  { word: "verbringen", phrase: "Zeit verbringen", file: "verbringen" },
  { word: "verdienen", phrase: "Geld verdienen", file: "verdienen" },
  { word: "vereinbaren", phrase: "einen Termin vereinbaren", file: "vereinbaren" },
  // /v/ sound - foreign/borrowed words (40)
  { word: "Vase", phrase: "eine schöne Vase", file: "Vase" },
  { word: "Villa", phrase: "eine große Villa", file: "Villa" },
  { word: "Visum", phrase: "das Visum", file: "Visum" },
  { word: "Verb", phrase: "ein deutsches Verb", file: "Verb" },
  { word: "November", phrase: "im November", file: "November" },
  { word: "Vanille", phrase: "mit Vanille", file: "Vanille" },
  { word: "Vampir", phrase: "ein echter Vampir", file: "Vampir" },
  { word: "Vakuum", phrase: "im Vakuum", file: "Vakuum" },
  { word: "Ventil", phrase: "das Ventil", file: "Ventil" },
  { word: "Video", phrase: "ein lustiges Video", file: "Video" },
  { word: "Vitamin", phrase: "viel Vitamin", file: "Vitamin" },
  { word: "Violine", phrase: "die Violine", file: "Violine" },
  { word: "Vulkan", phrase: "ein aktiver Vulkan", file: "Vulkan" },
  { word: "Vegetation", phrase: "die Vegetation", file: "Vegetation" },
  { word: "Ventilator", phrase: "der Ventilator", file: "Ventilator" },
  { word: "Veteran", phrase: "ein alter Veteran", file: "Veteran" },
  { word: "Vietnam", phrase: "aus Vietnam", file: "Vietnam" },
  { word: "Vibration", phrase: "starke Vibration", file: "Vibration" },
  { word: "violett", phrase: "ganz violett", file: "violett" },
  { word: "Virus", phrase: "ein gefährlicher Virus", file: "Virus" },
  { word: "Vision", phrase: "eine klare Vision", file: "Vision" },
  { word: "vital", phrase: "sehr vital", file: "vital" },
  { word: "Vokal", phrase: "ein langer Vokal", file: "Vokal" },
  { word: "Volumen", phrase: "großes Volumen", file: "Volumen" },
  { word: "Revolution", phrase: "die Revolution", file: "Revolution" },
  { word: "Universität", phrase: "an der Universität", file: "Universitaet" },
  { word: "Kurve", phrase: "eine scharfe Kurve", file: "Kurve" },
  { word: "Nerven", phrase: "starke Nerven", file: "Nerven" },
  { word: "Sklave", phrase: "ein Sklave", file: "Sklave" },
  { word: "Larve", phrase: "eine kleine Larve", file: "Larve" },
  { word: "Olive", phrase: "eine grüne Olive", file: "Olive" },
  { word: "aktiv", phrase: "sehr aktiv", file: "aktiv" },
  { word: "passiv", phrase: "ganz passiv", file: "passiv" },
  { word: "privat", phrase: "streng privat", file: "privat" },
  { word: "positiv", phrase: "sehr positiv", file: "positiv" },
  { word: "negativ", phrase: "leider negativ", file: "negativ" },
  { word: "Niveau", phrase: "hohes Niveau", file: "Niveau" },
  { word: "naiv", phrase: "zu naiv", file: "naiv" },
  { word: "Ventil", phrase: "ein kleines Ventil", file: "Ventil2" },
  { word: "nervös", phrase: "sehr nervös", file: "nervoes" }
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
