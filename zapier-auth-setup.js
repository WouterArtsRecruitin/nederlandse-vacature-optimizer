// 🔐 ZAPIER AUTHENTICATION SETUP
// Voor directe API toegang tot je Zapier account

const setupZapierAuth = {
  
  // OPTIE 1: API Key Method
  apiKey: {
    description: "Meest veilige methode voor API toegang",
    steps: [
      "1. Ga naar https://developer.zapier.com/",
      "2. Login met je Zapier account",
      "3. Ga naar 'API Keys' sectie",
      "4. Klik 'Create API Key'",
      "5. Copy de gegenereerde key",
      "6. Plak hier voor directe configuratie"
    ],
    permissions: [
      "Read/Write Zaps",
      "Create new Zaps", 
      "Test Zap steps",
      "Publish Zaps"
    ]
  },
  
  // OPTIE 2: OAuth Flow
  oauth: {
    description: "Veilige OAuth authenticatie",
    redirect_uri: "https://kandidatentekort.nl/zapier-callback",
    scopes: ["zap:write", "zap:read", "zap:test"],
    setup_url: "https://zapier.com/oauth/authorize?client_id=YOUR_CLIENT_ID&redirect_uri=https://kandidatentekort.nl/zapier-callback&response_type=code&scope=zap:write"
  },
  
  // OPTIE 3: Temporary Access Token
  tempToken: {
    description: "Tijdelijke token voor eenmalige setup",
    validity: "24 hours",
    instructions: [
      "1. Ga naar je Zapier account settings",
      "2. Developer settings → API Keys", 
      "3. Generate temporary token",
      "4. Deel token hier"
    ]
  }
};

// Test functie voor API toegang
async function testZapierAccess(apiKey) {
  const response = await fetch('https://api.zapier.com/v1/zaps', {
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    }
  });
  
  return response.ok;
}

// Automatische Zap configuratie functie
async function createAutomatedZap(apiKey) {
  const zapConfig = {
    title: "Kandidatentekort Vacature Analyse - Complete AI Pipeline",
    description: "Automated workflow from Google Sheets to AI processing",
    steps: [
      {
        app: "google-sheets",
        event: "new-spreadsheet-row"
      },
      {
        app: "webhook", 
        event: "post"
      },
      {
        app: "delay",
        event: "delay-for"
      },
      {
        app: "email",
        event: "send-outbound-email"
      },
      {
        app: "google-sheets",
        event: "create-spreadsheet-row"
      }
    ]
  };
  
  const response = await fetch('https://api.zapier.com/v1/zaps', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(zapConfig)
  });
  
  return response.json();
}

module.exports = { setupZapierAuth, testZapierAccess, createAutomatedZap };