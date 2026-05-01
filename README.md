<div align="center">
  <h1 align="center">🏛️ RepoMuseum</h1>
  <p align="center">
    <strong>Curate your codebase history into a stunning, interactive exhibition.</strong>
  </p>
  <p align="center">
    <a href="https://reactjs.org/"><img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" /></a>
    <a href="https://isomorphic-git.org/"><img src="https://img.shields.io/badge/isomorphic--git-F05032?style=for-the-badge&logo=git&logoColor=white" alt="isomorphic-git" /></a>
    <a href="https://vercel.com/"><img src="https://img.shields.io/badge/Vercel_Ready-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Vercel Ready" /></a>
    <br/>
    <i>UI / UX generated with Google Stitch</i>
  </p>
</div>

<br/>

## 🏺 What is RepoMuseum?
Codebases are more than just text files; they are historical artifacts shaped by hundreds of developers over years. **RepoMuseum** excavates your Git repository and transforms its raw metadata into a beautiful, interactive "Midnight Museum" exhibition. 

It is built as a **Dual-Engine architecture**:
1. **Zero-Backend Browser App:** Paste a public GitHub URL and watch it clone, analyze, and render entirely inside your browser memory.
2. **Local CLI Tool:** Analyze massive, private local repositories using your native Git engine for blazing-fast stratigraphy.

---

## 💎 Why is it Useful? (And How is it Better?)
Most git analytics tools are boring charts that require invasive GitHub OAuth permissions or expensive backends. RepoMuseum is fundamentally different:

*   **🔒 Zero-Backend & Private:** The React web app uses `isomorphic-git` and an in-memory filesystem (`memfs`). It clones the repo *directly* into your browser. We never store your code on our servers.
*   **🎨 Premium "Midnight Museum" UI:** Designed with the help of **Google Stitch**, the interface ditches the "efficiency-first" developer aesthetic for an Artistic Editorial style. Radial spotlights, archival glass cases, and Newsreader typography make your data look like a million-dollar exhibit.
*   **🧟 Zombie Module Detection:** Instead of just lines added/deleted, our curatorial engine identifies "Zombie Modules"—directories that historically saw massive churn but haven't been touched in the modern era.
*   **⏳ Stratigraphy (Era Partitioning):** We don't just show a timeline; we divide your repository's life into distinct "Eras" based on commit volume, allowing you to see exactly when the architecture shifted.

---

## 🗺️ How to Explore (For New Users)

### Option 1: The Browser Experience (Hosted)
If you want to explore open-source codebases effortlessly:
1. Visit the deployed Vercel link (or run it locally via `npm run dev` in the `/frontend` folder).
2. Enter any public GitHub URL in the "Provenance / Source URL" field (e.g., `https://github.com/facebook/react`).
3. Click **Begin Curation**.
4. Watch the Foyer loading sequence as the Web Worker clones the repository into your browser's RAM and analyzes the commit strata.
5. Step into the exhibition!

### Option 2: The Native CLI (Local)
If you want to analyze a massive enterprise monorepo or private code on your hard drive:
```bash
# 1. Install dependencies and build the engine
npm install
npm run build

# 2. Run the curator on any local directory
node dist/cli.js tour /path/to/your/local/repo --open
```

---

## 🚀 Vercel Deployment Guide

RepoMuseum's frontend is strictly static React + Web Workers, making it perfectly optimized for a zero-configuration Vercel deployment.

1. Create a new project in Vercel.
2. Import this repository.
3. Configure the **Build Settings**:
   * **Framework Preset:** Vite
   * **Root Directory:** `frontend`
   * **Build Command:** `npm run build`
   * **Output Directory:** `dist`
4. Click **Deploy**. Vercel will instantly host your very own Zero-Backend RepoMuseum!

---

## 🏛️ Architecture & Credits

*   **Engine:** Node.js (`readline` streaming) & `isomorphic-git` (browser WebAssembly).
*   **Design System:** The *Midnight Gallery* aesthetic was generated and optimized using **Google Stitch**, providing the structural Tailwind CSS, glassmorphism filters, and exact typographic hierarchies.
*   **Data Injection:** Uses a CORS-free `window.REPO_DATA` payload strategy to seamlessly transition from the React loader to the Vanilla HTML exhibition.
