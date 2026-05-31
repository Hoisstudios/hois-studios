# Hois Studios Website

Statische Website für **Hois Studios, Inh. Jannik Hois**.  
Technik: HTML, CSS, Vanilla JavaScript. Keine Frameworks, kein Tracking, keine Cookies.

## Dateien

- `index.html` – Startseite
- `style.css` – Designsystem, Layout, responsive Design, Animationen
- `script.js` – Navigation, Scroll-Reveal, aktive Navigation
- `impressum.html` – Impressum-Platzhalter
- `datenschutz.html` – Datenschutz-Platzhalter
- `agb.html` – optionaler AGB-Platzhalter
- `.nojekyll` – verhindert unnötige Jekyll-Verarbeitung auf GitHub Pages

## Vor Veröffentlichung ersetzen

Suche in allen Dateien nach diesen Platzhaltern:

- `EMAIL-EINTRAGEN`
- `E-Mail-Adresse ergänzen`
- `Straße und Hausnummer ergänzen`
- `PLZ und Ort ergänzen`
- `https://deine-domain.de/`
- `Datum der Veröffentlichung ergänzen`

## Lokale Fonts einbinden

Die CSS-Datei ist für lokale Fonts vorbereitet. Lege diese Dateien ab:

```text
assets/fonts/Manrope-Variable.woff2
assets/fonts/Inter-Variable.woff2
```

Die Fonts bitte selbst aus einer erlaubten Quelle beziehen und lokal hochladen. So werden beim Seitenaufruf keine externen Font-Dienste geladen.

## GitHub Pages

1. Neues Repository auf GitHub anlegen, z. B. `hois-studios`.
2. Alle Dateien aus diesem Ordner in das Repository hochladen.
3. In GitHub: `Settings` → `Pages`.
4. Unter `Build and deployment` als Source `Deploy from a branch` wählen.
5. Branch `main` und Ordner `/(root)` auswählen.
6. Speichern.

Die Website ist danach unter der GitHub-Pages-URL erreichbar. Bei eigener Domain später die Canonical- und Open-Graph-URLs in `index.html` anpassen.

## Rechtlicher Hinweis

Impressum, Datenschutz und AGB sind formal vorbereitet, aber nicht rechtlich geprüft. Vor Veröffentlichung sollten die tatsächlichen Angaben ergänzt und bei Unsicherheit rechtlich geprüft werden.
