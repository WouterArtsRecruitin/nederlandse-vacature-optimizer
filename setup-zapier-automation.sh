#!/bin/bash

# 🚀 AUTOMATED ZAPIER SETUP SCRIPT
# Voor Kandidatentekort Vacature Analyse - Complete AI Pipeline

echo "🤖 STARTING AUTOMATED ZAPIER CONFIGURATION..."
echo "================================================"

# Configuration variables
GOOGLE_SHEETS_ID="1iye7W9h1CG_Vqhlyf4KTVpQ6UOT6GS-bTOmyyqgWr4k"
WEBHOOK_URL="https://kandidatentekort.nl/.netlify/functions/process-vacancy-analysis"
EMAIL_FROM="artsrecruitin@gmail.com"

echo "✅ Configuration loaded:"
echo "   - Google Sheets ID: $GOOGLE_SHEETS_ID"
echo "   - Webhook URL: $WEBHOOK_URL"
echo "   - Email From: $EMAIL_FROM"
echo ""

# Generate Zapier CLI commands (if user has Zapier CLI)
echo "🔧 ZAPIER CLI SETUP COMMANDS:"
echo "If you have Zapier CLI installed, run these commands:"
echo ""

cat << EOF
# Login to Zapier CLI
zapier login

# Create new Zap
zapier scaffold

# Configure trigger - Google Sheets
zapier configure trigger google-sheets new-spreadsheet-row \\
  --spreadsheet="$GOOGLE_SHEETS_ID" \\
  --worksheet="Form Responses 1"

# Configure action 1 - Webhook
zapier configure action webhook post \\
  --url="$WEBHOOK_URL" \\
  --method="POST" \\
  --data='{"Email":"{{trigger.Email}}","company":"{{trigger.Company}}"}'

# Configure action 2 - Delay  
zapier configure action delay delay-for \\
  --delay_for=30 \\
  --unit="seconds"

# Configure action 3 - Email
zapier configure action email send-outbound-email \\
  --to="{{trigger.Email}}" \\
  --from="$EMAIL_FROM" \\
  --subject="✅ Je Vacature Analyse is gestart"

# Test and push
zapier test
zapier push
EOF

echo ""
echo "🌐 MANUAL SETUP INSTRUCTIONS:"
echo "If you don't have Zapier CLI, follow these steps in the Zapier web interface:"
echo ""

# Generate step-by-step manual instructions
cat << 'EOF'
STEP 1: CREATE NEW ZAP
========================
1. Go to https://zapier.com/app/zaps
2. Click "Create Zap"
3. Name: "Kandidatentekort Vacature Analyse - Complete AI Pipeline"

STEP 2: CONFIGURE TRIGGER
=========================
App: Google Sheets
Event: New Spreadsheet Row
Spreadsheet: Select your Google Sheets file
Worksheet: "Form Responses 1"

STEP 3: ADD WEBHOOK ACTION
==========================  
App: Webhooks by Zapier
Action: POST
URL: https://kandidatentekort.nl/.netlify/functions/process-vacancy-analysis
Method: POST
Data: Form fields (see configuration below)

STEP 4: ADD DELAY
=================
App: Delay by Zapier  
Action: Delay For
Duration: 30 seconds

STEP 5: ADD EMAIL
=================
App: Email by Zapier
Action: Send Outbound Email
To: {{1.Email}}
From: artsrecruitin@gmail.com
Subject: ✅ Je Vacature Analyse is gestart - Bevestiging

STEP 6: ADD CRM LOGGING
=======================
App: Google Sheets
Action: Create Spreadsheet Row
Spreadsheet: Create new "Vacature Analyses - CRM Log"

STEP 7: TEST & PUBLISH
======================
1. Test each step individually
2. Run complete test with sample data
3. Publish the Zap when all tests pass
EOF

echo ""
echo "📋 DETAILED FIELD MAPPINGS:"

# Generate detailed field mappings
cat << 'EOF'

WEBHOOK FIELD MAPPINGS (Step 3):
=================================
tracking_id → {{1.Tracking ID}}
Email → {{1.Email}}  
customer_email → {{1.Email}}
first_name → {{1.First name}}
last_name → {{1.Last name}}
phone_number → {{1.Phone number}}
company → {{1.Company}}
technical_sector → {{1.In welke technische sector is uw vacature?}}
company_size → {{1.Wat is de grootte van uw bedrijf?}}
optimization_goal → {{1.Wat is uw optimalisatiedoel voor deze vacature?}}
vacancy_platforms → {{1.Waar plaats je normaal vacatures?}}
vacancy_text → {{1.Upload je vacaturetekst en ontvang binnen 24 uur een volledige geoptimaliseerde versie.}}

CRM LOG FIELD MAPPINGS (Step 6):
=================================
Column A (Date) → {{zap_meta_human_now}}
Column B (Processing ID) → {{3.processing_id}}
Column C (Email) → {{1.Email}}
Column D (Name) → {{1.First name}} {{1.Last name}}
Column E (Company) → {{1.Company}}
Column F (Sector) → {{1.In welke technische sector is uw vacature?}}
Column G (Goal) → {{1.Wat is uw optimalisatiedoel voor deze vacature?}}
Column H (Status) → "Processing Started"
Column I (Automation) → "Success"
Column J (Tracking) → {{1.Tracking ID}}

EOF

echo ""
echo "🧪 TEST DATA:"

# Generate test data
cat << 'EOF'

ADD THIS TEST ROW TO YOUR GOOGLE SHEET:
=======================================
Tracking ID: AUTO_TEST_001
First name: Automated  
Last name: Test
Phone number: 0612345678
Email: automation.test@recruitin.nl
Company: AutoTest BV
In welke technische sector is uw vacature?: AI & Machine Learning
Wat is de grootte van uw bedrijf?: 10-50 medewerkers  
Wat is uw optimalisatiedoel voor deze vacature?: More qualified candidates
Waar plaats je normaal vacatures?: LinkedIn, Indeed
Upload je vacaturetekst...: We are looking for a Senior AI Engineer to join our innovative team. Experience with machine learning, Python, and cloud platforms required. Excellent growth opportunities.

EOF

echo ""
echo "✅ EXPECTED RESULTS:"
echo "   1. Zapier trigger activates within 2 minutes"
echo "   2. Webhook processes data successfully"  
echo "   3. Confirmation email sent to test address"
echo "   4. AI processing email follows within 5 minutes"
echo "   5. CRM log entry created"
echo ""

echo "🎯 AUTOMATION SETUP COMPLETE!"
echo "Follow the manual steps above to configure your Zapier flow."
echo "All configuration details and test data are provided."
echo ""
echo "💡 Need help? Check the generated files:"
echo "   - zapier-import-template.json"  
echo "   - zapier-complete-flow-config.json"
echo ""
echo "🚀 Ready to go live with your automated AI vacancy optimization!"