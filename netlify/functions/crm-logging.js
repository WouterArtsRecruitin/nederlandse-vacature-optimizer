exports.handler = async (event, context) => {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const data = JSON.parse(event.body);
    
    console.log('CRM Logging Data:', {
      timestamp: data.timestamp,
      processing_id: data.processing_id,
      customer_email: data.customer_email,
      customer_name: data.customer_name,
      company: data.company_name,
      sector: data.technical_sector,
      goal: data.optimization_goal,
      status: data.status,
      automation: data.automation_status,
      tracking_id: data.tracking_id
    });

    // Here you would typically integrate with:
    // - Google Sheets API for logging
    // - HubSpot, Salesforce, or other CRM
    // - Database logging
    
    // For now, we'll simulate successful logging
    const logEntry = {
      id: `CRM_${Date.now()}`,
      timestamp: data.timestamp,
      processing_id: data.processing_id,
      customer: {
        email: data.customer_email,
        name: data.customer_name,
        company: data.company_name
      },
      request_details: {
        technical_sector: data.technical_sector,
        optimization_goal: data.optimization_goal,
        status: data.status,
        automation_status: data.automation_status
      },
      tracking: {
        tracking_id: data.tracking_id,
        source: 'zapier_automation',
        pipeline_step: 'crm_logging'
      }
    };

    // TODO: Implement actual Google Sheets API integration
    // const sheets = google.sheets({ version: 'v4', auth });
    // const result = await sheets.spreadsheets.values.append({
    //   spreadsheetId: 'YOUR_CRM_SPREADSHEET_ID',
    //   range: 'Log!A:J',
    //   valueInputOption: 'RAW',
    //   resource: {
    //     values: [[
    //       data.timestamp,
    //       data.processing_id,
    //       data.customer_email,
    //       data.customer_name,
    //       data.company_name,
    //       data.technical_sector,
    //       data.optimization_goal,
    //       data.status,
    //       data.automation_status,
    //       data.tracking_id
    //     ]]
    //   }
    // });

    console.log('CRM entry logged successfully:', logEntry.id);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        status: 'success',
        message: 'CRM logging completed',
        log_entry_id: logEntry.id,
        timestamp: data.timestamp,
        customer_email: data.customer_email,
        processing_id: data.processing_id,
        logged_data: logEntry
      })
    };

  } catch (error) {
    console.error('CRM logging error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        status: 'error',
        message: 'CRM logging failed',
        error: error.message
      })
    };
  }
};