# 🛡️ EthicsCheck AI

A web-based tool that analyzes text for ethical writing practices — detecting AI-generated patterns, missing citations, lack of personal input, and generic content.

Built as a **1st-year Cybersecurity portfolio project**.

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?logo=tailwindcss&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white)

---
#🌐 Live Demo: 
https://ethics-check-ai-phoenix-mes-projects.vercel.app/

---

## ✨ Features

- **Ethics Score (0–100)** — Overall score with animated circular gauge
- **Detailed Breakdown** across four categories:
  - 🔍 **Originality** — Detects AI-like writing patterns and repetitive phrases
  - 💬 **Personal Input** — Checks for opinions, examples, and critical thinking
  - 📚 **Citations** — Identifies references, URLs, and source attribution
  - 📖 **Readability** — Evaluates sentence structure, vocabulary diversity, and generic content
- **Color-coded indicators** — Green (70+), Yellow (40–69), Red (0–39)
- **Warning messages** for critical issues
- **Actionable suggestions** to improve ethical writing
- **PDF report download** for documentation
- **Smooth animations** powered by Framer Motion
- **Responsive design** — works on desktop, tablet, and mobile

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- npm, yarn, or bun

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/YOUR_USERNAME/ethicscheck-ai.git
cd ethicscheck-ai

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

The app will open at **http://localhost:5173** in your browser.

### Build for Production

```bash
npm run build
```

The optimized output will be in the `dist/` folder, ready to deploy.

---

## 🧠 How It Works

The analysis engine (`src/lib/ethicsAnalyzer.ts`) runs entirely client-side — no data is sent to any server.

| Check | What It Detects |
|-------|----------------|
| **Originality** | AI-like phrases ("in today's world", "furthermore", "paradigm shift"), repetitive sentence starters |
| **Personal Input** | Personal markers ("I think", "in my experience"), concrete examples, specific data |
| **Citations** | Parenthetical references, bracketed numbers, "et al.", URLs, DOIs |
| **Readability** | Average sentence length, vocabulary diversity ratio, generic filler statements |

Scores are combined using a weighted average: Originality (30%), Personal Input (25%), Citations (25%), Readability (20%).

---

## 📁 Project Structure

```
src/
├── components/
│   ├── ScoreGauge.tsx       # Animated circular score display
│   ├── CategoryCard.tsx     # Individual category breakdown card
│   └── ReportDownload.tsx   # PDF report generation
├── lib/
│   └── ethicsAnalyzer.ts    # Core analysis engine
├── pages/
│   └── Index.tsx            # Main application page
└── index.css                # Theme and design tokens
```

---

## 🛠️ Tech Stack

| Technology | Purpose |
|-----------|---------|
| **React 18** | UI framework |
| **TypeScript** | Type safety |
| **Vite** | Build tool & dev server |
| **Tailwind CSS** | Styling |
| **shadcn/ui** | UI components |
| **Framer Motion** | Animations |
| **jsPDF** | PDF report generation |

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 🙋 Author

Built by ADRITA BASU, a 1st-year Cybersecurity student as a portfolio project demonstrating web development and security awareness skills.
