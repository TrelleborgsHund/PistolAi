<!-- Login.vue - Inloggningskomponent (för framtida implementering) -->
<template>
  <div class="login-container">
    <div class="login-card">
      <h1>{{ isRegisterMode ? 'Skapa konto' : 'Logga in' }}</h1>
      
      <div v-if="error" class="error-message">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
        {{ error }}
      </div>
      
      <form @submit.prevent="handleSubmit">
        <div class="form-group" v-if="isRegisterMode">
          <label for="name">Namn</label>
          <input 
            type="text" 
            id="name" 
            v-model="form.name" 
            placeholder="Ditt namn"
            required
          />
        </div>
        
        <div class="form-group">
          <label for="email">E-postadress</label>
          <input 
            type="email" 
            id="email" 
            v-model="form.email" 
            placeholder="din@email.se"
            required
          />
        </div>
        
        <div class="form-group">
          <label for="password">Lösenord</label>
          <input 
            type="password" 
            id="password" 
            v-model="form.password" 
            placeholder="Lösenord"
            required
          />
        </div>
        
        <div class="form-group" v-if="isRegisterMode">
          <label for="confirmPassword">Bekräfta lösenord</label>
          <input 
            type="password" 
            id="confirmPassword" 
            v-model="form.confirmPassword" 
            placeholder="Bekräfta lösenord"
            required
          />
        </div>
        
        <button type="submit" class="submit-button" :disabled="isLoading">
          <span v-if="isLoading">
            <span class="loading-spinner"></span>
            Vänta...
          </span>
          <span v-else>
            {{ isRegisterMode ? 'Skapa konto' : 'Logga in' }}
          </span>
        </button>
      </form>
      
      <div class="form-footer">
        <p v-if="isRegisterMode">
          Har du redan ett konto? 
          <a href="#" @click.prevent="toggleMode">Logga in här</a>
        </p>
        <p v-else>
          Har du inget konto? 
          <a href="#" @click.prevent="toggleMode">Skapa ett här</a>
        </p>
      </div>
      
      <div class="login-note">
        <p>
          <strong>OBS:</strong> Inloggningsfunktionen är inte aktiverad än. 
          Detta är en förhandsvisning av kommande funktionalitet.
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { login, register } from '../services/authService';

export default {
  name: 'Login',
  setup() {
    const router = useRouter();
    const isRegisterMode = ref(false);
    const isLoading = ref(false);
    const error = ref('');
    
    const form = ref({
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    });
    
    const toggleMode = () => {
      isRegisterMode.value = !isRegisterMode.value;
      error.value = '';
      form.value = {
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
      };
    };
    
    const handleSubmit = async () => {
      error.value = '';
      
      // Validera formulär
      if (isRegisterMode.value) {
        if (form.value.password !== form.value.confirmPassword) {
          error.value = 'Lösenorden matchar inte';
          return;
        }
        
        if (form.value.password.length < 6) {
          error.value = 'Lösenordet måste vara minst 6 tecken';
          return;
        }
      }
      
      isLoading.value = true;
      
      try {
        if (isRegisterMode.value) {
          // Registrera ny användare
          await register({
            name: form.value.name,
            email: form.value.email,
            password: form.value.password
          });
          
          // Efter registrering, logga in automatiskt
          await login(form.value.email, form.value.password);
        } else {
          // Logga in befintlig användare
          await login(form.value.email, form.value.password);
        }
        
        // Omdirigera till profilsidan efter inloggning
        router.push('/profile');
      } catch (err) {
        error.value = err.message || 'Ett fel uppstod. Försök igen senare.';
      } finally {
        isLoading.value = false;
      }
    };
    
    return {
      isRegisterMode,
      isLoading,
      error,
      form,
      toggleMode,
      handleSubmit
    };
  }
};
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 120px);
  padding: 1rem;
}

.login-card {
  background-color: white;
  border-radius: 12px;
  padding: 2rem;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

h1 {
  color: var(--primary-color);
  margin-bottom: 1.5rem;
  text-align: center;
  font-size: 1.8rem;
}

.error-message {
  background-color: #fff2f2;
  border: 1px solid #ffdddd;
  color: var(--error-color);
  padding: 0.75rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.form-group {
  margin-bottom: 1.25rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: var(--text-color);
}

input {
  width: 100%;
  padding: 0.85rem 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s, box-shadow 0.3s;
}

input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 2px rgba(var(--primary-color-rgb), 0.2);
}

.submit-button {
  width: 100%;
  padding: 0.85rem;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s;
  display: flex;
  justify-content: center;
  align-items: center;
}

.submit-button:hover:not(:disabled) {
  background-color: #3a7bc8;
  transform: translateY(-2px);
}

.submit-button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
  transform: none;
}

.loading-spinner {
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s ease-in-out infinite;
  margin-right: 0.5rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.form-footer {
  margin-top: 1.5rem;
  text-align: center;
  color: var(--secondary-color);
}

.form-footer a {
  color: var(--primary-color);
  text-decoration: none;
  font-weight: 500;
}

.form-footer a:hover {
  text-decoration: underline;
}

.login-note {
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid #eee;
  font-size: 0.9rem;
  color: #888;
  text-align: center;
}

@media (max-width: 480px) {
  .login-card {
    padding: 1.5rem;
  }
  
  h1 {
    font-size: 1.5rem;
    margin-bottom: 1.25rem;
  }
  
  input, .submit-button {
    padding: 0.75rem;
  }
}
</style>
