/**
 * Authentication Service
 * 
 * Denna tjänst hanterar användarautentisering och behörigheter.
 * För närvarande är detta en stub som förbereder för framtida implementering.
 */

// Simulerad användardata för utveckling
const MOCK_USERS = [
  {
    id: '1',
    email: 'test@example.com',
    password: 'password123', // I en verklig implementation skulle lösenord aldrig lagras i klartext
    name: 'Test Användare',
    role: 'user',
    subscription: null
  },
  {
    id: '2',
    email: 'premium@example.com',
    password: 'premium123',
    name: 'Premium Användare',
    role: 'user',
    subscription: {
      type: 'premium',
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 dagar från nu
    }
  }
];

// Lagra autentiseringsstatus och användardata
let currentUser = null;
let isAuthenticated = false;

/**
 * Loggar in en användare
 * 
 * @param {string} email - Användarens e-postadress
 * @param {string} password - Användarens lösenord
 * @returns {Promise<Object>} - Löfte som resolvas med användardata vid framgångsrik inloggning
 */
export async function login(email, password) {
  // Simulera API-anrop
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const user = MOCK_USERS.find(u => u.email === email && u.password === password);
      
      if (user) {
        // Ta bort lösenord från användarobjektet innan det returneras
        const { password, ...userWithoutPassword } = user;
        
        // Uppdatera autentiseringsstatus
        currentUser = userWithoutPassword;
        isAuthenticated = true;
        
        // Spara autentiseringsinformation i localStorage
        localStorage.setItem('auth', JSON.stringify({
          user: userWithoutPassword,
          token: 'mock-jwt-token',
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 timmar från nu
        }));
        
        resolve(userWithoutPassword);
      } else {
        reject(new Error('Ogiltiga inloggningsuppgifter'));
      }
    }, 500); // Simulera nätverksfördröjning
  });
}

/**
 * Loggar ut den aktuella användaren
 * 
 * @returns {Promise<void>} - Löfte som resolvas när utloggningen är klar
 */
export async function logout() {
  return new Promise(resolve => {
    setTimeout(() => {
      // Rensa autentiseringsstatus
      currentUser = null;
      isAuthenticated = false;
      
      // Ta bort autentiseringsinformation från localStorage
      localStorage.removeItem('auth');
      
      resolve();
    }, 200);
  });
}

/**
 * Kontrollerar om användaren är autentiserad
 * 
 * @returns {boolean} - Sant om användaren är autentiserad
 */
export function isUserAuthenticated() {
  // Om vi inte har en autentiseringsstatus i minnet, kontrollera localStorage
  if (!isAuthenticated) {
    const auth = localStorage.getItem('auth');
    if (auth) {
      try {
        const authData = JSON.parse(auth);
        
        // Kontrollera om token har gått ut
        if (new Date(authData.expiresAt) > new Date()) {
          currentUser = authData.user;
          isAuthenticated = true;
        } else {
          // Token har gått ut, rensa localStorage
          localStorage.removeItem('auth');
        }
      } catch (error) {
        console.error('Fel vid parsing av autentiseringsdata:', error);
        localStorage.removeItem('auth');
      }
    }
  }
  
  return isAuthenticated;
}

/**
 * Hämtar den aktuella användarens data
 * 
 * @returns {Object|null} - Användardata eller null om ingen användare är inloggad
 */
export function getCurrentUser() {
  // Kontrollera autentisering först för att uppdatera currentUser om det behövs
  isUserAuthenticated();
  return currentUser;
}

/**
 * Kontrollerar om användaren har en aktiv prenumeration
 * 
 * @returns {boolean} - Sant om användaren har en aktiv prenumeration
 */
export function hasActiveSubscription() {
  if (!isUserAuthenticated()) {
    return false;
  }
  
  return currentUser.subscription !== null && 
         new Date(currentUser.subscription.expiresAt) > new Date();
}

/**
 * Registrerar en ny användare
 * 
 * @param {Object} userData - Användardata för registrering
 * @returns {Promise<Object>} - Löfte som resolvas med användardata vid framgångsrik registrering
 */
export async function register(userData) {
  // Detta är en stub för framtida implementering
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Kontrollera om e-postadressen redan används
      const existingUser = MOCK_USERS.find(u => u.email === userData.email);
      
      if (existingUser) {
        reject(new Error('E-postadressen används redan'));
        return;
      }
      
      // Simulera framgångsrik registrering
      const newUser = {
        id: String(MOCK_USERS.length + 1),
        email: userData.email,
        name: userData.name,
        role: 'user',
        subscription: null
      };
      
      // I en verklig implementation skulle vi spara användaren i en databas
      // och hantera lösenordshashning säkert
      
      resolve(newUser);
    }, 800);
  });
}
