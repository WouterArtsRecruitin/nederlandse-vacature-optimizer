const nodemailer = require('nodemailer');

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
    
    // Gmail SMTP Configuration
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER || 'artsrecruitin@gmail.com',
        pass: process.env.GMAIL_APP_PASSWORD
      }
    });

    // HTML Email Template
    const htmlTemplate = `<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #ff6b35; color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
    .content { background: #f9fafb; padding: 20px; border-radius: 0 0 10px 10px; }
    .highlight { background: #fff3cd; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #ff6b35; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎯 Vacature Analyse Gestart!</h1>
      <p>Bevestiging voor ${data.company_name}</p>
    </div>
    <div class="content">
      <p>Beste ${data.customer_first_name} ${data.customer_last_name},</p>
      
      <div class="highlight">
        <h3>✅ Je aanvraag is ontvangen!</h3>
        <ul>
          <li><strong>Bedrijf:</strong> ${data.company_name}</li>
          <li><strong>Sector:</strong> ${data.technical_sector}</li>
          <li><strong>Doel:</strong> ${data.optimization_goal}</li>
        </ul>
      </div>
      
      <p>🤖 <strong>Onze AI is nu aan het werk:</strong></p>
      <ul>
        <li>Analyse van je vacaturetekst</li>
        <li>Optimalisatie voor ${data.technical_sector}</li>
        <li>Performance score berekening</li>
        <li>Verbetersuggesties generatie</li>
      </ul>
      
      <div class="highlight">
        <p><strong>📧 Je ontvangt binnen 5 minuten:</strong></p>
        <ul>
          <li>Volledig geoptimaliseerde vacaturetekst</li>
          <li>Performance score (0-100)</li>
          <li>Top 5 concrete verbeteringen</li>
          <li>Link voor gratis adviesgesprek</li>
        </ul>
      </div>
      
      <p>Heb je vragen? Reageer op deze email!</p>
      
      <p>Groeten,<br>
      <strong>Recruitin Intelligence Team</strong><br>
      <em>Processing ID: ${data.processing_id}</em></p>
    </div>
  </div>
</body>
</html>`;

    // Email configuration
    const mailOptions = {
      from: `"Recruitin Intelligence" <${process.env.GMAIL_USER || 'artsrecruitin@gmail.com'}>`,
      to: data.customer_email,
      subject: '✅ Je Vacature Analyse is gestart - Bevestiging',
      html: htmlTemplate,
      text: `Beste ${data.customer_first_name},

Je vacature analyse aanvraag voor ${data.company_name} is ontvangen!

Onze AI is nu aan het werk met:
- Analyse van je vacaturetekst
- Optimalisatie voor ${data.technical_sector}
- Performance score berekening

Je ontvangt binnen 5 minuten de volledige geoptimaliseerde versie.

Groeten,
Recruitin Intelligence Team
Processing ID: ${data.processing_id}`
    };

    // Send email
    console.log('Sending confirmation email to:', data.customer_email);
    const result = await transporter.sendMail(mailOptions);
    console.log('Confirmation email sent:', result.messageId);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        status: 'success',
        message: 'Confirmation email sent successfully',
        messageId: result.messageId,
        recipient: data.customer_email,
        processing_id: data.processing_id
      })
    };

  } catch (error) {
    console.error('Confirmation email error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        status: 'error',
        message: 'Failed to send confirmation email',
        error: error.message
      })
    };
  }
};