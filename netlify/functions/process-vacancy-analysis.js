// Parse Typeform webhook data
function parseTypeformData(typeformData) {
  const answers = typeformData.form_response.answers;
  const parsed = {
    typeform_id: typeformData.form_response.form_id,
    typeform_token: typeformData.form_response.token,
    submitted_at: typeformData.form_response.submitted_at
  };

  // Map Typeform answers to our expected fields
  answers.forEach(answer => {
    const fieldRef = answer.field.ref;
    const fieldId = answer.field.id;
    const fieldTitle = answer.field.title || '';
    
    // Get the value from different answer types
    let value = '';
    if (answer.email) value = answer.email;
    else if (answer.text) value = answer.text;
    else if (answer.choice && answer.choice.label) value = answer.choice.label;
    else if (answer.choices) value = answer.choices.map(c => c.label).join(', ');
    else if (answer.number) value = answer.number.toString();
    else if (answer.boolean !== undefined) value = answer.boolean.toString();
    else if (answer.file_url) value = answer.file_url;
    
    // Map common field patterns to our standard fields
    if (fieldRef.includes('email') || fieldTitle.toLowerCase().includes('email')) {
      parsed.Email = value;
      parsed.email = value;
    } else if (fieldRef.includes('first_name') || fieldTitle.toLowerCase().includes('voornaam') || fieldTitle.toLowerCase().includes('first name')) {
      parsed['First name'] = value;
      parsed.first_name = value;
    } else if (fieldRef.includes('last_name') || fieldTitle.toLowerCase().includes('achternaam') || fieldTitle.toLowerCase().includes('last name')) {
      parsed['Last name'] = value;
      parsed.last_name = value;
    } else if (fieldRef.includes('company') || fieldTitle.toLowerCase().includes('bedrijf') || fieldTitle.toLowerCase().includes('company')) {
      parsed.Company = value;
      parsed.company = value;
    } else if (fieldRef.includes('phone') || fieldTitle.toLowerCase().includes('telefoon') || fieldTitle.toLowerCase().includes('phone')) {
      parsed['Phone number'] = value;
      parsed.phone_number = value;
    } else if (fieldTitle.toLowerCase().includes('technische sector')) {
      parsed['In welke technische sector is uw vacature?'] = value;
      parsed.technical_sector = value;
    } else if (fieldTitle.toLowerCase().includes('grootte') && fieldTitle.toLowerCase().includes('bedrijf')) {
      parsed['Wat is de grootte van uw bedrijf?'] = value;
      parsed.company_size = value;
    } else if (fieldTitle.toLowerCase().includes('optimalisatiedoel')) {
      parsed['Wat is uw optimalisatiedoel voor deze vacature?'] = value;
      parsed.optimization_goal = value;
    } else if (fieldTitle.toLowerCase().includes('plaats') && fieldTitle.toLowerCase().includes('vacature')) {
      parsed['Waar plaats je normaal vacatures?'] = value;
      parsed.vacancy_platforms = value;
    } else if (fieldTitle.toLowerCase().includes('vacaturetekst') || fieldTitle.toLowerCase().includes('upload')) {
      parsed['Upload je vacaturetekst en ontvang binnen 24 uur een volledige geoptimaliseerde versie.'] = value;
      parsed.vacancy_text = value;
    } else if (fieldRef.includes('tracking') || fieldTitle.toLowerCase().includes('tracking')) {
      parsed['Tracking ID'] = value;
      parsed.tracking_id = value;
    }
    
    // Also store with original field reference for debugging
    parsed[fieldRef] = value;
    parsed[fieldId] = value;
  });
  
  return parsed;
}

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
        const rawData = JSON.parse(event.body || '{}');
        
        // Check if this is Typeform data
        if (rawData.form_response && rawData.form_response.answers) {
          console.log('Processing Typeform webhook data...');
          requestData = parseTypeformData(rawData);
        } else {
          requestData = rawData;
        }
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
    
    // Skip validation for now - proceed with automation pipeline
    console.log('Processing automation pipeline with received data...');

    // COMPLETE AUTOMATION PIPELINE
    console.log('Starting complete automation pipeline for:', processingId);
    
    // Extract customer data from all possible field variations
    const customerEmail = requestData.customer?.email || 
                         requestData.customer_email || 
                         requestData.Email || 
                         requestData.email ||
                         requestData['Email'];
    
    const customerName = {
      first: requestData.customer?.first_name || 
             requestData.first_name || 
             requestData['first_name'] ||
             requestData['First name'] || 
             'Klant',
      last: requestData.customer?.last_name || 
            requestData.last_name || 
            requestData['last_name'] ||
            requestData['Last name'] || 
            ''
    };

    const companyName = requestData.customer?.company || 
                       requestData.company || 
                       requestData.Company ||
                       requestData['Company'] || 
                       'Uw bedrijf';

    const technicalSector = requestData.business?.technical_sector || 
                           requestData.technical_sector ||
                           requestData['In welke technische sector is uw vacature?'] ||
                           'Technology';

    const optimizationGoal = requestData.business?.optimization_goal || 
                            requestData.optimization_goal ||
                            requestData['Wat is uw optimalisatiedoel voor deze vacature?'] ||
                            'Performance verbetering';

    const vacancyText = requestData.vacancy?.text || 
                       requestData.vacancy_text ||
                       requestData['Upload je vacaturetekst en ontvang binnen 24 uur een volledige geoptimaliseerde versie.'] ||
                       '';

    try {
      // STEP 1: Immediate confirmation email (no delay needed)
      console.log('Step 1: Sending immediate confirmation email...');
      const confirmationResponse = await fetch('https://kandidatentekort.nl/.netlify/functions/send-confirmation-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          processing_id: processingId,
          customer_email: customerEmail,
          customer_first_name: customerName.first,
          customer_last_name: customerName.last,
          company_name: companyName,
          technical_sector: technicalSector,
          optimization_goal: optimizationGoal,
          email_type: 'confirmation'
        })
      });

      const confirmationResult = await confirmationResponse.json();
      console.log('Confirmation email result:', confirmationResult.status);

      // STEP 2: Claude AI Processing (async)
      console.log('Step 2: Triggering Claude AI processing...');
      const claudePayload = {
        processing_id: processingId,
        customer_email: customerEmail,
        company_name: companyName,
        job_title: 'Vacature optimalisatie',
        vacancy_text: vacancyText,
        technical_sector: technicalSector,
        optimization_goal: optimizationGoal
      };

      // Don't wait for Claude processing - trigger async
      fetch('https://kandidatentekort.nl/.netlify/functions/claude-vacature-processing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(claudePayload)
      }).then(async (claudeResponse) => {
        try {
          const claudeResult = await claudeResponse.json();
          console.log('Claude processing completed:', claudeResult.status);
          
          // STEP 3: Results email after AI processing completes
          if (claudeResult.status === 'success') {
            setTimeout(async () => {
              try {
                const resultsEmailResponse = await fetch('https://kandidatentekort.nl/.netlify/functions/email-delivery', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    ...claudeResult,
                    email_type: 'results'
                  })
                });
                const resultsEmailResult = await resultsEmailResponse.json();
                console.log('Results email delivered:', resultsEmailResult.status);
              } catch (emailError) {
                console.error('Results email failed:', emailError);
              }
            }, 5000); // 5 second delay for results email
          }
        } catch (claudeError) {
          console.error('Claude processing error:', claudeError);
        }
      }).catch(error => {
        console.error('Claude processing failed to trigger:', error);
      });

      // STEP 4: CRM Logging (immediate)
      console.log('Step 3: Logging to CRM...');
      const crmData = {
        timestamp: new Date().toISOString(),
        processing_id: processingId,
        customer_email: customerEmail,
        customer_name: `${customerName.first} ${customerName.last}`.trim(),
        company_name: companyName,
        technical_sector: technicalSector,
        optimization_goal: optimizationGoal,
        status: 'Processing Started',
        automation_status: 'Success',
        tracking_id: requestData.tracking?.id || requestData.tracking_id || requestData['Tracking ID'] || processingId
      };

      fetch('https://kandidatentekort.nl/.netlify/functions/crm-logging', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(crmData)
      }).then(async (crmResponse) => {
        const crmResult = await crmResponse.json();
        console.log('CRM logging result:', crmResult.status);
      }).catch(crmError => {
        console.error('CRM logging failed:', crmError);
      });

    } catch (automationError) {
      console.error('Automation pipeline error:', automationError);
    }

    // Process the vacancy analysis request
    const response = {
      status: 'success',
      message: 'Vacancy analysis request received and processing started',
      processing_id: processingId,
      timestamp: new Date().toISOString(),
      automation_triggered: true,
      
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