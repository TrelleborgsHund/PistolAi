/**
 * Payment Service
 * 
 * Denna tjänst hanterar betalningar och prenumerationer.
 * För närvarande är detta en stub som förbereder för framtida implementering.
 */

// Simulerade prenumerationsplaner
export const SUBSCRIPTION_PLANS = {
  MONTHLY: {
    id: 'monthly',
    name: 'Månadsprenumeration',
    price: 49,
    currency: 'SEK',
    interval: 'month',
    description: 'Obegränsad tillgång till AI-chat i en månad'
  },
  YEARLY: {
    id: 'yearly',
    name: 'Årsprenumeration',
    price: 499,
    currency: 'SEK',
    interval: 'year',
    description: 'Obegränsad tillgång till AI-chat i ett år (spara 16%)'
  },
  LIFETIME: {
    id: 'lifetime',
    name: 'Livstidsprenumeration',
    price: 1499,
    currency: 'SEK',
    interval: 'once',
    description: 'Obegränsad tillgång till AI-chat för alltid'
  }
};

// Simulerade transaktioner för utveckling
const MOCK_TRANSACTIONS = [];

/**
 * Initierar en betalning för en prenumeration
 * 
 * @param {string} planId - ID för prenumerationsplanen
 * @param {string} userId - ID för användaren som gör betalningen
 * @returns {Promise<Object>} - Löfte som resolvas med betalningsinformation
 */
export async function initiatePayment(planId, userId) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const plan = Object.values(SUBSCRIPTION_PLANS).find(p => p.id === planId);
      
      if (!plan) {
        reject(new Error('Ogiltig prenumerationsplan'));
        return;
      }
      
      // Simulera en betalningslänk eller checkout-session
      // I en verklig implementation skulle detta anropa en betalningsleverantör som Stripe
      const paymentInfo = {
        paymentId: `payment_${Date.now()}`,
        userId,
        planId,
        amount: plan.price,
        currency: plan.currency,
        status: 'pending',
        createdAt: new Date(),
        checkoutUrl: `https://example.com/checkout/${planId}?user=${userId}`
      };
      
      // Lägg till i simulerade transaktioner
      MOCK_TRANSACTIONS.push(paymentInfo);
      
      resolve(paymentInfo);
    }, 600);
  });
}

/**
 * Simulerar en framgångsrik betalning
 * 
 * @param {string} paymentId - ID för betalningen
 * @returns {Promise<Object>} - Löfte som resolvas med uppdaterad betalningsinformation
 */
export async function simulateSuccessfulPayment(paymentId) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const paymentIndex = MOCK_TRANSACTIONS.findIndex(t => t.paymentId === paymentId);
      
      if (paymentIndex === -1) {
        reject(new Error('Betalning hittades inte'));
        return;
      }
      
      // Uppdatera betalningsstatus
      MOCK_TRANSACTIONS[paymentIndex].status = 'completed';
      MOCK_TRANSACTIONS[paymentIndex].completedAt = new Date();
      
      resolve(MOCK_TRANSACTIONS[paymentIndex]);
    }, 400);
  });
}

/**
 * Hämtar en användares prenumerationsinformation
 * 
 * @param {string} userId - ID för användaren
 * @returns {Promise<Object|null>} - Löfte som resolvas med prenumerationsinformation eller null
 */
export async function getUserSubscription(userId) {
  return new Promise(resolve => {
    setTimeout(() => {
      // Simulera hämtning av prenumerationsinformation från en databas
      // I en verklig implementation skulle detta anropa en API-endpoint
      
      // Hitta den senaste slutförda betalningen för användaren
      const latestTransaction = [...MOCK_TRANSACTIONS]
        .filter(t => t.userId === userId && t.status === 'completed')
        .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt))[0];
      
      if (!latestTransaction) {
        resolve(null);
        return;
      }
      
      const plan = Object.values(SUBSCRIPTION_PLANS).find(p => p.id === latestTransaction.planId);
      
      // Beräkna utgångsdatum baserat på plantyp
      let expiresAt = null;
      if (plan.interval === 'month') {
        expiresAt = new Date(latestTransaction.completedAt);
        expiresAt.setMonth(expiresAt.getMonth() + 1);
      } else if (plan.interval === 'year') {
        expiresAt = new Date(latestTransaction.completedAt);
        expiresAt.setFullYear(expiresAt.getFullYear() + 1);
      } else if (plan.interval === 'once') {
        // Livstidsprenumerationer går aldrig ut
        expiresAt = null;
      }
      
      const subscription = {
        id: `sub_${latestTransaction.paymentId}`,
        userId,
        planId: plan.id,
        planName: plan.name,
        startedAt: new Date(latestTransaction.completedAt),
        expiresAt,
        isActive: expiresAt === null || new Date(expiresAt) > new Date(),
        isLifetime: plan.interval === 'once'
      };
      
      resolve(subscription);
    }, 300);
  });
}

/**
 * Kontrollerar om en användare har en aktiv prenumeration
 * 
 * @param {string} userId - ID för användaren
 * @returns {Promise<boolean>} - Löfte som resolvas med true om användaren har en aktiv prenumeration
 */
export async function hasActiveSubscription(userId) {
  const subscription = await getUserSubscription(userId);
  return subscription !== null && subscription.isActive;
}

/**
 * Hämtar alla tillgängliga prenumerationsplaner
 * 
 * @returns {Promise<Array>} - Löfte som resolvas med en array av prenumerationsplaner
 */
export async function getSubscriptionPlans() {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(Object.values(SUBSCRIPTION_PLANS));
    }, 200);
  });
}

/**
 * Avbryter en användares prenumeration
 * 
 * @param {string} userId - ID för användaren
 * @param {string} subscriptionId - ID för prenumerationen
 * @returns {Promise<Object>} - Löfte som resolvas med avbrytningsinformation
 */
export async function cancelSubscription(userId, subscriptionId) {
  // Detta är en stub för framtida implementering
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        success: true,
        message: 'Prenumerationen har avbrutits',
        cancelledAt: new Date()
      });
    }, 500);
  });
}
