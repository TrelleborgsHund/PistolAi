<!-- Profile.vue - Profilsida för inloggade användare (för framtida implementering) -->
<template>
  <div class="profile-container">
    <div class="profile-header">
      <h1>Min profil</h1>
      <p class="profile-subtitle">Hantera ditt konto och prenumeration</p>
    </div>
    
    <div class="profile-content">
      <div class="profile-card user-info">
        <h2>Kontoinformation</h2>
        
        <div class="user-details">
          <div class="user-avatar">
            <span>{{ userInitials }}</span>
          </div>
          
          <div class="user-data">
            <p class="user-name">{{ user ? user.name : 'Inloggning krävs' }}</p>
            <p class="user-email">{{ user ? user.email : '' }}</p>
          </div>
        </div>
        
        <div class="form-group">
          <label for="name">Namn</label>
          <input 
            type="text" 
            id="name" 
            v-model="form.name" 
            placeholder="Ditt namn"
            :disabled="!user || isUpdating"
          />
        </div>
        
        <div class="form-group">
          <label for="email">E-postadress</label>
          <input 
            type="email" 
            id="email" 
            v-model="form.email" 
            placeholder="din@email.se"
            disabled
          />
          <small>E-postadressen kan inte ändras</small>
        </div>
        
        <div class="profile-actions">
          <button 
            class="update-button" 
            @click="updateProfile" 
            :disabled="!user || isUpdating || !hasChanges"
          >
            <span v-if="isUpdating">
              <span class="loading-spinner"></span>
              Uppdaterar...
            </span>
            <span v-else>Uppdatera profil</span>
          </button>
        </div>
      </div>
      
      <div class="profile-card subscription-info">
        <h2>Prenumeration</h2>
        
        <div v-if="user && subscription" class="subscription-details">
          <div class="subscription-status" :class="{ active: subscription.isActive }">
            <span class="status-indicator"></span>
            <span>{{ subscription.isActive ? 'Aktiv' : 'Inaktiv' }}</span>
          </div>
          
          <div class="subscription-type">
            <h3>{{ subscription.planName }}</h3>
            <p v-if="subscription.isLifetime" class="lifetime-badge">Livstid</p>
            <p v-else-if="subscription.expiresAt" class="expiry-info">
              Förnyas {{ formatDate(subscription.expiresAt) }}
            </p>
          </div>
          
          <button 
            v-if="subscription.isActive && !subscription.isLifetime" 
            class="cancel-button"
            @click="showCancelDialog = true"
          >
            Avbryt prenumeration
          </button>
        </div>
        
        <div v-else class="no-subscription">
          <p>Du har ingen aktiv prenumeration</p>
          <button class="subscribe-button" @click="goToSubscriptionPage">
            Se prenumerationsalternativ
          </button>
        </div>
      </div>
      
      <div class="profile-card password-change">
        <h2>Byt lösenord</h2>
        
        <div class="form-group">
          <label for="currentPassword">Nuvarande lösenord</label>
          <input 
            type="password" 
            id="currentPassword" 
            v-model="passwordForm.current" 
            placeholder="Nuvarande lösenord"
            :disabled="!user || isChangingPassword"
          />
        </div>
        
        <div class="form-group">
          <label for="newPassword">Nytt lösenord</label>
          <input 
            type="password" 
            id="newPassword" 
            v-model="passwordForm.new" 
            placeholder="Nytt lösenord"
            :disabled="!user || isChangingPassword"
          />
        </div>
        
        <div class="form-group">
          <label for="confirmPassword">Bekräfta nytt lösenord</label>
          <input 
            type="password" 
            id="confirmPassword" 
            v-model="passwordForm.confirm" 
            placeholder="Bekräfta nytt lösenord"
            :disabled="!user || isChangingPassword"
          />
        </div>
        
        <div class="profile-actions">
          <button 
            class="update-button" 
            @click="changePassword" 
            :disabled="!user || isChangingPassword || !canChangePassword"
          >
            <span v-if="isChangingPassword">
              <span class="loading-spinner"></span>
              Uppdaterar...
            </span>
            <span v-else>Byt lösenord</span>
          </button>
        </div>
      </div>
      
      <div class="profile-card danger-zone">
        <h2>Farlig zon</h2>
        <p>Åtgärder här kan inte ångras</p>
        
        <button 
          class="delete-button" 
          @click="showDeleteDialog = true"
          :disabled="!user"
        >
          Radera mitt konto
        </button>
        
        <button 
          class="logout-button" 
          @click="logout"
          :disabled="!user || isLoggingOut"
        >
          <span v-if="isLoggingOut">
            <span class="loading-spinner"></span>
            Loggar ut...
          </span>
          <span v-else>Logga ut</span>
        </button>
      </div>
    </div>
    
    <!-- Modal för avbryt prenumeration -->
    <div v-if="showCancelDialog" class="modal-overlay">
      <div class="modal-content">
        <h3>Avbryt prenumeration</h3>
        <p>Är du säker på att du vill avbryta din prenumeration? Du kommer att ha tillgång till tjänsten fram till slutet av din nuvarande faktureringsperiod.</p>
        
        <div class="modal-actions">
          <button class="cancel-action" @click="showCancelDialog = false">Avbryt</button>
          <button class="confirm-action" @click="cancelSubscription">Bekräfta</button>
        </div>
      </div>
    </div>
    
    <!-- Modal för radera konto -->
    <div v-if="showDeleteDialog" class="modal-overlay">
      <div class="modal-content">
        <h3>Radera konto</h3>
        <p>Är du säker på att du vill radera ditt konto? Denna åtgärd kan inte ångras och all din data kommer att tas bort permanent.</p>
        
        <div class="form-group">
          <label for="deleteConfirmation">Skriv "RADERA" för att bekräfta</label>
          <input 
            type="text" 
            id="deleteConfirmation" 
            v-model="deleteConfirmation" 
            placeholder="RADERA"
          />
        </div>
        
        <div class="modal-actions">
          <button class="cancel-action" @click="showDeleteDialog = false">Avbryt</button>
          <button 
            class="confirm-action delete-action" 
            @click="deleteAccount"
            :disabled="deleteConfirmation !== 'RADERA'"
          >
            Radera mitt konto permanent
          </button>
        </div>
      </div>
    </div>
    
    <div class="profile-note">
      <p>
        <strong>OBS:</strong> Profilfunktionen är inte fullt aktiverad än. 
        Detta är en förhandsvisning av kommande funktionalitet.
      </p>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { getCurrentUser, isUserAuthenticated, logout as authLogout } from '../services/authService';
import { getUserSubscription } from '../services/paymentService';

export default {
  name: 'Profile',
  setup() {
    const router = useRouter();
    const user = ref(null);
    const subscription = ref(null);
    const isUpdating = ref(false);
    const isChangingPassword = ref(false);
    const isLoggingOut = ref(false);
    const showCancelDialog = ref(false);
    const showDeleteDialog = ref(false);
    const deleteConfirmation = ref('');
    
    const form = ref({
      name: '',
      email: ''
    });
    
    const passwordForm = ref({
      current: '',
      new: '',
      confirm: ''
    });
    
    // Hämta användardata och prenumerationsinformation
    const fetchUserData = async () => {
      if (isUserAuthenticated()) {
        user.value = getCurrentUser();
        
        if (user.value) {
          form.value.name = user.value.name;
          form.value.email = user.value.email;
          
          try {
            subscription.value = await getUserSubscription(user.value.id);
          } catch (error) {
            console.error('Fel vid hämtning av prenumerationsinformation:', error);
          }
        }
      } else {
        // Omdirigera till inloggningssidan om användaren inte är inloggad
        router.push('/login');
      }
    };
    
    onMounted(fetchUserData);
    
    // Beräknade egenskaper
    const userInitials = computed(() => {
      if (!user.value || !user.value.name) return '?';
      return user.value.name
        .split(' ')
        .map(name => name.charAt(0).toUpperCase())
        .slice(0, 2)
        .join('');
    });
    
    const hasChanges = computed(() => {
      return user.value && form.value.name !== user.value.name;
    });
    
    const canChangePassword = computed(() => {
      return (
        passwordForm.value.current.length > 0 &&
        passwordForm.value.new.length >= 6 &&
        passwordForm.value.new === passwordForm.value.confirm
      );
    });
    
    // Metoder
    const formatDate = (dateString) => {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('sv-SE', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }).format(date);
    };
    
    const updateProfile = async () => {
      if (!user.value) return;
      
      isUpdating.value = true;
      
      try {
        // Simulera API-anrop för att uppdatera profil
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Uppdatera användardata
        user.value = {
          ...user.value,
          name: form.value.name
        };
        
        alert('Profilen har uppdaterats');
      } catch (error) {
        console.error('Fel vid uppdatering av profil:', error);
        alert('Ett fel uppstod vid uppdatering av profilen');
      } finally {
        isUpdating.value = false;
      }
    };
    
    const changePassword = async () => {
      if (!user.value) return;
      
      isChangingPassword.value = true;
      
      try {
        // Simulera API-anrop för att byta lösenord
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Återställ formulär
        passwordForm.value = {
          current: '',
          new: '',
          confirm: ''
        };
        
        alert('Lösenordet har ändrats');
      } catch (error) {
        console.error('Fel vid byte av lösenord:', error);
        alert('Ett fel uppstod vid byte av lösenord');
      } finally {
        isChangingPassword.value = false;
      }
    };
    
    const logout = async () => {
      isLoggingOut.value = true;
      
      try {
        await authLogout();
        router.push('/');
      } catch (error) {
        console.error('Fel vid utloggning:', error);
        alert('Ett fel uppstod vid utloggning');
        isLoggingOut.value = false;
      }
    };
    
    const cancelSubscription = async () => {
      if (!user.value || !subscription.value) return;
      
      try {
        // Simulera API-anrop för att avbryta prenumeration
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Uppdatera prenumerationsstatus
        subscription.value = {
          ...subscription.value,
          isActive: false
        };
        
        showCancelDialog.value = false;
        alert('Prenumerationen har avbrutits');
      } catch (error) {
        console.error('Fel vid avbrytning av prenumeration:', error);
        alert('Ett fel uppstod vid avbrytning av prenumerationen');
      }
    };
    
    const deleteAccount = async () => {
      if (!user.value || deleteConfirmation.value !== 'RADERA') return;
      
      try {
        // Simulera API-anrop för att radera konto
        await new Promise(resolve => setTimeout(resolve, 1200));
        
        // Logga ut och omdirigera
        await authLogout();
        router.push('/');
        alert('Ditt konto har raderats');
      } catch (error) {
        console.error('Fel vid radering av konto:', error);
        alert('Ett fel uppstod vid radering av kontot');
        showDeleteDialog.value = false;
      }
    };
    
    const goToSubscriptionPage = () => {
      router.push('/subscription');
    };
    
    return {
      user,
      subscription,
      form,
      passwordForm,
      isUpdating,
      isChangingPassword,
      isLoggingOut,
      showCancelDialog,
      showDeleteDialog,
      deleteConfirmation,
      userInitials,
      hasChanges,
      canChangePassword,
      formatDate,
      updateProfile,
      changePassword,
      logout,
      cancelSubscription,
      deleteAccount,
      goToSubscriptionPage
    };
  }
};
</script>

<style scoped>
.profile-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 1.5rem 1rem;
}

.profile-header {
  margin-bottom: 2rem;
  text-align: center;
}

h1 {
  color: var(--primary-color);
  margin-bottom: 0.5rem;
}

.profile-subtitle {
  color: var(--secondary-color);
  font-size: 1.1rem;
}

.profile-content {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
}

@media (min-width: 768px) {
  .profile-content {
    grid-template-columns: 1fr 1fr;
  }
  
  .profile-card.user-info,
  .profile-card.password-change {
    grid-column: 1;
  }
  
  .profile-card.subscription-info,
  .profile-card.danger-zone {
    grid-column: 2;
    grid-row: span 1;
  }
}

.profile-card {
  background-color: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.08);
}

.profile-card h2 {
  color: var(--text-color);
  font-size: 1.3rem;
  margin-bottom: 1.25rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid #eee;
}

/* Användarinfo */
.user-details {
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
}

.user-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: var(--primary-color);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: 600;
  margin-right: 1rem;
}

.user-data {
  flex: 1;
}

.user-name {
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.user-email {
  color: var(--secondary-color);
  font-size: 0.95rem;
}

/* Formulär */
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
  padding: 0.75rem 1rem;
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

input:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
}

small {
  display: block;
  margin-top: 0.35rem;
  color: var(--secondary-color);
  font-size: 0.85rem;
}

/* Knappar */
.profile-actions {
  display: flex;
  justify-content: flex-end;
}

button {
  padding: 0.75rem 1.25rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.update-button {
  background-color: var(--primary-color);
  color: white;
  border: none;
}

.update-button:hover:not(:disabled) {
  background-color: #3a7bc8;
  transform: translateY(-2px);
}

.subscribe-button {
  background-color: var(--success-color);
  color: white;
  border: none;
  width: 100%;
  margin-top: 1rem;
}

.subscribe-button:hover:not(:disabled) {
  opacity: 0.9;
  transform: translateY(-2px);
}

.cancel-button {
  background-color: transparent;
  color: var(--error-color);
  border: 1px solid var(--error-color);
  margin-top: 1rem;
}

.cancel-button:hover:not(:disabled) {
  background-color: rgba(var(--error-color), 0.1);
}

.delete-button {
  background-color: transparent;
  color: var(--error-color);
  border: 1px solid var(--error-color);
  margin-right: auto;
}

.delete-button:hover:not(:disabled) {
  background-color: rgba(var(--error-color), 0.1);
}

.logout-button {
  background-color: #f1f1f1;
  color: var(--text-color);
  border: none;
  margin-left: auto;
}

.logout-button:hover:not(:disabled) {
  background-color: #e5e5e5;
}

/* Prenumerationsinfo */
.subscription-details {
  padding: 1rem;
  border-radius: 8px;
  background-color: #f9f9f9;
}

.subscription-status {
  display: flex;
  align-items: center;
  margin-bottom: 0.75rem;
  font-weight: 500;
  color: #888;
}

.subscription-status.active {
  color: var(--success-color);
}

.status-indicator {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: #ccc;
  margin-right: 0.5rem;
}

.subscription-status.active .status-indicator {
  background-color: var(--success-color);
}

.subscription-type h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1.2rem;
}

.lifetime-badge {
  display: inline-block;
  background-color: var(--primary-color);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 16px;
  font-size: 0.85rem;
  font-weight: 500;
}

.expiry-info {
  color: var(--secondary-color);
  font-size: 0.9rem;
}

.no-subscription {
  text-align: center;
  padding: 1.5rem 0;
  color: var(--secondary-color);
}

/* Farlig zon */
.danger-zone {
  border: 1px solid #ffeeee;
}

.danger-zone h2 {
  color: var(--error-color);
}

.danger-zone p {
  color: var(--secondary-color);
  margin-bottom: 1.5rem;
  font-size: 0.9rem;
}

.danger-zone .profile-actions {
  display: flex;
  justify-content: space-between;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  border-radius: 12px;
  padding: 1.5rem;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.modal-content h3 {
  margin-top: 0;
  margin-bottom: 1rem;
  color: var(--text-color);
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 1.5rem;
  gap: 1rem;
}

.cancel-action {
  background-color: transparent;
  border: 1px solid #ddd;
  color: var(--text-color);
}

.confirm-action {
  background-color: var(--primary-color);
  color: white;
  border: none;
}

.delete-action {
  background-color: var(--error-color);
}

.delete-action:hover:not(:disabled) {
  background-color: #b71c1c;
}

/* Laddningsindikator */
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

/* Notis */
.profile-note {
  margin-top: 2rem;
  padding: 1rem;
  background-color: #fff8e1;
  border-radius: 8px;
  text-align: center;
  color: #856404;
  font-size: 0.9rem;
}

/* Responsiv design */
@media (max-width: 480px) {
  .profile-container {
    padding: 1rem 0.75rem;
  }
  
  .profile-card {
    padding: 1.25rem;
  }
  
  .user-avatar {
    width: 50px;
    height: 50px;
    font-size: 1.25rem;
  }
  
  .profile-actions {
    flex-direction: column;
  }
  
  .profile-actions button {
    width: 100%;
    margin-bottom: 0.5rem;
  }
  
  .danger-zone .profile-actions {
    flex-direction: column;
  }
  
  .delete-button, .logout-button {
    width: 100%;
    margin: 0 0 0.5rem 0;
  }
  
  .modal-actions {
    flex-direction: column;
  }
  
  .modal-actions button {
    width: 100%;
  }
}
</style>
