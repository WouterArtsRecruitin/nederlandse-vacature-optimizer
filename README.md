# Nederlandse Vacature Optimizer

**AI-powered recruitment tool voor de Nederlandse arbeidsmarkt**

🚀 **Live Demo**: [Wordt gedeployed op Netlify]

## 📋 Project Overview

Nederlandse Vacature Optimizer is een geavanceerde AI-tool die vacatureteksten analyseert en optimaliseert voor de Nederlandse arbeidsmarkt. Met Claude AI technologie biedt de tool concrete verbeterpunten die de respons met 40-60% kunnen verhogen.

## ✨ Key Features

- 🤖 **AI-Powered Analyse** - Claude API integratie voor slimme vacature analyse
- 🇳🇱 **Nederlandse Expertise** - Geoptimaliseerd voor Nederlandse recruitment praktijken
- ⚡ **Real-time Feedback** - Live character counting en quality indicators
- 📊 **Scoring System** - 5 criteria analyse met gemiddelde score
- 📈 **Marktanalyse** - Nederlandse salaris benchmarks en TTH prognoses
- 🎯 **Concrete Verbeterpunten** - Top 3 actionable recommendations
- 📄 **Geoptimaliseerde Versie** - Complete verbeterde vacaturetekst
- 📋 **TypeForm Integratie** - Document upload voor volledige optimalisatie
- 🎮 **Demo Vacatures** - Test met slechte/gemiddelde/goede voorbeelden

## 🛠 Tech Stack

- **Frontend**: HTML5, CSS3 (Custom Properties), Vanilla JavaScript
- **Backend**: Netlify Functions (Node.js)
- **AI**: Claude API (Anthropic) - claude-3-5-sonnet-20241022
- **Forms**: TypeForm integratie voor document uploads
- **Hosting**: Netlify met serverless functions
- **Analytics**: Google Analytics ready

## 🏗 Architecture

```
├── index.html                                      # Main application (SPA)
├── netlify/
│   └── functions/
│       └── claude-analyze.js                       # Claude API integration
├── netlify.toml                                    # Deployment config
└── README.md                                       # This file
```

## 🚀 Deployment

### Prerequisites
- GitHub account
- Netlify account  
- Claude API key (Anthropic)
- PDF Monkey API key (Optional - for professional PDF reports)

### Setup
1. **Clone & Push to GitHub**
2. **Connect to Netlify**:
   - New site from Git → GitHub
   - Repository: `nederlandse-vacature-optimizer`
   - Build settings: Auto-detected
3. **Environment Variables**:
   ```
   CLAUDE_API_KEY=your_claude_api_key_here
   PDFMONKEY_API_KEY=your_pdfmonkey_api_key_here
   ```
4. **Deploy** - Automatic via GitHub integration

## 🔧 Configuration

### Claude API Setup
- Sign up at [console.anthropic.com](https://console.anthropic.com)
- Create API key
- Add to Netlify environment variables

### PDF Monkey Setup (Optional)
- Sign up at [pdfmonkey.io](https://pdfmonkey.io)
- Create API key and workspace
- Workspace ID: `729854cd-a86a-44ee-9a52-1f3febd94af0`
- Add `PDFMONKEY_API_KEY` to Netlify environment variables
- Without PDF Monkey: Falls back to text report downloads

### TypeForm Integration
- Form URL: `https://form.typeform.com/to/01K25SKWYTKZ05DAHER9D52J94`
- Supports file uploads for complete document optimization
- Webhook integration possible for automated processing

## 📊 Analysis Criteria

1. **Aantrekkelijkheid** (1-10) - Employer branding, benefits, cultuur
2. **Duidelijkheid** (1-10) - Functieomschrijving, verwachtingen  
3. **Volledigheid** (1-10) - Essentiële informatie aanwezigheid
4. **Salaris Transparantie** (1-10) - Salaris range of indicatie
5. **Contact/Sollicitatie** (1-10) - Duidelijke procedure en contactgegevens

## 🎯 Nederlandse Markt Specifiek

- **TTH Optimalisatie** - Time-to-Hire predictions
- **Salaris Benchmarking** - Nederlandse marktstandaarden
- **Regio Analyse** - Gelderland/Randstad verschillen
- **Compliance** - AVG/GDPR ready
- **Cultuur** - Nederlandse directe communicatiestijl
- **Trends** - Hybride werken, work-life balance

## 🔄 Mock Analysis Fallback

Bij development of API problemen valt het systeem terug op intelligente mock analysis die:
- Tekst content analyseert op patronen
- Dynamische scoring berekent
- Contextual feedback genereert
- Realistische geoptimaliseerde versies maakt

## 📱 Features Detail

### Demo Systeem
- **Slechte Vacature** (Score: 3.2/10) - Basis informatie, geen structuur
- **Gemiddelde Vacature** (Score: 6.5/10) - Redelijke inhoud, verbeterpunten
- **Goede Vacature** (Score: 8.8/10) - Professioneel, compleet, aantrekkelijk

### Real-time Feedback
- Character counter (max 8000)
- Length indicator (te kort → zeer uitgebreid)  
- Structure analysis (bullets, sections)
- Keyword density analysis

### Export Functionaliteit
- Professional PDF reports via PDF Monkey integration
- Fallback text report download (TXT format)
- TypeForm upload voor premium optimalisatie
- Comprehensive analysis data export

## 🔒 Security & Privacy

- **No Data Storage** - Analyses worden niet opgeslagen
- **HTTPS Only** - Secure communicatie
- **API Security** - Environment variables voor keys
- **CORS Protection** - Netlify function security
- **AVG Compliant** - Nederlandse privacy wetgeving

## 📈 Performance

- **Loading Time** - <2s initial load
- **Analysis Speed** - 1-3s Claude API response
- **Mobile Optimized** - Responsive vanaf 320px
- **Accessibility** - WCAG 2.1 compliant
- **SEO Ready** - Semantic HTML, meta tags

## 🚨 Error Handling

- API failures → Mock analysis fallback  
- Network issues → Retry mechanism
- Validation errors → User-friendly messages
- Loading states → Progress indicators
- Toast notifications → Real-time feedback

## 📞 Support

Voor vragen of aanpassingen:
- **GitHub Issues**: [Repository issues](https://github.com/WouterArtsRecruitin/nederlandse-vacature-optimizer/issues)
- **Contact**: Wouter Arts - Recruitin

---

*🇳🇱 Nederlandse Vacature Optimizer - Powered by Claude AI*
*Verhoog je recruitment succes met slimme technologie*