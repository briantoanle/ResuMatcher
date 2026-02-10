# 📄 LaTeX Resume Optimizer Pro

> **The Expert Recruiter's Secret Weapon.** An AI-inspired, frequency-weighted optimization engine designed to transform your "Master Resume" into a high-impact, JD-tailored technical resume.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4+-38B2AC.svg)](https://tailwindcss.com/)
[![React](https://img.shields.io/badge/React-19-61DAFB.svg)](https://reactjs.org/)

---

## 🚀 Overview

In the competitive landscape of technical hiring, generic resumes are filtered out by ATS (Applicant Tracking Systems) and overlooked by busy recruiters. **LaTeX Resume Optimizer Pro** bridge the gap between your comprehensive experience and specific job requirements.

By applying **Recruiter-Logic™**—a custom frequency-weighted scoring algorithm—the app identifies core competencies in any Job Description and automatically selects the most relevant projects, experiences, and skills from your master profile to generate a pixel-perfect LaTeX document.

## ✨ Key Features

### 🧠 Recruiter-Logic™ Optimization
Unlike basic keyword stuffers, our engine uses a modified **TF-IDF (Term Frequency-Inverse Document Frequency)** approach.
- **N-Gram Extraction**: Analyzes unigrams, bigrams, and trigrams in the JD.
- **Tech Dictionary Weighting**: Gives 15x weight to industry-standard technical terms (React, Kubernetes, etc.).
- **Relevance Heatmap**: Provides a visual "Heatmap" of extracted keywords to show exactly what the engine prioritized.

### 🌟 Context-Aware STAR Method Helper
Writing impact bullets is hard. Our built-in **STAR (Situation, Task, Action, Result)** helper:
- **Analyzes the JD** in real-time.
- **Suggests tailored patterns**: If the JD mentions "React performance," the helper provides a specific frontend optimization example.
- **Quantifiable Results**: Guides you to include percentages, dollar amounts, and speed metrics.

### 🎨 Industry-Standard LaTeX Export
Outputs code compatible with the famous **"Jake's Resume"** Overleaf template—the gold standard for Software Engineering resumes at FAANG and top startups.
- **Simulated Preview**: A high-fidelity, CSS-based preview that mimics the final PDF output.
- **Rich Text to LaTeX**: Support for **Bold** and *Italic* formatting that translates perfectly into LaTeX commands.

### 🔒 Privacy & Performance
- **Zero-Backend**: All optimization logic runs locally in your browser. Your sensitive resume data never leaves your machine.
- **Dark Mode Support**: A sleek, accessible UI for late-night application sessions.
- **Responsive Design**: Fully functional on mobile for quick tweaks on the go.

---

## 🛠️ Technical Stack

- **Framework**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Typography**: Inter (UI) & Libre Baskerville (Resume Preview)
- **Engine**: Custom JavaScript frequency-weighting algorithm
- **Icons**: Lucide-inspired SVG components

---

## 📖 How to Use

1.  **Configure Master Profile**: In the **Editor** tab, fill out your comprehensive experience. This is your "source of truth."
2.  **Paste Job Description**: Drop the target JD into the analysis box at the bottom.
3.  **Run Optimization**: Click **"Run Optimization"** (or Build). The engine will calculate relevance scores for every section.
4.  **Tweak & Refine**: Use the **STAR Helper** to rewrite bullets based on the JD-specific suggestions.
5.  **Export**: 
    - **Generate PDF**: Uses a custom print-media CSS engine to produce a standard 8.5" x 11" document.
    - **Download .tex**: Get the raw source code to customize further in Overleaf.

---

## ⚖️ License

Distributed under the MIT License. See `LICENSE` for more information.

---

**Developed with 💙 for the technical community by an Expert Recruiter & Senior Frontend Engineer.**
