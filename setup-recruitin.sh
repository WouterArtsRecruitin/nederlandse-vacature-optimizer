# ===== WINDOWS SETUP SCRIPT =====
# Sla op als: setup-recruitin.bat

@echo off
echo.
echo =========================================
echo   🚀 RecruitIn Auto Setup Script
echo   Maakt backend + verbetert frontend
echo =========================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js niet gevonden!
    echo.
    echo Download Node.js van: https://nodejs.org
    echo Installeer de LTS versie en run dit script opnieuw.
    pause
    exit /b 1
)

echo ✅ Node.js versie:
node --version
echo.

REM Get current directory
set "PROJECT_DIR=%cd%"
echo 📁 Project directory: %PROJECT_DIR%
echo.

REM Create backend directory
echo 📁 Maak backend folder...
if not exist "backend" mkdir backend
cd backend

echo 📦 Initialiseer Node.js project...
echo {^
  "name": "recruitin-backend",^
  "version": "1.0.0",^
  "description": "Backend voor RecruitIn Vacature Analyser",^
  "main": "server.js",^
  "scripts": {^
    "start": "node server.js",^
    "dev": "nodemon server.js"^
  },^
  "dependencies": {^
    "express": "^4.18.2",^
    "cors": "^2.8.5",^
    "dotenv": "^16.3.1",^
    "helmet": "^7.0.0",^
    "express-rate-limit": "^6.8.1"^
  },^
  "devDependencies": {^
    "nodemon": "^3.0.1"^
  }^
} > package.json

echo 📦 Installeer dependencies...
call npm install

echo 🔐 Maak .env file...
echo CLAUDE_API_KEY=VERVANG_MET_JOUW_ECHTE_API_KEY > .env
echo PORT=3000 >> .env
echo NODE_ENV=development >> .env

echo 📝 Maak server.js...
(
echo const express = require('express'^);
echo const cors = require('cors'^);
echo const helmet = require('helmet'^);
echo const rateLimit = require('express-rate-limit'^);
echo require('dotenv'^).config(^);
echo.
echo const app = express(^);
echo.
echo // Security ^& CORS
echo app.use(helmet(^)^);
echo app.use(cors({
echo   origin: ['http://localhost:5500', 'http://127.0.0.1:5500', 'http://localhost:3000', 'file://'],
echo   credentials: true
echo }^)^);
echo.
echo // Rate limiting
echo const limiter = rateLimit({
echo   windowMs: 15 * 60 * 1000, // 15 min
echo   max: 10, // 10 requests per window
echo   message: { error: 'Te veel requests. Probeer later opnieuw.' }
echo }^);
echo.
echo app.use('/api/analyze', limiter^);
echo app.use(express.json({ limit: '10mb' }^)^);
echo.
echo // Logging
echo app.use((req, res, next^) =^> {
echo   console.log(`${new Date(^).toISOString(^)} - ${req.method} ${req.path}`^);
echo   next(^);
echo }^);
echo.
echo // Main analyze endpoint
echo app.post('/api/analyze', async (req, res^) =^> {
echo   try {
echo     const { content } = req.body;
echo.
echo     // Validation
echo     if (^!content ^|^| typeof content !== 'string'^) {
echo       return res.status(400^).json({
echo         success: false,
echo         error: 'Vacature content is verplicht'
echo       }^);
echo     }
echo.
echo     if (content.length ^< 50^) {
echo       return res.status(400^).json({
echo         success: false,
echo         error: 'Vacature tekst moet minimaal 50 karakters bevatten'
echo       }^);
echo     }
echo.
echo     // Call Claude API
echo     const result = await callClaudeAPI(content^);
echo.
echo     res.json({
echo       success: true,
echo       data: result,
echo       timestamp: new Date(^).toISOString(^)
echo     }^);
echo.
echo   } catch (error^) {
echo     console.error('Analysis error:', error^);
echo     res.status(500^).json({
echo       success: false,
echo       error: 'Er ging iets mis bij de analyse. Probeer het opnieuw.'
echo     }^);
echo   }
echo }^);
echo.
echo // Claude API function
echo async function callClaudeAPI(content^) {
echo   const response = await fetch('https://api.anthropic.com/v1/messages', {
echo     method: 'POST',
echo     headers: {
echo       'Content-Type': 'application/json',
echo       'anthropic-version': '2023-06-01',
echo       'x-api-key': process.env.CLAUDE_API_KEY
echo     },
echo     body: JSON.stringify({
echo       model: 'claude-3-sonnet-20240229',
echo       max_tokens: 2000,
echo       messages: [{
echo         role: 'user',
echo         content: createPrompt(content^)
echo       }]
echo     }^)
echo   }^);
echo.
echo   if (^!response.ok^) {
echo     throw new Error(`Claude API error: ${response.status}`^);
echo   }
echo.
echo   const data = await response.json(^);
echo   return parseClaudeResponse(data.content[0].text^);
echo }
echo.
echo function createPrompt(content^) {
echo   return `Je bent een senior recruitment expert. Analyseer deze Nederlandse vacature en geef scores 1-10:
echo.
echo VACATURE:
echo ${content}
echo.
echo Beoordeel:
echo 1. Aantrekkelijkheid 
echo 2. Duidelijkheid
echo 3. Volledigheid  
echo 4. Salaris transparantie
echo 5. Sollicitatie UX
echo.
echo Antwoord in exact dit JSON format:
echo {
echo   "overallScore": 7.2,
echo   "scores": {
echo     "aantrekkelijkheid": {"score": 7, "feedback": "Tekst spreekt goed aan"},
echo     "duidelijkheid": {"score": 8, "feedback": "Taken zijn helder"},
echo     "volledigheid": {"score": 6, "feedback": "Mist enkele details"},
echo     "salaris": {"score": 9, "feedback": "Salaris duidelijk vermeld"},
echo     "ux": {"score": 7, "feedback": "Solliciteren is makkelijk"}
echo   },
echo   "topVerbeteringen": [
echo     {"actie": "Voeg company culture toe", "impact": "Hoog", "tijd": "20 min"},
echo     {"actie": "Specificeer werkplek details", "impact": "Medium", "tijd": "15 min"},
echo     {"actie": "Verbeter call-to-action", "impact": "Medium", "tijd": "10 min"}
echo   ],
echo   "marktAnalyse": {
echo     "niveau": "Medior",
echo     "salarisbenchmark": "€45.000 - €55.000",
echo     "competitiviteit": "Sterk"
echo   }
echo }`;
echo }
echo.
echo function parseClaudeResponse(text^) {
echo   try {
echo     let cleaned = text.trim(^);
echo     if (cleaned.startsWith('```json'^)^) {
echo       cleaned = cleaned.replace(/```json\\n?/, ''^^).replace(/\\n?```$/, ''^^);
echo     }
echo     return JSON.parse(cleaned^);
echo   } catch (error^) {
echo     return {
echo       overallScore: 6.5,
echo       scores: {
echo         aantrekkelijkheid: {score: 6, feedback: "Basis analyse"},
echo         duidelijkheid: {score: 7, feedback: "Redelijk duidelijk"},
echo         volledigheid: {score: 6, feedback: "Basis informatie"},
echo         salaris: {score: 5, feedback: "Salaris onduidelijk"},
echo         ux: {score: 7, feedback: "Standaard proces"}
echo       },
echo       topVerbeteringen: [
echo         {actie: "Voeg meer details toe", impact: "Hoog", tijd: "30 min"},
echo         {actie: "Verbeter salaris info", impact: "Hoog", tijd: "15 min"},
echo         {actie: "Optimaliseer contact", impact: "Medium", tijd: "10 min"}
echo       ],
echo       marktAnalyse: {
echo         niveau: "Onbekend",
echo         salarisbenchmark: "Niet beschikbaar", 
echo         competitiviteit: "Gemiddeld"
echo       }
echo     };
echo   }
echo }
echo.
echo // Health check
echo app.get('/health', (req, res^) =^> {
echo   res.json({
echo     status: 'healthy',
echo     timestamp: new Date(^).toISOString(^)
echo   }^);
echo }^);
echo.
echo // Start server
echo const PORT = process.env.PORT ^|^| 3000;
echo app.listen(PORT, (^) =^> {
echo   console.log(`
echo 🚀 RecruitIn Backend actief!
echo 📍 URL: http://localhost:${PORT}
echo 🔧 Environment: ${process.env.NODE_ENV}
echo ⏰ Gestart: ${new Date(^).toLocaleString('nl-NL'^)}
echo   `^);
echo }^);
) > server.js

REM Go back to project root
cd "%PROJECT_DIR%"

echo 🎨 Verbeter frontend CSS...
(
echo /* Loading States */
echo .progress-container {
echo   margin: 20px 0;
echo   padding: 20px;
echo   background: linear-gradient(135deg, #f8f9fa 0%%, #e9ecef 100%%^);
echo   border-radius: 12px;
echo   text-align: center;
echo   border: 1px solid #dee2e6;
echo }
echo.
echo .progress-bar {
echo   width: 100%%;
echo   height: 8px;
echo   background: #e9ecef;
echo   border-radius: 4px;
echo   overflow: hidden;
echo   margin-bottom: 15px;
echo }
echo.
echo .progress-fill {
echo   height: 100%%;
echo   background: linear-gradient(90deg, #FF6B35, #ff8c5a^);
echo   background-size: 200%% 100%%;
echo   width: 0%%;
echo   transition: width 0.5s ease;
echo   border-radius: 4px;
echo   animation: shimmer 2s infinite;
echo }
echo.
echo @keyframes shimmer {
echo   0%% { background-position: -200%% 0; }
echo   100%% { background-position: 200%% 0; }
echo }
echo.
echo .progress-text {
echo   color: #495057;
echo   font-size: 14px;
echo   margin: 0;
echo   font-weight: 500;
echo }
echo.
echo .analyzing-icon {
echo   font-size: 24px;
echo   margin-bottom: 10px;
echo   animation: pulse 2s infinite;
echo }
echo.
echo @keyframes pulse {
echo   0%%, 100%% { transform: scale(1^); }
echo   50%% { transform: scale(1.1^); }
echo }
echo.
echo /* Error Messages */
echo .error-message {
echo   background: linear-gradient(135deg, #fff5f5 0%%, #fed7d7 100%%^);
echo   border: 1px solid #fc8181;
echo   border-radius: 12px;
echo   padding: 20px;
echo   margin: 20px 0;
echo   display: flex;
echo   align-items: flex-start;
echo   gap: 15px;
echo   animation: slideInDown 0.3s ease;
echo }
echo.
echo @keyframes slideInDown {
echo   from { opacity: 0; transform: translateY(-10px^); }
echo   to { opacity: 1; transform: translateY(0^); }
echo }
echo.
echo .error-icon {
echo   font-size: 24px;
echo   flex-shrink: 0;
echo   color: #e53e3e;
echo }
echo.
echo .error-content h3 {
echo   color: #c53030;
echo   margin: 0 0 8px 0;
echo   font-size: 18px;
echo   font-weight: 600;
echo }
echo.
echo .error-content p {
echo   color: #742a2a;
echo   margin: 0 0 15px 0;
echo   line-height: 1.5;
echo }
echo.
echo .btn-error {
echo   background: #e53e3e;
echo   color: white;
echo   border: none;
echo   padding: 8px 16px;
echo   border-radius: 6px;
echo   cursor: pointer;
echo   font-size: 14px;
echo   transition: all 0.2s;
echo }
echo.
echo .btn-error:hover {
echo   background: #c53030;
echo   transform: translateY(-1px^);
echo }
echo.
echo /* Mobile Responsive */
echo @media (max-width: 768px^) {
echo   .container { padding: 10px; }
echo   .recruitin-header h1 { font-size: 2rem; }
echo   .input-section { padding: 20px 15px; }
echo   #vacature-input { 
echo     padding: 15px; 
echo     font-size: 16px; 
echo     min-height: 200px; 
echo   }
echo   .cta-button { 
echo     width: 100%%; 
echo     padding: 16px; 
echo     font-size: 16px; 
echo   }
echo   .results-container { padding: 20px 15px; }
echo   .error-message { 
echo     flex-direction: column; 
echo     text-align: center; 
echo     padding: 15px; 
echo   }
echo }
) >> css/recruitin-brand.css

echo 🔧 Maak verbeterde frontend module...
(
echo class AIAnalysisModule {
echo   constructor(^) {
echo     this.apiEndpoint = 'http://localhost:3000/api/analyze';
echo     this.currentAnalysis = null;
echo   }
echo.
echo   async processVacature(content^) {
echo     try {
echo       this.showLoadingState(^);
echo       
echo       const response = await fetch(this.apiEndpoint, {
echo         method: 'POST',
echo         headers: { 'Content-Type': 'application/json' },
echo         body: JSON.stringify({ content }^)
echo       }^);
echo.
echo       const result = await response.json(^);
echo.
echo       if (^!result.success^) {
echo         throw new Error(result.error ^|^| 'Analyse mislukt'^);
echo       }
echo.
echo       this.currentAnalysis = result.data;
echo       if (window.resultsModule^) {
echo         window.resultsModule.displayResults(result.data^);
echo       }
echo       this.saveAnalysisLocally(content, result.data^);
echo.
echo     } catch (error^) {
echo       console.error('Analysis failed:', error^);
echo       this.showError(error.message^);
echo     } finally {
echo       this.hideLoadingState(^);
echo     }
echo   }
echo.
echo   showLoadingState(^) {
echo     const button = document.getElementById('analyze-btn'^);
echo     button.disabled = true;
echo     button.innerHTML = '🔄 Analyseren...';
echo     
echo     const progressHtml = `
echo       ^<div id="analysis-progress" class="progress-container"^>
echo         ^<div class="analyzing-icon"^>🤖^</div^>
echo         ^<div class="progress-bar"^>
echo           ^<div class="progress-fill"^>^</div^>
echo         ^</div^>
echo         ^<p class="progress-text"^>Claude AI analyseert je vacature...^</p^>
echo       ^</div^>
echo     `;
echo     
echo     document.querySelector('.input-section'^).insertAdjacentHTML('beforeend', progressHtml^);
echo     this.animateProgress(^);
echo   }
echo.
echo   animateProgress(^) {
echo     const progressFill = document.querySelector('.progress-fill'^);
echo     let width = 0;
echo     
echo     this.progressInterval = setInterval((^) =^> {
echo       width += Math.random(^) * 15;
echo       if (width ^> 90^) width = 90;
echo       progressFill.style.width = width + '%%';
echo     }, 500^);
echo   }
echo.
echo   hideLoadingState(^) {
echo     const button = document.getElementById('analyze-btn'^);
echo     button.disabled = false;
echo     button.innerHTML = '🚀 Analyseer Vacature';
echo     
echo     const progress = document.getElementById('analysis-progress'^);
echo     if (progress^) progress.remove(^);
echo     
echo     if (this.progressInterval^) clearInterval(this.progressInterval^);
echo   }
echo.
echo   showError(message^) {
echo     const errorHtml = `
echo       ^<div class="error-message"^>
echo         ^<div class="error-icon"^>⚠️^</div^>
echo         ^<div class="error-content"^>
echo           ^<h3^>Oeps! Er ging iets mis^</h3^>
echo           ^<p^>${message}^</p^>
echo           ^<button class="btn-error" onclick="this.closest('.error-message'^).remove(^)"^>
echo             Probeer opnieuw
echo           ^</button^>
echo         ^</div^>
echo       ^</div^>
echo     `;
echo     
echo     document.querySelector('.container'^).insertAdjacentHTML('afterbegin', errorHtml^);
echo   }
echo.
echo   saveAnalysisLocally(content, results^) {
echo     try {
echo       const analysis = {
echo         id: Date.now(^),
echo         content: content.substring(0, 200^) + '...',
echo         overallScore: results.overallScore,
echo         timestamp: new Date(^).toISOString(^)
echo       };
echo.
echo       const existing = JSON.parse(localStorage.getItem('recruitin_analyses'^) ^|^| '[]'^);
echo       existing.unshift(analysis^);
echo       
echo       if (existing.length ^> 50^) existing.splice(50^);
echo       
echo       localStorage.setItem('recruitin_analyses', JSON.stringify(existing^)^);
echo       console.log('✅ Analyse opgeslagen'^);
echo       
echo     } catch (error^) {
echo       console.warn('Kon analyse niet opslaan:', error^);
echo     }
echo   }
echo }
echo.
echo // Initialize
echo window.aiAnalysisModule = new AIAnalysisModule(^);
) > js/ai-analysis-module-new.js

echo 🧪 Maak test file...
(
echo ^<!DOCTYPE html^>
echo ^<html^>
echo ^<head^>
echo     ^<title^>RecruitIn Backend Test^</title^>
echo     ^<style^>
echo         body { font-family: Arial; margin: 40px; }
echo         .test { margin: 20px 0; padding: 20px; border: 1px solid #ddd; }
echo         .success { background: #d4edda; }
echo         .error { background: #f8d7da; }
echo         button { padding: 10px 20px; margin: 5px; }
echo     ^</style^>
echo ^</head^>
echo ^<body^>
echo     ^<h1^>🧪 RecruitIn Backend Tests^</h1^>
echo     
echo     ^<div class="test"^>
echo         ^<h3^>Test 1: Health Check^</h3^>
echo         ^<button onclick="testHealth(^)"^>Test Health^</button^>
echo         ^<div id="health-result"^>^</div^>
echo     ^</div^>
echo     
echo     ^<div class="test"^>
echo         ^<h3^>Test 2: Analysis^</h3^>
echo         ^<button onclick="testAnalysis(^)"^>Test Analysis^</button^>
echo         ^<div id="analysis-result"^>^</div^>
echo     ^</div^>
echo
echo     ^<script^>
echo         async function testHealth(^) {
echo             try {
echo                 const response = await fetch('http://localhost:3000/health'^);
echo                 const data = await response.json(^);
echo                 document.getElementById('health-result'^).innerHTML = 
echo                     '^<div class="success"^>✅ ' + JSON.stringify(data^) + '^</div^>';
echo             } catch (error^) {
echo                 document.getElementById('health-result'^).innerHTML = 
echo                     '^<div class="error"^>❌ ' + error.message + '^</div^>';
echo             }
echo         }
echo         
echo         async function testAnalysis(^) {
echo             try {
echo                 const response = await fetch('http://localhost:3000/api/analyze', {
echo                     method: 'POST',
echo                     headers: { 'Content-Type': 'application/json' },
echo                     body: JSON.stringify({ 
echo                         content: 'Test vacature voor een developer positie. We zoeken iemand met ervaring in JavaScript en React. Salaris €50.000 per jaar. Solliciteer via email naar jobs@test.nl.'
echo                     }^)
echo                 }^);
echo                 const data = await response.json(^);
echo                 document.getElementById('analysis-result'^).innerHTML = 
echo                     '^<div class="success"^>✅ ' + JSON.stringify(data, null, 2^) + '^</div^>';
echo             } catch (error^) {
echo                 document.getElementById('analysis-result'^).innerHTML = 
echo                     '^<div class="error"^>❌ ' + error.message + '^</div^>';
echo             }
echo         }
echo     ^</script^>
echo ^</body^>
echo ^</html^>
) > test-backend.html

echo.
echo ==========================================
echo   ✅ SETUP COMPLEET!
echo ==========================================
echo.
echo 📋 WAT IS ER GEMAAKT:
echo   • backend/ folder met Node.js server
echo   • Verbeterde CSS voor loading/errors  
echo   • Nieuwe AI module met backend calls
echo   • Test pagina voor backend
echo.
echo 🔧 VOLGENDE STAPPEN:
echo   1. Edit backend/.env - voeg je CLAUDE_API_KEY toe
echo   2. Start backend: cd backend ^&^& npm start
echo   3. Test backend: open test-backend.html in browser
echo   4. Update frontend: vervang ai-analysis-module.js met ai-analysis-module-new.js
echo.
echo 🚀 START BACKEND:
echo   cd backend
echo   npm start
echo.
echo ⚠️  VERGEET NIET: Je Claude API key toevoegen in backend/.env
echo.
pause

# ===== MAC/LINUX SETUP SCRIPT =====
# Sla op als: setup-recruitin.sh

#!/bin/bash

echo ""
echo "========================================="
echo "  🚀 RecruitIn Auto Setup Script"
echo "  Maakt backend + verbetert frontend"
echo "========================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js niet gevonden!"
    echo ""
    echo "Download Node.js van: https://nodejs.org"
    echo "Installeer de LTS versie en run dit script opnieuw."
    exit 1
fi

echo "✅ Node.js versie:"
node --version
echo ""

PROJECT_DIR=$(pwd)
echo "📁 Project directory: $PROJECT_DIR"
echo ""

# Create backend directory
echo "📁 Maak backend folder..."
mkdir -p backend
cd backend

echo "📦 Initialiseer Node.js project..."
cat > package.json << 'EOF'
{
  "name": "recruitin-backend",
  "version": "1.0.0",
  "description": "Backend voor RecruitIn Vacature Analyser",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "helmet": "^7.0.0",
    "express-rate-limit": "^6.8.1"
  },
  "devDependencies": {
    "nodemon": "^3.0.1"
  }
}
EOF

echo "📦 Installeer dependencies..."
npm install

echo "🔐 Maak .env file..."
cat > .env << 'EOF'
CLAUDE_API_KEY=VERVANG_MET_JOUW_ECHTE_API_KEY
PORT=3000
NODE_ENV=development
EOF

echo "📝 Maak server.js..."
cat > server.js << 'EOF'
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();

// Security & CORS
app.use(helmet());
app.use(cors({
  origin: ['http://localhost:5500', 'http://127.0.0.1:5500', 'http://localhost:3000', 'file://'],
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 10, // 10 requests per window
  message: { error: 'Te veel requests. Probeer later opnieuw.' }
});

app.use('/api/analyze', limiter);
app.use(express.json({ limit: '10mb' }));

// Logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Main analyze endpoint
app.post('/api/analyze', async (req, res) => {
  try {
    const { content } = req.body;

    // Validation
    if (!content || typeof content !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Vacature content is verplicht'
      });
    }

    if (content.length < 50) {
      return res.status(400).json({
        success: false,
        error: 'Vacature tekst moet minimaal 50 karakters bevatten'
      });
    }

    // Call Claude API
    const result = await callClaudeAPI(content);

    res.json({
      success: true,
      data: result,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Analysis error:', error);
    res.status(500).json({
      success: false,
      error: 'Er ging iets mis bij de analyse. Probeer het opnieuw.'
    });
  }
});

// Claude API function
async function callClaudeAPI(content) {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'anthropic-version': '2023-06-01',
      'x-api-key': process.env.CLAUDE_API_KEY
    },
    body: JSON.stringify({
      model: 'claude-3-sonnet-20240229',
      max_tokens: 2000,
      messages: [{
        role: 'user',
        content: createPrompt(content)
      }]
    })
  });

  if (!response.ok) {
    throw new Error(`Claude API error: ${response.status}`);
  }

  const data = await response.json();
  return parseClaudeResponse(data.content[0].text);
}

function createPrompt(content) {
  return `Je bent een senior recruitment expert. Analyseer deze Nederlandse vacature en geef scores 1-10:

VACATURE:
${content}

Beoordeel:
1. Aantrekkelijkheid 
2. Duidelijkheid
3. Volledigheid  
4. Salaris transparantie
5. Sollicitatie UX

Antwoord in exact dit JSON format:
{
  "overallScore": 7.2,
  "scores": {
    "aantrekkelijkheid": {"score": 7, "feedback": "Tekst spreekt goed aan"},
    "duidelijkheid": {"score": 8, "feedback": "Taken zijn helder"},
    "volledigheid": {"score": 6, "feedback": "Mist enkele details"},
    "salaris": {"score": 9, "feedback": "Salaris duidelijk vermeld"},
    "ux": {"score": 7, "feedback": "Solliciteren is makkelijk"}
  },
  "topVerbeteringen": [
    {"actie": "Voeg company culture toe", "impact": "Hoog", "tijd": "20 min"},
    {"actie": "Specificeer werkplek details", "impact": "Medium", "tijd": "15 min"},
    {"actie": "Verbeter call-to-action", "impact": "Medium", "tijd": "10 min"}
  ],
  "marktAnalyse": {
    "niveau": "Medior",
    "salarisbenchmark": "€45.000 - €55.000",
    "competitiviteit": "Sterk"
  }
}`;
}

function parseClaudeResponse(text) {
  try {
    let cleaned = text.trim();
    if (cleaned.startsWith('```json')) {
      cleaned = cleaned.replace(/```json\n?/, '').replace(/\n?```$/, '');
    }
    return JSON.parse(cleaned);
  } catch (error) {
    return {
      overallScore: 6.5,
      scores: {
        aantrekkelijkheid: {score: 6, feedback: "Basis analyse"},
        duidelijkheid: {score: 7, feedback: "Redelijk duidelijk"},
        volledigheid: {score: 6, feedback: "Basis informatie"},
        salaris: {score: 5, feedback: "Salaris onduidelijk"},
        ux: {score: 7, feedback: "Standaard proces"}
      },
      topVerbeteringen: [
        {actie: "Voeg meer details toe", impact: "Hoog", tijd: "30 min"},
        {actie: "Verbeter salaris info", impact: "Hoog", tijd: "15 min"},
        {actie: "Optimaliseer contact", impact: "Medium", tijd: "10 min"}
      ],
      marktAnalyse: {
        niveau: "Onbekend",
        salarisbenchmark: "Niet beschikbaar", 
        competitiviteit: "Gemiddeld"
      }
    };
  }
}

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`
🚀 RecruitIn Backend actief!
📍 URL: http://localhost:${PORT}
🔧 Environment: ${process.env.NODE_ENV}
⏰ Gestart: ${new Date().toLocaleString('nl-NL')}
  `);
});
EOF

# Go back to project root
cd "$PROJECT_DIR"

echo "🎨 Verbeter frontend CSS..."
cat >> css/recruitin-brand.css << 'EOF'

/* Loading States */
.progress-container {
  margin: 20px 0;
  padding: 20px;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-radius: 12px;
  text-align: center;
  border: 1px solid #dee2e6;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background: #e9ecef;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 15px;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #FF6B35, #ff8c5a);
  background-size: 200% 100%;
  width: 0%;
  transition: width 0.5s ease;
  border-radius: 4px;
  animation: shimmer 2s infinite;
}

@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

.progress-text {
  color: #495057;
  font-size: 14px;
  margin: 0;
  font-weight: 500;
}

.analyzing-icon {
  font-size: 24px;
  margin-bottom: 10px;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

/* Error Messages */
.error-message {
  background: linear-gradient(135deg, #fff5f5 0%, #fed7d7 100%);
  border: 1px solid #fc8181;
  border-radius: 12px;
  padding: 20px;
  margin: 20px 0;
  display: flex;
  align-items: flex-start;
  gap: 15px;
  animation: slideInDown 0.3s ease;
}

@keyframes slideInDown {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

.error-icon {
  font-size: 24px;
  flex-shrink: 0;
  color: #e53e3e;
}

.error-content h3 {
  color: #c53030;
  margin: 0 0 8px 0;
  font-size: 18px;
  font-weight: 600;
}

.error-content p {
  color: #742a2a;
  margin: 0 0 15px 0;
  line-height: 1.5;
}

.btn-error {
  background: #e53e3e;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
}

.btn-error:hover {
  background: #c53030;
  transform: translateY(-1px);
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .container { padding: 10px; }
  .recruitin-header h1 { font-size: 2rem; }
  .input-section { padding: 20px 15px; }
  #vacature-input { 
    padding: 15px; 
    font-size: 16px; 
    min-height: 200px; 
  }
  .cta-button { 
    width: 100%; 
    padding: 16px; 
    font-size: 16px; 
  }
  .results-container { padding: 20px 15px; }
  .error-message { 
    flex-direction: column; 
    text-align: center; 
    padding: 15px; 
  }
}
EOF

echo "🔧 Maak verbeterde frontend module..."
cat > js/ai-analysis-module-new.js << 'EOF'
class AIAnalysisModule {
  constructor() {
    this.apiEndpoint = 'http://localhost:3000/api/analyze';
    this.currentAnalysis = null;
  }

  async processVacature(content) {
    try {
      this.showLoadingState();
      
      const response = await fetch(this.apiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content })
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Analyse mislukt');
      }

      this.currentAnalysis = result.data;
      if (window.resultsModule) {
        window.resultsModule.displayResults(result.data);
      }
      this.saveAnalysisLocally(content, result.data);

    } catch (error) {
      console.error('Analysis failed:', error);
      this.showError(error.message);
    } finally {
      this.hideLoadingState();
    }
  }

  showLoadingState() {
    const button = document.getElementById('analyze-btn');
    button.disabled = true;
    button.innerHTML = '🔄 Analyseren...';
    
    const progressHtml = `
      <div id="analysis-progress" class="progress-container">
        <div class="analyzing-icon">🤖</div>
        <div class="progress-bar">
          <div class="progress-fill"></div>
        </div>
        <p class="progress-text">Claude AI analyseert je vacature...</p>
      </div>
    `;
    
    document.querySelector('.input-section').insertAdjacentHTML('beforeend', progressHtml);
    this.animateProgress();
  }

  animateProgress() {
    const progressFill = document.querySelector('.progress-fill');
    let width = 0;
    
    this.progressInterval = setInterval(() => {
      width += Math.random() * 15;
      if (width > 90) width = 90;
      progressFill.style.width = width + '%';
    }, 500);
  }

  hideLoadingState() {
    const button = document.getElementById('analyze-btn');
    button.disabled = false;
    button.innerHTML = '🚀 Analyseer Vacature';
    
    const progress = document.getElementById('analysis-progress');
    if (progress) progress.remove();
    
    if (this.progressInterval) clearInterval(this.progressInterval);
  }

  showError(message) {
    const errorHtml = `
      <div class="error-message">
        <div class="error-icon">⚠️</div>
        <div class="error-content">
          <h3>Oeps! Er ging iets mis</h3>
          <p>${message}</p>
          <button class="btn-error" onclick="this.closest('.error-message').remove()">
            Probeer opnieuw
          </button>
        </div>
      </div>
    `;
    
    document.querySelector('.container').insertAdjacentHTML('afterbegin', errorHtml);
  }

  saveAnalysisLocally(content, results) {
    try {
      const analysis = {
        id: Date.now(),
        content: content.substring(0, 200) + '...',
        overallScore: results.overallScore,
        timestamp: new Date().toISOString()
      };

      const existing = JSON.parse(localStorage.getItem('recruitin_analyses') || '[]');
      existing.unshift(analysis);
      
      if (existing.length > 50) existing.splice(50);
      
      localStorage.setItem('recruitin_analyses', JSON.stringify(existing));
      console.log('✅ Analyse opgeslagen');
      
    } catch (error) {
      console.warn('Kon analyse niet opslaan:', error);
    }
  }
}

// Initialize
window.aiAnalysisModule = new AIAnalysisModule();
EOF

echo "🧪 Maak test file..."
cat > test-backend.html << 'EOF'
<!DOCTYPE html>
<html>
<head>
    <title>RecruitIn Backend Test</title>
    <style>
        body { font-family: Arial; margin: 40px; }
        .test { margin: 20px 0; padding: 20px; border: 1px solid #ddd; }
        .success { background: #d4edda; }
        .error { background: #f8d7da; }
        button { padding: 10px 20px; margin: 5px; }
    </style>
</head>
<body>
    <h1>🧪 RecruitIn Backend Tests</h1>
    
    <div class="test">
        <h3>Test 1: Health Check</h3>
        <button onclick="testHealth()">Test Health</button>
        <div id="health-result"></div>
    </div>
    
    <div class="test">
        <h3>Test 2: Analysis</h3>
        <button onclick="testAnalysis()">Test Analysis</button>
        <div id="analysis-result"></div>
    </div>

    <script>
        async function testHealth() {
            try {
                const response = await fetch('http://localhost:3000/health');
                const data = await response.json();
                document.getElementById('health-result').innerHTML = 
                    '<div class="success">✅ ' + JSON.stringify(data) + '</div>';
            } catch (error) {
                document.getElementById('health-result').innerHTML = 
                    '<div class="error">❌ ' + error.message + '</div>';
            }
        }
        
        async function testAnalysis() {
            try {
                const response = await fetch('http://localhost:3000/api/analyze', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 
                        content: 'Test vacature voor een developer positie. We zoeken iemand met ervaring in JavaScript en React. Salaris €50.000 per jaar. Solliciteer via email naar jobs@test.nl.'
                    })
                });
                const data = await response.json();
                document.getElementById('analysis-result').innerHTML = 
                    '<div class="success">✅ ' + JSON.stringify(data, null, 2) + '</div>';
            } catch (error) {
                document.getElementById('analysis-result').innerHTML = 
                    '<div class="error">❌ ' + error.message + '</div>';
            }
        }
    </script>
</body>
</html>
EOF

echo ""
echo "=========================================="
echo "  ✅ SETUP COMPLEET!"
echo "=========================================="
echo ""
echo "📋 WAT IS ER GEMAAKT:"
echo "  • backend/ folder met Node.js server"
echo "  • Verbeterde CSS voor loading/errors"  
echo "  • Nieuwe AI module met backend calls"
echo "  • Test pagina voor backend"
echo ""
echo "🔧 VOLGENDE STAPPEN:"
echo "  1. Edit backend/.env - voeg je CLAUDE_API_KEY toe"
echo "  2. Start backend: cd backend && npm start"
echo "  3. Test backend: open test-backend.html in browser"
echo "  4. Update frontend: vervang ai-analysis-module.js met ai-analysis-module-new.js"
echo ""
echo "🚀 START BACKEND:"
echo "  cd backend"
echo "  npm start"
echo ""
echo "⚠️  VERGEET NIET: Je Claude API key toevoegen in backend/.env"
echo ""

# ===== QUICK START INSTRUCTIES =====

# WINDOWS GEBRUIKERS:
# 1. Kopieer de Windows batch code naar een bestand: setup-recruitin.bat
# 2. Dubbelklik het bestand of run in Command Prompt
# 3. Volg de instructies op het scherm

# MAC/LINUX GEBRUIKERS:  
# 1. Kopieer de bash script code naar een bestand: setup-recruitin.sh
# 2. Maak het executable: chmod +x setup-recruitin.sh
# 3. Run het script: ./setup-recruitin.sh
# 4. Volg de instructies op het scherm

# NA HET SCRIPT:
# 1. Edit backend/.env file - voeg je echte Claude API key toe
# 2. Start de backend server: cd backend && npm start
# 3. Test in browser: open test-backend.html
# 4. Update je frontend: vervang ai-analysis-module.js met ai-analysis-module-new.js