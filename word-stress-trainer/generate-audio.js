const textToSpeech = require('@google-cloud/text-to-speech');
const fs = require('fs');
const path = require('path');

const client = new textToSpeech.TextToSpeechClient();

const words = [
  // First syllable stress - native words
  { word: "Arbeit", phrase: "die schwere Arbeit", file: "Arbeit" },
  { word: "Leben", phrase: "das ganze Leben", file: "Leben" },
  { word: "spielen", phrase: "draußen spielen", file: "spielen" },
  { word: "Wasser", phrase: "kaltes Wasser", file: "Wasser" },
  { word: "Zimmer", phrase: "ein großes Zimmer", file: "Zimmer" },
  { word: "Mutter", phrase: "meine Mutter", file: "Mutter" },
  { word: "Vater", phrase: "mein Vater", file: "Vater" },
  { word: "Bruder", phrase: "mein Bruder", file: "Bruder" },
  { word: "Schwester", phrase: "meine Schwester", file: "Schwester" },
  { word: "Schule", phrase: "die Schule", file: "Schule" },
  { word: "Lehrer", phrase: "der Lehrer", file: "Lehrer" },
  { word: "Morgen", phrase: "guten Morgen", file: "Morgen" },
  { word: "Abend", phrase: "guten Abend", file: "Abend" },
  { word: "Essen", phrase: "gutes Essen", file: "Essen" },
  { word: "trinken", phrase: "etwas trinken", file: "trinken" },
  // Separable prefix stress
  { word: "anfangen", phrase: "jetzt anfangen", file: "anfangen" },
  { word: "aufstehen", phrase: "früh aufstehen", file: "aufstehen" },
  { word: "ausgehen", phrase: "heute ausgehen", file: "ausgehen" },
  { word: "einkaufen", phrase: "Lebensmittel einkaufen", file: "einkaufen" },
  { word: "mitnehmen", phrase: "etwas mitnehmen", file: "mitnehmen" },
  { word: "zurückkommen", phrase: "bald zurückkommen", file: "zurueckkommen" },
  { word: "abfahren", phrase: "morgen abfahren", file: "abfahren" },
  { word: "anrufen", phrase: "jemanden anrufen", file: "anrufen" },
  { word: "aufmachen", phrase: "die Tür aufmachen", file: "aufmachen" },
  { word: "zumachen", phrase: "das Fenster zumachen", file: "zumachen" },
  // Inseparable prefix - root stressed
  { word: "bezahlen", phrase: "die Rechnung bezahlen", file: "bezahlen" },
  { word: "verstehen", phrase: "gut verstehen", file: "verstehen" },
  { word: "erklären", phrase: "etwas erklären", file: "erklaeren" },
  { word: "beginnen", phrase: "früh beginnen", file: "beginnen" },
  { word: "vergessen", phrase: "niemals vergessen", file: "vergessen" },
  { word: "bekommen", phrase: "ein Geschenk bekommen", file: "bekommen" },
  { word: "erzählen", phrase: "eine Geschichte erzählen", file: "erzaehlen" },
  { word: "entscheiden", phrase: "schnell entscheiden", file: "entscheiden" },
  { word: "gewinnen", phrase: "das Spiel gewinnen", file: "gewinnen" },
  { word: "verlieren", phrase: "den Schlüssel verlieren", file: "verlieren" },
  { word: "besuchen", phrase: "Freunde besuchen", file: "besuchen" },
  { word: "empfehlen", phrase: "das Restaurant empfehlen", file: "empfehlen" },
  { word: "entstehen", phrase: "Probleme entstehen", file: "entstehen" },
  { word: "zerbrechen", phrase: "das Glas zerbrechen", file: "zerbrechen" },
  { word: "gefallen", phrase: "mir gefallen", file: "gefallen" },
  // Foreign words - various stress patterns
  { word: "Student", phrase: "ein fleißiger Student", file: "Student" },
  { word: "Universität", phrase: "die große Universität", file: "Universitaet" },
  { word: "Restaurant", phrase: "ein gutes Restaurant", file: "Restaurant" },
  { word: "Musik", phrase: "laute Musik", file: "Musik" },
  { word: "Telefon", phrase: "das neue Telefon", file: "Telefon" },
  { word: "Hotel", phrase: "ein schönes Hotel", file: "Hotel" },
  { word: "Kaffee", phrase: "heißer Kaffee", file: "Kaffee" },
  { word: "Computer", phrase: "der alte Computer", file: "Computer" },
  { word: "interessant", phrase: "sehr interessant", file: "interessant" },
  { word: "Information", phrase: "wichtige Information", file: "Information" },
  { word: "Situation", phrase: "eine schwierige Situation", file: "Situation" },
  { word: "Grammatik", phrase: "deutsche Grammatik", file: "Grammatik" },
  { word: "Programm", phrase: "das neue Programm", file: "Programm" },
  { word: "Problem", phrase: "ein großes Problem", file: "Problem" },
  { word: "Thema", phrase: "ein wichtiges Thema", file: "Thema" },
  // -ieren verbs (always stress -IE-)
  { word: "studieren", phrase: "Medizin studieren", file: "studieren" },
  { word: "telefonieren", phrase: "lange telefonieren", file: "telefonieren" },
  { word: "fotografieren", phrase: "Landschaften fotografieren", file: "fotografieren" },
  { word: "reservieren", phrase: "einen Tisch reservieren", file: "reservieren" },
  { word: "probieren", phrase: "etwas Neues probieren", file: "probieren" },
  { word: "funktionieren", phrase: "gut funktionieren", file: "funktionieren" },
  { word: "reparieren", phrase: "das Auto reparieren", file: "reparieren" },
  { word: "organisieren", phrase: "eine Party organisieren", file: "organisieren" },
  // Compound words
  { word: "Arbeitgeber", phrase: "der neue Arbeitgeber", file: "Arbeitgeber" },
  { word: "Kindergarten", phrase: "der Kindergarten", file: "Kindergarten" },
  { word: "Wohnzimmer", phrase: "das große Wohnzimmer", file: "Wohnzimmer" },
  { word: "Schlafzimmer", phrase: "mein Schlafzimmer", file: "Schlafzimmer" },
  { word: "Hausaufgabe", phrase: "die schwere Hausaufgabe", file: "Hausaufgabe" },
  { word: "Geburtstag", phrase: "alles Gute zum Geburtstag", file: "Geburtstag" },
  // Adjectives with native stress
  { word: "wichtig", phrase: "sehr wichtig", file: "wichtig" },
  { word: "richtig", phrase: "ganz richtig", file: "richtig" },
  { word: "fertig", phrase: "schon fertig", file: "fertig" },
  { word: "langsam", phrase: "ganz langsam", file: "langsam" },
  { word: "gemeinsam", phrase: "etwas gemeinsam", file: "gemeinsam" }
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
