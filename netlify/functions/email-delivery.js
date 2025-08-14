const nodemailer = require('nodemailer');

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
    // Parse request data from Claude processing
    const requestData = JSON.parse(event.body || '{}');
    
    const {
      processing_id,
      customer_email,
      original_data,
      optimization_result
    } = requestData;

    // Create nodemailer transporter (using Gmail SMTP)
    const transporter = nodemailer.createTransporter({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER || 'artsrecruitin@gmail.com',
        pass: process.env.GMAIL_APP_PASSWORD
      }
    });

    // Generate professional email content
    const emailHTML = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: 'Arial', sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #ff6b35 0%, #f97316 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
    .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
    .metrics { background: white; padding: 20px; border-radius: 10px; margin: 20px 0; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
    .score { font-size: 2.5rem; font-weight: bold; color: #ff6b35; text-align: center; }
    .highlight { background: #fff3cd; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #ff6b35; }
    .optimized-text { background: white; padding: 20px; border-radius: 10px; margin: 20px 0; border: 1px solid #e5e7eb; }
    .footer { text-align: center; padding: 20px; color: #666; font-size: 0.9rem; }
    .btn { display: inline-block; background: #ff6b35; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 10px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎯 Jouw Vacature Optimalisatie is Klaar!</h1>
      <p>Professionele AI-analyse voor ${original_data.company_name || 'je bedrijf'}</p>
    </div>
    
    <div class="content">
      <div class="metrics">
        <div class="score">${optimization_result.performance_score || 85}/100</div>
        <p style="text-align: center; margin-top: 10px;"><strong>Optimalisatie Score</strong></p>
        <p style="text-align: center; color: #10b981; font-size: 1.2rem;">
          📈 Verwachte Response Rate Toename: ${optimization_result.response_rate_toename || '40%'}
        </p>
      </div>
      
      <div class="highlight">
        <h3>🚀 Belangrijkste Verbeteringen:</h3>
        <ul>
          ${(optimization_result.wijzigingen || []).map(wijziging => `<li>${wijziging}</li>`).join('')}
        </ul>
      </div>
      
      <div class="optimized-text">
        <h3>✨ Jouw Geoptimaliseerde Vacaturetekst:</h3>
        <p style="font-style: italic; color: #666; margin-bottom: 15px;">
          Functie: ${original_data.job_title || 'Niet opgegeven'}
        </p>
        <div style="background: #f8f9fa; padding: 15px; border-radius: 6px; white-space: pre-line;">
${optimization_result.geoptimaliseerde_tekst || 'Geoptimaliseerde tekst niet beschikbaar'}
        </div>
      </div>
      
      <div class="highlight">
        <h3>💡 Aanbevelingen voor Implementatie:</h3>
        <ul>
          ${(optimization_result.aanbevelingen || ['Gebruik de geoptimaliseerde tekst voor betere resultaten']).map(aanbeveling => `<li>${aanbeveling}</li>`).join('')}
        </ul>
      </div>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="https://calendly.com/wouter-arts-/vacature-analyse-advies" class="btn">
          📅 Plan Gratis Adviesgesprek
        </a>
      </div>
    </div>
    
    <div class="footer">
      <p><strong>Recruitin Intelligence</strong></p>
      <p>Processing ID: ${processing_id}</p>
      <p>Vragen? Reageer op deze email of plan een gesprek via de button hierboven.</p>
    </div>
  </div>
</body>
</html>`;

    // Email configuration
    const mailOptions = {
      from: `"Recruitin Intelligence" <${process.env.GMAIL_USER || 'artsrecruitin@gmail.com'}>`,
      to: customer_email,
      subject: `✨ Jouw Geoptimaliseerde Vacature voor ${original_data.job_title || 'je Functie'} is Klaar!`,
      html: emailHTML,
      text: `
Beste collega,

Jouw vacature optimalisatie is voltooid!

Score: ${optimization_result.performance_score || 85}/100
Verwachte Response Rate Toename: ${optimization_result.response_rate_toename || '40%'}

Geoptimaliseerde tekst:
${optimization_result.geoptimaliseerde_tekst || 'Zie HTML versie voor complete tekst'}

Groeten,
Recruitin Intelligence Team

Processing ID: ${processing_id}
      `
    };

    // Send email
    const emailResult = await transporter.sendMail(mailOptions);

    // Return success response
    const response = {
      status: 'success',
      message: 'Optimization email sent successfully',
      processing_id: processing_id,
      email_details: {
        to: customer_email,
        subject: mailOptions.subject,
        messageId: emailResult.messageId,
        sent_at: new Date().toISOString()
      },
      performance_metrics: {
        score: optimization_result.performance_score || 85,
        response_rate_increase: optimization_result.response_rate_toename || '40%'
      }
    };

    console.log('Email sent successfully:', {
      processing_id,
      customer_email,
      messageId: emailResult.messageId
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(response)
    };

  } catch (error) {
    console.error('Email delivery error:', error);

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        status: 'error',
        error: 'Email delivery failed',
        message: error.message,
        timestamp: new Date().toISOString()
      })
    };
  }
};