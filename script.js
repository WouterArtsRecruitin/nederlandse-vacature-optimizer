// ===============================================
// Nederlandse Vacature Optimizer - JavaScript
// TalentFlow Pro MVP - Complete Functionality
// ===============================================

// Global Variables
let isAnalyzing = false;
let currentAnalysis = null;

// Security Helper Functions
function secureUpdateHTML(element, htmlContent) {
    // Sanitize HTML content to prevent XSS attacks
    if (typeof DOMPurify !== 'undefined') {
        const cleanHTML = DOMPurify.sanitize(htmlContent);
        element.innerHTML = cleanHTML;
    } else {
        // Fallback: use textContent for safety if DOMPurify not loaded
        console.warn('DOMPurify not loaded, using textContent as fallback');
        element.textContent = htmlContent.replace(/<[^>]*>/g, '');
    }
}

// Performance Helper Functions
function measurePerformance(name, fn) {
    // Performance monitoring wrapper
    return async function(...args) {
        const start = performance.now();
        try {
            const result = await fn.apply(this, args);
            const end = performance.now();
            console.log(`⏱️ ${name}: ${(end - start).toFixed(2)}ms`);
            return result;
        } catch (error) {
            const end = performance.now();
            console.log(`❌ ${name} failed after ${(end - start).toFixed(2)}ms:`, error.message);
            throw error;
        }
    };
}

// Lazy loading for TypeForm embed
function loadTypeFormWhenNeeded() {
    // Only load TypeForm script when user shows interest
    const script = document.createElement('script');
    script.src = '//embed.typeform.com/next/embed.js';
    script.async = true;
    document.head.appendChild(script);
    console.log('📝 TypeForm script loaded on demand');
}

// Nederlandse Recruitment Prompt Template
const NEDERLANDS_RECRUITMENT_PROMPT = `
Je bent een senior Nederlandse recruitment expert met 15+ jaar ervaring in tech en industrie.

NEDERLANDSE ARBEIDSMARKT 2025 CONTEXT:
- TTH (Time-to-Hire): 45-60 dagen voor senior rollen
- Salaristransparantie verhoogt respons met 40-60%
- Regionale verschillen: Randstad +10-15% vs Gelderland/Noord-Brabant
- Tech/industrie focus met emphasis op Gelderland markt
- AVG/GDPR compliance is verplicht
- Inclusieve taal verhoogt diversiteit met 25%

ANALYSE CRITERIA (1-10 scores):
1. Aantrekkelijkheid: Employer branding, benefits, ontwikkelingsmogelijkheden, cultuur
2. Duidelijkheid: Functieomschrijving, verwachtingen, doelen, rapportagelijnen
3. Volledigheid: Aanwezigheid essentiële informatie (functie, eisen, salaris, locatie)
4. Salaris_transparantie: Specifieke range of duidelijke indicatie
5. Contact_sollicitatie: Duidelijk proces en toegankelijke contactgegevens

NEDERLANDSE MARKT SPECIFIEKE FACTOREN:
- Werk-privé balans belangrijk voor kandidaten
- Duurzaamheid en maatschappelijke impact wordt gewaardeerd  
- Directe communicatiestijl past bij Nederlandse cultuur
- Hybride werken is standaard geworden
- Ontwikkelingsmogelijkheden zijn cruciaal voor behoud

VACATURE TEKST VOOR ANALYSE:
{VACATURE_TEKST}

Geef analyse in EXACT dit JSON format (geen andere tekst):
{
  "scores": {
    "aantrekkelijkheid": {"score": X, "toelichting": "specifieke feedback waarom deze score"},
    "duidelijkheid": {"score": X, "toelichting": "specifieke feedback waarom deze score"},
    "volledigheid": {"score": X, "toelichting": "specifieke feedback waarom deze score"},
    "salaris_transparantie": {"score": X, "toelichting": "specifieke feedback waarom deze score"},
    "contact_sollicitatie": {"score": X, "toelichting": "specifieke feedback waarom deze score"}
  },
  "gemiddelde_score": X.X,
  "top_3_verbeterpunten": [
    "Concreet verbeterpunt 1 met impact op response rate - specifiek en actionable",
    "Concreet verbeterpunt 2 met impact op TTH - specifiek en actionable", 
    "Concreet verbeterpunt 3 met marktcompetitiviteit - specifiek en actionable"
  ],
  "nederlandse_markt_analyse": {
    "functieniveau": "junior/medior/senior + argumentatie waarom",
    "salaris_inschatting": "€X.XXX-€X.XXX op basis Nederlandse benchmarks voor deze functie",
    "competitiviteit": "zwak/gemiddeld/sterk + waarom ten opzichte van marktstandaard",
    "tth_prognose": "X dagen op basis vacaturekwaliteit en marktomstandigheden",
    "regio_advies": "Gelderland-specifiek advies indien relevant voor de functie"
  },
  "geoptimaliseerde_versie": "Complete verbeterde Nederlandse vacaturetekst die alle feedback implementeert, inclusief functietitel, aantrekkelijke intro, duidelijke taken en eisen, salaris range, benefits, en professionele contactgegevens. Gebruik Nederlandse recruitment best practices."
}
`;

// Demo Vacatures Database
const DEMO_VACATURES = {
    slecht: `Quality Manager

Een uniek hightechproductiebedrijf zoekt een quality manager.

Taken:
- Kwaliteit bewaken
- Processen verbeteren  
- Samenwerken met collega's

Eisen:
- HBO/WO opleiding
- Ervaring in kwaliteit
- Communicatief vaardig

Arbeidsvoorwaarden:
- Goed salaris
- Leuke collega's
- Goede sfeer

Solliciteer via email.`,

    gemiddeld: `Senior Software Developer - React/Node.js

TechStart BV zoekt een ervaren developer voor ons groeiende team.

Wat ga je doen:
• Frontend development met React
• Backend API's bouwen met Node.js
• Samenwerken in Agile team
• Code reviews en mentoring

Wat zoeken we:
• 3+ jaar ervaring React/Node.js
• Kennis van TypeScript
• Ervaring met databases (PostgreSQL)
• HBO/WO niveau

Wat bieden we:
• Competitive salary
• Flexibele werktijden
• Groei mogelijkheden
• Moderne tools

Interesse? Mail naar jobs@techstart.nl`,

    goed: `Senior Quality Manager - Zero Defect Excellence

🎯 Transformeer kwaliteitsprocessen bij innovatief hightech bedrijf op de Veluwe

Als Quality Manager bij ons toonaangevende productiebedrijf leid je de kwaliteitsrevolutie voor internationale medische en aerospace klanten.

Jouw impact:
• Implementeren van zero-defect productieprocessen (ISO 13485, AS9100)
• Leiden van continuous improvement projecten met Lean Six Sigma methodologie
• Strategische advisering aan senior management over kwaliteitsrisico's
• Coaching en ontwikkeling van multidisciplinair kwaliteitsteam (8 professionals)

💼 Wat zoeken we?
• 5+ jaar leidinggevende ervaring Quality Management (hightech/medtech)
• WO Technische Bedrijfskunde + Six Sigma Black Belt certificering
• Aantoonbare ervaring met ISO 9001/13485 en AS9100 implementatie
• Excellent in Nederlands en Engels (stakeholder communicatie)
• Woonachtig in regio Arnhem, Nijmegen, Apeldoorn of omgeving

💰 Wat bieden wij? (€75.000 - €95.000)
• Competitief salaris €75.000-€95.000 + resultaatbonus tot 10%
• 40 vrije dagen (27 vakantie + 13 ADV)
• Hybride werken: 3 dagen kantoor / 2 dagen thuis
• Persoonlijk ontwikkelbudget €3.000/jaar voor certificeringen
• Pensioenregeling met 50% werkgeversbijdrage
• Leaseauto of reiskostenvergoeding €0.19/km
• Internationale carrièremogelijkheden binnen VECO groep

🚀 Jouw groeipad:
Direct rapporterend aan Operations Director met doorgroeimogelijkheden naar:
• Director Quality & Compliance (binnen 2-3 jaar)
• Operations Director functie
• International Quality Lead voor groepsmaatschappijen

📞 Direct solliciteren:
Marlon Vintges, Senior Recruiter
Tel: 06-48772698 (ook WhatsApp)
Email: m.vintges@veco.com

Geïnteresseerd? Solliciteer vandaag - wij reageren binnen 24 uur!

VECO Precision • Veluwe • www.veco.com
Acquisitie naar aanleiding van deze vacature wordt niet gewaardeerd.`
};

// ===============================================
// APP INITIALIZATION
// ===============================================

function initializeApp() {
    console.log('🚀 Nederlandse Vacature Optimizer MVP wordt geïnitialiseerd...');
    
    // Hide loading screen after 2 seconds
    setTimeout(() => {
        const loadingScreen = document.getElementById('loadingScreen');
        const app = document.getElementById('app');
        
        if (loadingScreen && app) {
            loadingScreen.style.display = 'none';
            app.style.display = 'block';
            app.style.animation = 'fadeIn 0.5s ease-out';
        }
    }, 2000);
    
    // Initialize event listeners
    setupEventListeners();
    
    // Initialize character counter
    updateCharCounter();
    
    // Track page load
    trackEvent('page_load', {
        event_category: 'engagement',
        timestamp: new Date().toISOString()
    });
    
    console.log('✅ App geïnitialiseerd');
}

function setupEventListeners() {
    // Textarea input events
    const textarea = document.getElementById('vacatureInput');
    if (textarea) {
        textarea.addEventListener('input', updateCharCounter);
        textarea.addEventListener('paste', handlePaste);
    }
    
    // Button click tracking
    document.addEventListener('click', (e) => {
        if (e.target.matches('.demo-btn')) {
            trackEvent('demo_button_clicked', {
                event_category: 'user_interaction',
                demo_type: e.target.textContent.includes('Slechte') ? 'bad' : 
                          e.target.textContent.includes('Gemiddelde') ? 'average' : 'good'
            });
        }
    });
}

// ===============================================
// DEMO FUNCTIONALITY
// ===============================================

function loadDemoVacature(type) {
    const textarea = document.getElementById('vacatureInput');
    const resultsDiv = document.getElementById('results');
    
    if (!textarea || !DEMO_VACATURES[type]) {
        showToast('Demo niet beschikbaar', 'Er ging iets mis bij het laden van de demo vacature.', 'error');
        return;
    }
    
    // Clear previous results
    if (resultsDiv) {
        resultsDiv.style.display = 'none';
    }
    
    // Load demo content with animation
    textarea.style.opacity = '0.5';
    
    setTimeout(() => {
        textarea.value = DEMO_VACATURES[type];
        updateCharCounter();
        textarea.style.opacity = '1';
        
        // Scroll to textarea
        textarea.scrollIntoView({ 
            behavior: 'smooth',
            block: 'center'
        });
        
        // Show success message
        const typeLabels = {
            slecht: 'Slechte Vacature',
            gemiddeld: 'Gemiddelde Vacature',
            goed: 'Goede Vacature'
        };
        
        showToast(
            `${typeLabels[type]} Geladen`,
            'Demo vacature is ingeladen. Klik op "Analyseer Vacature" om te beginnen.',
            'success'
        );
        
        // Track demo usage
        trackEvent('demo_loaded', {
            event_category: 'demo_usage',
            demo_type: type,
            text_length: textarea.value.length
        });
        
    }, 300);
}

// ===============================================
// TEXT PROCESSING FUNCTIONS
// ===============================================

function updateCharCounter() {
    const textarea = document.getElementById('vacatureInput');
    const charCountSpan = document.getElementById('charCount');
    const lengthIndicator = document.getElementById('lengthIndicator');
    const structureIndicator = document.getElementById('structureIndicator');
    const keywordIndicator = document.getElementById('keywordIndicator');
    
    if (!textarea || !charCountSpan) return;
    
    const text = textarea.value;
    const charCount = text.length;
    
    // Update character counter
    charCountSpan.textContent = charCount;
    
    // Update length indicator
    if (lengthIndicator) {
        let lengthStatus = '';
        let lengthClass = '';
        
        if (charCount < 100) {
            lengthStatus = 'Te kort';
            lengthClass = 'status-poor';
        } else if (charCount < 300) {
            lengthStatus = 'Kort';
            lengthClass = 'status-fair';
        } else if (charCount < 1000) {
            lengthStatus = 'Goed';
            lengthClass = 'status-good';
        } else if (charCount < 2000) {
            lengthStatus = 'Uitgebreid';
            lengthClass = 'status-excellent';
        } else {
            lengthStatus = 'Zeer uitgebreid';
            lengthClass = 'status-excellent';
        }
        
        lengthIndicator.innerHTML = `
            <span class="indicator-icon">📏</span>
            <span class="indicator-text ${lengthClass}">Lengte: ${lengthStatus}</span>
        `;
    }
    
    // Update structure indicator
    if (structureIndicator && text.length > 50) {
        const hasTitle = /^[A-Z][^\\n]{10,}$/m.test(text);
        const hasBullets = /[•·\-\*]/.test(text);
        const hasSections = text.split('\n\n').length > 2;
        
        let structureScore = 0;
        if (hasTitle) structureScore++;
        if (hasBullets) structureScore++;
        if (hasSections) structureScore++;
        
        let structureStatus = '';
        let structureClass = '';
        
        if (structureScore >= 2) {
            structureStatus = 'Goed gestructureerd';
            structureClass = 'status-good';
        } else if (structureScore === 1) {
            structureStatus = 'Basic structuur';
            structureClass = 'status-fair';
        } else {
            structureStatus = 'Meer structuur nodig';
            structureClass = 'status-poor';
        }
        
        structureIndicator.innerHTML = `
            <span class="indicator-icon">🏗️</span>
            <span class="indicator-text ${structureClass}">Structuur: ${structureStatus}</span>
        `;
    }
    
    // Update keyword indicator
    if (keywordIndicator && text.length > 50) {
        const keywords = [
            'salaris', 'euro', '€', 'loon', 'beloning',
            'ervaring', 'jaar', 'senior', 'junior',
            'opleiding', 'hbo', 'wo', 'diploma',
            'team', 'collega', 'samenwerk',
            'groei', 'ontwikkel', 'carri[eë]re',
            'hybride', 'thuiswerk', 'kantoor',
            'sollicit', 'cv', 'motivatie'
        ];
        
        const textLower = text.toLowerCase();
        const foundKeywords = keywords.filter(keyword => 
            new RegExp(keyword).test(textLower)
        ).length;
        
        let keywordStatus = '';
        let keywordClass = '';
        
        if (foundKeywords >= 8) {
            keywordStatus = 'Rijk aan keywords';
            keywordClass = 'status-excellent';
        } else if (foundKeywords >= 5) {
            keywordStatus = 'Goede keywords';
            keywordClass = 'status-good';
        } else if (foundKeywords >= 3) {
            keywordStatus = 'Basic keywords';
            keywordClass = 'status-fair';
        } else {
            keywordStatus = 'Meer keywords nodig';
            keywordClass = 'status-poor';
        }
        
        keywordIndicator.innerHTML = `
            <span class="indicator-icon">🔑</span>
            <span class="indicator-text ${keywordClass}">Keywords: ${keywordStatus}</span>
        `;
    }
}

function clearInput() {
    const textarea = document.getElementById('vacatureInput');
    const resultsDiv = document.getElementById('results');
    
    if (textarea) {
        textarea.value = '';
        updateCharCounter();
        textarea.focus();
    }
    
    if (resultsDiv) {
        resultsDiv.style.display = 'none';
    }
    
    showToast('Input Gewist', 'Tekstveld is leeggemaakt.', 'info');
    
    trackEvent('input_cleared', {
        event_category: 'user_interaction'
    });
}

async function pasteFromClipboard() {
    try {
        const text = await navigator.clipboard.readText();
        const textarea = document.getElementById('vacatureInput');
        
        if (textarea && text.trim()) {
            textarea.value = text;
            updateCharCounter();
            textarea.focus();
            
            showToast('Tekst Geplakt', `${text.length} karakters geplakt uit klembord.`, 'success');
            
            trackEvent('clipboard_paste', {
                event_category: 'user_interaction',
                text_length: text.length
            });
        }
    } catch (error) {
        showToast('Plakken Mislukt', 'Kon niet plakken uit klembord. Gebruik Ctrl+V.', 'warning');
    }
}

function handlePaste(event) {
    setTimeout(() => {
        updateCharCounter();
        
        trackEvent('paste_event', {
            event_category: 'user_interaction',
            text_length: event.target.value.length
        });
    }, 100);
}

// ===============================================
// MAIN ANALYSIS FUNCTION
// ===============================================

async function analyzeVacature() {
    const textarea = document.getElementById('vacatureInput');
    const vacatureText = textarea ? textarea.value.trim() : '';
    
    // Validation
    if (!vacatureText) {
        showToast('Geen Tekst', 'Voer eerst een vacaturetekst in om te analyseren.', 'warning');
        if (textarea) textarea.focus();
        return;
    }
    
    if (vacatureText.length < 100) {
        showToast('Tekst Te Kort', 'Voer minimaal 100 karakters in voor een betrouwbare analyse.', 'warning');
        if (textarea) textarea.focus();
        return;
    }
    
    if (vacatureText.length > 8000) {
        showToast('Tekst Te Lang', 'Maximum 8000 karakters toegestaan voor optimale prestaties.', 'warning');
        return;
    }
    
    // Prevent double analysis
    if (isAnalyzing) {
        showToast('Analyse Bezig', 'Er wordt al een analyse uitgevoerd. Even geduld...', 'info');
        return;
    }
    
    try {
        isAnalyzing = true;
        showLoading();
        
        // Track analysis start
        trackEvent('analysis_started', {
            event_category: 'analysis',
            text_length: vacatureText.length,
            timestamp: new Date().toISOString()
        });
        
        console.log('🔍 Starting vacature analysis...');
        const startTime = Date.now();
        
        // Call Claude API with performance monitoring
        const measureClaudeAPI = measurePerformance('Claude API Call', callClaudeAPI);
        const analysis = await measureClaudeAPI(vacatureText);
        
        const analysisTime = (Date.now() - startTime) / 1000;
        console.log(`✅ Analysis completed in ${analysisTime.toFixed(1)}s`);
        
        // Store current analysis
        currentAnalysis = analysis;
        
        // Display results
        displayResults(analysis);
        
        // Track successful analysis
        trackEvent('analysis_completed', {
            event_category: 'analysis',
            average_score: analysis.gemiddelde_score,
            analysis_time: analysisTime,
            text_length: vacatureText.length
        });
        
        showToast(
            'Analyse Voltooid!', 
            `Score: ${analysis.gemiddelde_score}/10 - Bekijk de resultaten hieronder.`, 
            'success'
        );
        
    } catch (error) {
        console.error('❌ Analysis failed:', error);
        showError(error.message);
        
        trackEvent('analysis_error', {
            event_category: 'analysis',
            error_message: error.message,
            text_length: vacatureText.length
        });
        
    } finally {
        isAnalyzing = false;
        hideLoading();
    }
}

// ===============================================
// API INTEGRATION
// ===============================================

async function callClaudeAPI(vacatureText, retryCount = 0) {
    const prompt = NEDERLANDS_RECRUITMENT_PROMPT.replace('{VACATURE_TEKST}', vacatureText);
    const maxRetries = 3;
    
    try {
        // Add timeout to prevent hanging requests
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
        
        // Try Netlify function first
        const response = await fetch('/.netlify/functions/claude-analyze', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                prompt: prompt,
                max_tokens: 4000
            }),
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            // Enhanced error handling based on status code
            let errorMessage = `API aanroep mislukt (${response.status})`;
            if (response.status === 429) {
                errorMessage = 'Te veel verzoeken. Probeer het over een minuut opnieuw.';
            } else if (response.status === 401 || response.status === 403) {
                errorMessage = 'API authenticatie probleem. Contact support.';
            } else if (response.status >= 500) {
                errorMessage = 'Server probleem. Probeer het over een paar minuten opnieuw.';
            }
            throw new Error(errorMessage);
        }

        const data = await response.json();
        
        if (!data.content || !data.content[0] || !data.content[0].text) {
            throw new Error('Ongeldig API antwoord formaat');
        }
        
        let content = data.content[0].text;
        
        // Clean up JSON response
        content = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        
        // Parse JSON with better error handling
        let analysis;
        try {
            analysis = JSON.parse(content);
        } catch (parseError) {
            throw new Error('Kon AI antwoord niet verwerken. Probeer het opnieuw.');
        }
        
        // Validate required fields
        validateAnalysisResponse(analysis);
        
        return analysis;
        
    } catch (error) {
        console.error('Claude API Error:', error);
        
        // Handle timeout errors
        if (error.name === 'AbortError') {
            if (retryCount < maxRetries) {
                console.log(`⏰ Timeout, retry ${retryCount + 1}/${maxRetries}...`);
                await new Promise(resolve => setTimeout(resolve, 1000 * (retryCount + 1))); // Exponential backoff
                return callClaudeAPI(vacatureText, retryCount + 1);
            }
            throw new Error('Analyse duurt te lang. Probeer het later opnieuw.');
        }
        
        // Handle network errors with retry
        if ((error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) && retryCount < maxRetries) {
            console.log(`🔄 Network error, retry ${retryCount + 1}/${maxRetries}...`);
            await new Promise(resolve => setTimeout(resolve, 1000 * (retryCount + 1))); // Exponential backoff
            return callClaudeAPI(vacatureText, retryCount + 1);
        }
        
        // Try fallback mock analysis for development/API issues
        if (error.message.includes('404') || error.message.includes('Netlify') || error.message.includes('API authenticatie')) {
            console.log('🔄 Using fallback mock analysis...');
            return generateMockAnalysis(vacatureText);
        }
        
        // User-friendly error message
        const userMessage = error.message.startsWith('Te veel') || error.message.startsWith('API') || error.message.startsWith('Server') 
            ? error.message 
            : 'Er ging iets mis bij de analyse. Probeer het opnieuw.';
            
        throw new Error(userMessage);
    }
}

function validateAnalysisResponse(analysis) {
    const required = ['scores', 'gemiddelde_score', 'top_3_verbeterpunten', 'nederlandse_markt_analyse', 'geoptimaliseerde_versie'];
    
    for (const field of required) {
        if (!analysis[field]) {
            throw new Error(`Invalid analysis response: missing ${field}`);
        }
    }
    
    if (!analysis.scores.aantrekkelijkheid || !analysis.scores.duidelijkheid) {
        throw new Error('Invalid analysis response: missing score details');
    }
}

function generateMockAnalysis(vacatureText) {
    // Fallback mock analysis for development/testing
    const textLength = vacatureText.length;
    const hasSalary = /€|euro|salaris|loon/i.test(vacatureText);
    const hasStructure = vacatureText.split('\n').length > 3;
    
    const baseScore = hasSalary ? 7 : 5;
    const structureBonus = hasStructure ? 1 : 0;
    const lengthBonus = textLength > 500 ? 1 : 0;
    
    const score = Math.min(baseScore + structureBonus + lengthBonus, 10);
    
    return {
        scores: {
            aantrekkelijkheid: {
                score: score - 1,
                toelichting: "Vacature heeft basis aantrekkelijkheid maar kan verbeteren met meer employer branding"
            },
            duidelijkheid: {
                score: score,
                toelichting: "Functieomschrijving is redelijk duidelijk maar kan specifieker"
            },
            volledigheid: {
                score: score - 0.5,
                toelichting: "De meeste essentiële informatie is aanwezig"
            },
            salaris_transparantie: {
                score: hasSalary ? 8 : 3,
                toelichting: hasSalary ? "Salarisinformatie is aanwezig" : "Geen salarisinformatie gevonden - dit verlaagt respons significant"
            },
            contact_sollicitatie: {
                score: 6,
                toelichting: "Sollicitatieprocedure kan duidelijker en aantrekkelijker"
            }
        },
        gemiddelde_score: Number(score.toFixed(1)),
        top_3_verbeterpunten: [
            hasSalary ? 
                "Maak het salaris nog specifieker met een range (bijv. €50.000-60.000)" :
                "Voeg een salaris range toe - dit verhoogt respons met 40-60%",
            "Verbeter de aantrekkelijkheid met meer employer branding en bedrijfscultuur",
            "Maak de functieomschrijving specifieker met concrete voorbeelden en verwachtingen"
        ],
        nederlandse_markt_analyse: {
            functieniveau: textLength > 800 ? "Senior niveau op basis van uitgebreide beschrijving" : "Medior niveau op basis van beschrijving",
            salaris_inschatting: "€45.000-€65.000 op basis van Nederlandse marktstandaarden",
            competitiviteit: score > 7 ? "Sterk - bovengemiddelde vacature" : score > 5 ? "Gemiddeld - kan verbeteren" : "Zwak - significante verbeteringen nodig",
            tth_prognose: `${Math.max(30, 60 - (score * 5))} dagen op basis van vacaturekwaliteit`,
            regio_advies: "Voor Gelderland markt: benadruk hybride werken en werk-privé balans"
        },
        geoptimaliseerde_versie: `GEOPTIMALISEERDE VERSIE (Mock):

Senior Developer - React/Node.js
€50.000 - €65.000 | Hybride werken | Gelderland

🚀 Join ons groeiende tech team!

Wat ga je doen:
• Bouwen van schaalbare React applicaties
• Ontwikkelen van Node.js backend services  
• Samenwerken in een Agile development team
• Mentoren van junior developers

Wat zoeken we:
• 3+ jaar ervaring met React en Node.js
• Kennis van TypeScript en moderne frameworks
• HBO/WO opleiding of gelijkwaardige ervaring
• Passie voor clean code en best practices

Wat bieden wij:
• Competitief salaris: €50.000-€65.000
• Hybride werken (3 dagen kantoor, 2 thuis)
• €2.000 ontwikkelbudget per jaar
• 25 vakantiedagen + tijd voor side projects
• Moderne tech stack en tools
• Informele sfeer met gedreven collega's

🎯 Direct solliciteren:
Mail je CV naar jobs@company.nl of bel 06-12345678
We reageren binnen 48 uur!

Bedrijfsnaam | Locatie | www.website.nl`
    };
}

// ===============================================
// RESULTS DISPLAY
// ===============================================

function displayResults(analysis) {
    const resultsDiv = document.getElementById('results');
    if (!resultsDiv) return;
    
    // Generate scores HTML
    const scoresHTML = Object.entries(analysis.scores).map(([key, data]) => {
        const scoreClass = data.score <= 4 ? 'score-low' : data.score <= 6 ? 'score-medium' : 'score-high';
        const labels = {
            'aantrekkelijkheid': 'Aantrekkelijkheid',
            'duidelijkheid': 'Duidelijkheid', 
            'volledigheid': 'Volledigheid',
            'salaris_transparantie': 'Salaris Transparantie',
            'contact_sollicitatie': 'Contact/Sollicitatie'
        };
        
        return `
            <div class="score-card">
                <div class="score-number ${scoreClass}">${data.score}/10</div>
                <div class="score-label">${labels[key]}</div>
                <div class="score-description">${data.toelichting}</div>
            </div>
        `;
    }).join('');

    // Add average score
    const avgScoreClass = analysis.gemiddelde_score <= 4 ? 'score-low' : 
                         analysis.gemiddelde_score <= 6 ? 'score-medium' : 'score-high';
    
    const averageScoreHTML = `
        <div class="score-card average-score-card">
            <div class="score-number" style="color: var(--primary-orange);">${analysis.gemiddelde_score}/10</div>
            <div class="score-label"><strong>Gemiddelde Score</strong></div>
            <div class="score-description">
                ${analysis.gemiddelde_score >= 8 ? 'Uitstekende vacature!' : 
                  analysis.gemiddelde_score >= 6 ? 'Goede basis, nog te verbeteren' :
                  analysis.gemiddelde_score >= 4 ? 'Gemiddeld, aanzienlijke verbeteringen mogelijk' :
                  'Veel verbeteringen nodig voor betere resultaten'}
            </div>
        </div>
    `;

    // Generate improvements HTML
    const improvementsHTML = analysis.top_3_verbeterpunten.map((punt, index) => 
        `<li class="improvement-item">
            <span class="improvement-number">${index + 1}.</span> ${punt}
        </li>`
    ).join('');

    // Generate market analysis HTML
    const marketAnalysisHTML = `
        <div class="market-grid">
            <div class="market-item">
                <div class="market-label">Functieniveau:</div>
                <div class="market-value">${analysis.nederlandse_markt_analyse.functieniveau}</div>
            </div>
            <div class="market-item">
                <div class="market-label">Salaris inschatting:</div>
                <div class="market-value">${analysis.nederlandse_markt_analyse.salaris_inschatting}</div>
            </div>
            <div class="market-item">
                <div class="market-label">Competitiviteit:</div>
                <div class="market-value">${analysis.nederlandse_markt_analyse.competitiviteit}</div>
            </div>
            <div class="market-item">
                <div class="market-label">TTH prognose:</div>
                <div class="market-value">${analysis.nederlandse_markt_analyse.tth_prognose}</div>
            </div>
            ${analysis.nederlandse_markt_analyse.regio_advies ? 
              `<div class="market-item">
                <div class="market-label">Regio advies:</div>
                <div class="market-value">${analysis.nederlandse_markt_analyse.regio_advies}</div>
              </div>` : ''
            }
        </div>
    `;

    // Full results HTML
    const resultsHTML = `
        <div class="results-header">
            <h3 class="results-title">📊 Vacature Analyse Resultaten</h3>
            <p class="results-subtitle">
                Gebaseerd op Nederlandse recruitment best practices en marktstandaarden
            </p>
        </div>
        
        <div class="scores-grid">
            ${scoresHTML}
            ${averageScoreHTML}
        </div>
        
        <div class="analysis-section">
            <h4 class="analysis-title">
                <span>🎯</span>
                Top 3 Kritieke Verbeterpunten
            </h4>
            <ul class="improvement-list">
                ${improvementsHTML}
            </ul>
        </div>
        
        <div class="analysis-section">
            <h4 class="analysis-title">
                <span>💰</span>
                Nederlandse Marktanalyse
            </h4>
            <div class="market-analysis">
                ${marketAnalysisHTML}
            </div>
        </div>
        
        <div class="optimized-section">
            <h4 class="analysis-title">
                <span>⚡</span>
                Geoptimaliseerde Vacaturetekst
            </h4>
            <div class="optimized-text">${analysis.geoptimaliseerde_versie}</div>
            <button onclick="copyOptimizedText()" class="copy-btn">
                <span>📋</span>
                Kopieer Geoptimaliseerde Versie
            </button>
            <button onclick="downloadAnalysis()" class="copy-btn" style="background: var(--primary-blue); margin-left: 1rem;">
                <span>📄</span>
                Download Analyse (PDF)
            </button>
        </div>
    `;

    // Security: Use secure HTML update to prevent XSS attacks
    secureUpdateHTML(resultsDiv, resultsHTML);
    resultsDiv.style.display = 'block';
    
    // Show upgrade section after results
    const upgradeSection = document.getElementById('upgradeSection');
    if (upgradeSection) {
        upgradeSection.style.display = 'block';
    }
    
    // Smooth scroll to results
    setTimeout(() => {
        resultsDiv.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    }, 100);
}

// ===============================================
// UI HELPER FUNCTIONS
// ===============================================

function showLoading() {
    const btn = document.getElementById('analyzeBtn');
    if (!btn) return;
    
    btn.disabled = true;
    btn.innerHTML = `
        <div class="spinner"></div>
        <div>
            <div class="btn-text">Analyseren...</div>
            <div class="btn-subtitle">Claude AI werkt voor je</div>
        </div>
    `;
    
    document.getElementById('results').style.display = 'none';
}

function hideLoading() {
    const btn = document.getElementById('analyzeBtn');
    if (!btn) return;
    
    btn.disabled = false;
    btn.innerHTML = `
        <span class="btn-icon">🚀</span>
        <span class="btn-text">Analyseer Vacature</span>
        <span class="btn-subtitle">AI-powered Nederlandse analyse</span>
    `;
}

function showError(message) {
    const resultsDiv = document.getElementById('results');
    if (!resultsDiv) return;
    
    resultsDiv.style.display = 'block';
    resultsDiv.innerHTML = `
        <div class="error-section">
            <h3 class="error-title">❌ Analyse Mislukt</h3>
            <p class="error-message">${message}</p>
            <p><strong>Mogelijke oplossingen:</strong></p>
            <ul style="text-align: left; margin: 1rem 0;">
                <li>Controleer je internetverbinding</li>
                <li>Probeer het over een paar minuten opnieuw</li>
                <li>Gebruik een kortere vacaturetekst</li>
                <li>Herlaad de pagina als het probleem aanhoudt</li>
            </ul>
            <button onclick="analyzeVacature()" class="retry-btn">
                🔄 Opnieuw Proberen
            </button>
        </div>
    `;
}

function showToast(title, message, type = 'info') {
    const container = document.getElementById('toastContainer');
    if (!container) return;
    
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    toast.innerHTML = `
        <div class="toast-title">${title}</div>
        <div class="toast-message">${message}</div>
    `;
    
    container.appendChild(toast);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (toast.parentNode) {
            toast.style.animation = 'slideOutRight 0.3s ease-out forwards';
            setTimeout(() => {
                if (toast.parentNode) {
                    container.removeChild(toast);
                }
            }, 300);
        }
    }, 5000);
}

// ===============================================
// UTILITY FUNCTIONS
// ===============================================

function copyOptimizedText() {
    if (!currentAnalysis) return;
    
    const text = currentAnalysis.geoptimaliseerde_versie;
    
    navigator.clipboard.writeText(text).then(() => {
        const btn = event.target.closest('.copy-btn');
        const originalHTML = btn.innerHTML;
        
        btn.innerHTML = '<span>✅</span> Gekopieerd!';
        btn.style.background = 'var(--success)';
        
        setTimeout(() => {
            btn.innerHTML = originalHTML;
            btn.style.background = 'var(--success)';
        }, 2000);
        
        showToast('Tekst Gekopieerd', 'Geoptimaliseerde vacature is gekopieerd naar klembord.', 'success');
        
        trackEvent('optimized_text_copied', {
            event_category: 'user_interaction',
            score: currentAnalysis.gemiddelde_score
        });
        
    }).catch(err => {
        console.error('Copy failed:', err);
        showToast('Kopiëren Mislukt', 'Selecteer en kopieer de tekst handmatig.', 'error');
    });
}

function downloadAnalysis() {
    if (!currentAnalysis) return;
    
    // Create downloadable content
    const content = `
NEDERLANDSE VACATURE ANALYSE RAPPORT
=====================================

Datum: ${new Date().toLocaleDateString('nl-NL')}
Geanalyseerd met: TalentFlow Pro - Nederlandse Vacature Optimizer

SCORES OVERZICHT:
================
• Aantrekkelijkheid: ${currentAnalysis.scores.aantrekkelijkheid.score}/10
• Duidelijkheid: ${currentAnalysis.scores.duidelijkheid.score}/10
• Volledigheid: ${currentAnalysis.scores.volledigheid.score}/10
• Salaris Transparantie: ${currentAnalysis.scores.salaris_transparantie.score}/10
• Contact/Sollicitatie: ${currentAnalysis.scores.contact_sollicitatie.score}/10

GEMIDDELDE SCORE: ${currentAnalysis.gemiddelde_score}/10

TOP 3 VERBETERPUNTEN:
====================
1. ${currentAnalysis.top_3_verbeterpunten[0]}
2. ${currentAnalysis.top_3_verbeterpunten[1]}
3. ${currentAnalysis.top_3_verbeterpunten[2]}

NEDERLANDSE MARKTANALYSE:
========================
• Functieniveau: ${currentAnalysis.nederlandse_markt_analyse.functieniveau}
• Salaris inschatting: ${currentAnalysis.nederlandse_markt_analyse.salaris_inschatting}
• Competitiviteit: ${currentAnalysis.nederlandse_markt_analyse.competitiviteit}
• TTH prognose: ${currentAnalysis.nederlandse_markt_analyse.tth_prognose}

GEOPTIMALISEERDE VACATURETEKST:
==============================
${currentAnalysis.geoptimaliseerde_versie}

---
Gegenereerd door TalentFlow Pro
Nederlandse Recruitment Intelligence
    `;
    
    // Create and download file
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    link.href = url;
    link.download = `vacature-analyse-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    
    showToast('Analyse Gedownload', 'Rapport is opgeslagen als tekstbestand.', 'success');
    
    trackEvent('analysis_downloaded', {
        event_category: 'user_interaction',
        score: currentAnalysis.gemiddelde_score
    });
}

function trackEvent(eventName, parameters = {}) {
    // Google Analytics tracking
    if (typeof gtag !== 'undefined') {
        gtag('event', eventName, {
            event_category: parameters.event_category || 'general',
            ...parameters
        });
    }
    
    // Console logging for development
    console.log(`📊 Event: ${eventName}`, parameters);
}

// ===============================================
// EXPORT FOR TESTING
// ===============================================

// Make functions available globally for testing
window.TalentFlowOptimizer = {
    analyzeVacature,
    loadDemoVacature,
    copyOptimizedText,
    downloadAnalysis,
    clearInput,
    pasteFromClipboard
};

// ===============================================
// PRIVACY CHECKBOX EN TYPEFORM FUNCTIONALITEIT
// ===============================================
function initializePrivacyCheckbox() {
    const checkbox = document.getElementById('privacyCheckbox');
    const button = document.getElementById('interestBtn');
    
    if (!checkbox || !button) return;
    
    checkbox.addEventListener('change', function() {
        if (checkbox.checked) {
            button.disabled = false;
            button.style.opacity = '1';
            button.style.cursor = 'pointer';
        } else {
            button.disabled = true;
            button.style.opacity = '0.5';
            button.style.cursor = 'not-allowed';
        }
    });
}

function showInterestConfirmation() {
    const privacySection = document.getElementById('privacySection');
    const confirmationSection = document.getElementById('uploadConfirmation');
    
    // Hide privacy section and show confirmation
    privacySection.style.display = 'none';
    confirmationSection.style.display = 'block';
    confirmationSection.scrollIntoView({ behavior: 'smooth' });
    
    showToast('Interesse Bevestigd!', 'Je kunt nu het upload formulier openen.', 'success');
}

function showTypeFormEmbed() {
    const container = document.getElementById('typeformContainer');
    const loading = document.getElementById('typeformLoading');
    const confirmationSection = document.getElementById('uploadConfirmation');
    
    // Hide confirmation and show TypeForm container with loading
    confirmationSection.style.display = 'none';
    container.style.display = 'block';
    container.scrollIntoView({ behavior: 'smooth' });
    
    // Hide loading after a delay to show embed
    setTimeout(() => {
        loading.style.display = 'none';
    }, 2000);
    
    showToast('TypeForm Geladen', 'Het upload formulier is nu beschikbaar hieronder.', 'success');
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        initializeApp();
        initializePrivacyCheckbox();
    });
} else {
    initializeApp();
    initializePrivacyCheckbox();
}

console.log('🇳🇱 Nederlandse Vacature Optimizer geladen - Ready for analysis!');