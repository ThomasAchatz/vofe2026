# Zelt Weckmann – Helfer-App

Statische Web-App, kein Backend, kein Build-Schritt.  Läuft direkt aus 
diesem Repo über GitHub Pages (oder jeden anderen Static Host).

## Dateien in diesem Repo

```
index.html          Grundgerüst (Login + App)
css/style.css        Design (Farben, Layout)
js/data.js            <-- HIER passt du täglich Inhalte an
js/app.js            App-Logik (i.d.R. nicht anfassen)
manifest.json        Für "Zum Home-Bildschirm hinzufügen"
sw.js                Offline-Caching fürs Homescreen-Icon
assets/speisekarte.pdf   Platzhalter – durch echte PDF ersetzen
assets/spickzettel.pdf   Platzhalter – durch echte PDF ersetzen
icons/icon-192.png, icon-512.png   App-Icon
```

## Was du regelmäßig bearbeitest

Alles Tages-Aktuelle steht in **`js/data.js`**, z. B.:

- `TAGESGERICHT` – ein Eintrag pro Datum
- `SONDERAKTION_DETAILS` – Zusatztext zum Tages-Highlight (z. B. Kindertag, Menzl-Abend)
- `WICHTIGE_INFOS` – Liste, die auf "Heute" und im Infos-Tab erscheint
- `TEAMS` – Zuordnung Team ↔ Rotationsnummer **(bitte einmal prüfen, siehe Kommentar in der Datei)**

Einfach die Datei bearbeiten, committen, pushen – fertig.

## 1) Auf GitHub hochladen

Falls noch nicht geschehen:

```bash
cd vofe2026
git init
git add .
git commit -m "Erste Version Helfer-App"
git branch -M main
git remote add origin https://github.com/<dein-user>/vofe2026.git
git push -u origin main
```

Wenn du schon ein leeres Repo `vofe2026` auf GitHub hast: einfach alle
Dateien aus diesem Ordner dort hineinkopieren (per Drag&Drop im Browser
geht auch, oder `git add . && git commit -m "update" && git push`).

## 2) Live schalten mit GitHub Pages (kostenlos, kein Server nötig)

1. Im GitHub-Repo: **Settings → Pages**
2. Bei "Source" **main-Branch** und Ordner **/(root)** auswählen → Save
3. Nach ca. 1 Minute ist die App erreichbar unter:
   `https://<dein-user>.github.io/vofe2026/`

Diese URL kannst du direkt am Handy aufrufen.

## 3) Auf dem Handy testen

**Option A – schnell, nur im Browser:**
1. Öffne die GitHub-Pages-URL in Safari (iPhone) oder Chrome (Android)
2. Login mit z. B. `ROT2` oder `BOX1` testen
3. Im Tab "Heute" siehst du unten ein gelbes Test-Feld "🧪 Zum Testen:
   Festtag simulieren" – darüber kannst du jeden Festtag (7.–17.8.)
   durchklicken, auch bevor das Fest live ist

**Option B – wie eine echte App (empfohlen):**
- iPhone (Safari): Seite öffnen → Teilen-Symbol → "Zum Home-Bildschirm"
- Android (Chrome): Seite öffnen → Menü (⋮) → "Zum Startbildschirm hinzufügen" /
  "App installieren"
- Danach erscheint ein Icon auf dem Homescreen, die App startet ohne
  Browser-Leiste (wie eine native App) und funktioniert auch offline
  (bis auf Wetter und PDFs).

**Option C – lokal auf dem Computer testen, bevor du pushst:**
```bash
cd vofe2026
python3 -m http.server 8080
```
Dann `http://localhost:8080` im Browser öffnen. Für den Test am Handy im
selben WLAN: die lokale IP deines Rechners rausfinden (z. B.
`192.168.…`) und am Handy `http://<diese-ip>:8080` aufrufen.

## Login-Codes zum Testen

- Rotationsteams: `rot1` – `rot8`
- Boxen: `box1` – `box5`

Groß-/Kleinschreibung ist egal.

## Offene Punkte, bevor's live geht

- [ ] Team-↔-Rotationsnummer-Zuordnung in `data.js` bestätigen
- [ ] Echte Speisekarte/Spickzettel-PDFs in `assets/` hochladen
- [ ] Tagesgerichte in `TAGESGERICHT` eintragen
- [ ] Kontakte (Erste Hilfe, Zeltmeister, Fundbüro, WC-Lage) in
      `WICHTIGE_INFOS` ergänzen
- [ ] Sonderaktion-Details (Kindertag, Menzl-Abend etc.) in
      `SONDERAKTION_DETAILS` ergänzen, sobald du sie hast
