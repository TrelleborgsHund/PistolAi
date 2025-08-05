<template>
  <div class="chat-container">
    <h1>AI-Chatt för Pistolskytte</h1>
    <p class="chat-intro">
      Ställ frågor om pistolskytte, vapenlagstiftning eller säkerhetsbestämmelser. 
      AI-chatten hämtar information från officiella källor.
    </p>
    
    <div class="source-badges">
      <a href="https://www.riksdagen.se/sv/dokument-lagar/dokument/svensk-forfattningssamling/vapenlag-199667_sfs-1996-67" target="_blank" class="source-badge">Vapenlag (1996:67)</a>
      <a href="https://www.riksdagen.se/sv/dokument-lagar/dokument/svensk-forfattningssamling/vapenforordning-199670_sfs-1996-70" target="_blank" class="source-badge">Vapenförordning (1996:70)</a>
      <a href="https://www.skyttesport.se/media/es2ejinw/saekb_2020.pdf" target="_blank" class="source-badge">SÄKB</a>
    </div>
    
    <div class="chat-box" ref="chatBox">
      <div v-if="chatHistory.length === 0" class="empty-chat">
        <div class="empty-chat-content">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          <p>Ställ en fråga om pistolskytte för att börja!</p>
          <div class="example-questions">
            <p>Exempelfrågor:</p>
            <button @click="setExampleQuestion('Vad krävs för att få licens för pistol?')" class="example-btn">Vad krävs för att få licens för pistol?</button>
            <button @click="setExampleQuestion('Hur ska vapen förvaras säkert?')" class="example-btn">Hur ska vapen förvaras säkert?</button>
            <button @click="setExampleQuestion('Vilka säkerhetsregler gäller på skjutbanan?')" class="example-btn">Vilka säkerhetsregler gäller på skjutbanan?</button>
          </div>
        </div>
      </div>
      
      <div v-for="(message, index) in chatHistory" :key="index" class="message" :class="message.type">
        <div class="message-header" v-if="message.type === 'ai'">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M12 16v-4"></path>
            <path d="M12 8h.01"></path>
          </svg>
          <span>AI-Assistent</span>
        </div>
        <div class="message-header" v-if="message.type === 'user'">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
          <span>Du</span>
        </div>
        <div class="message-content">
          <div v-if="message.type === 'user'" class="user-message">
            {{ message.text }}
          </div>
          <div v-else-if="message.type === 'ai'" class="ai-message">
            <!-- Visa samlat svar med källhänvisningar längst ner -->
            <div v-if="message.multiSource && message.sources" class="consolidated-response">
              <!-- Samlad sammanfattning -->
              <div class="consolidated-summary">
                <p v-html="formatText(message.consolidatedSummary)"></p>
              </div>
              
              <!-- Originaltexter från källor -->
              <div class="original-sources">
                <details>
                  <summary>Visa originaltexter från källor</summary>
                  <div v-for="(source, sourceIndex) in message.sources" :key="sourceIndex" class="source-section">
                    <h4 class="source-title">{{ source.source }} {{ source.title }}</h4>
                    <div class="original-content">
                      <p>{{ source.content }}</p>
                    </div>
                  </div>
                </details>
              </div>
              
              <!-- Källhänvisningar -->
              <div class="sources-footer">
                <p class="sources-label">Källor:</p>
                <div class="source-references">
                  <div v-for="(ref, refIndex) in message.sourceReferences" :key="refIndex" class="source-reference">
                    <a :href="ref.sourceUrl" target="_blank" rel="noopener noreferrer" class="source-link">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                        <polyline points="15 3 21 3 21 9"></polyline>
                        <line x1="10" y1="14" x2="21" y2="3"></line>
                      </svg>
                      {{ ref.source }} {{ ref.title }}
                    </a>
                  </div>
                </div>
                <p class="source-note"><small>Kontrollera alltid källorna för den mest aktuella informationen.</small></p>
              </div>
            </div>
            
            <!-- Visa svar från en källa (baklängeskompatibilitet) -->
            <div v-else>
              <div class="summary" v-if="message.summary">
                <p v-html="formatText(message.summary)"></p>
              </div>
              <div class="original-text" v-if="message.originalText">
                <details>
                  <summary>Visa originaltext</summary>
                  <div class="original-content">
                    <p>{{ message.originalText }}</p>
                  </div>
                </details>
              </div>
              <div class="source" v-if="message.source">
                <p>
                  <a :href="message.sourceUrl" target="_blank" rel="noopener noreferrer" class="source-link">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                      <polyline points="15 3 21 3 21 9"></polyline>
                      <line x1="10" y1="14" x2="21" y2="3"></line>
                    </svg>
                    Källa: {{ message.source }}
                  </a>
                  <small>Kontrollera alltid källan för den mest aktuella informationen.</small>
                </p>
              </div>
            </div>
          </div>
          <div v-else-if="message.type === 'error'" class="error-message">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            {{ message.text }}
          </div>
        </div>
      </div>
      
      <div v-if="isLoading" class="loading-indicator">
        <div class="dot"></div>
        <div class="dot"></div>
        <div class="dot"></div>
      </div>
    </div>
    
    <div class="chat-input">
      <textarea 
        v-model="userInput" 
        placeholder="Ställ din fråga här..." 
        @keydown.enter.prevent="sendMessage"
        :disabled="isLoading"
        rows="2"
        ref="inputField"
      ></textarea>
      <button @click="sendMessage" :disabled="isLoading || !userInput.trim()" class="send-button">
        <svg v-if="!isLoading" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="22" y1="2" x2="11" y2="13"></line>
          <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
        </svg>
        <span v-if="isLoading">...</span>
      </button>
    </div>
  </div>
</template>

<script>
import { queryAIBackend } from '../services/aiChatService';

export default {
  name: 'Chat',
  data() {
    return {
      userInput: '',
      chatHistory: [],
      isLoading: false
    }
  },
  methods: {
    /**
     * Formaterar text med radbrytningar för HTML-visning
     * @param {string} text - Texten att formatera
     * @returns {string} - Formaterad text med HTML-radbrytningar
     */
    formatText(text) {
      if (!text) return '';
      return text.replace(/\n/g, '<br>');
    },
    
    /**
     * Hanterar användarens fråga och skickar den till AI-tjänsten
     */
    async sendMessage() {
      if (!this.userInput.trim() || this.isLoading) return;
      
      // Lägg till användarens meddelande i chatten
      const userMessage = {
        type: 'user',
        text: this.userInput.trim()
      };
      this.chatHistory.push(userMessage);
      
      // Rensa input och visa laddningsindikator
      const query = this.userInput.trim();
      this.userInput = '';
      this.isLoading = true;
      
      try {
        // Anropa AI-chattservicen för att få svar
        const response = await queryAIBackend(query);
        
        // Skapa AI-svaret för chatten
        let aiResponse;
        
        if (response.multiSource && response.sources) {
          // Hantera svar från flera källor
          aiResponse = {
            type: 'ai',
            multiSource: true,
            sources: response.sources
          };
        } else {
          // Hantera svar från en källa (baklängeskompatibilitet)
          aiResponse = {
            type: 'ai',
            originalText: response.originalText,
            summary: response.summary,
            source: response.source,
            sourceUrl: response.sourceUrl
          };
        }
        
        this.chatHistory.push(aiResponse);
      } catch (error) {
        console.error('Error fetching AI response:', error);
        this.chatHistory.push({
          type: 'error',
          text: 'Ett fel uppstod vid hämtning av svar. Försök igen senare.'
        });
      } finally {
        this.isLoading = false;
        this.$nextTick(() => {
          this.scrollToBottom();
        });
      }
    },
    
    /**
     * Fyller i en exempelfråga i inputfältet
     * @param {string} question - Exempelfrågan att fylla i
     */
    setExampleQuestion(question) {
      this.userInput = question;
      this.$nextTick(() => {
        this.$refs.inputField.focus();
      });
    },
    
    /**
     * Scrollar chattboxen till botten
     */
    scrollToBottom() {
      if (this.$refs.chatBox) {
        this.$refs.chatBox.scrollTop = this.$refs.chatBox.scrollHeight;
      }
    },
    
    /**
     * Sparar chatthistoriken i localStorage
     */
    saveChatHistory() {
      try {
        localStorage.setItem('pistolskytteChatHistory', JSON.stringify(this.chatHistory));
      } catch (error) {
        console.error('Kunde inte spara chatthistorik:', error);
      }
    },
    
    /**
     * Laddar chatthistoriken från localStorage
     */
    loadChatHistory() {
      try {
        const savedHistory = localStorage.getItem('pistolskytteChatHistory');
        if (savedHistory) {
          this.chatHistory = JSON.parse(savedHistory);
        }
      } catch (error) {
        console.error('Kunde inte ladda chatthistorik:', error);
      }
    },
    
    /**
     * Rensar chatthistoriken
     */
    clearChat() {
      this.chatHistory = [];
      localStorage.removeItem('pistolskytteChatHistory');
    }
  },
  watch: {
    // Spara chatthistoriken när den ändras
    chatHistory: {
      handler() {
        this.saveChatHistory();
      },
      deep: true
    }
  },
  mounted() {
    // Ladda chatthistoriken när komponenten monteras
    this.loadChatHistory();
  },
  updated() {
    this.scrollToBottom();
  }
}
</script>

<style scoped>
.chat-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  height: calc(100vh - 120px); /* Anpassa höjden för att passa i viewporten */
}

h1 {
  color: var(--primary-color);
  margin-bottom: 0.5rem;
  font-size: 1.8rem;
}

.chat-intro {
  margin-bottom: 0.75rem;
  color: var(--secondary-color);
  font-size: 0.95rem;
}

/* Källbadges */
.source-badges {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.source-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  background-color: rgba(var(--primary-color-rgb), 0.1);
  color: var(--primary-color);
  border-radius: 16px;
  font-size: 0.85rem;
  text-decoration: none;
  transition: all 0.2s ease;
}

.source-badge:hover {
  background-color: rgba(var(--primary-color-rgb), 0.2);
  transform: translateY(-1px);
}

/* Chattbox */
.chat-box {
  background-color: white;
  border-radius: 12px;
  padding: 1rem;
  flex: 1;
  overflow-y: auto;
  margin-bottom: 1rem;
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.08);
  scroll-behavior: smooth;
}

/* Tom chatt */
.empty-chat {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  color: #666;
}

.empty-chat-content {
  text-align: center;
  max-width: 400px;
}

.empty-chat-content svg {
  color: var(--primary-color);
  opacity: 0.7;
  margin-bottom: 1rem;
}

.example-questions {
  margin-top: 1.5rem;
}

.example-questions p {
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.example-btn {
  display: block;
  width: 100%;
  text-align: left;
  padding: 0.6rem 1rem;
  margin: 0.5rem 0;
  background-color: rgba(var(--primary-color-rgb), 0.05);
  color: var(--text-color);
  border: 1px solid rgba(var(--primary-color-rgb), 0.2);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: normal;
}

.example-btn:hover {
  background-color: rgba(var(--primary-color-rgb), 0.1);
  border-color: rgba(var(--primary-color-rgb), 0.3);
}

/* Meddelanden */
.message {
  margin-bottom: 1.25rem;
  border-radius: 12px;
  max-width: 85%;
  position: relative;
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.message-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.25rem;
  font-size: 0.85rem;
  color: #666;
}

.message-header svg {
  opacity: 0.7;
}

.user {
  margin-left: auto;
  background-color: rgba(var(--primary-color-rgb), 0.1);
  color: var(--text-color);
}

.ai {
  margin-right: auto;
  background-color: white;
  border: 1px solid #eaeaea;
  color: var(--text-color);
}

.error {
  margin-right: auto;
  background-color: #fff2f2;
  border: 1px solid #ffdddd;
  color: #d32f2f;
}

.error-message {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem;
}

.error-message svg {
  color: #d32f2f;
}

.message-content {
  padding: 0.75rem 1rem;
}

.user-message {
  font-weight: 500;
}

/* AI-meddelande */
.ai-message .summary {
  margin-bottom: 0.75rem;
  line-height: 1.5;
}

.ai-message .original-text {
  margin: 0.75rem 0;
  font-size: 0.9rem;
}

.ai-message .original-text details {
  border: 1px solid #eaeaea;
  border-radius: 8px;
  overflow: hidden;
}

.ai-message .original-text summary {
  padding: 0.5rem 0.75rem;
  background-color: #f9f9f9;
  cursor: pointer;
  font-weight: 500;
  user-select: none;
}

.ai-message .original-text summary:hover {
  background-color: #f5f5f5;
}

.ai-message .original-text .original-content {
  padding: 0.75rem;
  background-color: #fafafa;
  border-top: 1px solid #eaeaea;
  font-size: 0.9rem;
  line-height: 1.5;
}

.ai-message .source {
  margin-top: 0.75rem;
  font-size: 0.85rem;
  border-top: 1px solid #f0f0f0;
  padding-top: 0.75rem;
}

.consolidated-response {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.consolidated-summary {
  background-color: rgba(var(--primary-color-rgb), 0.05);
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
}

.consolidated-summary p {
  margin: 0;
  line-height: 1.6;
}

.original-sources {
  margin: 1rem 0;
}

.source-section {
  border-left: 3px solid var(--primary-color);
  padding-left: 1rem;
  margin-bottom: 1rem;
}

.source-title {
  font-size: 1.1rem;
  font-weight: 600;
  margin-top: 0;
  margin-bottom: 0.5rem;
  color: var(--primary-color);
}

.sources-footer {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #f0f0f0;
}

.sources-label {
  font-weight: 600;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
  color: #555;
}

.source-references {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-bottom: 0.5rem;
}

.source-reference {
  font-size: 0.85rem;
}

.source-note {
  margin-top: 0.5rem;
  font-style: italic;
  color: #888;
}

.source-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--primary-color);
  text-decoration: none;
  margin-bottom: 0.25rem;
}

.source-link:hover {
  text-decoration: underline;
}

.ai-message .source small {
  display: block;
  margin-top: 0.25rem;
  color: #888;
  font-style: italic;
}

/* Laddningsindikator */
.loading-indicator {
  display: flex;
  justify-content: center;
  margin: 1rem 0;
}

.dot {
  width: 8px;
  height: 8px;
  background-color: var(--primary-color);
  border-radius: 50%;
  margin: 0 4px;
  opacity: 0.7;
  animation: bounce 1.5s infinite ease-in-out;
}

.dot:nth-child(2) {
  animation-delay: 0.2s;
}

.dot:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes bounce {
  0%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-8px);
  }
}

/* Chattinput */
.chat-input {
  display: flex;
  gap: 0.5rem;
  position: relative;
  margin-bottom: 0.5rem;
}

textarea {
  flex: 1;
  padding: 0.85rem 1rem;
  border: 1px solid #ddd;
  border-radius: 12px;
  resize: none;
  font-family: inherit;
  font-size: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: border-color 0.3s, box-shadow 0.3s;
}

textarea:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 2px 12px rgba(var(--primary-color-rgb), 0.15);
}

.send-button {
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 50%;
  width: 48px;
  height: 48px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  align-self: flex-end;
  margin-bottom: 4px;
}

.send-button:hover:not(:disabled) {
  background-color: #3a7bc8;
  transform: translateY(-2px);
  box-shadow: 0 3px 10px rgba(var(--primary-color-rgb), 0.3);
}

.send-button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

/* Responsiv design */
@media (max-width: 768px) {
  .chat-container {
    padding: 0.75rem;
    height: calc(100vh - 100px);
  }
  
  h1 {
    font-size: 1.5rem;
    margin-bottom: 0.5rem;
  }
  
  .chat-intro {
    font-size: 0.9rem;
    margin-bottom: 0.5rem;
  }
  
  .message {
    max-width: 90%;
  }
  
  .chat-box {
    padding: 0.75rem;
  }
  
  .send-button {
    width: 42px;
    height: 42px;
  }
  
  .send-button svg {
    width: 18px;
    height: 18px;
  }
  
  textarea {
    padding: 0.75rem;
    font-size: 0.95rem;
  }
}

@media (max-width: 480px) {
  .chat-container {
    padding: 0.5rem;
  }
  
  .source-badges {
    gap: 0.3rem;
    margin-bottom: 0.75rem;
  }
  
  .source-badge {
    padding: 0.2rem 0.5rem;
    font-size: 0.75rem;
  }
  
  .message {
    max-width: 95%;
  }
  
  .message-content {
    padding: 0.6rem 0.75rem;
  }
  
  .ai-message .original-text summary {
    padding: 0.4rem 0.6rem;
  }
  
  .ai-message .original-text .original-content {
    padding: 0.6rem;
  }
}
</style>
