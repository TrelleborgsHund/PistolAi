const axios = require('axios');
const cheerio = require('cheerio');

/**
 * Netlify Function för att hämta och bearbeta text från Vapenlagen
 * 
 * @param {Object} event - Netlify Functions event object
 * @returns {Object} - HTTP response object
 */
exports.handler = async function(event, context) {
  // Lägg till CORS-headers för utveckling
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };
  
  // Hantera preflight OPTIONS-förfrågan
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }
  
  try {
    console.log('Hämtar data från Vapenlag...');
    
    const response = await axios.get('https://www.riksdagen.se/sv/dokument-lagar/dokument/svensk-forfattningssamling/vapenlag-199667_sfs-1996-67');
    const $ = cheerio.load(response.data);
    
    // Extrahera den relevanta texten från sidan
    const lawText = $('.main-content').text();
    
    // Bearbeta och formatera texten
    const processedText = processLawText(lawText);
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ text: processedText })
    };
  } catch (error) {
    console.error('Fel vid hämtning av Vapenlag:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
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
  // Rensa bort onödiga whitespace och formatera texten
  let processed = text.replace(/\s+/g, ' ').trim();
  
  // Ta bort eventuella headers, footers och andra irrelevanta delar
  // Detta är en förenklad version - i en verklig implementation skulle vi
  // behöva mer sofistikerad bearbetning
  
  return processed;
}
