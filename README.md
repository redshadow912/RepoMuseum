<div align="center">
  <h1 align="center">🏛️ RepoMuseum</h1>
  <p align="center">
    <strong>Code is history. Curate your repository into a stunning, interactive exhibition.</strong>
  </p>
  <p align="center">
    <a href="https://reactjs.org/"><img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" /></a>
    <a href="https://isomorphic-git.org/"><img src="https://img.shields.io/badge/isomorphic--git-F05032?style=for-the-badge&logo=git&logoColor=white" alt="isomorphic-git" /></a>
    <a href="https://vercel.com/"><img src="https://img.shields.io/badge/Vercel_Ready-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Vercel Ready" /></a>
  </p>
</div>

<br/>

## 🏺 The Museum Metaphor

Codebases are more than just text files; they are living artifacts shaped by hundreds of developers over years of struggle, triumph, and 3 AM coffee-fueled hotfixes. 

**RepoMuseum** extracts the soul of your Git repository and transforms its raw metadata into a high-end, interactive "Midnight Museum" exhibition. Instead of dry analytics and corporate dashboards, you get gamified insights, architectural stratigraphy, and psychological developer profiling.

### 🔒 Core Value Proposition: Zero-Trust Privacy
Your code is your business. RepoMuseum operates with a **100% Client-Side Engine**. Whether you are parsing in the browser or via our CLI, **no source code ever touches our servers**. The entire museum is rendered directly in your local environment. 

---

## 💎 The Exhibits (Features)

Our curatorial engine catalogs your history into the following wings:

*   🏛️ **The Foyer:** Enter the museum and view your repository's "Culture Badge" (e.g., *Midnight Monolith*, *9-to-5 Enterprise*) based on historical commit habits.
*   📈 **Historical Strata:** We excavate your commit history, mapping the tectonic shifts of architecture over time. See exactly when your codebase evolved across 6 distinct "Eras."
*   🦴 **The Relics:** 
    *   **Zombie Directories:** Identifies massive modules that saw explosive churn but have since been entirely abandoned.
    *   **The Bug Graveyard:** Scans commit syntax to identify the top 5 most historically fragile, bug-prone files.
*   👥 **The Guilds:** Analyzes code ownership and developer concentration. Features a flashing **"High Truck Factor"** warning if a single author controls >85% of an artifact.
*   🎭 **The Confessional:** A psychological profile of your team. Tracks *Midnight Oil* (12 AM - 4 AM commits), *Weekend Commitments*, and *Profanity Events* etched into the ledger.
*   🔐 **The Vault:** A historical security auditor. Scans every commit in history for leaked `.env` files, `id_rsa` keys, and credentials. Even if deleted later, the archive remembers.

---

## 🗺️ How to Run It (The Dual Architecture)

RepoMuseum features two distinct paths for curation, designed to handle both small personal projects and massive enterprise monorepos.

### Path A: The Local Archivist (Recommended for Large/Enterprise Repos)
*For massive codebases like React, Linux, or your company's proprietary monorepo.*

Modern browsers limit memory usage, making it impossible to clone a 10GB repo directly into Chrome. To bypass this, we decoupled the parser from the presentation layer.

1. Navigate to your massive local Git repository.
2. Run our headless CLI parser (uses your machine's full native power):
   ```bash
   npx repomuseum-parser
   ```
3. This blazing-fast script extracts the metadata and generates a tiny `dossier.json` file in seconds.
4. Open the [RepoMuseum Web UI](https://repomuseum.vercel.app).
5. **Drag and drop** your `dossier.json` into the upload zone for instant, beautiful rendering.

### Path B: The Browser Explorer (For Small/Public Repos)
*For quickly exploring open-source projects without leaving your browser.*

1. Visit the [RepoMuseum Web UI](https://repomuseum.vercel.app).
2. Paste any public GitHub URL (e.g., `https://github.com/expressjs/express`).
3. Click **Begin Curation**.
4. Our `isomorphic-git` Web Worker will securely clone the repository into your browser's RAM, parse the strata, and build the exhibits in real-time.

---

## ⚠️ Known Limitations & Transparency

We believe in radical honesty about our architecture:

*   **Path B Relies on a CORS Proxy:** Because browsers cannot directly clone from GitHub, Path B routes traffic through `https://cors.isomorphic-git.org`. This public proxy frequently rate-limits. If your curation hangs indefinitely, the proxy has likely blocked the request.
*   **The Heap Crash:** If you attempt to use Path B on a massive repository, your browser *will* run out of memory (RAM) and the Web Worker will crash. **This is exactly why Path A (the CLI) was built.** Always use the Dropzone and CLI for large repositories.
*   **Shallow Clones:** To save memory, Path B enforces a `depth: 50` shallow clone. For a complete, unadulterated history, use Path A.

---

## 🤝 Contributing

The museum is always expanding its wings. We welcome pull requests for new exhibits, better WebWorker memory management, or new UX improvements. 

1. Fork the archive.
2. Create your feature branch (`git checkout -b feature/new-exhibit`).
3. Commit your changes (`git commit -m 'feat: Add The Armory exhibit'`).
4. Push to the branch (`git push origin feature/new-exhibit`).
5. Open a Pull Request.

---

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.

<div align="center">
  <i>© 2026 RepoMuseum Archival Services. All commits reserved.</i>
</div>
