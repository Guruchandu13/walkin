# Sivion Global Technologies - Recruitment QR Landing Page

A production-ready, single-card liquid glassmorphic recruitment landing page designed for QR code scanning.

## 🚀 Features
- **Progressive Flow**:
  1. **Step 1 (First Scan)**: Displays company branding, welcome message, and **ONLY "Click Here ↗"** (LinkedIn button).
  2. **Step 2 (Upon Return / Page Reload)**:
     - Automatically transitions to show **ONLY Step 2**: **"Ready to Apply?"** with **"Continue to Application Form →"** button.
  3. **Step 3 (Completion -> LinkedIn Direct Page)**:
     - When candidate clicks **"Continue to Application Form →"**, Google Form opens in a new tab.
     - This tab transitions to Step 3 and redirects to the official **LinkedIn direct page** (`https://www.linkedin.com/company/sivionglobaltechnologies/`).
- **Developer / Testing Reset**:
  - Discreetly reset state by tapping the Sivion logo 3 times, or by loading with `?reset=1`.
- **Design & UI**:
  - Liquid glassmorphism with dynamic ambient aurora backdrop.
  - Official Sivion Global Technologies metallic gold logo.
  - Interactive micro-animations and specular glass highlights.
- **Accessibility & Performance**:
  - Pure HTML5, CSS3, Vanilla JavaScript (0 external dependencies or CDN latency).
  - WCAG AA compliant contrast and `:focus-visible` states.
  - Multi-tier state persistence across `localStorage`, `sessionStorage`, cookies, and memory.

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
