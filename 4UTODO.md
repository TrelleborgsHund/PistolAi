# Uppgifter för användaren

## Aktuella uppgifter
- [ ] Verifiera att informationskällorna är korrekt angivna:
  - Vapenförordning (1996:70) och Vapenlag (1996:67) på https://www.riksdagen.se
  - www.skyttesport.se/media/es2ejinw/saekb_2020.pdf
- [ ] Bekräfta att AI-chattens svarformat är enligt önskemål (korrekt text, sammanfattning, källhänvisning)
- [ ] Testa appen på olika mobilenheter för att säkerställa korrekt visning och funktionalitet
- [ ] Överväg framtida funktioner för inloggning och betalning (detaljer kommer att behövas senare)
- [ ] Driftsätt appen och backend med Netlify (se instruktioner nedan)

## Netlify Deployment

### Förberedelser
1. Skapa ett konto på [Netlify](https://www.netlify.com/) om du inte redan har ett
2. Installera Netlify CLI: `npm install -g netlify-cli`
3. Logga in på Netlify från terminalen: `netlify login`

### Driftsättning
1. Bygg appen: `npm run build`
2. Initiera Netlify i projektet: `netlify init`
   - Välj "Create & configure a new site"
   - Välj team
   - Ange ett unikt site-namn (t.ex. "pistolskytte-info")
3. Driftsätt: `netlify deploy --prod`

### API-endpoints
Följande API-endpoints är implementerade som Netlify Functions:

| Endpoint | Beskrivning | Källa |
|----------|-------------|-------|
| `/api/vapenlag` | Hämtar och bearbetar text från Vapenlagen | riksdagen.se |
| `/api/vapenforordning` | Hämtar och bearbetar text från Vapenförordningen | riksdagen.se |
| `/api/sakb` | Hämtar och bearbetar text från SÄKB | skyttesport.se |

### Underhåll och uppdatering
- Netlify Functions uppdateras automatiskt när du pushar ändringar till ditt Git-repository
- För SÄKB-PDF:en rekommenderas manuell uppdatering när en ny version publiceras:
  1. Ladda ner den senaste PDF:en
  2. Extrahera texten med ett PDF-verktyg
  3. Uppdatera innehållet i `netlify/functions/sakb.js`

## Avklarade uppgifter
- [x] Specificera grundläggande krav för PWA-appen
- [x] Implementera Netlify Functions för dataskrapning i produktion
