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
    // Parse request body (support both JSON and form data)
    let requestData;
    const contentType = event.headers['content-type'] || '';
    
    if (contentType.includes('application/json')) {
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
    } else if (contentType.includes('application/x-www-form-urlencoded')) {
      // Parse form data
      const params = new URLSearchParams(event.body || '');
      requestData = {
        customer: {
          email: params.get('customer_email'),
          name: params.get('customer_name'), 
          company: params.get('customer_company'),
          phone: params.get('customer_phone')
        },
        vacancy: {
          title: params.get('vacancy_title'),
          description: params.get('vacancy_description'),
          region: params.get('vacancy_region'),
          sector: params.get('vacancy_sector')
        }
      };
    } else {
      // Try to parse as JSON anyway
      try {
        requestData = JSON.parse(event.body || '{}');
      } catch {
        requestData = {};
      }
    }

    // Generate processing ID if not provided
    const processingId = requestData.processing_id || 
      `VAC_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Validate required fields - more flexible validation
    const hasCustomerData = requestData.customer?.email || requestData.customer_email;
    
    if (!hasCustomerData) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          error: 'Missing customer email',
          message: 'Customer email is required for processing',
          received_keys: Object.keys(requestData),
          debug_body: event.body?.substring(0, 200) + '...'
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