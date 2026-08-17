# 📊 FINDS Project Presentations

This directory contains presentation materials for the FINDS (Finned Intelligence from Satellite) project.

## 🎯 **Available Presentations**

### **Main Project Slides**
- **📋 [Google Drive Slides](https://drive.google.com/file/d/111xzfdWaFjN1wSuBbt7DkpPj1DUrm_k4/view?usp=drive_link)** — Complete project overview
- **📅 Last Updated**: October 2025 (hackathon); see [CHANGELOG](../CHANGELOG.md) for post-hackathon v2.x engineering
- **👥 Authors**: Yasmine Dweir & Edmund Gunn Jr.
- **🏛️ Event**: NASA Space Apps NYC | NYU
- **🏆 Award**: NYC Best Use of Gemini API — NASA Space Apps Challenge 2025 (local NYC award; not a NASA Global Winner claim)

## 📝 **Presentation Content**

### **Key Topics Covered**
1. **Problem Statement**
   - Shark conservation and habitat context
   - Marine ecosystem monitoring with public NASA data
   - Satellite environmental clues (SST, ocean color)

2. **Solution Overview**
   - AI-assisted **habitat-hotspot exploration** (environmental scoring, not shark detection)
   - Interactive Deck.gl map with responsive UI
   - Edge IO gesture controls for live demos

3. **Technical Implementation**
   - NASA GIBS MUR SST + PACE/VIIRS chlorophyll-a
   - Gemini structured ranking on NASA-derived cells
   - Cloudflare Worker + R2 cache
   - Deck.gl heatmap rendering

4. **Demo Features**
   - Live or cached hotspot visualization
   - Edge IO gesture controls (pinch, spread, shake)
   - Interactive mapping
   - **Real-time** refers to UI interaction latency only — not satellite freshness or confirmed shark presence

## 🎬 **Demo Instructions**

### **For Presenters**
1. **Setup**: Stable internet for live NASA + Gemini path; use `/demo.json` offline fallback if needed
2. **Demo Data**: Prefer production Worker with provenance visible in UI
3. **Gestures**: Practice Edge IO controls before presentation
4. **Backup**: Static screenshots in `docs/media/pixel6a/`
5. **Language**: Say “exploratory habitat hotspots,” not “shark detection” or “real-time tracking”

### **For Audience**
- **Interactive Elements**: Try gesture controls during demo
- **Questions**: Technical details in GitHub repository and [Space Apps alignment](../docs/release/SPACE_APPS_SUBMISSION_ALIGNMENT.md)
- **Follow-up**: Contact via GitHub repository

## 🔗 **Related Resources**

- **GitHub Repository**: [FINDS Project](https://github.com/gunnchOS3k/FINDS-Sharks-From-Space)
- **Live app**: [https://finds-web-4j5.pages.dev](https://finds-web-4j5.pages.dev)
- **Documentation**: Setup guides, scientific limitations, conceptual tag model in repository

## 📧 **Contact Information**

- **Project Repository**: [FINDS on GitHub](https://github.com/gunnchOS3k/FINDS-Sharks-From-Space)

---

**Supporting ocean literacy and conservation framing — not operational marine-safety guidance.**
