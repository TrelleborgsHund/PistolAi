<template>
  <div class="home">
    <div class="hero">
      <h1>Välkommen till Pistolskytte Info</h1>
      <p>Din AI-assistent för information om pistolskytte</p>
      <router-link to="/chat" class="cta-button">Starta AI-chatten</router-link>
    </div>
    
    <div class="features">
      <div class="feature-card">
        <div class="feature-icon">📚</div>
        <h3>Pålitlig information</h3>
        <p>All information hämtas direkt från Vapenförordning (1996:70), Vapenlag (1996:67) och SÄKB.</p>
      </div>
      
      <div class="feature-card">
        <div class="feature-icon">💬</div>
        <h3>AI-driven chatt</h3>
        <p>Ställ frågor i fritext och få precisa svar med källhänvisningar.</p>
      </div>
      
      <div class="feature-card">
        <div class="feature-icon">📱</div>
        <h3>Mobilanpassad</h3>
        <p>Använd appen på din mobil, surfplatta eller dator - online eller offline.</p>
      </div>
    </div>
    
    <div class="info-section">
      <h2>Om informationskällorna</h2>
      <p>Denna app använder enbart följande officiella källor:</p>
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
    </div>
  </div>
</template>

<script>
export default {
  name: 'Home'
}
</script>

<style scoped>
.home {
  max-width: 1200px;
  margin: 0 auto;
}

.hero {
  text-align: center;
  padding: 2rem 1rem;
  margin-bottom: 2rem;
  background-color: var(--primary-color);
  color: white;
  border-radius: 8px;
}

.hero h1 {
  font-size: 2rem;
  margin-bottom: 1rem;
}

.hero p {
  font-size: 1.2rem;
  margin-bottom: 2rem;
}

.cta-button {
  display: inline-block;
  background-color: var(--accent-color);
  color: white;
  padding: 0.8rem 1.5rem;
  border-radius: 4px;
  text-decoration: none;
  font-weight: bold;
  transition: background-color 0.3s;
}

.cta-button:hover {
  background-color: #e67e22;
}

.features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
}

.feature-card {
  background-color: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.feature-icon {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.feature-card h3 {
  margin-bottom: 0.5rem;
  color: var(--primary-color);
}

.info-section {
  background-color: white;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.info-section h2 {
  color: var(--primary-color);
  margin-bottom: 1rem;
}

.info-section ul {
  list-style-type: none;
  padding-left: 0;
}

.info-section li {
  margin-bottom: 0.5rem;
}

.info-section a {
  color: var(--primary-color);
  text-decoration: none;
  display: inline-block;
  padding: 0.5rem 0;
}

.info-section a:hover {
  text-decoration: underline;
}

@media (max-width: 768px) {
  .hero h1 {
    font-size: 1.5rem;
  }
  
  .hero p {
    font-size: 1rem;
  }
  
  .features {
    grid-template-columns: 1fr;
  }
}
</style>
