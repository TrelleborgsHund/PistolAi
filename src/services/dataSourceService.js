/**
 * Data Source Service
 * 
 * Denna tjänst hanterar hämtning och bearbetning av data från specificerade källor:
 * - Vapenförordning (1996:70)
 * - Vapenlag (1996:67)
 * - SÄKB (Säkerhetsbestämmelser för civilt skytte)
 *
 * I utvecklingsmiljö används simulerad data.
 * I produktionsmiljö används Netlify Functions för att skrapa data från källorna.
 */

import axios from 'axios';

// API-endpoints för Netlify Functions
const API_BASE_URL = '/api';

// API-källor
const API_SOURCES = {
  VAPENLAG: `${API_BASE_URL}/vapenlag`,
  VAPENFORORDNING: `${API_BASE_URL}/vapenforordning`,
  SAKB: `${API_BASE_URL}/sakb`
};

// Källornas ursprungliga URL:er (för referens)
const ORIGINAL_SOURCES = {
  VAPENLAG: 'https://www.riksdagen.se/sv/dokument-lagar/dokument/svensk-forfattningssamling/vapenlag-199667_sfs-1996-67',
  VAPENFORORDNING: 'https://www.riksdagen.se/sv/dokument-lagar/dokument/svensk-forfattningssamling/vapenforordning-199670_sfs-1996-70',
  SAKB: 'https://www.skyttesport.se/media/es2ejinw/saekb_2020.pdf'
};

// Cachad data
let cachedData = {
  vapenlag: null,
  vapenforordning: null,
  sakb: null
};

/**
 * Hämtar och bearbetar text från Vapenlagen
 * 
 * @returns {Promise<string>} - Löfte som resolvas med bearbetad text
 */
export async function fetchVapenlag() {
  if (cachedData.vapenlag) {
    return cachedData.vapenlag;
  }
  
  try {
    // Försök hämta data från Netlify Function API
    try {
      console.log('Hämtar Vapenlag från API...');
      const response = await axios.get(API_SOURCES.VAPENLAG);
      const processedText = response.data.text;
      
      // Cacha resultatet
      cachedData.vapenlag = processedText;
      
      return processedText;
    } catch (apiError) {
      console.warn('Kunde inte hämta Vapenlag från API, använder simulerad data:', apiError.message);
      
      // Fallback till simulerad data om API-anropet misslyckas
      const vapenlagText = `
        Vapenlag (1996:67)
        
        1 kap. Lagens tillämpningsområde
        
        1 § Denna lag gäller skjutvapen och ammunition samt vissa föremål som i lagen jämställs med skjutvapen.
        
        2 § Med skjutvapen förstås i denna lag vapen med vilka kulor, hagel, harpuner eller andra projektiler kan skjutas ut med hjälp av krutladdningar, kolsyreladdningar, komprimerad luft eller andra liknande utskjutningsmedel.
        
        2 kap. Tillstånd och registrering
        
        1 § Tillstånd krävs för att
        a) inneha skjutvapen eller ammunition,
        b) driva handel med skjutvapen,
        c) yrkesmässigt ta emot skjutvapen för reparation eller översyn, eller
        d) föra in skjutvapen eller ammunition till Sverige.
        
        5 § Tillstånd att inneha skjutvapen får meddelas
        1. enskilda personer,
        2. sammanslutningar för jakt- eller målskytte, som uppfyller höga krav på säkerhet i fråga om handhavande av vapen och som har en stabil organisation och kontinuerlig skytteverksamhet, samt
        3. huvudmän för museer, om museet får statsbidrag enligt särskilda föreskrifter eller om museet ägs av en kommun, ett landsting eller en stiftelse som står under länsstyrelsens tillsyn.
        
        6 § Tillstånd att inneha helautomatiska vapen eller enhandsvapen får meddelas endast om det finns synnerliga skäl. Detta gäller dock inte start- eller signalvapen.
      `;
      
      // Cacha resultatet
      cachedData.vapenlag = vapenlagText;
      
      return vapenlagText;
    }
  } catch (error) {
    console.error('Fel vid hämtning av Vapenlag:', error);
    throw new Error('Kunde inte hämta data från Vapenlag');
  }
}

/**
 * Hämtar och bearbetar text från Vapenförordningen
 * 
 * @returns {Promise<string>} - Löfte som resolvas med bearbetad text
 */
export async function fetchVapenforordning() {
  if (cachedData.vapenforordning) {
    return cachedData.vapenforordning;
  }
  
  try {
    // Försök hämta data från Netlify Function API
    try {
      console.log('Hämtar Vapenförordning från API...');
      const response = await axios.get(API_SOURCES.VAPENFORORDNING);
      const processedText = response.data.text;
      
      // Cacha resultatet
      cachedData.vapenforordning = processedText;
      
      return processedText;
    } catch (apiError) {
      console.warn('Kunde inte hämta Vapenförordning från API, använder simulerad data:', apiError.message);
      
      // Fallback till simulerad data om API-anropet misslyckas
      const vapenforordningText = `
        Vapenförordning (1996:70)
        
        1 kap. Definitioner
        
        1 § De uttryck och benämningar som används i vapenlagen (1996:67) har samma betydelse i denna förordning.
        
        2 kap. Undantag från tillståndsplikten
        
        1 § Tillstånd enligt 2 kap. 1 § vapenlagen (1996:67) att inneha skjutvapen eller ammunition krävs inte för
        1. statschefen,
        2. den som för statligt museum eller stiftelse som står under tillsyn av en statlig myndighet vill inneha skjutvapen, om vapnet är avsett för samling och inte för skjutning,
        3. den som innehar start- eller signalvapen laddat med patroner som inte innehåller projektiler,
        4. den som har lånat ett skjutvapen med stöd av bestämmelserna i 3 kap. vapenlagen, eller
        5. utländsk företrädare vid statsbesök eller liknande.
        
        3 kap. Tillstånd att inneha skjutvapen
        
        1 § Vid prövning av om tillstånd att inneha helautomatiska vapen eller enhandsvapen för flerskott ska meddelas för målskytte, ska särskilt beaktas sökandens dokumenterade aktivitet som målskytt.
        
        2 § Den som ansöker om tillstånd att inneha skjutvapen ska, om inte ansökan uteslutande avser annat ändamål än skjutning, ha avlagt prov som visar att han eller hon kan handha vapen av det slag som ansökan avser.
      `;
      
      // Cacha resultatet
      cachedData.vapenforordning = vapenforordningText;
      
      return vapenforordningText;
    }
  } catch (error) {
    console.error('Fel vid hämtning av Vapenförordning:', error);
    throw new Error('Kunde inte hämta data från Vapenförordning');
  }
}

/**
 * Hämtar och bearbetar text från SÄKB-dokumentet
 * 
 * @returns {Promise<string>} - Löfte som resolvas med bearbetad text
 */
export async function fetchSAKB() {
  if (cachedData.sakb) {
    return cachedData.sakb;
  }
  
  try {
    // Försök hämta data från Netlify Function API
    try {
      console.log('Hämtar SÄKB från API...');
      const response = await axios.get(API_SOURCES.SAKB);
      const processedText = response.data.text;
      
      // Cacha resultatet
      cachedData.sakb = processedText;
      
      return processedText;
    } catch (apiError) {
      console.warn('Kunde inte hämta SÄKB från API, använder simulerad data:', apiError.message);
      
      // Fallback till simulerad data om API-anropet misslyckas
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
      `;
      
      // Cacha resultatet
      cachedData.sakb = sakbText;
      
      return sakbText;
    }
  } catch (error) {
    console.error('Fel vid hämtning av SÄKB:', error);
    throw new Error('Kunde inte hämta data från SÄKB');
  }
}

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

/**
 * Hämtar all data från alla källor
 * 
 * @returns {Promise<Object>} - Löfte som resolvas med all data
 */
export async function fetchAllSources() {
  try {
    const [vapenlag, vapenforordning, sakb] = await Promise.all([
      fetchVapenlag(),
      fetchVapenforordning(),
      fetchSAKB()
    ]);
    
    return {
      vapenlag,
      vapenforordning,
      sakb
    };
  } catch (error) {
    console.error('Fel vid hämtning av alla källor:', error);
    throw new Error('Kunde inte hämta data från alla källor');
  }
}
