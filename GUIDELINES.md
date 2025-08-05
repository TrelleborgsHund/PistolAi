# Riktlinjer för Pistolskytte Info App

## Kodstandard

### JavaScript/Vue
- Använd ES6+ syntax
- Följ Vue.js officiella stilguide
- Använd Prettier för kodformatering
- Använd ESLint för kodkvalitet
- Använd TypeScript för typkontroll där det är möjligt

### CSS
- Använd BEM-namnkonvention för CSS-klasser
- Använd SCSS för förbättrad CSS-struktur
- Använd responsiv design med mobile-first approach

### Allmänt
- Kommentera kod där logiken inte är självförklarande
- Använd beskrivande variabelnamn
- Håll funktioner små och fokuserade på en uppgift
- Använd asynkrona funktioner för nätverksanrop

## Säkerhetsrutiner

### API-nycklar och känslig information
- Lagra aldrig API-nycklar i koden
- Använd `.env`-filer för lokala miljövariabler
- För produktion, använd miljövariabler i hosting-plattformen

### Secrets Management
- Nycklar och lösenord ska aldrig committas till Git
- Använd `.env` för utvecklingsmiljön
- För lokal utveckling: $env:USERPROFILE\AppData\Local\secrets.json

### Användardata
- Minimera insamling av användardata
- Var tydlig med vilken data som samlas in och varför
- Implementera GDPR-kompatibla rutiner när användardata börjar samlas in

## Testkonventioner

### Enhetstester
- Använd Jest för enhetstester
- Sträva efter hög testtäckning för kritiska komponenter
- Testa edge cases och felhantering

### Integrationstester
- Testa API-endpoints med verktyg som Supertest
- Verifiera dataflödet mellan frontend och backend

### End-to-End tester
- Använd Cypress för E2E-tester av kritiska användarflöden
- Testa på olika skärmstorlekar för att säkerställa responsivitet

## Versionshantering

### Git
- Använd feature branches för ny funktionalitet
- Använd pull requests för kodgranskning
- Följ Semantic Versioning (MAJOR.MINOR.PATCH)
- Använd beskrivande commit-meddelanden

### Branching-strategi
- `main` - Produktionskod
- `develop` - Utvecklingsbranch
- `feature/[namn]` - För nya funktioner
- `fix/[namn]` - För bugfixar

## Deployment

### Staging och Produktion
- Använd staging-miljö för testning före produktion
- Automatisera deployment med CI/CD
- Implementera rollback-strategi

### Prestanda
- Optimera bilder och assets
- Implementera lazy loading
- Använd code splitting
- Minimera JavaScript och CSS

## PWA-specifika riktlinjer

### Offline-funktionalitet
- Cacha viktiga resurser för offline-användning
- Implementera fallback för när nätverksanrop misslyckas

### Installation
- Säkerställ att appen kan installeras på hemskärmen
- Optimera app manifest för bästa användarupplevelse

### Push-notifikationer
- Implementera push-notifikationer för framtida funktioner
- Respektera användarens preferenser för notifikationer
