# RepoMuseum 🏛️

A local-first CLI tool that analyzes a local git repository and generates a beautiful single-page HTML "museum tour" report. 

Explore the history, hotspots, ownership, and curious artifacts of your codebase entirely offline. No GitHub tokens or external APIs required!

## Features
- **Welcome Hall:** High-level statistics and a generated summary of your repository.
- **Strata (Eras) Gallery:** Codebase history partitioned into distinct chronological eras based on commit volume.
- **Hotspots Exhibit:** Identify which files have seen the most churn or the most frequent edits.
- **Curators Wing:** See who "owns" or contributes most to the hottest files in the repository.
- **Artifacts & Oddities:** Fun facts like the oldest active file, most renamed file, and the largest single commit.
- **Map Room:** Discover co-change clusters (files that frequently change together in the same commit).

## Installation

You need [Node.js](https://nodejs.org/) and `git` installed on your system.

```bash
# Clone the repository
git clone https://github.com/yourusername/repomuseum.git
cd repomuseum

# Install dependencies
npm install

# Build the TypeScript code
npm run build

# Link the CLI globally for easy access
npm link
```

## Usage

Run the tool against any local git repository on your machine.

```bash
repomuseum tour <path-to-your-repo> [options]
```

### Options
- `--out <dir>` : Output directory for the report (default: `./repomuseum-report`)
- `--since <YYYY-MM-DD>` : Analyze only commits after this date
- `--max-commits <n>` : Limit commits processed (good for massive repos)
- `--eras <n>` : Number of eras to partition history into (default: 6)
- `--include-merges` : Include merge commits (default: false)
- `--open` : Try to automatically open the generated HTML report in your browser

### Example
```bash
# Generate a tour of the current repository and open it immediately
repomuseum tour . --open
```

## Screenshots

*(Placeholder for screenshots of the dark-mode HTML report)*

## Development
- `npm run dev` : Run the CLI directly via `ts-node` without building.
- `npm run build` : Compile TypeScript to `dist/`.
- `npm run lint` : Run ESLint.

## License
MIT
