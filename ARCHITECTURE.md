# Arkitektur för Pistolskytte Info App

## Översikt
Denna applikation är en Progressive Web App (PWA) för mobiltelefoner, fokuserad på att tillhandahålla information om pistolskytte genom en AI-chattfunktion. Appen hämtar information från specifika källor och presenterar svaren i ett strukturerat format.

## Teknologistack

### Frontend
- **HTML5/CSS3/JavaScript** - Grundläggande webbteknologier
- **Vue.js** - Frontend-ramverk för reaktiv UI
- **Vuetify** - Material Design-komponentbibliotek för Vue
- **Workbox** - För PWA-funktionalitet (service workers, caching)

### Backend
- **Node.js** - Serverplattform
- **Express** - Webbramverk för API-endpoints
- **Langchain** - För AI-chattfunktionalitet och dokumenthantering

### AI och Datahantering
- **OpenAI API** - För AI-chattfunktionen
- **PDF.js** - För att extrahera text från PDF-dokument
- **Cheerio** - För att skrapa webbinnehåll från riksdagen.se

### Dataflöde
1. Användaren ställer en fråga via chattgränssnittet
2. Frågan skickas till backend-servern
3. Servern använder Langchain för att:
   - Söka i förbearbetade dokument (vapenlag, vapenförordning, SÄKB)
   - Hämta relevant information
   - Generera ett svar med OpenAI API
4. Svaret returneras till användaren i formatet:
   - Korrekt text från källan
   - AI-genererad sammanfattning
   - Källhänvisning med länk

## Moduler

### Frontend-moduler
- **Chat UI** - Chattgränssnitt för användarinteraktion
- **PWA Configuration** - Manifest, service workers, etc.
- **Response Renderer** - Formaterar och visar svaren från AI

### Backend-moduler
- **API Server** - Hanterar HTTP-förfrågningar
- **Document Processor** - Förbearbetar och indexerar dokumentkällor
- **AI Chat Service** - Integrerar med OpenAI och hanterar chattlogik
- **Source Citation Service** - Hanterar källhänvisningar

## Framtida utbyggnad
Arkitekturen är designad för att enkelt kunna utökas med:
- **Autentiseringssystem** - För framtida inloggningsfunktionalitet
- **Betalningssystem** - För framtida monetisering
- **Användarhantering** - För att spara användarpreferenser och chatthistorik

## Tjänstekatalog
- **OpenAI API** - För AI-chattfunktionalitet
- **Hosting** - Netlify/Vercel för frontend, Heroku/Railway för backend

## Säkerhet
- API-nycklar och känslig information hanteras via miljövariabler
- CORS-konfiguration för att begränsa åtkomst
- Rate limiting för att förhindra överbelastning
