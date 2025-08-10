# Leonardo VEO3 Video Instructies - Verbeterde Versie

## Overzicht
Deze gids helpt bij het creëren van professionele, conversie-geoptimaliseerde video's voor de Nederlandse Vacature Optimizer platform.

---

## Video 1: Hero Transformatie - "Van Oud naar Nieuw"
**Bestandsnaam:** `hero-transformation.mp4`
**Doel:** Visueel tonen van veroudering → modernisering in recruitment

### Verbeterde Prompt:
```
Professional office setting. Camera starts with close-up of worn, yellowed paper showing "GEZOCHT: WERKVOORBEREIDER MBO WERKTUIGBOUW, 15+ jaar ervaring vereist". Paper slowly dissolves with orange particle effect. Modern, clean UI emerges showing colorful candidate avatars, skill tags floating, match percentages "95% MATCH", and vibrant "RECRUITIN OPTIMIZER" logo. Smooth transition with professional lighting. Corporate blue/orange color scheme. 6 seconds.
```

### Optimale Instellingen:
- **Model:** Leonardo Video (VEO3)
- **Aspect Ratio:** 16:9 (1920x1080)
- **Duration:** 6 seconds (verhoogd voor betere storytelling)
- **Motion Strength:** 5-6 (lagere waarde voor professionelere uitstraling)
- **Quality:** Ultra High
- **Style:** Corporate/Professional
- **Camera Movement:** Subtle zoom-in
- **Lighting:** Professional office lighting

### Implementatie Tips:
- Gebruik subtitles voor accessibility
- Comprimeer tot max 2MB voor snelle loading
- Creëer fallback static image

---

## Video 2: Process Visualisatie - "De Magie Gebeurt"
**Bestandsnaam:** `process-visualization.mp4`
**Doel:** Vertrouwen opbouwen door transparante proces-weergave

### Verbeterde Prompt:
```
Clean white background with subtle grid pattern. Three connected stages appear sequentially: STAGE 1 - Document icon animates with "Vacature Uploaden" text, pages flutter. STAGE 2 - AI brain icon pulses with orange neural networks, progress bar fills to 100%, "Analyse in Progress" text. STAGE 3 - Checkmark explosion with confetti, "95% SCORE BEHAALD" text appears. Professional icons, smooth transitions, corporate color palette. Modern UI elements. 7 seconds.
```

### Optimale Instellingen:
- **Model:** Leonardo Video (VEO3)
- **Aspect Ratio:** 16:9
- **Duration:** 7 seconds
- **Motion Strength:** 6-7
- **Quality:** Ultra High
- **Style:** Minimal/Corporate
- **Background:** Clean/Professional
- **Typography:** Clear, readable fonts

---

## Video 3: Resultaten Showcase (NIEUW)
**Bestandsnaam:** `results-showcase.mp4`
**Doel:** Social proof en concrete resultaten tonen

### Nieuwe Prompt:
```
Split screen animation. LEFT: Traditional job posting with low engagement icons (2 applications, sad emoji). RIGHT: Optimized posting with explosion of positive metrics (47 applications, thumbs up, celebration emojis). Netherlands map in background with location pins appearing. Text overlay: "GEMIDDELD 60% MEER REACTIES". Professional data visualization style. Orange/blue corporate colors. 5 seconds.
```

### Instellingen:
- **Model:** Leonardo Video (VEO3)
- **Aspect Ratio:** 16:9
- **Duration:** 5 seconds
- **Motion Strength:** 7-8
- **Quality:** Ultra High

---

## Video 4: Testimonial Motion Graphics (NIEUW)
**Bestandsnaam:** `testimonial-motion.mp4`
**Doel:** Geloofwaardigheid door klant quotes

### Prompt:
```
Professional office environment. Quote bubbles appear with customer testimonials in Dutch: "Fantastische tool!" - Jennifer K., HR Manager. Stars animation (5/5 rating). Company logos subtly appear (anonymized). Professional headshots morph in. Orange accent colors, modern typography. Clean, trustworthy aesthetic. 6 seconds.
```

---

## Technische Specificaties

### Bestandsformaten:
- **Primair:** MP4 (H.264 codec)
- **Backup:** WebM voor moderne browsers
- **Poster:** Static JPG/WebP voor slow connections

### Optimalisatie:
```bash
# FFmpeg compression command
ffmpeg -i input.mp4 -c:v libx264 -crf 28 -c:a aac -b:a 128k -vf scale=1920:1080 output.mp4
```

### Bestandsstructuur:
```
/assets/videos/
├── hero-transformation.mp4 (max 3MB)
├── process-visualization.mp4 (max 2MB)
├── results-showcase.mp4 (max 2MB)
├── testimonial-motion.mp4 (max 2MB)
└── fallbacks/
    ├── hero-static.webp
    ├── process-static.webp
    ├── results-static.webp
    └── testimonial-static.webp
```

---

## Implementatie Guidelines

### HTML Integration:
```html
<video 
    autoplay 
    muted 
    loop 
    playsinline 
    preload="metadata"
    poster="fallbacks/hero-static.webp"
    class="hero-video">
    <source src="hero-transformation.mp4" type="video/mp4">
    <img src="fallbacks/hero-static.webp" alt="Hero transformation">
</video>
```

### CSS Performance:
```css
.hero-video {
    width: 100%;
    height: auto;
    object-fit: cover;
    will-change: transform;
}

@media (prefers-reduced-motion: reduce) {
    .hero-video {
        display: none;
    }
}
```

### JavaScript Loading:
```javascript
// Lazy load videos voor performance
const videos = document.querySelectorAll('video[data-src]');
const videoObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const video = entry.target;
            video.src = video.dataset.src;
            video.load();
            videoObserver.unobserve(video);
        }
    });
});

videos.forEach(video => videoObserver.observe(video));
```

---

## A/B Testing Framework

### Varianten om te testen:
1. **Timing:** 5s vs 7s vs 10s duration
2. **Style:** Professional vs Playful vs Minimal
3. **Text:** Met vs zonder text overlays
4. **Motion:** Low vs High motion strength

### Metrics om te meten:
- Video completion rate
- Click-through rate naar CTA
- Time on page
- Conversion rate

---

## Quality Checklist

### Pre-productie:
- [ ] Storyboard goedgekeurd
- [ ] Brand guidelines gevolgd (colors, fonts, tone)
- [ ] Mobile-first design approach
- [ ] Accessibility overwegingen (subtitles, contrast)

### Post-productie:
- [ ] File size < 3MB per video
- [ ] Autoplay werkt in alle browsers
- [ ] Fallback images beschikbaar
- [ ] Loading performance getest
- [ ] Mobile responsive getest

### SEO & Analytics:
- [ ] Schema markup toegevoegd
- [ ] Video sitemaps gecreëerd
- [ ] Event tracking geconfigureerd
- [ ] Core Web Vitals impact gemeten

---

## Troubleshooting

### Veelvoorkomende problemen:
1. **Video laadt niet:** Check MIME types en server configuratie
2. **Autoplay werkt niet:** Ensure muted attribute aanwezig
3. **Performance issues:** Implementeer lazy loading
4. **Mobile playback:** Test playsinline attribute

### Browser Support:
- Chrome: 100% support
- Safari: 95% support (check codec)
- Firefox: 98% support
- Edge: 100% support

---

## Volgende Stappen

1. **Genereer video's** met verbeterde prompts
2. **Test in staging environment**
3. **Optimaliseer file sizes**
4. **Implementeer analytics tracking**
5. **Monitor performance metrics**
6. **A/B test verschillende varianten**

Voor vragen of ondersteuning: contact het development team.