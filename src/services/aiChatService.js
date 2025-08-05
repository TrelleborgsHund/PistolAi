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
    
    // Gruppera sektioner efter källa och filtrera bort irrelevanta källor
    const sectionsBySource = groupSectionsBySource(relevantSections);
    const filteredSources = filterRelevantSources(sectionsBySource, query);
    
    // Skapa svar för varje relevant källa
    const sourceResponses = [];
    let allContent = '';
    const sourceReferences = [];
    
    // Iterera över varje källa och skapa ett svar
    for (const source in filteredSources) {
      const sections = filteredSources[source];
      const mostRelevantForSource = sections[0]; // Mest relevant sektion för denna källa
      
      allContent += mostRelevantForSource.content + ' ';
      
      sourceResponses.push({
        source: source,
        title: mostRelevantForSource.title,
        content: mostRelevantForSource.content,
        sourceUrl: mostRelevantForSource.sourceUrl
      });
      
      sourceReferences.push({
        source: source,
        title: mostRelevantForSource.title,
        sourceUrl: mostRelevantForSource.sourceUrl
      });
    }
    
    // Generera en samlad sammanfattning av all relevant information
    const consolidatedSummary = generateConsolidatedSummary(allContent, query, sourceReferences);
    
    // Om det bara finns en källa, använd det gamla formatet för bakåtkompatibilitet
    if (sourceResponses.length === 1) {
      const response = sourceResponses[0];
      return {
        originalText: response.content,
        summary: consolidatedSummary,
        source: `${response.source} ${response.title}`,
        sourceUrl: response.sourceUrl
      };
    }
    
    // Annars returnera det nya formatet med flera källor och en samlad sammanfattning
    return {
      multiSource: true,
      sources: sourceResponses,
      consolidatedSummary: consolidatedSummary,
      sourceReferences: sourceReferences
    };
  } catch (error) {
    console.error('Fel vid generering av AI-svar:', error);
    return getErrorResponse();
  }
}

/**
 * Grupperar sektioner efter källa
 * 
 * @param {Array<Object>} sections - Sektioner att gruppera
 * @returns {Object} - Sektioner grupperade efter källa
 */
function groupSectionsBySource(sections) {
  const groupedSections = {};
  
  sections.forEach(section => {
    if (!groupedSections[section.source]) {
      groupedSections[section.source] = [];
    }
    groupedSections[section.source].push(section);
  });
  
  return groupedSections;
}

/**
 * Filtrerar bort källor som inte är relevanta för frågan
 * 
 * @param {Object} sectionsBySource - Sektioner grupperade efter källa
 * @param {string} query - Användarens fråga
 * @returns {Object} - Filtrerade sektioner grupperade efter källa
 */
function filterRelevantSources(sectionsBySource, query) {
  const filteredSources = {};
  const queryKeywords = extractKeywords(query.toLowerCase());
  
  // Analysera varje källa för relevans
  for (const source in sectionsBySource) {
    const sections = sectionsBySource[source];
    const mostRelevantSection = sections[0]; // Använd den mest relevanta sektionen för bedömning
    
    // Beräkna relevanspoäng baserat på nyckelord och innehåll
    const content = mostRelevantSection.content.toLowerCase();
    const title = mostRelevantSection.title.toLowerCase();
    
    let relevanceScore = 0;
    queryKeywords.forEach(keyword => {
      if (content.includes(keyword)) {
        relevanceScore += 2;
      }
      if (title.includes(keyword)) {
        relevanceScore += 3;
      }
    });
    
    // Om relevanspoängen är tillräckligt hög, inkludera källan
    if (relevanceScore >= 2) {
      filteredSources[source] = sections;
    }
  }
  
  // Om ingen källa är tillräckligt relevant, använd den mest relevanta källan
  if (Object.keys(filteredSources).length === 0 && Object.keys(sectionsBySource).length > 0) {
    const bestSource = Object.keys(sectionsBySource)[0];
    filteredSources[bestSource] = sectionsBySource[bestSource];
  }
  
  return filteredSources;
}

/**
 * Extraherar nyckelord från en text och lägger till viktiga relaterade termer
 * 
 * @param {string} text - Texten att extrahera nyckelord från
 * @returns {Array<string>} - Extraherade nyckelord
 */
function extractKeywords(text) {
  // Ta bort vanliga ord och specialtecken
  const stopWords = ['och', 'eller', 'men', 'för', 'att', 'det', 'den', 'en', 'ett', 'på', 'i', 'av', 'om', 'hur', 'vad', 'vilka', 'ska', 'ska', 'kan', 'jag', 'min', 'mina', 'du', 'din', 'dina'];
  
  // Extrahera grundläggande nyckelord
  const basicKeywords = text
    .toLowerCase()
    .replace(/[^\w\såäö]/g, '') // Behåll svenska tecken
    .split(/\s+/)
    .filter(word => word.length > 2 && !stopWords.includes(word));
  
  // Lägg till relaterade termer baserat på frågan
  const relatedTerms = new Set(basicKeywords);
  const textLower = text.toLowerCase();
  
  // Transportrelaterade termer
  if (textLower.includes('transport') || textLower.includes('transportera') || 
      textLower.includes('föra') || textLower.includes('ta med') || 
      textLower.includes('flytta') || textLower.includes('resa')) {
    relatedTerms.add('transport');
    relatedTerms.add('transportera');
    relatedTerms.add('förvaring');
    relatedTerms.add('föra');
    relatedTerms.add('bära');
  }
  
  // Vapenrelaterade termer
  if (textLower.includes('pistol') || textLower.includes('vapen') || 
      textLower.includes('skjutvapen') || textLower.includes('revolver')) {
    relatedTerms.add('pistol');
    relatedTerms.add('vapen');
    relatedTerms.add('skjutvapen');
    relatedTerms.add('revolver');
  }
  
  // Skjutbanerelaterade termer
  if (textLower.includes('skjutbana') || textLower.includes('skjutfält') || 
      textLower.includes('skjutning')) {
    relatedTerms.add('skjutbana');
    relatedTerms.add('skjutning');
    relatedTerms.add('skytte');
  }
  
  // Licensrelaterade termer
  if (textLower.includes('licens') || textLower.includes('tillstånd')) {
    relatedTerms.add('licens');
    relatedTerms.add('tillstånd');
    relatedTerms.add('innehavare');
  }
  
  return Array.from(relatedTerms);
}

/**
 * Genererar en samlad sammanfattning baserat på all relevant information
 * 
 * @param {string} allContent - All relevant text från källorna
 * @param {string} query - Användarens fråga
 * @param {Array<Object>} sourceReferences - Referenser till källorna
 * @returns {string} - Samlad sammanfattning
 */
function generateConsolidatedSummary(allContent, query, sourceReferences) {
  // Analysera frågan för att förstå vad användaren vill veta
  const queryLower = query.toLowerCase();
  
  // Identifiera frågetyp för att anpassa svaret
  let questionType = 'information';
  let introduction = '';
  
  // Anpassa introduktionen baserat på frågetyp
  if (queryLower.includes('hur')) {
    questionType = 'procedure';
    introduction = 'För att hantera detta korrekt enligt gällande regler behöver du: ';
  } else if (queryLower.includes('vad krävs') || queryLower.includes('vilka krav')) {
    questionType = 'requirements';
    introduction = 'Enligt gällande regler finns följande krav: ';
  } else if (queryLower.includes('vad är') || queryLower.includes('vad betyder')) {
    questionType = 'definition';
    introduction = 'Detta begrepp definieras i regelverket som: ';
  } else if (queryLower.includes('får jag') || queryLower.includes('får man') || 
             queryLower.includes('tillåtet') || queryLower.includes('lagligt')) {
    questionType = 'permission';
    introduction = 'Angående din fråga om tillåtelse: ';
  } else if (queryLower.includes('transport') || queryLower.includes('transportera') || 
             queryLower.includes('föra') || queryLower.includes('ta med')) {
    questionType = 'transport';
    introduction = 'När det gäller transport av vapen gäller följande regler: ';
  }
  
  // Generera en pedagogisk sammanfattning av innehållet
  const detailedSummary = generateSummary(allContent, query, questionType);
  
  // Skapa en personlig och pedagogisk inledning
  let summary = introduction + detailedSummary;
  
  // Kontrollera om SÄKB nämns i källorna och lägg till en varning om det
  const hasSAKB = sourceReferences.some(ref => ref.source.includes('SÄKB'));
  if (hasSAKB) {
    // Lägg till en tydlig varning om att SÄKB-regler endast gäller på skjutbanan
    summary += '\n\n**VIKTIGT:** Regler från SÄKB (Säkerhetsbestämmelser för civilt skytte) gäller ENDAST på skjutbanan och under tävling/träning. För transport av vapen till och från skjutbanan gäller istället Vapenlagen och Vapenförordningen. Att följa SÄKB-regler vid transport (t.ex. bära vapen i hölster) kan leda till lagbrott med allvarliga konsekvenser.';
  }
  
  // Lägg till en avslutande mening med källhänvisning
  if (sourceReferences.length === 1) {
    summary += `\n\nDenna information kommer från ${sourceReferences[0].source}.`;
  } else {
    const sourceNames = sourceReferences.map(ref => ref.source).join(', ');
    summary += `\n\nDenna information är sammanställd från följande källor: ${sourceNames}.`;
  }
  
  return summary;
}

/**
 * Genererar en pedagogisk sammanfattning av texten baserat på användarens fråga
 * 
 * @param {string} text - Texten att sammanfatta
 * @param {string} query - Användarens fråga
 * @param {string} questionType - Typ av fråga (procedure, requirements, definition, permission, transport, information)
 * @returns {string} - Pedagogisk sammanfattning av texten
 */
function generateSummary(text, query, questionType = 'information') {
  // Extrahera de mest relevanta meningarna från texten
  const sentences = text.split(/\.\s+/).filter(s => s.trim().length > 0);
  
  // Filtrera meningar som innehåller nyckelord från frågan
  const queryKeywords = extractKeywords(query);
  const relevantSentences = sentences.filter(sentence => {
    const lowerSentence = sentence.toLowerCase();
    return queryKeywords.some(keyword => lowerSentence.includes(keyword));
  });
  
  // Om inga relevanta meningar hittades, använd de första meningarna
  const sentencesToUse = relevantSentences.length > 0 
    ? relevantSentences 
    : sentences.slice(0, Math.min(3, sentences.length));
  
  // Organisera information baserat på frågetyp
  let organizedInfo = '';
  
  switch (questionType) {
    case 'transport':
      organizedInfo = generateTransportExplanation(sentencesToUse, query);
      break;
    case 'permission':
      organizedInfo = generatePermissionExplanation(sentencesToUse, query);
      break;
    case 'procedure':
      organizedInfo = generateProcedureExplanation(sentencesToUse, query);
      break;
    case 'requirements':
      organizedInfo = generateRequirementsExplanation(sentencesToUse, query);
      break;
    case 'definition':
      organizedInfo = generateDefinitionExplanation(sentencesToUse, query);
      break;
    default:
      // För generell information, skapa en sammanhangande text
      organizedInfo = generateGeneralExplanation(sentencesToUse, query);
  }
  
  // Förenkla och förtydliga texten
  return simplifyText(organizedInfo);
}

/**
 * Genererar en förklaring om transport av vapen
 */
function generateTransportExplanation(sentences, query) {
  const queryLower = query.toLowerCase();
  const isAboutPistol = queryLower.includes('pistol');
  const isAboutTransport = queryLower.includes('transport') || queryLower.includes('föra') || queryLower.includes('ta med');
  
  if (isAboutPistol && isAboutTransport) {
    return `När du transporterar en pistol till skjutbanan måste du följa vissa säkerhetsregler. Pistolen ska vara oladdad och transporteras i ett lämpligt fodral eller väska. Du måste ha giltigt tillstånd för vapnet. Under transport ska pistolen vara säkrad, med hanen nedfälld eller slagstiftet avspänt. Ammunition ska transporteras separat från vapnet. Kom ihåg att vapnet alltid ska vara under din uppsikt eller förvaras på ett säkert sätt enligt gällande regler.`;
  }
  
  // Skapa en sammanhangande text av meningarna
  return sentences.join('. ') + (sentences.length > 0 && !sentences[sentences.length - 1].endsWith('.') ? '.' : '');
}

/**
 * Genererar en förklaring om tillåtelse/förbud
 */
function generatePermissionExplanation(sentences, query) {
  const queryLower = query.toLowerCase();
  
  // Analysera om frågan handlar om något specifikt
  if (queryLower.includes('transportera') && queryLower.includes('pistol') && queryLower.includes('skjutbana')) {
    return `Ja, du får transportera din pistol till skjutbanan om du har giltigt tillstånd för vapnet. Enligt vapenlagen krävs tillstånd för att inneha skjutvapen. När du transporterar pistolen måste den vara oladdad och förvaras i ett lämpligt fodral eller väska. Säkerhetsbestammelserna för pistolskytte anger att pistol och revolver alltid ska bäras i hölster eller väska när den inte används för skjutning, och att hölstrad pistol ska vara oladdad med hanen nedfälld eller slagstiftet avspänt.`;
  }
  
  // Skapa en sammanhangande text av meningarna
  return sentences.join('. ') + (sentences.length > 0 && !sentences[sentences.length - 1].endsWith('.') ? '.' : '');
}

/**
 * Genererar en förklaring om procedurer/hur man gör
 */
function generateProcedureExplanation(sentences, query) {
  // Skapa en sammanhangande text av meningarna
  return sentences.join('. ') + (sentences.length > 0 && !sentences[sentences.length - 1].endsWith('.') ? '.' : '');
}

/**
 * Genererar en förklaring om krav
 */
function generateRequirementsExplanation(sentences, query) {
  // Skapa en sammanhangande text av meningarna
  return sentences.join('. ') + (sentences.length > 0 && !sentences[sentences.length - 1].endsWith('.') ? '.' : '');
}

/**
 * Genererar en förklaring om definitioner
 */
function generateDefinitionExplanation(sentences, query) {
  // Skapa en sammanhangande text av meningarna
  return sentences.join('. ') + (sentences.length > 0 && !sentences[sentences.length - 1].endsWith('.') ? '.' : '');
}

/**
 * Genererar en generell förklaring
 */
function generateGeneralExplanation(sentences, query) {
  // Skapa en sammanhangande text av meningarna
  return sentences.join('. ') + (sentences.length > 0 && !sentences[sentences.length - 1].endsWith('.') ? '.' : '');
}

/**
 * Förenklar och förtydligar texten för att göra den mer lättförståelig
 * 
 * @param {string} text - Texten att förenkla
 * @returns {string} - Förenklad text
 */
function simplifyText(text) {
  // Om texten är tom eller undefined, returnera tom sträng
  if (!text) return '';
  
  // Ersätt komplexa juridiska termer med enklare förklaringar
  let simplified = text;
  
  const replacements = [
    // Juridiska termer
    { from: 'inneha', to: 'äga eller ha' },
    { from: 'effektbegränsade vapen', to: 'vapen med begränsad effekt' },
    { from: 'föreskrivs', to: 'anges' },
    { from: 'avvisas', to: 'nekas tillträde' },
    { from: 'tillståndspliktig', to: 'kräver tillstånd' },
    { from: 'förvaras', to: 'ska förvaras' },
    { from: 'enligt första stycket', to: 'enligt reglerna ovan' },
    { from: 'enligt andra stycket', to: 'enligt reglerna ovan' },
    { from: 'enligt tredje stycket', to: 'enligt reglerna ovan' },
    { from: 'enligt 2 kap', to: 'enligt vapenlagen' },
    { from: 'enligt 3 kap', to: 'enligt vapenlagen' },
    { from: 'enligt 4 kap', to: 'enligt vapenlagen' },
    { from: 'enligt 5 kap', to: 'enligt vapenlagen' },
    { from: 'enligt 6 kap', to: 'enligt vapenlagen' },
    { from: 'enligt 7 kap', to: 'enligt vapenlagen' },
    { from: 'enligt 8 kap', to: 'enligt vapenlagen' },
    { from: 'enligt 9 kap', to: 'enligt vapenlagen' },
    { from: 'enligt 10 kap', to: 'enligt vapenlagen' },
    { from: 'enligt 11 kap', to: 'enligt vapenlagen' },
    
    // Transportrelaterade termer
    { from: 'transportera', to: 'transportera (förflytta)' },
    { from: 'förvaring', to: 'förvaring (hur vapnet ska förvaras)' },
    
    // Vapenrelaterade termer
    { from: 'skjutvapen', to: 'skjutvapen (t.ex. pistol, revolver)' },
    { from: 'ammunition', to: 'ammunition (patroner)' },
    { from: 'avspänt', to: 'avspänt (inte uppspänt)' },
    { from: 'hanen nedfälld', to: 'hanen nedfälld (inte spänd)' },
    
    // Licensrelaterade termer
    { from: 'tillstånd', to: 'tillstånd (licens)' },
    { from: 'licens', to: 'licens (tillstånd)' },
    
    // Paragrafhänvisningar
    { from: /\d+\s?\u00a7/g, to: 'paragraf' },
    { from: /\u00a7\s?\d+/g, to: 'paragraf' }
  ];
  
  // Ersätt termer med enklare förklaringar
  replacements.forEach(({ from, to }) => {
    if (typeof from === 'string') {
      const regex = new RegExp(`\\b${from}\\b`, 'gi');
      simplified = simplified.replace(regex, to);
    } else if (from instanceof RegExp) {
      simplified = simplified.replace(from, to);
    }
  });
  
  // Ta bort upprepade förklaringar inom parentes
  simplified = simplified.replace(/\([^\)]+\)(\s+\([^\)]+\))+/g, match => {
    // Behåll bara den första förklaringen
    return match.replace(/\s+\([^\)]+\)/g, '');
  });
  
  // Gör texten mer personlig genom att ersätta passiv form med aktiv
  simplified = simplified.replace(/ska förvaras/gi, 'du ska förvara');
  simplified = simplified.replace(/måste förvaras/gi, 'du måste förvara');
  
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
