const textToSpeech = require('@google-cloud/text-to-speech');
const fs = require('fs');
const path = require('path');

const client = new textToSpeech.TextToSpeechClient();

const words = [
  // With glottal stop - vowel at syllable/word beginning (40)
  { word: "beachten", phrase: "bitte beachten", file: "beachten" },
  { word: "beantworten", phrase: "schnell beantworten", file: "beantworten" },
  { word: "beobachten", phrase: "genau beobachten", file: "beobachten" },
  { word: "Verein", phrase: "ein großer Verein", file: "Verein" },
  { word: "verarbeiten", phrase: "gut verarbeiten", file: "verarbeiten" },
  { word: "Geäst", phrase: "das dichte Geäst", file: "Geaest" },
  { word: "Theater", phrase: "ins Theater", file: "Theater" },
  { word: "Chaos", phrase: "totales Chaos", file: "Chaos" },
  { word: "beurteilen", phrase: "richtig beurteilen", file: "beurteilen" },
  { word: "erarbeiten", phrase: "gemeinsam erarbeiten", file: "erarbeiten" },
  { word: "Spiegelei", phrase: "ein leckeres Spiegelei", file: "Spiegelei" },
  { word: "geeignet", phrase: "gut geeignet", file: "geeignet" },
  { word: "beauftragen", phrase: "jemanden beauftragen", file: "beauftragen" },
  { word: "Antialkoholiker", phrase: "ein überzeugter Antialkoholiker", file: "Antialkoholiker" },
  { word: "Aorta", phrase: "die Aorta", file: "Aorta" },
  { word: "beeilen", phrase: "sich beeilen", file: "beeilen" },
  { word: "beenden", phrase: "schnell beenden", file: "beenden" },
  { word: "beeindrucken", phrase: "sehr beeindrucken", file: "beeindrucken" },
  { word: "beeinflussen", phrase: "stark beeinflussen", file: "beeinflussen" },
  { word: "Reaktion", phrase: "eine schnelle Reaktion", file: "Reaktion" },
  { word: "Realität", phrase: "die harte Realität", file: "Realitaet" },
  { word: "ideal", phrase: "ganz ideal", file: "ideal" },
  { word: "kreativ", phrase: "sehr kreativ", file: "kreativ" },
  { word: "geehrt", phrase: "sehr geehrt", file: "geehrt" },
  { word: "geerbt", phrase: "vom Vater geerbt", file: "geerbt" },
  { word: "Seeigel", phrase: "ein stacheliger Seeigel", file: "Seeigel" },
  { word: "Seeanemone", phrase: "eine bunte Seeanemone", file: "Seeanemone" },
  { word: "Beamte", phrase: "ein deutscher Beamte", file: "Beamte" },
  { word: "verursachen", phrase: "Probleme verursachen", file: "verursachen" },
  { word: "Abenteuer", phrase: "ein großes Abenteuer", file: "Abenteuer" },
  { word: "beunruhigen", phrase: "sehr beunruhigen", file: "beunruhigen" },
  { word: "Poesie", phrase: "schöne Poesie", file: "Poesie" },
  { word: "beinhalten", phrase: "alles beinhalten", file: "beinhalten" },
  { word: "Koalition", phrase: "eine neue Koalition", file: "Koalition" },
  { word: "kooperieren", phrase: "gut kooperieren", file: "kooperieren" },
  { word: "Bibliothek", phrase: "in der Bibliothek", file: "Bibliothek" },
  { word: "Atheist", phrase: "ein überzeugter Atheist", file: "Atheist" },
  { word: "Atheismus", phrase: "der moderne Atheismus", file: "Atheismus" },
  { word: "Poet", phrase: "ein großer Poet", file: "Poet" },
  { word: "naiv", phrase: "zu naiv", file: "naiv" },
  // Without glottal stop - smooth transition (40)
  { word: "aber", phrase: "aber natürlich", file: "aber" },
  { word: "ober", phrase: "nach oben", file: "ober" },
  { word: "weil", phrase: "nur weil", file: "weil" },
  { word: "dein", phrase: "das ist dein", file: "dein" },
  { word: "mein", phrase: "das ist mein", file: "mein" },
  { word: "sein", phrase: "das muss sein", file: "sein" },
  { word: "Bauer", phrase: "ein alter Bauer", file: "Bauer" },
  { word: "Mauer", phrase: "eine hohe Mauer", file: "Mauer" },
  { word: "sauer", phrase: "sehr sauer", file: "sauer" },
  { word: "teuer", phrase: "zu teuer", file: "teuer" },
  { word: "Feuer", phrase: "ein großes Feuer", file: "Feuer" },
  { word: "euer", phrase: "das ist euer", file: "euer" },
  { word: "Euro", phrase: "zehn Euro", file: "Euro" },
  { word: "Europa", phrase: "ganz Europa", file: "Europa" },
  { word: "leider", phrase: "ja leider", file: "leider" },
  { word: "weiter", phrase: "immer weiter", file: "weiter" },
  { word: "heiter", phrase: "sehr heiter", file: "heiter" },
  { word: "breiter", phrase: "viel breiter", file: "breiter" },
  { word: "Leitung", phrase: "die neue Leitung", file: "Leitung" },
  { word: "Zeitung", phrase: "die heutige Zeitung", file: "Zeitung" },
  { word: "Heizung", phrase: "die warme Heizung", file: "Heizung" },
  { word: "Meister", phrase: "ein großer Meister", file: "Meister" },
  { word: "Geist", phrase: "ein guter Geist", file: "Geist" },
  { word: "meist", phrase: "am meisten", file: "meist" },
  { word: "feucht", phrase: "sehr feucht", file: "feucht" },
  { word: "Leuchte", phrase: "eine helle Leuchte", file: "Leuchte" },
  { word: "freuen", phrase: "sich freuen", file: "freuen" },
  { word: "neuen", phrase: "die neuen", file: "neuen" },
  { word: "Haut", phrase: "weiche Haut", file: "Haut" },
  { word: "laut", phrase: "sehr laut", file: "laut" },
  { word: "Baum", phrase: "ein großer Baum", file: "Baum" },
  { word: "Raum", phrase: "ein großer Raum", file: "Raum" },
  { word: "Traum", phrase: "ein schöner Traum", file: "Traum" },
  { word: "Haus", phrase: "ein schönes Haus", file: "Haus" },
  { word: "Maus", phrase: "eine kleine Maus", file: "Maus" },
  { word: "raus", phrase: "schnell raus", file: "raus" },
  { word: "Pause", phrase: "eine kurze Pause", file: "Pause" },
  { word: "Laune", phrase: "gute Laune", file: "Laune" },
  { word: "Auge", phrase: "mein Auge", file: "Auge" },
  { word: "Zaun", phrase: "ein hoher Zaun", file: "Zaun" }
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
