const axios = require('axios');
const cheerio = require('cheerio');

/**
 * Netlify Function för att hämta och bearbeta text från Vapenlagen
 * 
 * @param {Object} event - Netlify Functions event object
 * @returns {Object} - HTTP response object
 */
exports.handler = async function(event, context) {
  // Lägg till CORS-headers för alla miljöer
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };
  
  // Hantera preflight OPTIONS-förfrågan
  if (event.httpMethod === 'OPTIONS') {
    console.log('Hanterar OPTIONS-förfrågan för Vapenlag');
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }
  
  try {
    console.log('Hämtar data från Vapenlag...');
    
    // Sätt timeout för att undvika långa väntetider
    const response = await axios.get(
      'https://www.riksdagen.se/sv/dokument-lagar/dokument/svensk-forfattningssamling/vapenlag-199667_sfs-1996-67',
      { timeout: 10000 } // 10 sekunder timeout
    );
    
    if (!response.data) {
      throw new Error('Inget svar från riksdagen.se');
    }
    
    const $ = cheerio.load(response.data);
    
    // Extrahera den relevanta texten från sidan
    const lawText = $('.main-content').text();
    
    if (!lawText || lawText.trim() === '') {
      throw new Error('Kunde inte hitta lagtext på sidan');
    }
    
    // Bearbeta och formatera texten
    const processedText = processLawText(lawText);
    console.log('Vapenlag hämtad och bearbetad framgångsrikt');
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ text: processedText, source: 'vapenlag' })
    };
  } catch (error) {
    console.error('Fel vid hämtning av Vapenlag:', error.message);
    console.error('Stack:', error.stack);
    
    // Returnera ett mer informativt felmeddelande
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: `Fel vid hämtning av Vapenlag: ${error.message}`,
        source: 'vapenlag',
        error: 'Kunde inte hämta data från Vapenlag',
        message: error.message
      })
    };
  }
};

/**
 * Hjälpfunktion för att bearbeta lagtext
 * 
 * @param {string} text - Rå lagtext
 * @returns {string} - Bearbetad och formaterad text
 */
function processLawText(text) {
  if (!text) return '';
  
  // Rensa bort onödiga whitespace och formatera texten
  let processed = text.replace(/\s+/g, ' ').trim();
  
  // Ta bort eventuella headers, footers och andra irrelevanta delar
  // Detta är en förenklad version - i en verklig implementation skulle vi
  // behöva mer sofistikerad bearbetning
  
  // Lägg till tydlig identifiering av källan
  processed = `Vapenlag (1996:67)\n\n${processed}`;
  
  return processed;
}
