/**
 * Netlify Function för att tillhandahålla text från SÄKB
 * 
 * Notera: I en produktionsmiljö skulle vi använda en PDF-parser för att extrahera 
 * text från PDF-filen. För denna implementation använder vi förbearbetad text.
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
    console.log('Hämtar data från SÄKB...');
    
    // Förbearbetad text från SÄKB PDF
    // I en produktionsmiljö skulle denna text komma från en PDF-parser
    // eller lagras i en databas efter manuell bearbetning
    const sakbText = `
      SÄKB - Säkerhetsbestämmelser för civilt skytte
      
      1. Allmänna säkerhetsbestämmelser
      1.1 Grundläggande regler
      1.1.1 Betrakta alltid varje vapen som laddat.
      1.1.2 Rikta aldrig vapnet mot något som du inte avser att beskjuta.
      1.1.3 Håll fingret borta från avtryckaren till dess att du avser att avfyra skottet.
      
      1.2 Hantering av vapen och ammunition
      1.2.1 Det är förbjudet att hantera skjutvapen eller ammunition under påverkan av alkohol eller andra berusningsmedel. Skytt som uppenbart är påverkad av alkohol eller annat berusningsmedel ska avvisas från skjutbanan.
      1.2.2 Vapnet ska alltid hanteras med största försiktighet.
      
      2. Säkerhetsbestämmelser på skjutbanan
      2.1 Allmänna regler
      2.1.1 Skjutledaren ansvarar för säkerheten på skjutbanan.
      2.1.2 Alla skyttar ska följa skjutledarens anvisningar.
      
      3. Vapenhantering
      3.1 Laddning och plundring
      3.1.1 Laddning får endast ske på skjutplatsen efter kommando från skjutledaren.
      3.1.2 Vid plundring ska vapnet riktas i säker riktning.
      
      4. Särskilda bestämmelser för pistolskytte
      4.1 Pistol och revolver ska alltid bäras i hölster eller väska när den inte används för skjutning.
      4.2 Hölstrad pistol eller revolver ska vara oladdad och ha hanen nedfälld eller slagstiftet avspänt.
      4.3 Vid skjutning ska skytten befinna sig på anvisad plats och vapnet ska riktas i skjutriktningen.
      
      5. Åtgärder vid funktionsfel
      5.1 Vid klick eller annat funktionsfel ska vapnet hållas i skjutriktningen i minst 10 sekunder.
      5.2 Därefter ska skytten påkalla skjutledarens uppmärksamhet och invänta dennes instruktioner.
      
      6. Särskilda bestämmelser för tävlingar
      6.1 Vid tävlingar ska särskild säkerhetskontrollant utses.
      6.2 Säkerhetskontrollanten ska kontrollera att alla vapen är plundrade och säkra efter varje skjutlag.
    `;
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ text: sakbText })
    };
  } catch (error) {
    console.error('Fel vid hämtning av SÄKB:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Kunde inte hämta data från SÄKB',
        message: error.message
      })
    };
  }
};
