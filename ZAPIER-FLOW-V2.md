# 🚀 Verbeterde Zapier Flow - Lead Generatie Optimalisatie

## Overzicht

Deze verbeterde Zapier flow is specifiek ontworpen voor **maximale lead conversie** met de nieuwe site design.

## Flow Diagram

```
1. Typeform Submission (Trigger)
   ↓
2. Extract Data & Validate
   ↓
3. Call Claude API (Analyse + Optimalisatie)
   ↓
4. Send Confirmation Email (Direct response)
   ↓
5. Delay 2 minuten
   ↓
6. Send Optimized Vacancy Email
   ↓
7. Log to CRM (Google Sheets)
   ↓
8. Create Follow-up Task
```

---

## Stap-voor-Stap Setup

### STAP 1: Typeform Trigger

**App:** Typeform
**Event:** New Entry

**Typeform Velden:**
- Email (verplicht)
- Naam (verplicht)
- Bedrijfsnaam (verplicht)
- Telefoonnummer (optioneel)
- Vacaturetekst (lange tekst veld)
- Sector (dropdown)
- Optimalisatiedoel (multiple choice)
- Akkoord privacy (ja/nee)

**Test:** Vul test formulier in op https://form.typeform.com/to/z1GroMCc

---

### STAP 2: Data Filtering

**App:** Filter by Zapier
**Condition:**
- Email exists
- Privacy akkoord = Ja
- Vacaturetekst length > 100 chars

**Reason:** Voorkom spam en incomplete submissions

---

### STAP 3: Claude AI Analyse

**App:** Webhooks by Zapier
**Method:** POST
**URL:** `https://kandidatentekort.nl/.netlify/functions/claude-analyze`

**Request Body (JSON):**
```json
{
  "prompt": "Je bent een senior Nederlandse recruitment expert...\n\nVACATURE TEKST:\n{{1. Vacaturetekst}}\n\nGeef volledige analyse in JSON format...",
  "max_tokens": 4000
}
```

**Headers:**
```
Content-Type: application/json
```

**Response mapping:**
- Parse JSON response
- Extract: scores, gemiddelde_score, verbeterpunten, geoptimaliseerde_versie

---

### STAP 4: Bevestiging Email (Direct)

**App:** Gmail / SendGrid / Email by Zapier
**Event:** Send Email

**To:** `{{1. Email}}`
**From:** `jouw@bedrijf.nl`
**Subject:** `✅ Je Vacature Analyse is Gestart - {{1. Bedrijfsnaam}}`

**Email Template:**
```html
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header {
            background: linear-gradient(135deg, #FF6B35 0%, #E85A25 100%);
            color: white;
            padding: 30px;
            text-align: center;
            border-radius: 10px 10px 0 0;
        }
        .content { background: #f9fafb; padding: 30px; }
        .highlight {
            background: #fff;
            padding: 20px;
            border-radius: 8px;
            margin: 15px 0;
            border-left: 4px solid #FF6B35;
        }
        .button {
            display: inline-block;
            background: #FF6B35;
            color: white;
            padding: 15px 30px;
            text-decoration: none;
            border-radius: 8px;
            font-weight: bold;
            margin: 20px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎯 Analyse Gestart!</h1>
            <p style="margin: 0; opacity: 0.95;">{{1. Bedrijfsnaam}}</p>
        </div>

        <div class="content">
            <p>Beste {{1. Naam}},</p>

            <div class="highlight">
                <h3 style="margin-top: 0;">✅ We zijn aan de slag!</h3>
                <p>Je vacature wordt nu geanalyseerd door onze AI met focus op:</p>
                <ul>
                    <li>{{1. Sector}} specifieke optimalisatie</li>
                    <li>Salaris transparantie analyse</li>
                    <li>Nederlandse markt benchmarks</li>
                    <li>Response rate optimalisatie</li>
                </ul>
            </div>

            <p><strong>📧 Je ontvangt binnen 2 minuten:</strong></p>
            <ul>
                <li>✅ Volledig geoptimaliseerde vacaturetekst</li>
                <li>📊 Performance score (1-10)</li>
                <li>🎯 Top 3 kritieke verbeterpunten</li>
                <li>💰 Salaris marktanalyse</li>
                <li>📈 Time-to-hire prognose</li>
            </ul>

            <div class="highlight" style="background: #FFF3CD; border-left-color: #FFC107;">
                <p style="margin: 0;"><strong>💡 Pro Tip:</strong> Check je spam folder als je binnen 5 minuten niets ontvangt!</p>
            </div>

            <p>Vragen? Reageer direct op deze email!</p>

            <p>Met vriendelijke groet,<br>
            <strong>Team KandidatenTekort.nl</strong><br>
            AI-Powered Recruitment Optimalisatie</p>
        </div>
    </div>
</body>
</html>
```

---

### STAP 5: Delay

**App:** Delay by Zapier
**Event:** Delay For
**Duration:** 2 minutes

**Reason:** Geef Claude AI tijd om analyse te voltooien

---

### STAP 6: Geoptimaliseerde Vacature Email

**App:** Gmail / SendGrid
**To:** `{{1. Email}}`
**Subject:** `🎉 Je Geoptimaliseerde Vacature is Klaar! Score: {{3. gemiddelde_score}}/10`

**Email Template:**
```html
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 700px; margin: 0 auto; padding: 20px; }
        .header {
            background: linear-gradient(135deg, #1E3A8A 0%, #3B5BA5 100%);
            color: white;
            padding: 40px;
            text-align: center;
            border-radius: 10px 10px 0 0;
        }
        .score-badge {
            display: inline-block;
            background: white;
            color: #FF6B35;
            font-size: 3rem;
            font-weight: bold;
            width: 100px;
            height: 100px;
            border-radius: 50%;
            line-height: 100px;
            margin: 20px 0;
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        }
        .content { background: #fff; padding: 30px; }
        .section {
            background: #f9fafb;
            padding: 20px;
            margin: 20px 0;
            border-radius: 8px;
            border-left: 4px solid #FF6B35;
        }
        .optimized-text {
            background: #fff;
            padding: 25px;
            border: 2px solid #FF6B35;
            border-radius: 8px;
            font-family: Georgia, serif;
            line-height: 1.8;
            white-space: pre-wrap;
        }
        .cta-button {
            display: inline-block;
            background: #FF6B35;
            color: white;
            padding: 18px 40px;
            text-decoration: none;
            border-radius: 8px;
            font-weight: bold;
            margin: 20px 0;
            font-size: 1.1rem;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎉 Je Geoptimaliseerde Vacature!</h1>
            <div class="score-badge">{{3. gemiddelde_score}}/10</div>
            <p style="margin: 0; font-size: 1.2rem;">{{1. Bedrijfsnaam}}</p>
        </div>

        <div class="content">
            <p>Beste {{1. Naam}},</p>

            <p>Geweldig nieuws! Onze AI heeft je vacature volledig geanalyseerd en geoptimaliseerd. Hier zijn je resultaten:</p>

            <!-- Scores Section -->
            <div class="section">
                <h3>📊 Performance Scores</h3>
                <ul>
                    <li><strong>Aantrekkelijkheid:</strong> {{3.scores.aantrekkelijkheid.score}}/10</li>
                    <li><strong>Duidelijkheid:</strong> {{3.scores.duidelijkheid.score}}/10</li>
                    <li><strong>Volledigheid:</strong> {{3.scores.volledigheid.score}}/10</li>
                    <li><strong>Salaris Transparantie:</strong> {{3.scores.salaris_transparantie.score}}/10</li>
                    <li><strong>Sollicitatieproces:</strong> {{3.scores.contact_sollicitatie.score}}/10</li>
                </ul>
            </div>

            <!-- Top Improvements -->
            <div class="section">
                <h3>🎯 Top 3 Verbeterpunten</h3>
                <ol>
                    <li>{{3.top_3_verbeterpunten.0}}</li>
                    <li>{{3.top_3_verbeterpunten.1}}</li>
                    <li>{{3.top_3_verbeterpunten.2}}</li>
                </ol>
            </div>

            <!-- Market Analysis -->
            <div class="section">
                <h3>💰 Nederlandse Marktanalyse</h3>
                <ul>
                    <li><strong>Functieniveau:</strong> {{3.nederlandse_markt_analyse.functieniveau}}</li>
                    <li><strong>Salaris indicatie:</strong> {{3.nederlandse_markt_analyse.salaris_inschatting}}</li>
                    <li><strong>Competitiviteit:</strong> {{3.nederlandse_markt_analyse.competitiviteit}}</li>
                    <li><strong>Time-to-Hire:</strong> {{3.nederlandse_markt_analyse.tth_prognose}}</li>
                </ul>
            </div>

            <!-- Optimized Version -->
            <h2 style="color: #1E3A8A; margin-top: 40px;">✨ Je Geoptimaliseerde Vacaturetekst:</h2>

            <div class="optimized-text">{{3.geoptimaliseerde_versie}}</div>

            <div style="text-align: center; margin: 40px 0;">
                <p><strong>📋 Kopieer deze tekst en gebruik hem direct!</strong></p>
                <p style="color: #666;">Verwachting: <strong style="color: #10b981;">40-60% meer sollicitaties</strong></p>
            </div>

            <!-- CTA -->
            <div style="background: linear-gradient(135deg, #FFF3CD 0%, #FFE999 100%); padding: 30px; border-radius: 12px; text-align: center; margin: 30px 0;">
                <h3 style="margin-top: 0; color: #1E3A8A;">🚀 Wil je nog betere resultaten?</h3>
                <p>Plan een gratis 15-min strategiegesprek voor:</p>
                <ul style="text-align: left; display: inline-block;">
                    <li>Persoonlijke recruitment strategie</li>
                    <li>Multi-channel plaatsing optimalisatie</li>
                    <li>Candidate experience verbetering</li>
                    <li>Employer branding tips</li>
                </ul>
                <br>
                <a href="https://calendly.com/jouwbedrijf/recruitment-strategie" class="cta-button">
                    📅 Plan Gratis Gesprek
                </a>
            </div>

            <p>Succes met je nieuwe vacature!</p>

            <p>Met vriendelijke groet,<br>
            <strong>Team KandidatenTekort.nl</strong><br>
            <a href="https://kandidatentekort.nl">kandidatentekort.nl</a></p>

            <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">

            <p style="font-size: 0.9rem; color: #666;">
                <strong>PS:</strong> Deel je resultaten met ons! We zijn benieuwd hoeveel meer sollicitaties je krijgt.
                Email ons op <a href="mailto:feedback@kandidatentekort.nl">feedback@kandidatentekort.nl</a>
            </p>
        </div>
    </div>
</body>
</html>
```

---

### STAP 7: CRM Logging

**App:** Google Sheets
**Event:** Create Spreadsheet Row

**Spreadsheet:** "Kandidatentekort Leads"
**Worksheet:** "Submissions"

**Kolom Mapping:**
- A: Timestamp → `{{zap_meta_human_now}}`
- B: Email → `{{1. Email}}`
- C: Naam → `{{1. Naam}}`
- D: Bedrijf → `{{1. Bedrijfsnaam}}`
- E: Telefoon → `{{1. Telefoonnummer}}`
- F: Sector → `{{1. Sector}}`
- G: Score → `{{3. gemiddelde_score}}`
- H: Status → "Email Sent"
- I: Follow-up → "Pending"
- J: Source → "Website Lead Form"

---

### STAP 8: Follow-up Task (Optioneel)

**App:** Google Tasks / Todoist / Asana
**Event:** Create Task

**Task Details:**
- **Title:** Follow-up: {{1. Bedrijfsnaam}} - {{1. Naam}}
- **Description:**
  ```
  Lead Details:
  - Email: {{1. Email}}
  - Phone: {{1. Telefoonnummer}}
  - Score: {{3. gemiddelde_score}}/10
  - Sector: {{1. Sector}}

  Action: Bel binnen 3 dagen voor feedback en upsell gesprek
  ```
- **Due Date:** +3 days
- **Assignee:** Sales Team

---

## 🎯 Success Metrics

Track deze KPI's in je Google Sheet:

1. **Conversion Rate:** (Emails sent / Form submissions) × 100%
2. **Average Score:** Gemiddelde van alle vacature scores
3. **Follow-up Rate:** % leads waarmee follow-up contact is geweest
4. **Response Time:** Tijd tussen submission en email delivery

---

## 🔧 Testing Checklist

- [ ] Test formulier volledig invullen
- [ ] Bevestigings email ontvangen binnen 1 min
- [ ] Geoptimaliseerde vacature email ontvangen binnen 3 min
- [ ] Data correct in Google Sheets
- [ ] Follow-up task aangemaakt
- [ ] Alle personalisatie werkt (naam, bedrijf, etc.)

---

## 📊 Optimization Tips

1. **A/B Test Email Subject Lines:**
   - "Je Vacature Score: X/10" vs "Geoptimaliseerde Vacature Klaar!"

2. **Track Open Rates:**
   - Use email tracking tools (SendGrid, Mailchimp)

3. **Monitor Drop-off:**
   - Check waar submissions mislukken in de flow

4. **Improve Response Time:**
   - Reduce delay van 2 min → 1 min als API snel genoeg is

---

## 🚨 Troubleshooting

**Probleem:** Emails komen niet aan
**Oplossing:** Check spam, verify sender domain, gebruik zakelijke email

**Probleem:** Claude API timeout
**Oplossing:** Verhoog max_tokens limiet, of split analysis in 2 calls

**Probleem:** JSON parsing errors
**Oplossing:** Add error handling filter stap, fallback naar basis email

---

## 🎓 Advanced Features (Future)

1. **SMS Notifications** - Stuur SMS bij high-value leads (score > 8)
2. **Slack Notifications** - Alert sales team bij nieuwe submission
3. **LinkedIn Automation** - Auto-connect met leads
4. **Calendar Booking** - Embedded booking link in email
5. **Retargeting Pixel** - Track conversions voor ads

---

**Vragen?** Contact: support@kandidatentekort.nl
