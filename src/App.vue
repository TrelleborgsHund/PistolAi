<template>
  <div class="app">
    <header class="app-header">
      <div class="header-content">
        <h1>Pistolskytte Info</h1>
        
        <nav class="app-nav">
          <div class="nav-links">
            <router-link to="/" class="nav-link">Hem</router-link>
            <router-link to="/chat" class="nav-link">AI-Chatt</router-link>
            <router-link to="/about" class="nav-link">Om</router-link>
          </div>
          
          <div class="auth-links">
            <template v-if="isAuthenticated">
              <router-link to="/profile" class="auth-link profile-link">
                <span class="user-initial">{{ userInitial }}</span>
                <span class="profile-text">Profil</span>
              </router-link>
            </template>
            <template v-else>
              <router-link to="/login" class="auth-link login-link">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
                  <polyline points="10 17 15 12 10 7"></polyline>
                  <line x1="15" y1="12" x2="3" y2="12"></line>
                </svg>
                <span>Logga in</span>
              </router-link>
            </template>
          </div>
        </nav>
      </div>
    </header>
    
    <main class="app-content">
      <router-view />
    </main>
    
    <footer class="app-footer">
      <div class="footer-content">
        <p>&copy; {{ new Date().getFullYear() }} Pistolskytte Info App</p>
        <div class="footer-links">
          <router-link to="/about">Om appen</router-link>
          <span class="separator">|</span>
          <a href="https://www.riksdagen.se" target="_blank" rel="noopener">Riksdagen</a>
          <span class="separator">|</span>
          <a href="https://www.skyttesport.se" target="_blank" rel="noopener">Skyttesport</a>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
import { computed } from 'vue';
import { getCurrentUser, isUserAuthenticated } from './services/authService';

export default {
  name: 'App',
  setup() {
    const isAuthenticated = computed(() => {
      return isUserAuthenticated();
    });
    
    const userInitial = computed(() => {
      const user = getCurrentUser();
      if (user && user.name) {
        return user.name.charAt(0).toUpperCase();
      }
      return '?';
    });
    
    return {
      isAuthenticated,
      userInitial
    };
  }
}
</script>

<style>
:root {
  --primary-color: #4A90E2;
  --primary-color-rgb: 74, 144, 226;
  --secondary-color: #2C3E50;
  --accent-color: #F39C12;
  --text-color: #333333;
  --background-color: #F5F5F5;
  --white: #FFFFFF;
  --success-color: #0f9d58;
  --error-color: #d32f2f;
  --warning-color: #f4b400;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: var(--background-color);
  color: var(--text-color);
  line-height: 1.6;
}

.app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.app-header {
  background-color: var(--primary-color);
  color: var(--white);
  padding: 0.75rem 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
}

@media (min-width: 768px) {
  .header-content {
    flex-direction: row;
    justify-content: space-between;
  }
}

.app-header h1 {
  font-size: 1.5rem;
  margin: 0;
}

.app-nav {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  margin-top: 0.75rem;
  width: 100%;
}

@media (min-width: 768px) {
  .app-nav {
    margin-top: 0;
    justify-content: flex-end;
  }
}

.nav-links {
  display: flex;
  gap: 0.5rem;
}

.auth-links {
  display: flex;
  margin-left: 1rem;
}

.nav-link, .auth-link {
  color: var(--white);
  text-decoration: none;
  padding: 0.5rem 0.75rem;
  border-radius: 4px;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.95rem;
}

.nav-link:hover,
.nav-link.router-link-active {
  background-color: rgba(255, 255, 255, 0.2);
}

.auth-link {
  background-color: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 0.4rem 0.75rem;
  margin-left: 0.5rem;
}

.auth-link:hover,
.auth-link.router-link-active {
  background-color: rgba(255, 255, 255, 0.25);
  transform: translateY(-1px);
}

.profile-link {
  background-color: rgba(255, 255, 255, 0.2);
}

.user-initial {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  background-color: rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  font-weight: 600;
  font-size: 0.85rem;
}

.app-content {
  flex: 1;
  padding: 1rem;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

.app-footer {
  background-color: var(--secondary-color);
  color: var(--white);
  padding: 1.25rem 1rem;
  margin-top: auto;
  font-size: 0.9rem;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
}

@media (min-width: 768px) {
  .footer-content {
    flex-direction: row;
    justify-content: space-between;
  }
}

.footer-links {
  display: flex;
  gap: 0.75rem;
  align-items: center;
}

.footer-links a {
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  transition: color 0.2s;
}

.footer-links a:hover {
  color: white;
  text-decoration: underline;
}

.separator {
  color: rgba(255, 255, 255, 0.4);
  font-size: 0.8rem;
}

@media (max-width: 480px) {
  .app-header h1 {
    font-size: 1.3rem;
  }
  
  .nav-link, .auth-link {
    padding: 0.4rem 0.6rem;
    font-size: 0.9rem;
  }
  
  .profile-text {
    display: none;
  }
  
  .app-nav {
    justify-content: space-between;
  }
  
  .auth-links {
    margin-left: 0;
  }
  /* Responsiv design för mobil */
  @media (max-width: 768px) {
    .app-nav {
      flex-direction: column;
      gap: 0.5rem;
    }
  }
}</style>
