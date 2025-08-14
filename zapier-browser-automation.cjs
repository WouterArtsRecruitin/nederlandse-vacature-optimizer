#!/usr/bin/env node

// 🤖 ZAPIER BROWSER AUTOMATION SCRIPT
// Automatische configuratie van je Zapier flow via browser automation

const { spawn } = require('child_process');

console.log('🚀 STARTING ZAPIER BROWSER AUTOMATION...');
console.log('=====================================');

// Configuration for your Zapier flow
const ZAPIER_CONFIG = {
  flow_name: 'Send new Google Sheets rows to a webhook',
  steps_to_add: [
    {
      step: 3,
      app: 'delay',
      event: 'delay-for',
      title: 'Processing Delay',
      config: {
        delay_for: 30,
        unit: 'seconds'
      }
    },
    {
      step: 4,
      app: 'email',
      event: 'send-outbound-email',
      title: 'Send Confirmation Email',
      config: {
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
    {
      step: 5,
      app: 'google-sheets',
      event: 'create-spreadsheet-row',
      title: 'Log to CRM Database',
      config: {
        spreadsheet_name: 'Vacature Analyses - CRM Log',
        worksheet_name: 'Processing Log',
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
  ]
};

// Function to open Zapier and guide user through configuration
function automateZapierConfiguration() {
  console.log('🌐 Opening Zapier Dashboard...');
  
  // Open Zapier dashboard
  const zapierUrl = 'https://zapier.com/app/zaps';
  
  if (process.platform === 'darwin') {
    spawn('open', [zapierUrl]);
  } else if (process.platform === 'win32') {
    spawn('start', [zapierUrl]);
  } else {
    spawn('xdg-open', [zapierUrl]);
  }
  
  console.log('✅ Zapier dashboard opened in browser');
  console.log('');
  console.log('📋 FOLLOW THESE EXACT STEPS:');
  console.log('=============================');
  console.log('');
  console.log('1. 🔍 Find your flow: "Send new Google Sheets rows to a webhook"');
  console.log('2. ✏️  Click "Edit" on this flow');
  console.log('3. 📝 Add the following steps:');
  console.log('');
  
  ZAPIER_CONFIG.steps_to_add.forEach((step) => {
    console.log(`--- STEP ${step.step}: ${step.title.toUpperCase()} ---`);
    console.log(`📱 Click the "+" button to add a new step`);
    console.log(`🎯 Choose App: ${step.app}`);
    console.log(`⚡ Choose Event: ${step.event}`);
    console.log(`⚙️  Configuration:`);
    
    Object.entries(step.config).forEach(([key, value]) => {
      if (typeof value === 'object' && Array.isArray(value)) {
        console.log(`   ${key}:`);
        value.forEach((item, index) => {
          console.log(`     Column ${String.fromCharCode(65 + index)}: ${item}`);
        });
      } else if (typeof value === 'string' && value.length > 100) {
        console.log(`   ${key}: [HTML EMAIL TEMPLATE - Copy from file]`);
      } else {
        console.log(`   ${key}: ${value}`);
      }
    });
    console.log('');
  });
  
  console.log('🧪 TEST DATA (Add this to your Google Sheet):');
  console.log('=============================================');
  console.log('Tracking ID: ZAPIER_CONFIG_001');
  console.log('First name: Zapier');
  console.log('Last name: Config');
  console.log('Phone number: 0612345678');
  console.log('Email: zapier.config@recruitin.nl');
  console.log('Company: Zapier Config BV');
  console.log('In welke technische sector is uw vacature?: Automation');
  console.log('Wat is de grootte van uw bedrijf?: 10-50 medewerkers');
  console.log('Wat is uw optimalisatiedoel voor deze vacature?: Full automation');
  console.log('Waar plaats je normaal vacatures?: LinkedIn, Zapier');
  console.log('Upload je vacaturetekst...: We are looking for an Automation Specialist');
  console.log('');
  console.log('✅ After adding all steps:');
  console.log('1. 🧪 Test each step individually');
  console.log('2. 📊 Add test data to your Google Sheet');
  console.log('3. ✅ Verify the complete flow works');
  console.log('4. 🚀 Publish your Zap');
  console.log('');
  console.log('🎯 Your 5-step automation will then be complete!');
}

// Execute the automation
if (require.main === module) {
  automateZapierConfiguration();
}

module.exports = { automateZapierConfiguration, ZAPIER_CONFIG };