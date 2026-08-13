# GitHub Profile README Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `subagent-driven-development` task-by-task. Steps use checkbox syntax for tracking.

**Goal:** Publish Alexandre Nevero's C-direction GitHub profile README with visual identity, verified work, and maintainable activity stats.

**Architecture:** Keep all critical information in `README.md` as GitHub-native Markdown. Use one repository SVG hero image for the approved composition, then a small local SVG that a scheduled GitHub Action refreshes from the GitHub API.

**Tech Stack:** GitHub Flavored Markdown, SVG, POSIX shell, GitHub Actions.

## Global Constraints

- Profile repository must be public and named `Alexandre-Nevero`.
- `README.md` must live at repository root and keep core information readable without images.
- Use `Alexandre Nevero` as opening name and `Dre` only as portrait signature.
- Preserve verified roles: SelyoPass Founder, LINGAP Backend developer, GuidHer Business research.
- Use no third-party widget or dependency. Stats generator must use `curl`, `jq`, and `GITHUB_TOKEN` only.
- Follow Conventional Commits. No assistant attribution.

---

### Task 1: Create profile asset and README

**Files:**
- Create: `README.md`
- Create: `assets/profile-hero.svg`

**Interfaces:**
- Produces a root GitHub profile README with relative image reference `assets/profile-hero.svg`.

- [ ] Build a dark C-direction hero SVG: `Alexandre Nevero`, right-side dot-screen sculpture, and `Dre` inside the image lower edge.
- [ ] Write semantic README content: opening positioning, contact links, Focus/Portfolio/Signal, selected work, and activity image placeholder.
- [ ] Verify all facts against `docs/profile-readme-brief.md` and test links with `rg`.
- [ ] Commit with `feat: add profile readme`.

### Task 2: Add local activity generator

**Files:**
- Create: `scripts/generate-stats.sh`
- Create: `assets/stats.svg`
- Create: `.github/workflows/refresh-stats.yml`

**Interfaces:**
- `scripts/generate-stats.sh <username> <output>` writes a valid standalone SVG based on GitHub REST API responses.
- README renders `assets/stats.svg` using a relative image reference.

- [ ] Write a shell test that asserts generated SVG contains username, public repository count, follower count, and valid SVG root.
- [ ] Run test first and record its expected failure because generator is absent.
- [ ] Implement minimal generator using `curl`, `jq`, and a token passed through `GITHUB_TOKEN`.
- [ ] Add workflow with manual and daily trigger, `contents: write`, and a guarded commit of changed `assets/stats.svg`.
- [ ] Generate initial SVG from live public profile API, run test, validate shell and YAML syntax.
- [ ] Commit with `feat: add local activity stats`.

### Task 3: Render and release

**Files:**
- Verify: `README.md`, `assets/profile-hero.svg`, `assets/stats.svg`, `.github/workflows/refresh-stats.yml`

- [ ] Render README in GitHub-compatible local HTML and inspect desktop/mobile screenshots.
- [ ] Check links, SVG XML, shell syntax, YAML structure, and repository diff.
- [ ] Merge approved branch into `main`.
- [ ] Create public `Alexandre-Nevero/Alexandre-Nevero` repository if absent, add remote, and push `main`.
- [ ] Verify repository visibility, root README presence, and profile README prerequisites using GitHub API.
