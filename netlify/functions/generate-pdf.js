// Netlify function for PDF Monkey integration
// Nederlandse Vacature Optimizer - PDF Generation

exports.handler = async (event, context) => {
    // Handle CORS preflight requests
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Content-Type': 'application/json',
    };

    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers,
            body: '',
        };
    }

    // Only allow POST requests
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ error: 'Method Not Allowed' }),
        };
    }

    try {
        // Parse request body
        const { analysisData, vacatureText, originalText } = JSON.parse(event.body);

        if (!analysisData || !vacatureText) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Missing analysis data or vacature text' }),
            };
        }

        // Get PDF Monkey API key from environment variables
        const PDFMONKEY_API_KEY = process.env.PDFMONKEY_API_KEY;
        const WORKSPACE_ID = '729854cd-a86a-44ee-9a52-1f3febd94af0';
        
        // Debug logging
        console.log('🔍 PDF Monkey Environment check:');
        console.log('- PDFMONKEY_API_KEY exists:', !!PDFMONKEY_API_KEY);
        console.log('- WORKSPACE_ID:', WORKSPACE_ID);
        
        if (!PDFMONKEY_API_KEY) {
            console.error('❌ PDFMONKEY_API_KEY not found in environment variables');
            
            // Return simple text download as fallback
            const reportContent = generateTextReport(analysisData, vacatureText, originalText);
            
            return {
                statusCode: 200,
                headers: {
                    ...headers,
                    'Content-Type': 'text/plain',
                    'Content-Disposition': 'attachment; filename="vacature-analyse-rapport.txt"'
                },
                body: reportContent,
            };
        }

        console.log('🔍 Calling PDF Monkey API...');
        
        // Prepare data for PDF template
        const pdfData = {
            document: {
                document_template_id: WORKSPACE_ID,
                payload: {
                    bedrijfsnaam: extractBedrijfsnaam(originalText || vacatureText),
                    functietitel: extractFunctietitel(originalText || vacatureText),
                    datum: new Date().toLocaleDateString('nl-NL'),
                    
                    // Scores
                    score_aantrekkelijkheid: analysisData.scores?.aantrekkelijkheid?.score || 0,
                    score_duidelijkheid: analysisData.scores?.duidelijkheid?.score || 0,
                    score_volledigheid: analysisData.scores?.volledigheid?.score || 0,
                    score_salaris: analysisData.scores?.salaris_transparantie?.score || 0,
                    score_contact: analysisData.scores?.contact_sollicitatie?.score || 0,
                    gemiddelde_score: analysisData.gemiddelde_score || 0,
                    
                    // Toelichtingen
                    toelichting_aantrekkelijkheid: analysisData.scores?.aantrekkelijkheid?.toelichting || '',
                    toelichting_duidelijkheid: analysisData.scores?.duidelijkheid?.toelichting || '',
                    toelichting_volledigheid: analysisData.scores?.volledigheid?.toelichting || '',
                    toelichting_salaris: analysisData.scores?.salaris_transparantie?.toelichting || '',
                    toelichting_contact: analysisData.scores?.contact_sollicitatie?.toelichting || '',
                    
                    // Verbeterpunten
                    verbeterpunt_1: analysisData.top_3_verbeterpunten?.[0] || '',
                    verbeterpunt_2: analysisData.top_3_verbeterpunten?.[1] || '',
                    verbeterpunt_3: analysisData.top_3_verbeterpunten?.[2] || '',
                    
                    // Marktanalyse
                    functieniveau: analysisData.nederlandse_markt_analyse?.functieniveau || '',
                    salaris_inschatting: analysisData.nederlandse_markt_analyse?.salaris_inschatting || '',
                    competitiviteit: analysisData.nederlandse_markt_analyse?.competitiviteit || '',
                    tth_prognose: analysisData.nederlandse_markt_analyse?.tth_prognose || '',
                    regio_advies: analysisData.nederlandse_markt_analyse?.regio_advies || '',
                    
                    // Teksten
                    originele_vacature: originalText || vacatureText,
                    geoptimaliseerde_vacature: analysisData.geoptimaliseerde_versie || '',
                    
                    // Metadata
                    gegenereerd_op: new Date().toISOString(),
                    tool_versie: 'Nederlandse Vacature Optimizer v2.0'
                }
            }
        };

        // Call PDF Monkey API
        const response = await fetch(`https://api.pdfmonkey.io/api/v1/documents`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${PDFMONKEY_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(pdfData),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('❌ PDF Monkey API Error:', response.status, errorText);
            
            // Fallback to text report
            const reportContent = generateTextReport(analysisData, vacatureText, originalText);
            
            return {
                statusCode: 200,
                headers: {
                    ...headers,
                    'Content-Type': 'text/plain',
                    'Content-Disposition': 'attachment; filename="vacature-analyse-rapport.txt"'
                },
                body: reportContent,
            };
        }

        const pdfResult = await response.json();
        
        console.log('✅ PDF Monkey response received:', pdfResult.id);
        
        // Return PDF document info
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                document_id: pdfResult.id,
                download_url: pdfResult.download_url,
                status: pdfResult.status,
                message: 'PDF rapport wordt gegenereerd...',
                timestamp: new Date().toISOString()
            }),
        };

    } catch (error) {
        console.error('❌ PDF Generation error:', error);
        
        // Fallback to text report
        try {
            const { analysisData, vacatureText, originalText } = JSON.parse(event.body);
            const reportContent = generateTextReport(analysisData, vacatureText, originalText);
            
            return {
                statusCode: 200,
                headers: {
                    ...headers,
                    'Content-Type': 'text/plain',
                    'Content-Disposition': 'attachment; filename="vacature-analyse-rapport.txt"'
                },
                body: reportContent,
            };
        } catch (fallbackError) {
            return {
                statusCode: 500,
                headers,
                body: JSON.stringify({ 
                    error: 'PDF generatie mislukt',
                    details: error.message,
                    timestamp: new Date().toISOString()
                }),
            };
        }
    }
};

// Helper functions
function extractBedrijfsnaam(text) {
    // Simple extraction - can be improved
    const lines = text.split('\n');
    for (const line of lines) {
        if (line.toLowerCase().includes('bedrijf') || line.toLowerCase().includes('organisatie')) {
            return line.trim();
        }
    }
    return 'Bedrijf';
}

function extractFunctietitel(text) {
    // Extract function title from first few lines
    const lines = text.split('\n').filter(line => line.trim());
    return lines[0] || 'Functie';
}

function generateTextReport(analysisData, vacatureText, originalText) {
    return `NEDERLANDSE VACATURE OPTIMIZER - ANALYSE RAPPORT
========================================================

GEGENEREERD OP: ${new Date().toLocaleDateString('nl-NL')} om ${new Date().toLocaleTimeString('nl-NL')}

SAMENVATTING SCORES
==================
• Aantrekkelijkheid: ${analysisData.scores?.aantrekkelijkheid?.score || 0}/10
• Duidelijkheid: ${analysisData.scores?.duidelijkheid?.score || 0}/10
• Volledigheid: ${analysisData.scores?.volledigheid?.score || 0}/10
• Salaris Transparantie: ${analysisData.scores?.salaris_transparantie?.score || 0}/10
• Contact/Sollicitatie: ${analysisData.scores?.contact_sollicitatie?.score || 0}/10

GEMIDDELDE SCORE: ${analysisData.gemiddelde_score || 0}/10

TOP 3 VERBETERPUNTEN
===================
1. ${analysisData.top_3_verbeterpunten?.[0] || 'Geen verbeterpunten gevonden'}
2. ${analysisData.top_3_verbeterpunten?.[1] || 'Geen verbeterpunten gevonden'}
3. ${analysisData.top_3_verbeterpunten?.[2] || 'Geen verbeterpunten gevonden'}

NEDERLANDSE MARKT ANALYSE
========================
• Functieniveau: ${analysisData.nederlandse_markt_analyse?.functieniveau || 'Onbekend'}
• Salaris inschatting: ${analysisData.nederlandse_markt_analyse?.salaris_inschatting || 'Geen data'}
• Competitiviteit: ${analysisData.nederlandse_markt_analyse?.competitiviteit || 'Gemiddeld'}
• TTH Prognose: ${analysisData.nederlandse_markt_analyse?.tth_prognose || 'Onbekend'}
• Regio advies: ${analysisData.nederlandse_markt_analyse?.regio_advies || 'Geen advies'}

GEDETAILLEERDE FEEDBACK
=====================
${Object.entries(analysisData.scores || {}).map(([key, data]) => 
    `${key.toUpperCase()}: ${data.toelichting || 'Geen toelichting'}`
).join('\n\n')}

ORIGINELE VACATURETEKST
=====================
${originalText || vacatureText}

GEOPTIMALISEERDE VERSIE
=====================
${analysisData.geoptimaliseerde_versie || 'Geen geoptimaliseerde versie beschikbaar'}

========================================================
Nederlandse Vacature Optimizer v2.0 - Powered by Claude AI
`;
}