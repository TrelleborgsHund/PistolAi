/**
 * AI Chat Service
 * 
 * Denna tjänst hanterar kommunikation med AI-backend för chattfunktionen.
 * Den integrerar med dataintegrationstjänsten för att hämta relevant information
 * från de specificerade källorna och generera meningsfulla svar.
 */

import { searchSources } from './aiDataIntegrationService';

/**
 * Genererar ett svar från AI-chatten baserat på användarens fråga
 * 
 * @param {string} query - Användarens fråga
 * @returns {Promise<Object>} - Ett löfte som resolvas med AI-svaret
 */
export async function getAIResponse(query) {
  try {
    // Simulerar nätverksfördröjning för att ge en mer realistisk upplevelse
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Sök efter relevant information i källorna
    const relevantSections = await searchSources(query);
    
    // Om inga relevanta sektioner hittades, returnera ett standardsvar
    if (!relevantSections || relevantSections.length === 0) {
      return getDefaultResponse();
    }
    
    // Använd den mest relevanta sektionen för svaret
    const mostRelevant = relevantSections[0];
    
    // Generera en sammanfattning av den relevanta texten
    const summary = generateSummary(mostRelevant.content, query);
    
    return {
      originalText: mostRelevant.content,
      summary: summary,
      source: `${mostRelevant.source} ${mostRelevant.title}`,
      sourceUrl: mostRelevant.sourceUrl
    };
  } catch (error) {
    console.error('Fel vid generering av AI-svar:', error);
    return getErrorResponse();
  }
}

/**
 * Genererar en sammanfattning av texten baserat på användarens fråga
 * 
 * @param {string} text - Texten att sammanfatta
 * @param {string} query - Användarens fråga
 * @returns {string} - Sammanfattning av texten
 */
function generateSummary(text, query) {
  // Detta är en förenklad implementation av sammanfattning
  // I en verklig implementation skulle vi använda en AI-modell för att generera sammanfattningen
  
  // Extrahera de mest relevanta meningarna från texten
  const sentences = text.split(/\.\s+/);
  
  // Filtrera meningar som innehåller nyckelord från frågan
  const keywords = query.toLowerCase().split(/\s+/);
  const relevantSentences = sentences.filter(sentence => {
    const lowerSentence = sentence.toLowerCase();
    return keywords.some(keyword => lowerSentence.includes(keyword));
  });
  
  // Om inga relevanta meningar hittades, använd de första meningarna
  const sentencesToUse = relevantSentences.length > 0 
    ? relevantSentences 
    : sentences.slice(0, Math.min(3, sentences.length));
  
  // Kombinera meningarna till en sammanfattning
  let summary = sentencesToUse.join('. ');
  
  // Lägg till punkt om det behövs
  if (summary && !summary.endsWith('.')) {
    summary += '.';
  }
  
  // Förenkla och förtydliga texten (simulerad AI-bearbetning)
  summary = simplifyText(summary);
  
  return summary;
}

/**
 * Förenklar och förtydligar texten för att göra den mer lättförståelig
 * 
 * @param {string} text - Texten att förenkla
 * @returns {string} - Förenklad text
 */
function simplifyText(text) {
  // Detta är en förenklad implementation
  // I en verklig implementation skulle vi använda en AI-modell för detta
  
  // Exempel på enkel bearbetning
  let simplified = text;
  
  // Ersätt komplexa juridiska termer med enklare förklaringar
  const replacements = [
    { from: 'inneha', to: 'äga eller ha' },
    { from: 'effektbegränsade vapen', to: 'vapen med begränsad effekt' },
    { from: 'föreskrivs', to: 'anges' },
    { from: 'avvisas', to: 'nekas tillträde' }
  ];
  
  replacements.forEach(({ from, to }) => {
    const regex = new RegExp(`\\b${from}\\b`, 'gi');
    simplified = simplified.replace(regex, to);
  });
  
  return simplified;
}

/**
 * Returnerar ett standardsvar när ingen relevant information hittas
 * 
 * @returns {Object} - Standardsvar
 */
function getDefaultResponse() {
  return {
    originalText: "Jag kunde inte hitta specifik information om detta i de tillgängliga källorna. För mer detaljerad information, vänligen konsultera direkt med Vapenlag (1996:67), Vapenförordning (1996:70) eller SÄKB.",
    summary: "Din fråga berör ett område som inte täcks specifikt i de källor jag har tillgång till. För mer information, rekommenderar jag att du läser direkt i källdokumenten eller kontaktar en expert inom området.",
    source: "Ingen specifik källa hittad",
    sourceUrl: "https://www.riksdagen.se/sv/dokument-lagar/dokument/svensk-forfattningssamling/vapenlag-199667_sfs-1996-67"
  };
}

/**
 * Returnerar ett felmeddelande när något går fel
 * 
 * @returns {Object} - Felmeddelande
 */
function getErrorResponse() {
  return {
    originalText: "Ett fel uppstod vid hämtning av information. Vänligen försök igen senare.",
    summary: "Tyvärr kunde jag inte bearbeta din fråga just nu på grund av ett tekniskt problem. Försök gärna igen om en stund.",
    source: "Fel vid informationshämtning",
    sourceUrl: ""
  };
}

/**
 * Huvudfunktion för att anropa AI-chattfunktionen
 * 
 * @param {string} query - Användarens fråga
 * @returns {Promise<Object>} - Ett löfte som resolvas med AI-svaret
 */
export async function queryAIBackend(query) {
  return getAIResponse(query);
}
