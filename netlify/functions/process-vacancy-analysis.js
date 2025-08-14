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
      // Parse form data - get all parameters first
      const params = new URLSearchParams(event.body || '');
      const allParams = Object.fromEntries(params);
      
      // Create structured data with fallbacks for direct field access
      requestData = {
        tracking: {
          id: params.get('tracking_id')
        },
        customer: {
          first_name: params.get('customer_first_name'),
          last_name: params.get('customer_last_name'),
          email: params.get('customer_email'),
          phone: params.get('customer_phone'),
          company: params.get('customer_company')
        },
        business: {
          technical_sector: params.get('technical_sector'),
          company_size: params.get('company_size'),
          optimization_goal: params.get('optimization_goal'),
          vacancy_platforms: params.get('vacancy_platforms')
        },
        vacancy: {
          text: params.get('vacancy_text'),
          description: params.get('vacancy_text'), // fallback
          title: 'Vacature optimalisatie', // default
          sector: params.get('technical_sector')
        },
        // Add direct access to all form fields
        ...allParams
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

    // Debug mode - show all received data
    console.log('DEBUG - Full request body:', event.body);
    console.log('DEBUG - Content type:', contentType);
    console.log('DEBUG - Parsed data:', JSON.stringify(requestData, null, 2));
    
    // Validate required fields - check multiple email field variations
    const hasCustomerData = requestData.customer?.email || 
                           requestData.customer_email ||
                           requestData.email ||
                           requestData.Email ||
                           requestData['customer[email]'] ||
                           requestData['Email'];
    
    if (!hasCustomerData) {
      // Return detailed debug info instead of error
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          status: 'debug_mode',
          message: 'No email found - showing debug info',
          debug: {
            content_type: contentType,
            raw_body: event.body,
            parsed_data: requestData,
            received_keys: Object.keys(requestData),
            form_params: contentType.includes('form-urlencoded') ? 
              Object.fromEntries(new URLSearchParams(event.body || '')) : null
          }
        })
      };
    }

    // Process the vacancy analysis request
    const response = {
      status: 'success',
      message: 'Vacancy analysis request received and queued for processing',
      processing_id: processingId,
      timestamp: new Date().toISOString(),
      
      // Request summary with Typeform data
      request_summary: {
        tracking_id: requestData.tracking?.id || 'not_provided',
        customer_email: requestData.customer?.email || 'not_provided',
        customer_name: `${requestData.customer?.first_name || ''} ${requestData.customer?.last_name || ''}`.trim() || 'not_provided',
        company: requestData.customer?.company || 'not_provided',
        technical_sector: requestData.business?.technical_sector || 'not_provided',
        company_size: requestData.business?.company_size || 'not_provided',
        optimization_goal: requestData.business?.optimization_goal || 'not_provided',
        vacancy_platforms: requestData.business?.vacancy_platforms || 'not_provided',
        vacancy_word_count: requestData.vacancy?.text ? requestData.vacancy.text.split(/\s+/).length : 0,
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