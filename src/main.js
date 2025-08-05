import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import { createPinia } from 'pinia';
import App from './App.vue';
import Home from './views/Home.vue';
import Chat from './views/Chat.vue';
import About from './views/About.vue';
import Login from './views/Login.vue';
import Profile from './views/Profile.vue';
import Subscription from './views/Subscription.vue';

// Skapa globala CSS-variabler för färger och stilar
const createGlobalStyles = () => {
  const style = document.createElement('style');
  style.textContent = `
    :root {
      --primary-color: #4285f4;
      --primary-color-rgb: 66, 133, 244;
      --secondary-color: #5f6368;
      --text-color: #202124;
      --background-color: #f8f9fa;
      --error-color: #d32f2f;
      --success-color: #0f9d58;
      --warning-color: #f4b400;
      --border-radius: 8px;
      --box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      --transition-speed: 0.3s;
    }
    
    body {
      font-family: 'Roboto', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
      margin: 0;
      padding: 0;
      background-color: var(--background-color);
      color: var(--text-color);
      line-height: 1.6;
    }
    
    * {
      box-sizing: border-box;
    }
  `;
  document.head.appendChild(style);
};

// Skapa router
const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/chat',
      name: 'Chat',
      component: Chat
    },
    {
      path: '/about',
      name: 'About',
      component: About
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/profile',
      name: 'Profile',
      component: Profile
    },
    {
      path: '/subscription',
      name: 'Subscription',
      component: Subscription
    }
  ]
});

// Navigationsguard för att kontrollera autentisering
import { isUserAuthenticated } from './services/authService';

router.beforeEach((to, from, next) => {
  // Sidor som kräver autentisering
  const requiresAuth = ['Profile', 'Subscription'].includes(to.name);
  
  // Om sidan kräver autentisering och användaren inte är inloggad
  if (requiresAuth && !isUserAuthenticated()) {
    // Omdirigera till inloggningssidan med redirect-parameter
    next({ name: 'Login', query: { redirect: to.fullPath } });
  } else {
    // Fortsätt till önskad sida
    next();
  }
});

// Skapa Pinia store
const pinia = createPinia();

// Lägg till globala stilar
createGlobalStyles();

// Registrera service worker för PWA-funktionalitet
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('Service Worker registrerad:', registration);
      })
      .catch(error => {
        console.error('Service Worker registrering misslyckades:', error);
      });
  });
}

// Skapa och montera appen
const app = createApp(App);

// Lägg till globala egenskaper
app.config.globalProperties.$isUserAuthenticated = isUserAuthenticated;

app.use(router);
app.use(pinia);
app.mount('#app');
