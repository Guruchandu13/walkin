# Sivion Global Technologies - Recruitment QR Landing Page

A production-ready, single-card liquid glassmorphic recruitment landing page designed for QR code scanning.

## 🚀 Features
- **Two-Step Progressive Flow**:
  1. **Step 1 (First Scan)**: Displays company branding, welcome message, and **"Visit Our LinkedIn Page ↗"**.
  2. **Step 2 (Upon Return)**: Automatically detects return and displays **"Continue to Application Form →"** (Google Form).
- **Design & UI**:
  - Liquid glassmorphism with dynamic ambient aurora backdrop.
  - Official Sivion Global Technologies metallic gold logo.
  - Interactive micro-animations and specular glass highlights.
- **Accessibility & Performance**:
  - Pure HTML5, CSS3, Vanilla JavaScript (0 external dependencies or CDN latency).
  - WCAG AA compliant contrast and `:focus-visible` states.
  - State persistence via safe `localStorage` with private-browsing fallbacks.

## 📁 File Structure
```text
├── index.html        # Semantic HTML5 single-card markup
├── style.css         # Liquid glassmorphism, aurora mesh & typography
├── script.js         # Single-step transition logic & persistence
├── logo.png          # High-resolution transparent company logo
└── README.md
```

## 🛠️ Local Development
Run with any static web server:
```bash
python3 -m http.server 3000
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🚀 Deployment
Deploy to Vercel, Netlify, or GitHub Pages by connecting this repository (Preset: "Other", Root: `./`).
