<template>
  <div class="about-container">
    <h1>Om Pistolskytte Info App</h1>
    
    <div class="about-section">
      <h2>Applikationens syfte</h2>
      <p>
        Pistolskytte Info App är en mobilanpassad PWA (Progressive Web App) som ger användare tillgång till 
        pålitlig information om pistolskytte genom en AI-driven chattfunktion. Appen är designad för att 
        hjälpa skyttar, instruktörer och andra intresserade att snabbt få svar på frågor om regler, 
        lagar och säkerhetsbestämmelser inom pistolskytte.
      </p>
    </div>
    
    <div class="about-section">
      <h2>Informationskällor</h2>
      <p>
        AI-chatten hämtar <strong>enbart</strong> information från följande officiella källor:
      </p>
      <ul>
        <li>
          <a href="https://www.riksdagen.se/sv/dokument-lagar/dokument/svensk-forfattningssamling/vapenlag-199667_sfs-1996-67" target="_blank" rel="noopener noreferrer">
            Vapenlag (1996:67)
          </a>
        </li>
        <li>
          <a href="https://www.riksdagen.se/sv/dokument-lagar/dokument/svensk-forfattningssamling/vapenforordning-199670_sfs-1996-70" target="_blank" rel="noopener noreferrer">
            Vapenförordning (1996:70)
          </a>
        </li>
        <li>
          <a href="https://www.skyttesport.se/media/es2ejinw/saekb_2020.pdf" target="_blank" rel="noopener noreferrer">
            SÄKB (Säkerhetsbestämmelser för civilt skytte)
          </a>
        </li>
      </ul>
      <p class="disclaimer">
        <strong>Observera:</strong> Även om vi strävar efter att tillhandahålla korrekt information, 
        bör du alltid kontrollera med de officiella källorna för den mest aktuella informationen. 
        Applikationen är endast ett verktyg för att underlätta tillgång till information och ersätter 
        inte officiella dokument eller professionell rådgivning.
      </p>
    </div>
    
    <div class="about-section">
      <h2>Hur AI-chatten fungerar</h2>
      <p>
        När du ställer en fråga i chatten:
      </p>
      <ol>
        <li>AI-systemet söker igenom de specificerade källorna efter relevant information</li>
        <li>Den hämtar den exakta texten från källdokumenten</li>
        <li>Den skapar en sammanfattning för att göra informationen mer lättförståelig</li>
        <li>Den inkluderar alltid en källhänvisning så att du kan verifiera informationen</li>
      </ol>
    </div>
    
    <div class="about-section">
      <h2>PWA-funktionalitet</h2>
      <p>
        Denna app är en Progressive Web App (PWA), vilket innebär att du kan:
      </p>
      <ul>
        <li>Installera appen på din hemskärm på mobilen eller datorn</li>
        <li>Använda appen även när du har begränsad eller ingen internetanslutning</li>
        <li>Få en appliknande upplevelse med snabb laddning och responsiv design</li>
      </ul>
    </div>
    
    <div class="about-section">
      <h2>Kontakt</h2>
      <p>
        För frågor, feedback eller support, vänligen kontakta oss på:
      </p>
      <p class="contact-info">
        <strong>E-post:</strong> info@pistolskytteapp.se
      </p>
    </div>
    
    <div class="about-section version-info">
      <p>Version: 0.1.0</p>
      <p>&copy; {{ new Date().getFullYear() }} Pistolskytte Info App</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'About'
}
</script>

<style scoped>
.about-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 1rem;
}

h1 {
  color: var(--primary-color);
  margin-bottom: 2rem;
  text-align: center;
}

.about-section {
  background-color: white;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

h2 {
  color: var(--primary-color);
  margin-bottom: 1rem;
  border-bottom: 2px solid var(--primary-color);
  padding-bottom: 0.5rem;
}

p {
  margin-bottom: 1rem;
  line-height: 1.6;
}

ul, ol {
  margin-bottom: 1rem;
  padding-left: 1.5rem;
}

li {
  margin-bottom: 0.5rem;
}

a {
  color: var(--primary-color);
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}

.disclaimer {
  background-color: #fff3cd;
  border-left: 4px solid #ffc107;
  padding: 1rem;
  margin: 1rem 0;
}

.contact-info {
  background-color: #e8f4f8;
  padding: 1rem;
  border-radius: 4px;
}

.version-info {
  text-align: center;
  font-size: 0.9rem;
  color: #666;
}

@media (max-width: 768px) {
  .about-container {
    padding: 0.5rem;
  }
  
  .about-section {
    padding: 1rem;
  }
}
</style>
