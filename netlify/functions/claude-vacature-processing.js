const { Anthropic } = require('@anthropic-ai/sdk');

exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: JSON.stringify({ message: 'CORS preflight successful' }) };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  try {
    // Initialize Claude API
    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });

    // Parse request data
    const requestData = JSON.parse(event.body || '{}');
    
    const { 
      processing_id, 
      customer_email, 
      company_name, 
      job_title, 
      vacancy_text, 
      technical_sector,
      optimization_goal 
    } = requestData;

    // Generate Claude AI optimization prompt
    const optimizationPrompt = `
🎯 VACATURE OPTIMALISATIE EXPERT PROTOCOL v3.0 - Recruitin Intelligence

CONTEXT:
- Bedrijf: ${company_name || 'Niet opgegeven'}
- Functie: ${job_title || 'Niet opgegeven'}  
- Sector: ${technical_sector || 'Niet opgegeven'}
- Optimalisatiedoel: ${optimization_goal || 'Algemene optimalisatie'}

OORSPRONKELIJKE VACATURETEKST:
${vacancy_text || 'Geen vacaturetekst opgegeven'}

🔍 OPTIMALISATIE CRITERIA:

1. SALARIS TRANSPARANTIE
   - Exacte salarisbandbreedte vermelden
   - CAO conform
   - Doorgroeipotentieel kwantificeren

2. DOORGROEIMOGELIJKHEDEN
   - Concrete carrièrepaden schetsen
   - Opleidings- en ontwikkelbudget specificeren
   - Interne doorgroei-mogelijkheden benoemen

3. INCLUSIEVE TAAL
   - Gender-neutrale terminologie
   - Diversiteit expliciet verwelkomen
   - Geen impliciete uitsluitende termen

4. TECHNISCHE VAARDIGHEDENPRECISIE
   - Must-have vs. nice-to-have skills duidelijk scheiden
   - Exacte technische vereisten
   - Verwachte ervaringsjaren per vaardigheid

5. UNIEKE BEDRIJFSCULTUUR
   - Bedrijfswaarden expliciet benoemen
   - Werksfeer en team dynamiek beschrijven
   - Onderscheidende werkgeverseigenschappen

GEVRAAGDE OUTPUT (JSON FORMAT):
{
  "geoptimaliseerde_tekst": "Volledig geoptimaliseerde vacaturetekst hier",
  "wijzigingen": [
    "Wijziging 1",
    "Wijziging 2", 
    "Wijziging 3",
    "Wijziging 4",
    "Wijziging 5"
  ],
  "performance_score": 85,
  "response_rate_toename": "40%",
  "aanbevelingen": [
    "Aanbeveling 1",
    "Aanbeveling 2"
  ]
}

Geef alleen de JSON terug, geen andere tekst.
`;

    // Call Claude API
    const message = await anthropic.messages.create({
      model: "claude-3-haiku-20240307",
      max_tokens: 2000,
      messages: [{
        role: "user",
        content: optimizationPrompt
      }]
    });

    // Parse Claude response
    let claudeResult;
    try {
      claudeResult = JSON.parse(message.content[0].text);
    } catch (parseError) {
      // Fallback if Claude doesn't return valid JSON
      claudeResult = {
        geoptimaliseerde_tekst: message.content[0].text,
        wijzigingen: ["AI analyse uitgevoerd"],
        performance_score: 80,
        response_rate_toename: "35%",
        aanbevelingen: ["Bekijk de geoptimaliseerde tekst voor verbeteringen"]
      };
    }

    // Calculate performance metrics
    const originalWordCount = (vacancy_text || '').split(/\s+/).length;
    const optimizedWordCount = claudeResult.geoptimaliseerde_tekst.split(/\s+/).length;
    
    const result = {
      status: 'success',
      processing_id: processing_id,
      timestamp: new Date().toISOString(),
      
      // Original data
      original_data: {
        company_name,
        job_title,
        vacancy_text,
        technical_sector,
        word_count: originalWordCount
      },
      
      // Claude AI results
      optimization_result: {
        ...claudeResult,
        optimized_word_count: optimizedWordCount,
        improvement_ratio: Math.round((optimizedWordCount / originalWordCount) * 100) || 0
      },
      
      // Next steps
      next_actions: [
        'email_delivery',
        'document_storage',
        'performance_tracking'
      ],
      
      // Customer data
      delivery: {
        customer_email: customer_email,
        delivery_scheduled: new Date(Date.now() + 5 * 60 * 1000).toISOString() // 5 minutes
      }
    };

    // Log successful processing
    console.log('Claude AI processing completed:', {
      processing_id,
      customer_email,
      performance_score: claudeResult.performance_score
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(result)
    };

  } catch (error) {
    console.error('Claude processing error:', error);

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        status: 'error',
        error: 'AI processing failed',
        message: error.message,
        timestamp: new Date().toISOString(),
        fallback_actions: [
          'retry_processing',
          'manual_review'
        ]
      })
    };
  }
};