/**
 * AI Data Integration Service
 * 
 * Denna tjänst integrerar datakällorna med AI-chattfunktionen.
 * Den förbereder data från källorna för användning i AI-modellen och
 * hanterar sökning i datakällorna baserat på användarfrågor.
 */

import { fetchVapenlag, fetchVapenforordning, fetchSAKB } from './dataSourceService';

// Cachad bearbetad data
let processedData = null;

/**
 * Förbereder och indexerar all data från källorna
 * 
 * @returns {Promise<Object>} - Löfte som resolvas med bearbetad data
 */
export async function prepareData() {
  if (processedData) {
    return processedData;
  }
  
  try {
    // Hämta data från alla källor
    const vapenlagText = await fetchVapenlag();
    const vapenforordningText = await fetchVapenforordning();
    const sakbText = await fetchSAKB();
    
    // Dela upp texten i sektioner för bättre sökning
    const vapenlagSections = splitIntoSections(vapenlagText, 'Vapenlag');
    const vapenforordningSections = splitIntoSections(vapenforordningText, 'Vapenförordning');
    const sakbSections = splitIntoSections(sakbText, 'SÄKB');
    
    // Kombinera alla sektioner till en indexerad datastruktur
    const allSections = [
      ...vapenlagSections,
      ...vapenforordningSections,
      ...sakbSections
    ];
    
    // Indexera sektionerna för snabbare sökning
    // I en verklig implementation skulle vi använda en mer avancerad indexeringsmetod
    // som t.ex. en inverterad index eller vektordatabas
    const indexedData = createSimpleIndex(allSections);
    
    processedData = {
      sections: allSections,
      index: indexedData
    };
    
    return processedData;
  } catch (error) {
    console.error('Fel vid förberedelse av data:', error);
    throw new Error('Kunde inte förbereda data för AI-modellen');
  }
}

/**
 * Delar upp text i mindre sektioner för bättre sökning
 * 
 * @param {string} text - Text att dela upp
 * @param {string} source - Källans namn
 * @returns {Array<Object>} - Array med sektioner
 */
function splitIntoSections(text, source) {
  // Detta är en förenklad implementation
  // I en verklig implementation skulle vi använda mer avancerad textanalys
  // för att identifiera meningsfulla sektioner baserat på struktur
  
  // Dela upp texten i stycken
  const paragraphs = text.split(/\n\s*\n/);
  
  // Skapa sektioner av styckena
  return paragraphs.map((paragraph, index) => {
    // Försök identifiera en rubrik eller sektion
    const titleMatch = paragraph.match(/^(\d+(\.\d+)*\s+[A-ZÅÄÖ].*?)$/m);
    const title = titleMatch ? titleMatch[1].trim() : `Sektion ${index + 1}`;
    
    return {
      id: `${source.toLowerCase()}-${index}`,
      source: source,
      title: title,
      content: paragraph.trim(),
      sourceUrl: getSourceUrl(source)
    };
  }).filter(section => section.content.length > 10); // Filtrera bort tomma sektioner
}

/**
 * Skapar ett enkelt sökindex för sektionerna
 * 
 * @param {Array<Object>} sections - Sektioner att indexera
 * @returns {Object} - Enkelt sökindex
 */
function createSimpleIndex(sections) {
  const index = {};
  
  // För varje sektion, extrahera nyckelord och lägg till i indexet
  sections.forEach(section => {
    // Extrahera ord från innehållet
    const words = section.content.toLowerCase()
      .replace(/[.,;:!?()\[\]{}'"]/g, '')
      .split(/\s+/)
      .filter(word => word.length > 2); // Filtrera bort korta ord
    
    // Lägg till varje ord i indexet
    words.forEach(word => {
      if (!index[word]) {
        index[word] = [];
      }
      
      // Undvik dubbletter
      if (!index[word].includes(section.id)) {
        index[word].push(section.id);
      }
    });
  });
  
  return index;
}

/**
 * Returnerar URL för en given källa
 * 
 * @param {string} source - Källans namn
 * @returns {string} - Källans URL
 */
function getSourceUrl(source) {
  switch (source) {
    case 'Vapenlag':
      return 'https://www.riksdagen.se/sv/dokument-lagar/dokument/svensk-forfattningssamling/vapenlag-199667_sfs-1996-67';
    case 'Vapenförordning':
      return 'https://www.riksdagen.se/sv/dokument-lagar/dokument/svensk-forfattningssamling/vapenforordning-199670_sfs-1996-70';
    case 'SÄKB':
      return 'https://www.skyttesport.se/media/es2ejinw/saekb_2020.pdf';
    default:
      return '';
  }
}

/**
 * Söker i datakällorna efter relevant information baserat på en fråga
 * 
 * @param {string} query - Användarens fråga
 * @returns {Promise<Array<Object>>} - Löfte som resolvas med relevanta sektioner
 */
export async function searchSources(query) {
  try {
    // Förbereda data om det inte redan är gjort
    const data = await prepareData();
    
    // Extrahera nyckelord från frågan
    const keywords = extractKeywords(query);
    
    // Hitta relevanta sektioner baserat på nyckelorden
    const relevantSectionIds = findRelevantSections(keywords, data.index);
    
    // Hämta de faktiska sektionerna
    const relevantSections = relevantSectionIds.map(id => 
      data.sections.find(section => section.id === id)
    ).filter(Boolean);
    
    // Sortera sektionerna efter relevans (enkel implementation)
    return rankSectionsByRelevance(relevantSections, keywords);
  } catch (error) {
    console.error('Fel vid sökning i källor:', error);
    throw new Error('Kunde inte söka i datakällorna');
  }
}

/**
 * Extraherar nyckelord från en fråga
 * 
 * @param {string} query - Användarens fråga
 * @returns {Array<string>} - Extraherade nyckelord
 */
function extractKeywords(query) {
  // Detta är en förenklad implementation
  // I en verklig implementation skulle vi använda NLP-tekniker för att
  // extrahera meningsfulla nyckelord och entiteter
  
  return query.toLowerCase()
    .replace(/[.,;:!?()\[\]{}'"]/g, '')
    .split(/\s+/)
    .filter(word => 
      word.length > 3 && 
      !['och', 'eller', 'men', 'som', 'att', 'det', 'den', 'för', 'med'].includes(word)
    );
}

/**
 * Hittar relevanta sektioner baserat på nyckelord
 * 
 * @param {Array<string>} keywords - Nyckelord att söka efter
 * @param {Object} index - Sökindex
 * @returns {Array<string>} - ID:n för relevanta sektioner
 */
function findRelevantSections(keywords, index) {
  // Samla sektioner som matchar nyckelorden
  const matchingSections = {};
  
  keywords.forEach(keyword => {
    // Sök efter exakta matchningar
    if (index[keyword]) {
      index[keyword].forEach(sectionId => {
        if (!matchingSections[sectionId]) {
          matchingSections[sectionId] = 0;
        }
        matchingSections[sectionId] += 1;
      });
    }
    
    // Sök efter delvisa matchningar (prefix)
    Object.keys(index).forEach(indexedWord => {
      if (indexedWord.startsWith(keyword) && keyword !== indexedWord) {
        index[indexedWord].forEach(sectionId => {
          if (!matchingSections[sectionId]) {
            matchingSections[sectionId] = 0;
          }
          matchingSections[sectionId] += 0.5; // Lägre vikt för delvisa matchningar
        });
      }
    });
  });
  
  // Konvertera till array och sortera efter antal matchningar
  return Object.entries(matchingSections)
    .sort((a, b) => b[1] - a[1])
    .map(entry => entry[0]);
}

/**
 * Rangordnar sektioner efter relevans för frågan
 * 
 * @param {Array<Object>} sections - Sektioner att rangordna
 * @param {Array<string>} keywords - Nyckelord från frågan
 * @returns {Array<Object>} - Rangordnade sektioner
 */
function rankSectionsByRelevance(sections, keywords) {
  // Beräkna en enkel relevanspoäng för varje sektion
  return sections.map(section => {
    const content = section.content.toLowerCase();
    
    // Beräkna hur många av nyckelorden som finns i sektionen
    const keywordMatches = keywords.filter(keyword => content.includes(keyword)).length;
    
    // Beräkna relevanspoäng baserat på antal matchningar och deras position
    let relevanceScore = keywordMatches / keywords.length;
    
    // Ge högre poäng om nyckelorden förekommer tidigt i texten
    keywords.forEach(keyword => {
      const position = content.indexOf(keyword);
      if (position !== -1 && position < content.length / 3) {
        relevanceScore += 0.1;
      }
    });
    
    return {
      ...section,
      relevanceScore
    };
  })
  .sort((a, b) => b.relevanceScore - a.relevanceScore)
  .slice(0, 5); // Begränsa till de 5 mest relevanta sektionerna
}
