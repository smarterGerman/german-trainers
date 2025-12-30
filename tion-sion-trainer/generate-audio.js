const textToSpeech = require('@google-cloud/text-to-speech');
const fs = require('fs');
const path = require('path');

const client = new textToSpeech.TextToSpeechClient();

const words = [
  // -tion words (40)
  { word: "Nation", phrase: "eine große Nation", file: "Nation" },
  { word: "Situation", phrase: "die aktuelle Situation", file: "Situation" },
  { word: "Information", phrase: "wichtige Information", file: "Information" },
  { word: "Funktion", phrase: "eine wichtige Funktion", file: "Funktion" },
  { word: "Reaktion", phrase: "eine schnelle Reaktion", file: "Reaktion" },
  { word: "Produktion", phrase: "die moderne Produktion", file: "Produktion" },
  { word: "Tradition", phrase: "eine alte Tradition", file: "Tradition" },
  { word: "Position", phrase: "eine gute Position", file: "Position" },
  { word: "Kommunikation", phrase: "direkte Kommunikation", file: "Kommunikation" },
  { word: "Motivation", phrase: "hohe Motivation", file: "Motivation" },
  { word: "Konzentration", phrase: "volle Konzentration", file: "Konzentration" },
  { word: "Organisation", phrase: "eine große Organisation", file: "Organisation" },
  { word: "Demonstration", phrase: "eine friedliche Demonstration", file: "Demonstration" },
  { word: "Konstruktion", phrase: "solide Konstruktion", file: "Konstruktion" },
  { word: "Redaktion", phrase: "die neue Redaktion", file: "Redaktion" },
  { word: "Aktion", phrase: "eine tolle Aktion", file: "Aktion" },
  { word: "Attraktion", phrase: "die größte Attraktion", file: "Attraktion" },
  { word: "Direktion", phrase: "die neue Direktion", file: "Direktion" },
  { word: "Infektion", phrase: "eine schwere Infektion", file: "Infektion" },
  { word: "Inspektion", phrase: "eine gründliche Inspektion", file: "Inspektion" },
  { word: "Kollektion", phrase: "die neue Kollektion", file: "Kollektion" },
  { word: "Korrektion", phrase: "eine kleine Korrektion", file: "Korrektion" },
  { word: "Lektion", phrase: "eine wichtige Lektion", file: "Lektion" },
  { word: "Perfektion", phrase: "absolute Perfektion", file: "Perfektion" },
  { word: "Sektion", phrase: "die medizinische Sektion", file: "Sektion" },
  { word: "Selektion", phrase: "eine strenge Selektion", file: "Selektion" },
  { word: "Rezeption", phrase: "an der Rezeption", file: "Rezeption" },
  { word: "Konsumtion", phrase: "die hohe Konsumtion", file: "Konsumtion" },
  { word: "Evolution", phrase: "die menschliche Evolution", file: "Evolution" },
  { word: "Revolution", phrase: "eine industrielle Revolution", file: "Revolution" },
  { word: "Sensation", phrase: "eine echte Sensation", file: "Sensation" },
  { word: "Frustration", phrase: "große Frustration", file: "Frustration" },
  { word: "Illustration", phrase: "eine schöne Illustration", file: "Illustration" },
  { word: "Meditation", phrase: "tiefe Meditation", file: "Meditation" },
  { word: "Publikation", phrase: "eine wichtige Publikation", file: "Publikation" },
  { word: "Qualifikation", phrase: "die nötige Qualifikation", file: "Qualifikation" },
  { word: "Zivilisation", phrase: "die moderne Zivilisation", file: "Zivilisation" },
  { word: "Imagination", phrase: "lebhafte Imagination", file: "Imagination" },
  { word: "Integration", phrase: "erfolgreiche Integration", file: "Integration" },
  { word: "Kooperation", phrase: "enge Kooperation", file: "Kooperation" },
  // -sion words (40)
  { word: "Vision", phrase: "eine klare Vision", file: "Vision" },
  { word: "Version", phrase: "die neue Version", file: "Version" },
  { word: "Explosion", phrase: "eine laute Explosion", file: "Explosion" },
  { word: "Dimension", phrase: "eine neue Dimension", file: "Dimension" },
  { word: "Pension", phrase: "eine kleine Pension", file: "Pension" },
  { word: "Diskussion", phrase: "eine lange Diskussion", file: "Diskussion" },
  { word: "Emission", phrase: "hohe Emission", file: "Emission" },
  { word: "Mission", phrase: "eine geheime Mission", file: "Mission" },
  { word: "Kommission", phrase: "die europäische Kommission", file: "Kommission" },
  { word: "Passion", phrase: "mit großer Passion", file: "Passion" },
  { word: "Session", phrase: "eine lange Session", file: "Session" },
  { word: "Aggression", phrase: "ohne Aggression", file: "Aggression" },
  { word: "Depression", phrase: "schwere Depression", file: "Depression" },
  { word: "Expression", phrase: "freie Expression", file: "Expression" },
  { word: "Impression", phrase: "ein starker Impression", file: "Impression" },
  { word: "Kompression", phrase: "hohe Kompression", file: "Kompression" },
  { word: "Progression", phrase: "langsame Progression", file: "Progression" },
  { word: "Regression", phrase: "eine leichte Regression", file: "Regression" },
  { word: "Rezession", phrase: "die wirtschaftliche Rezession", file: "Rezession" },
  { word: "Expansion", phrase: "schnelle Expansion", file: "Expansion" },
  { word: "Fusion", phrase: "eine große Fusion", file: "Fusion" },
  { word: "Illusion", phrase: "eine optische Illusion", file: "Illusion" },
  { word: "Infusion", phrase: "eine Infusion bekommen", file: "Infusion" },
  { word: "Konfusion", phrase: "totale Konfusion", file: "Konfusion" },
  { word: "Transfusion", phrase: "eine Bluttransfusion", file: "Transfusion" },
  { word: "Erosion", phrase: "starke Erosion", file: "Erosion" },
  { word: "Korrosion", phrase: "Schutz vor Korrosion", file: "Korrosion" },
  { word: "Konversion", phrase: "eine schnelle Konversion", file: "Konversion" },
  { word: "Provision", phrase: "eine hohe Provision", file: "Provision" },
  { word: "Revision", phrase: "eine gründliche Revision", file: "Revision" },
  { word: "Exkursion", phrase: "eine interessante Exkursion", file: "Exkursion" },
  { word: "Invasion", phrase: "eine militärische Invasion", file: "Invasion" },
  { word: "Occasion", phrase: "eine besondere Occasion", file: "Occasion" },
  { word: "Evasion", phrase: "Steuer-Evasion", file: "Evasion" },
  { word: "Implosion", phrase: "eine kontrollierte Implosion", file: "Implosion" },
  { word: "Transmission", phrase: "automatische Transmission", file: "Transmission" },
  { word: "Emulsion", phrase: "eine stabile Emulsion", file: "Emulsion" },
  { word: "Immersion", phrase: "totale Immersion", file: "Immersion" },
  { word: "Submersion", phrase: "langsame Submersion", file: "Submersion" },
  { word: "Dispersion", phrase: "gleichmäßige Dispersion", file: "Dispersion" }
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
