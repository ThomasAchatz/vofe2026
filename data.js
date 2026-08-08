/* =======================================================================
   DATEN – Zelt Weckmann Helfer-App
   -----------------------------------------------------------------------
   Diese Datei ist die einzige Stelle, die du während des Fests bearbeiten
   musst. Änderungen wirken sofort nach dem nächsten "git push" + Deploy.
   Struktur ist bewusst einfach gehalten (kein Backend nötig).
   ======================================================================= */

// -------------------------------------------------------------------
// 1) LOGIN-CODES
// -------------------------------------------------------------------
// rot1–rot8  = Rotationsteams (folgen jeden Tag ihrer festen Position)
// box1–box5  = eigene Zugänge ohne Rotation (fixer Bereich, siehe unten)
//
// WICHTIG: Die Zuordnung "welches Team = welche Rotationsnummer" war aus
// der Excel-Datei nicht ersichtlich. Ich habe sie in der Reihenfolge
// vergeben, wie die Teams in der Tabelle stehen (Krähe=1, Wiesinger=2, …).
// Bitte prüfen/anpassen, bevor ihr live geht!
const TEAMS = {
  rot1: { name: "Team Krähe",     teamKey: "kraehe" },
  rot2: { name: "Team Wiesinger", teamKey: "wiesinger" },
  rot3: { name: "Team Schräpler", teamKey: "schraepler" },
  rot4: { name: "Team Fuchs",     teamKey: "fuchs" },
  rot5: { name: "Team Chaos",     teamKey: "chaos" },
  rot6: { name: "Team Berger",    teamKey: "berger" },
  rot7: { name: "Team Köck",      teamKey: "koeck" },
  rot8: { name: "Team Rauscher",  teamKey: "rauscher" },
};

// Boxen: eigener Zugang, aber keine Rotation. "bereich" ist ein fixer
// Text, den ihr frei setzen könnt (z. B. Standortbeschreibung).
const BOXEN = {
  box1: { name: "Box 1", bereich: "Bereich wird noch ergänzt" },
  box2: { name: "Box 2", bereich: "Bereich wird noch ergänzt" },
  box3: { name: "Box 3", bereich: "Bereich wird noch ergänzt" },
  box4: { name: "Box 4", bereich: "Bereich wird noch ergänzt" },
  box5: { name: "Box 5", bereich: "Bereich wird noch ergänzt" },
};

// -------------------------------------------------------------------
// 2) FESTTAGE 2026 (07.–17.08.2026, laut Gäubodenvolksfest-Kalender)
// -------------------------------------------------------------------
// shifts: Schichtzeiten, die an diesem Tag gelten (für alle Teams gleich)
// sonderaktion: Abendband/Programm-Highlight (offiziell von weckmann-zelt.de/abendevents/)
const DAYS = [
  { date: "2026-08-07", weekday: "Freitag",   shifts: [{ label: "Ganztags", time: "13:00" }], sonderaktion: "Die Gipfelstürmer" },
  { date: "2026-08-08", weekday: "Samstag",   shifts: [{ label: "Ganztags", time: "09:00" }], sonderaktion: "Gewekiner Buam+Madl" },
  { date: "2026-08-09", weekday: "Sonntag",   shifts: [{ label: "Früh", time: "09:00" }, { label: "Spät", time: "10:30" }], sonderaktion: "Pröllergeisda" },
  { date: "2026-08-10", weekday: "Montag",    shifts: [{ label: "Früh", time: "09:00" }, { label: "Spät", time: "10:30" }], sonderaktion: "Menzl XXL - die Wiesn-Besetzung" },
  { date: "2026-08-11", weekday: "Dienstag",  shifts: [{ label: "Früh", time: "09:00" }, { label: "Spät", time: "15:00" }], sonderaktion: "Kapelle Josef Menzl" },
  { date: "2026-08-12", weekday: "Mittwoch",  shifts: [{ label: "Früh", time: "09:00" }, { label: "Spät", time: "15:00" }], sonderaktion: "Kasplattnrocker" },
  { date: "2026-08-13", weekday: "Donnerstag",shifts: [{ label: "Früh", time: "09:00" }, { label: "Spät", time: "15:00" }], sonderaktion: "Froschhaxn Express" },
  { date: "2026-08-14", weekday: "Freitag",   shifts: [{ label: "Früh", time: "09:00" }, { label: "Spät", time: "15:00" }], sonderaktion: "Gewekiner Buam+Madl" },
  { date: "2026-08-15", weekday: "Samstag",   shifts: [{ label: "Ganztags", time: "09:00" }], sonderaktion: "Die Gipfelstürmer" },
  { date: "2026-08-16", weekday: "Sonntag",   shifts: [{ label: "Ganztags", time: "08:00" }], sonderaktion: "Kapelle Josef Menzl" },
  { date: "2026-08-17", weekday: "Montag",    shifts: [{ label: "Früh", time: "09:00" }, { label: "Spät", time: "16:00" }], sonderaktion: "Waidler Power" },
];

// -------------------------------------------------------------------
// 3) EINTEILUNG PRO TEAM UND TAG (1:1 aus eurer Excel übernommen)
// -------------------------------------------------------------------
// Jedes Array hat 11 Einträge - einen pro Tag in derselben Reihenfolge
// wie DAYS oben. dutyNote ist eine feste Zusatzaufgabe fürs ganze Fest.
const SCHEDULE = {
  kraehe: {
    dutyNote: null,
    positions: ["9/10", "17/18", "25/26", "3-4", "11/12", "19/20", "27/28", "5/6", "13/14", "21/22", "29/30"],
  },
  wiesinger: {
    dutyNote: "Garten 4 · Bühne 2",
    positions: ["11/12 – 13/14", "19/20 – 21/22", "27/28 – 29/30", "5/6 – 7/8", "13/14 – 15/16", "21/22 – 23/24", "29/30 – 1-2", "7/8 – 9/10", "15/16 – 17/18", "23/24 – 25/26", "1&2 / 3&4"],
  },
  schraepler: {
    dutyNote: "Garten 3 · Bühne 2",
    positions: ["15/16 – 17/18", "23/24 – 25/26", "1-2 – 3-4", "9/10 – 11/12", "17/18 – 19/20", "25/26 – 27/28", "3-4 – 5/6", "11/12 – 13/14", "19/20 – 21/22", "27/28 – 29/30", "5/6 – 7/8"],
  },
  fuchs: {
    dutyNote: "Garten 4 · Bühne 1",
    positions: ["19/20 – 21/22", "27/28 – 29/30", "5/6 – 7/8", "13/14 – 15/16", "21/22 – 23/24", "29/30 – 1-2", "7/8 – 9/10", "15/16 – 17/18", "23/24 – 25/26", "1&2 / 3&4", "9/10 – 11/12"],
  },
  chaos: {
    dutyNote: "Garten 3 · Bühne 2",
    positions: ["23/24 – 25/26", "1-2 – 3-4", "9/10 – 11/12", "17/18 – 19/20", "25/26 – 27/28", "3-4 – 5/6", "11/12 – 13/14", "19/20 – 21/22", "27/28 – 29/30", "5/6 – 7/8", "13/14 – 15/16"],
  },
  berger: {
    dutyNote: "Garten 4 · Bühne 2",
    positions: ["27/28 – 29/30", "5/6 – 7/8", "13/14 – 15/16", "21/22 – 23/24", "29/30 – 1-2", "7/8 – 9/10", "15/16 – 17/18", "23/24 – 25/26", "1-2 – 3-4", "9/10 – 11/12", "17/18 – 19/20"],
  },
  koeck: {
    dutyNote: "Garten 3 · Bühne 2",
    positions: ["1-2 – 3-4", "9/10 – 11/12", "17/18 – 19/20", "25/26 – 27/28", "3-4 – 5/6", "11/12 – 13/14", "19/20 – 21/22", "27/28 – 29/30", "5/6 – 7/8", "13/14 – 15/16", "21/22 – 23/24"],
  },
  rauscher: {
    dutyNote: "Garten 4 · Bühne 1",
    positions: ["5/6 – 7/8", "13/14 – 15/16", "21/22 – 23/24", "29/30 – 1-2", "7/8 – 9/10", "15/16 – 17/18", "23/24 – 25/26", "1-2 – 3-4", "9/10 – 11/12", "17/18 – 19/20", "25/26 – 27/28"],
  },
};

// -------------------------------------------------------------------
// 4) TAGESGERICHT PRO TAG
// -------------------------------------------------------------------
// Auf der Website waren die Gerichte nur als Bild-PDF verfügbar, daher
// hier erstmal Platzhalter – bitte mit den echten Gerichten befüllen.
// Aus dem offiziellen Speisekarten-Flyer übernommen. An Tagen ohne
// Eintrag im Flyer gibt es explizit kein Tagesgericht (nicht "wird ergänzt").
const KEIN_TAGESGERICHT = "Heute gibt es kein Tagesgericht.";
const TAGESGERICHT = {
  "2026-08-07": KEIN_TAGESGERICHT,
  "2026-08-08": "Schweinesteak mit Schmorzwiebeln & Kartoffelsalat",
  "2026-08-09": KEIN_TAGESGERICHT,
  "2026-08-10": "Biergulasch mit Semmelknödel & Salat",
  "2026-08-11": "Gemischter Braten von Kalb & Schwein mit Semmelknödel",
  "2026-08-12": "Rinderschmorbraten in Pfefferrahmsoß mit Spätzle",
  "2026-08-13": "Entengröstl mit Zwiebeln & angröst'n Knödeln",
  "2026-08-14": "Sauerbraten mit Semmelknödel",
  "2026-08-15": KEIN_TAGESGERICHT,
  "2026-08-16": KEIN_TAGESGERICHT,
  "2026-08-17": KEIN_TAGESGERICHT,
};

// -------------------------------------------------------------------
// 5) WICHTIGE INFOS (immer sichtbar, unabhängig vom Tag)
// -------------------------------------------------------------------
// icon: "alert" | "medkit" | "user" | "wc" | "info"
const WICHTIGE_INFOS = [
  { icon: "alert", title: "Schichtwechsel", text: "Bitte 5 Minuten vor Schichtende am Treffpunkt einfinden." },
  { icon: "medkit", title: "Erste Hilfe", text: "Sanitätszelt am Haupteingang – Kontakt: wird noch ergänzt" },
  { icon: "user", title: "Zeltmeister", text: "Ansprechpartner für Fragen & Notfälle – Kontakt: wird noch ergänzt" },
  { icon: "wc", title: "WC & Pausenraum", text: "Lage: wird noch ergänzt" },
  { icon: "info", title: "Fundbüro", text: "wird noch ergänzt" },
  { icon: "info", title: "Jugendschutz", text: "Ausweiskontrolle beim Alkoholausschank beachten." },
];

// -------------------------------------------------------------------
// 6) SONDERAKTIONEN – zusätzliche Details zum Tages-Highlight
// -------------------------------------------------------------------
// Key = Datum, Value = zusätzlicher Text (optional, z. B. Kindertag-Infos).
// Wird ergänzt, sobald ihr die Details habt (2. Runde laut Absprache).
const SONDERAKTION_DETAILS = {
  // "2026-08-10": "Menzl XXL Abend – Einlass ab 19 Uhr, große Bühne",
};

// -------------------------------------------------------------------
// 6b) TAGESAKTIONEN ("Wos Außerg'wöhnlichs") – aus dem Speisekarten-Flyer
// -------------------------------------------------------------------
// Besondere Angebote an einzelnen Tagen, unabhängig vom Tagesgericht.
// Ein Datum kann auch mehrere Aktionen haben (z. B. 17.08.).
const TAGESAKTIONEN = {
  "2026-08-09": [
    { titel: "Burschen-Dog", zeit: "11–23 Uhr", text: "10l-Fassl Festbier + Brotzeitbrettl für den ganzen Tisch + 8 Armbändel + 8 Schnäpse ‚Hau mi Weck Mann' + Gutschein Foto-Automat", preis: "180 € (statt 282 € einzeln)" },
  ],
  "2026-08-11": [
    { titel: "Kindertag – Knüller für die Kloana", zeit: "bis 19 Uhr", text: "Nudeln mit Tomatensoß & 0,5 l Orangenlimo", preis: "6,00 €" },
  ],
  "2026-08-16": [
    { titel: "Frühschoppen", zeit: "10–15 Uhr", text: "Ein Paar Weißwürstl mit Breze, süßem Senf und 0,5 l Straubinger Weiße Original", preis: "12,50 €" },
  ],
  "2026-08-17": [
    { titel: "Kindertag – Knüller für die Kloana", zeit: "bis 19 Uhr", text: "Nudeln mit Tomatensoß & 0,5 l Orangenlimo", preis: "6,00 €" },
    { titel: "Da Hammer kommt zum Schluss", zeit: "", text: "Eine Maß + 1/2 Hendl vom Grill", preis: "18,90 €" },
  ],
};

// -------------------------------------------------------------------
// 7) DOWNLOADS
// -------------------------------------------------------------------
const DOWNLOADS = {
  speisekarte: "speisekarte.pdf",
  spickzettel: "spickzettel.pdf",
};

// -------------------------------------------------------------------
// 7b) RESERVIERUNGEN (Sitzplan für den Abend)
// -------------------------------------------------------------------
// stand: Anzeigetext oben im Reiter, bitte jeden Abend aktualisieren.
// bilder: Liste der Sitzplan-Fotos/Scans. Bei euch meist 2 Teile (linker &
// rechter Bereich) – einfach die Dateien überschreiben (gleicher Name)
// oder neue Dateinamen eintragen, falls es mal mehr/weniger Teile sind.
const RESERVIERUNGEN = {
  stand: "Freitag, 07.08.2026 – Abend",
  bilder: ["reservierung-1.jpg", "reservierung-2.jpg"],
};

// -------------------------------------------------------------------
// 8) WETTER (Open-Meteo, kostenlos & ohne API-Key) – Straubing
// -------------------------------------------------------------------
const WETTER_CONFIG = {
  latitude: 48.8809,
  longitude: 12.5731,
};

// -------------------------------------------------------------------
// 9) STORNOS
// -------------------------------------------------------------------
// Rein statische Liste – du trägst hier abends ein, was storniert wurde,
// committest die Datei, fertig. Kein Login/Formular in der App nötig.
// bedienerNr: 1-60, gericht: freier Text, zeit: optional (z.B. "14:30")
const STORNOS = [
  // { bedienerNr: 24, gericht: "Schweinebraten", zeit: "14:30" },
  // { bedienerNr: 7,  gericht: "Wiener mit Kartoffelsalat", zeit: "18:05" },
];

// -------------------------------------------------------------------
// 10) RESERVIERUNGEN (Sitzplan-Foto/PDF für den Abend)
// -------------------------------------------------------------------
// Einfach jeden Abend ein Foto/Scan des Sitzplans nach diesem Muster
// benennen und ins Repo-Root hochladen:
//
//   reservierungen-JJJJ-MM-TT.jpg
//
// z. B. für Freitag 07.08.2026: reservierungen-2026-08-07.jpg
// Kein Code-Edit nötig – die App sucht die passende Datei für den
// aktuellen Tag automatisch. "extension" unten anpassen, falls du
// lieber .png oder .pdf hochlädst.
const RESERVIERUNGEN_CONFIG = {
  extension: "jpg",
};
