// Netlify function for Claude API integration
// Nederlandse Vacature Optimizer - AI Analysis Backend

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
        const { prompt, max_tokens = 4000 } = JSON.parse(event.body);

        if (!prompt) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Missing prompt parameter' }),
            };
        }

        // Get Claude API key from environment variables
        const CLAUDE_API_KEY = process.env.CLAUDE_API_KEY;
        
        // Debug logging
        console.log('🔍 Environment variables check:');
        console.log('- NODE_ENV:', process.env.NODE_ENV);
        console.log('- CLAUDE_API_KEY exists:', !!CLAUDE_API_KEY);
        console.log('- CLAUDE_API_KEY length:', CLAUDE_API_KEY ? CLAUDE_API_KEY.length : 'undefined');
        console.log('- All env vars:', Object.keys(process.env).filter(key => key.includes('CLAUDE')));
        
        if (!CLAUDE_API_KEY) {
            console.error('❌ CLAUDE_API_KEY not found in environment variables');
            return {
                statusCode: 500,
                headers,
                body: JSON.stringify({ 
                    error: 'Server configuration error',
                    details: 'API key not configured',
                    debug: {
                        hasApiKey: !!CLAUDE_API_KEY,
                        envKeys: Object.keys(process.env).filter(key => key.includes('CLAUDE'))
                    }
                }),
            };
        }

        console.log('🔍 Making Claude API request...');
        
        // Call Claude API
        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': CLAUDE_API_KEY,
                'anthropic-version': '2023-06-01',
            },
            body: JSON.stringify({
                model: 'claude-3-5-sonnet-20241022',
                max_tokens: max_tokens,
                messages: [
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                temperature: 0.7
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('❌ Claude API Error:', response.status, errorText);
            
            // Return user-friendly error messages
            let userMessage = 'Er ging iets mis met de AI analyse.';
            
            if (response.status === 401) {
                userMessage = 'API authenticatie mislukt. Controleer je API key.';
            } else if (response.status === 429) {
                userMessage = 'Te veel verzoeken. Probeer het over een minuut opnieuw.';
            } else if (response.status >= 500) {
                userMessage = 'Claude service is tijdelijk niet beschikbaar.';
            }
            
            return {
                statusCode: response.status,
                headers,
                body: JSON.stringify({ 
                    error: userMessage,
                    details: `API returned ${response.status}`,
                    timestamp: new Date().toISOString()
                }),
            };
        }

        const data = await response.json();
        
        console.log('✅ Claude API response received');
        
        // Validate response structure
        if (!data.content || !Array.isArray(data.content) || data.content.length === 0) {
            console.error('❌ Invalid Claude API response structure:', data);
            return {
                statusCode: 500,
                headers,
                body: JSON.stringify({ 
                    error: 'Ongeldige API response',
                    details: 'Claude returned invalid response format'
                }),
            };
        }

        // Log usage for monitoring
        const usage = data.usage || {};
        console.log(`📊 Token usage - Input: ${usage.input_tokens || 'unknown'}, Output: ${usage.output_tokens || 'unknown'}`);

        // Return successful response
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                content: data.content,
                usage: usage,
                model: data.model || 'claude-3-5-sonnet-20241022',
                timestamp: new Date().toISOString()
            }),
        };

    } catch (error) {
        console.error('❌ Function error:', error);
        
        let userMessage = 'Er ging iets mis met de analyse.';
        
        if (error.name === 'SyntaxError') {
            userMessage = 'Ongeldige request data.';
        } else if (error.message.includes('fetch')) {
            userMessage = 'Verbinding met AI service mislukt.';
        }
        
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ 
                error: userMessage,
                details: error.message,
                timestamp: new Date().toISOString()
            }),
        };
    }
};