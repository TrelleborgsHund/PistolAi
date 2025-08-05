<!-- Subscription.vue - Sida för prenumerationshantering (för framtida implementering) -->
<template>
  <div class="subscription-container">
    <div class="subscription-header">
      <h1>Prenumerationsalternativ</h1>
      <p class="subscription-subtitle">Välj den plan som passar dig bäst</p>
    </div>
    
    <div class="subscription-content">
      <div v-if="isLoading" class="loading-container">
        <div class="loading-spinner large"></div>
        <p>Laddar prenumerationsalternativ...</p>
      </div>
      
      <div v-else-if="error" class="error-message">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
        <p>{{ error }}</p>
      </div>
      
      <div v-else class="plans-container">
        <div 
          v-for="plan in plans" 
          :key="plan.id" 
          class="plan-card"
          :class="{ 'selected': selectedPlan === plan.id, 'best-value': plan.id === 'yearly' }"
          @click="selectPlan(plan.id)"
        >
          <div v-if="plan.id === 'yearly'" class="best-value-badge">Bästa värdet</div>
          
          <h2>{{ plan.name }}</h2>
          <div class="plan-price">
            <span class="price">{{ plan.price }} {{ plan.currency }}</span>
            <span class="interval" v-if="plan.interval !== 'once'">/ {{ plan.interval === 'month' ? 'månad' : 'år' }}</span>
          </div>
          
          <p class="plan-description">{{ plan.description }}</p>
          
          <ul class="plan-features">
            <li>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              Obegränsade AI-frågor
            </li>
            <li>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              Tillgång till alla källdokument
            </li>
            <li>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              Chatthistorik sparas
            </li>
            <li v-if="plan.id === 'yearly' || plan.id === 'lifetime'">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              Prioriterad support
            </li>
          </ul>
          
          <div class="plan-select">
            <div class="radio-button" :class="{ 'checked': selectedPlan === plan.id }">
              <div class="radio-inner"></div>
            </div>
            <span>{{ selectedPlan === plan.id ? 'Vald' : 'Välj plan' }}</span>
          </div>
        </div>
      </div>
      
      <div class="subscription-actions">
        <button 
          class="back-button" 
          @click="goBack"
        >
          Tillbaka
        </button>
        
        <button 
          class="subscribe-button" 
          @click="proceedToPayment"
          :disabled="!selectedPlan || isProcessing"
        >
          <span v-if="isProcessing">
            <span class="loading-spinner"></span>
            Bearbetar...
          </span>
          <span v-else>
            Fortsätt till betalning
          </span>
        </button>
      </div>
    </div>
    
    <div class="subscription-info">
      <div class="info-card">
        <h3>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="16" x2="12" y2="12"></line>
            <line x1="12" y1="8" x2="12.01" y2="8"></line>
          </svg>
          Vanliga frågor
        </h3>
        
        <div class="faq-item">
          <h4>Hur fungerar betalningen?</h4>
          <p>Vi använder säker betalningshantering via Stripe. Vi lagrar aldrig dina kortuppgifter.</p>
        </div>
        
        <div class="faq-item">
          <h4>Kan jag avbryta min prenumeration?</h4>
          <p>Ja, du kan avbryta din prenumeration när som helst från din profilsida. Du behåller tillgång till tjänsten fram till slutet av din betalda period.</p>
        </div>
        
        <div class="faq-item">
          <h4>Vad ingår i prenumerationen?</h4>
          <p>Prenumerationen ger dig obegränsad tillgång till vår AI-chattfunktion som kan svara på frågor om vapenlagstiftning och säkerhet baserat på officiella källor.</p>
        </div>
      </div>
    </div>
    
    <div class="subscription-note">
      <p>
        <strong>OBS:</strong> Prenumerationsfunktionen är inte aktiverad än. 
        Detta är en förhandsvisning av kommande funktionalitet.
      </p>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { isUserAuthenticated } from '../services/authService';
import { getSubscriptionPlans, initiatePayment } from '../services/paymentService';

export default {
  name: 'Subscription',
  setup() {
    const router = useRouter();
    const plans = ref([]);
    const selectedPlan = ref(null);
    const isLoading = ref(true);
    const isProcessing = ref(false);
    const error = ref(null);
    
    // Hämta prenumerationsplaner
    const fetchPlans = async () => {
      isLoading.value = true;
      error.value = null;
      
      try {
        plans.value = await getSubscriptionPlans();
        
        // Välj årlig plan som standard
        if (plans.value.some(plan => plan.id === 'yearly')) {
          selectedPlan.value = 'yearly';
        } else if (plans.value.length > 0) {
          selectedPlan.value = plans.value[0].id;
        }
      } catch (err) {
        console.error('Fel vid hämtning av prenumerationsplaner:', err);
        error.value = 'Kunde inte hämta prenumerationsalternativ. Försök igen senare.';
      } finally {
        isLoading.value = false;
      }
    };
    
    onMounted(() => {
      // Kontrollera om användaren är inloggad
      if (!isUserAuthenticated()) {
        router.push('/login?redirect=subscription');
        return;
      }
      
      fetchPlans();
    });
    
    // Metoder
    const selectPlan = (planId) => {
      selectedPlan.value = planId;
    };
    
    const proceedToPayment = async () => {
      if (!selectedPlan.value) return;
      
      isProcessing.value = true;
      
      try {
        // Simulera betalningsprocess
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // I en verklig implementation skulle vi anropa en betalningsleverantör
        // och omdirigera användaren till en checkout-sida
        
        // För demo-syfte, visa en alert och omdirigera till profilsidan
        alert('Detta är en demo. I en verklig implementation skulle du omdirigeras till en betalningssida.');
        router.push('/profile');
      } catch (err) {
        console.error('Fel vid betalningshantering:', err);
        error.value = 'Ett fel uppstod vid betalningshantering. Försök igen senare.';
      } finally {
        isProcessing.value = false;
      }
    };
    
    const goBack = () => {
      router.back();
    };
    
    return {
      plans,
      selectedPlan,
      isLoading,
      isProcessing,
      error,
      selectPlan,
      proceedToPayment,
      goBack
    };
  }
};
</script>

<style scoped>
.subscription-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 1.5rem 1rem;
}

.subscription-header {
  text-align: center;
  margin-bottom: 2rem;
}

h1 {
  color: var(--primary-color);
  margin-bottom: 0.5rem;
}

.subscription-subtitle {
  color: var(--secondary-color);
  font-size: 1.1rem;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 0;
}

.loading-spinner.large {
  width: 40px;
  height: 40px;
  border-width: 3px;
  margin-bottom: 1rem;
}

.error-message {
  background-color: #fff2f2;
  border: 1px solid #ffdddd;
  color: var(--error-color);
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.plans-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.plan-card {
  background-color: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.08);
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  border: 2px solid transparent;
}

.plan-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.plan-card.selected {
  border-color: var(--primary-color);
}

.plan-card.best-value {
  border-color: var(--success-color);
}

.best-value-badge {
  position: absolute;
  top: -12px;
  right: 20px;
  background-color: var(--success-color);
  color: white;
  padding: 0.25rem 1rem;
  border-radius: 16px;
  font-size: 0.85rem;
  font-weight: 600;
}

.plan-card h2 {
  margin-top: 0;
  margin-bottom: 1rem;
  color: var(--text-color);
}

.plan-price {
  margin-bottom: 1rem;
}

.price {
  font-size: 2rem;
  font-weight: 700;
  color: var(--primary-color);
}

.interval {
  font-size: 1rem;
  color: var(--secondary-color);
}

.plan-description {
  color: var(--secondary-color);
  margin-bottom: 1.5rem;
  min-height: 3em;
}

.plan-features {
  list-style-type: none;
  padding: 0;
  margin: 0 0 1.5rem 0;
}

.plan-features li {
  display: flex;
  align-items: center;
  margin-bottom: 0.75rem;
  color: var(--text-color);
}

.plan-features li svg {
  color: var(--success-color);
  margin-right: 0.75rem;
  flex-shrink: 0;
}

.plan-select {
  display: flex;
  align-items: center;
  margin-top: auto;
}

.radio-button {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid #ddd;
  margin-right: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: border-color 0.2s;
}

.radio-button.checked {
  border-color: var(--primary-color);
}

.radio-inner {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: var(--primary-color);
  opacity: 0;
  transform: scale(0);
  transition: all 0.2s;
}

.radio-button.checked .radio-inner {
  opacity: 1;
  transform: scale(1);
}

.subscription-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 1.5rem;
}

.back-button {
  padding: 0.85rem 1.5rem;
  background-color: transparent;
  border: 1px solid #ddd;
  border-radius: 8px;
  color: var(--text-color);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.back-button:hover {
  background-color: #f5f5f5;
}

.subscribe-button {
  padding: 0.85rem 2rem;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
}

.subscribe-button:hover:not(:disabled) {
  background-color: #3a7bc8;
  transform: translateY(-2px);
}

.subscribe-button:disabled {
  opacity: 0.6;
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

.subscription-info {
  margin-top: 3rem;
}

.info-card {
  background-color: #f9f9f9;
  border-radius: 12px;
  padding: 1.5rem;
}

.info-card h3 {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0;
  margin-bottom: 1.25rem;
  color: var(--text-color);
}

.faq-item {
  margin-bottom: 1.25rem;
}

.faq-item:last-child {
  margin-bottom: 0;
}

.faq-item h4 {
  margin: 0 0 0.5rem 0;
  color: var(--text-color);
}

.faq-item p {
  margin: 0;
  color: var(--secondary-color);
  line-height: 1.5;
}

.subscription-note {
  margin-top: 2rem;
  padding: 1rem;
  background-color: #fff8e1;
  border-radius: 8px;
  text-align: center;
  color: #856404;
  font-size: 0.9rem;
}

@media (max-width: 768px) {
  .subscription-container {
    padding: 1rem;
  }
  
  .plans-container {
    grid-template-columns: 1fr;
  }
  
  .plan-description {
    min-height: auto;
  }
}

@media (max-width: 480px) {
  .subscription-actions {
    flex-direction: column;
    gap: 1rem;
  }
  
  .back-button, .subscribe-button {
    width: 100%;
  }
}
</style>
