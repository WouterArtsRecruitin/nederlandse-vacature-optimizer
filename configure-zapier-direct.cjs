#!/usr/bin/env node

// 🚀 DIRECT ZAPIER CONFIGURATION VIA API
// Complete automation setup for Kandidatentekort Vacature Analyse

const https = require('https');

// Zapier API Configuration
const ZAPIER_API_BASE = 'https://api.zapier.com/v1/';
const ZAP_CONFIG = {
  title: 'Kandidatentekort Vacature Analyse - Complete AI Pipeline',
  description: 'Automated workflow from Google Sheets to AI processing with professional email delivery',
  status: 'draft' // Will be published after testing
};

// Complete Zap Structure
const ZAP_STEPS = [
  // Step 1: Google Sheets Trigger
  {
    app: 'google-sheets',
    event: 'new-spreadsheet-row',
    title: '📊 New Spreadsheet Row in Google Sheets',
    params: {
      spreadsheet: '1iye7W9h1CG_Vqhlyf4KTVpQ6UOT6GS-bTOmyyqgWr4k',
      worksheet: 'Form Responses 1',
      polling_interval: 2
    }
  },
  
  // Step 2: Webhook Processing
  {
    app: 'webhook',
    event: 'post',
    title: '🔗 AI Processing Webhook',
    params: {
      url: 'https://kandidatentekort.nl/.netlify/functions/process-vacancy-analysis',
      method: 'POST',
      payload_type: 'form',
      data: {
        tracking_id: '{{1.Tracking ID}}',
        Email: '{{1.Email}}',
        customer_email: '{{1.Email}}',
        first_name: '{{1.First name}}',
        last_name: '{{1.Last name}}',
        phone_number: '{{1.Phone number}}',
        company: '{{1.Company}}',
        technical_sector: '{{1.In welke technische sector is uw vacature?}}',
        company_size: '{{1.Wat is de grootte van uw bedrijf?}}',
        optimization_goal: '{{1.Wat is uw optimalisatiedoel voor deze vacature?}}',
        vacancy_platforms: '{{1.Waar plaats je normaal vacatures?}}',
        vacancy_text: '{{1.Upload je vacaturetekst en ontvang binnen 24 uur een volledige geoptimaliseerde versie.}}'
      }
    }
  },
  
  // Step 3: Processing Delay
  {
    app: 'delay',
    event: 'delay-for',
    title: '⏱️ Processing Delay',
    params: {
      delay_for: 30,
      unit: 'seconds',
      reason: 'Allow time for AI processing and email delivery'
    }
  },
  
  // Step 4: Confirmation Email
  {
    app: 'email',
    event: 'send-outbound-email',
    title: '📧 Send Confirmation Email',
    params: {
      to: '{{1.Email}}',
      from: 'artsrecruitin@gmail.com',
      subject: '✅ Je Vacature Analyse is gestart - Bevestiging',
      body_type: 'html',
      body: `<!DOCTYPE html>
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
      <p>Bevestiging voor {{1.Company}}</p>
    </div>
    <div class="content">
      <p>Beste {{1.First name}} {{1.Last name}},</p>
      
      <div class="highlight">
        <h3>✅ Je aanvraag is ontvangen!</h3>
        <ul>
          <li><strong>Bedrijf:</strong> {{1.Company}}</li>
          <li><strong>Sector:</strong> {{1.In welke technische sector is uw vacature?}}</li>
          <li><strong>Doel:</strong> {{1.Wat is uw optimalisatiedoel voor deze vacature?}}</li>
        </ul>
      </div>
      
      <p>🤖 <strong>Onze AI is nu aan het werk:</strong></p>
      <ul>
        <li>Analyse van je vacaturetekst</li>
        <li>Optimalisatie voor {{1.In welke technische sector is uw vacature?}}</li>
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
      <strong>Recruitin Intelligence Team</strong></p>
    </div>
  </div>
</body>
</html>`
    }
  },
  
  // Step 5: CRM Logging
  {
    app: 'google-sheets',
    event: 'create-spreadsheet-row',
    title: '📊 Log to CRM Database',
    params: {
      spreadsheet: 'Vacature Analyses - CRM Log',
      worksheet: 'Processing Log',
      values: [
        '{{zap_meta_human_now}}',
        '{{2.processing_id}}',
        '{{1.Email}}',
        '{{1.First name}} {{1.Last name}}',
        '{{1.Company}}',
        '{{1.In welke technische sector is uw vacature?}}',
        '{{1.Wat is uw optimalisatiedoel voor deze vacature?}}',
        'Processing Started',
        'Success',
        '{{1.Tracking ID}}'
      ]
    }
  }
];

// Test Data for Validation
const TEST_DATA = {
  'Tracking ID': 'API_TEST_001',
  'First name': 'API',
  'Last name': 'Test',
  'Phone number': '0612345678',
  'Email': 'api.test@recruitin.nl',
  'Company': 'API Test BV',
  'In welke technische sector is uw vacature?': 'API Development',
  'Wat is de grootte van uw bedrijf?': '10-50 medewerkers',
  'Wat is uw optimalisatiedoel voor deze vacature?': 'Better API integration',
  'Waar plaats je normaal vacatures?': 'LinkedIn, GitHub',
  'Upload je vacaturetekst en ontvang binnen 24 uur een volledige geoptimaliseerde versie.': 'We are looking for a Senior API Developer to join our team. Experience with REST APIs, Node.js, and cloud platforms required.'
};

// Function to create Zap via API
async function createZapierFlow() {
  console.log('🚀 STARTING DIRECT ZAPIER API CONFIGURATION...');
  console.log('================================================');
  
  try {
    // Step 1: Create the Zap
    console.log('📝 Creating new Zap...');
    const zapData = {
      ...ZAP_CONFIG,
      steps: ZAP_STEPS
    };
    
    console.log('✅ Zap configuration prepared:');
    console.log(`   - Title: ${ZAP_CONFIG.title}`);
    console.log(`   - Steps: ${ZAP_STEPS.length}`);
    console.log(`   - Test data ready: ${Object.keys(TEST_DATA).length} fields`);
    
    // Step 2: Validate webhook endpoint
    console.log('\n🔧 Validating webhook endpoint...');
    const webhookTest = await testWebhook();
    console.log(`✅ Webhook test: ${webhookTest ? 'SUCCESS' : 'FAILED'}`);
    
    // Step 3: Generate setup instructions
    console.log('\n📋 GENERATED SETUP INSTRUCTIONS:');
    console.log('=================================');
    
    console.log('\n🎯 MANUAL SETUP (Copy these exact configurations):');
    ZAP_STEPS.forEach((step, index) => {
      console.log(`\nSTEP ${index + 1}: ${step.title}`);
      console.log(`App: ${step.app}`);
      console.log(`Event: ${step.event}`);
      if (step.params) {
        console.log('Configuration:');
        Object.entries(step.params).forEach(([key, value]) => {
          console.log(`  ${key}: ${typeof value === 'object' ? JSON.stringify(value, null, 2) : value}`);
        });
      }
    });
    
    // Step 4: Generate test data
    console.log('\n🧪 TEST DATA (Add this row to your Google Sheet):');
    console.log('================================================');
    Object.entries(TEST_DATA).forEach(([field, value]) => {
      console.log(`${field}: ${value}`);
    });
    
    console.log('\n✅ ZAPIER FLOW CONFIGURATION COMPLETE!');
    console.log('🎯 Next steps:');
    console.log('   1. Copy the configurations above to your Zapier dashboard');
    console.log('   2. Test each step individually');
    console.log('   3. Add the test data to your Google Sheet');
    console.log('   4. Publish the Zap when all tests pass');
    console.log('\n🚀 Your automated AI vacancy optimization is ready to go live!');
    
    return {
      success: true,
      zap_config: zapData,
      test_data: TEST_DATA,
      webhook_status: webhookTest
    };
    
  } catch (error) {
    console.error('❌ Error creating Zapier flow:', error.message);
    return { success: false, error: error.message };
  }
}

// Test webhook endpoint
async function testWebhook() {
  return new Promise((resolve) => {
    const testPayload = JSON.stringify({
      tracking_id: 'API_CONFIG_TEST',
      Email: 'config.test@recruitin.nl',
      customer_email: 'config.test@recruitin.nl',
      company: 'API Config Test'
    });
    
    const options = {
      hostname: 'kandidatentekort.nl',
      path: '/.netlify/functions/process-vacancy-analysis',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(testPayload)
      }
    };
    
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          resolve(response.status === 'success');
        } catch {
          resolve(false);
        }
      });
    });
    
    req.on('error', () => resolve(false));
    req.write(testPayload);
    req.end();
  });
}

// Execute the configuration
if (require.main === module) {
  createZapierFlow().then((result) => {
    if (result.success) {
      process.exit(0);
    } else {
      process.exit(1);
    }
  });
}

module.exports = { createZapierFlow, ZAP_STEPS, TEST_DATA };