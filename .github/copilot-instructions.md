# Copilot instructions

- This is a static website for Fidele Eifellabender; keep pages in the repository root.
- Write user-facing website content in German.
- Put shared styles in `assets/css/style.css` and shared JavaScript in `assets/js/main.js`.
- Keep event data in `data/termine.json` as valid JSON.

A) BARRIEREFREIHEIT (WCAG 2.2, Level AA als Mindestziel)
- Alle Erfolgskriterien der Stufen A und AA aus WCAG 2.2 erfüllen
  (Prinzipien: wahrnehmbar, bedienbar, verständlich, robust).
- Besonders prüfen: Fokus nicht verdeckt (2.4.11), Drag-Alternativen (2.5.7),
  Zielgröße min. 24x24 CSS-px (2.5.8), konsistente Hilfe/Kontakt (3.2.6),
  keine doppelte Dateneingabe (3.3.7), barrierefreie Anmeldung (3.3.8).
- Semantisches HTML5: eine <h1>, lückenlose Überschriftenhierarchie, Landmarks
  (header, nav, main, footer), „Zum Inhalt springen“-Link.
- Alt-Texte für alle Informationsbilder, leeres alt="" nur für rein dekorative;
  Linkbilder brauchen einen aussagekräftigen Alt-Text.
- Kontrast: Text min. 4,5:1, große Schrift/UI-Elemente min. 3:1; Zoom bis 200 %
  ohne Funktionsverlust; vollständige Tastaturbedienung mit sichtbarem Fokus.
- Formulare: sichtbare Labels, verständliche Fehlermeldungen, Autocomplete-Attribute.
- Keine Accessibility-Overlay-Widgets als Ersatz für sauberen Code.
- Videos: Untertitel/Transkript; Audio: Transkript; Animationen abschaltbar
  (prefers-reduced-motion).

B) PERFORMANCE (Core Web Vitals, 75. Perzentil)
- LCP ≤ 2,5 s, INP ≤ 200 ms, CLS ≤ 0,1.
- Bilder in modernen Formaten (WebP/AVIF), responsive (srcset), mit width/height;
  LCP-Bild nicht lazy-loaden, alle anderen schon.
- Schriften lokal hosten, kein Render-Blocking, minimales JavaScript, keine
  unnötigen Plugins. Langen JS-Tasks vermeiden.
- Nachweis per Lighthouse/PageSpeed und echten Messwerten liefern.

C) SICHERHEIT (OWASP Top 10:2025)
- Software aktuell halten (Core, Theme, Plugins), nicht mehr gepflegte
  Komponenten entfernen (Supply-Chain-/Komponentenrisiko).
- Sichere Konfiguration: HTTPS überall inkl. HSTS, keine http://-Ressourcen
  (kein Mixed Content), Security-Header (CSP, X-Content-Type-Options,
  Referrer-Policy, Permissions-Policy), Verzeichnislisting aus, Admin-Bereich
  absichern (2FA, starke Passwörter, Login-Limit, Rollen mit Minimalrechten).
- Eingaben validieren/escapen (Injection, XSS), Formular-Spam-Schutz ohne
  datenschutzkritische Dienste (z. B. Honeypot statt Google reCAPTCHA).
- Backups, Logging, Update-Routine dokumentieren.

D) USABILITY (Nielsens 10 Heuristiken)
- Klare Navigation, konsistente Muster, Systemstatus-Rückmeldungen, minimalistisches
  Design, Erkennen statt Erinnern, verständliche Fehlermeldungen, leicht
  auffindbare Hilfe/Kontakt. Mobile-first, Hauptziel („Anfrage senden“) in
  max. 2 Klicks erreichbar. Veraltete Inhalte (vergangene Termine) werden
  automatisch archiviert oder ausgeblendet.

E) RECHTLICHES FÜR DEN E.V. (Deutschland)
Hinweis: Du gibst keine Rechtsberatung; liefere Entwürfe und markiere
Prüfbedarf.