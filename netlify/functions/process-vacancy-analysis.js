exports.handler = async (event, context) => {
  // Set CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Handle preflight OPTIONS request
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ message: 'CORS preflight successful' })
    };
  }

  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ 
        error: 'Method not allowed',
        allowed_methods: ['POST']
      })
    };
  }

  try {
    // Parse request body
    let requestData;
    try {
      requestData = JSON.parse(event.body || '{}');
    } catch (parseError) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          error: 'Invalid JSON payload',
          message: 'Request body must be valid JSON'
        })
      };
    }

    // Generate processing ID if not provided
    const processingId = requestData.processing_id || 
      `VAC_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Validate required fields
    const requiredFields = ['customer'];
    const missingFields = requiredFields.filter(field => !requestData[field]);
    
    if (missingFields.length > 0) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          error: 'Missing required fields',
          missing: missingFields,
          received_keys: Object.keys(requestData)
        })
      };
    }

    // Process the vacancy analysis request
    const response = {
      status: 'success',
      message: 'Vacancy analysis request received and queued for processing',
      processing_id: processingId,
      timestamp: new Date().toISOString(),
      
      // Request summary
      request_summary: {
        customer_email: requestData.customer?.email || 'not_provided',
        vacancy_title: requestData.vacancy?.title || requestData.vacancy?.functietitel || 'not_provided',
        word_count: requestData.vacancy?.word_count || 0,
        priority: requestData.processing?.priority || 'normal'
      },
      
      // Processing details
      processing: {
        expected_completion: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
        status: 'queued',
        next_steps: [
          'AI analysis of job description',
          'SEO optimization suggestions',
          'Benchmark comparison',
          'Email delivery of results'
        ]
      },
      
      // Debug info (remove in production)
      debug: {
        received_data_keys: Object.keys(requestData),
        request_size: event.body?.length || 0,
        source_ip: event.headers['x-forwarded-for'] || 'unknown'
      }
    };

    // Log successful request (for monitoring)
    console.log('Vacancy analysis request processed:', {
      processing_id: processingId,
      customer_email: requestData.customer?.email,
      timestamp: new Date().toISOString()
    });

    // Send success response
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(response)
    };

  } catch (error) {
    // Log error for debugging
    console.error('Error processing vacancy analysis request:', error);

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Internal server error',
        message: 'An error occurred while processing your request',
        timestamp: new Date().toISOString(),
        request_id: `ERR_${Date.now()}`
      })
    };
  }
};