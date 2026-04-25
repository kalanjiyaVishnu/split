# ⚡ Split Premium
### The Ultimate JSON & Code Diffing Studio

Split Premium is a high-end, developer-first workbench built to handle complex JSON and text diffing with surgical precision. It bridges the gap between raw code analysis and visual data representation, offering an immersive, glassmorphic environment for modern software craftsmanship.

![Split Premium Hero](/home/vishnu/.gemini/antigravity/brain/02f6bea4-88a6-4077-bd1a-aa78ddc24aa8/media__1777088564104.png)

## 💎 Core Value Propositions

### 🌐 Dual-Engine Graph Visualization
Split is the only diffing tool that integrates **JSONCrack** with a custom **Premium Interactive Engine**:
- **Premium Graph**: Built on `React Flow`, this engine supports **Deep Path Selection**. Click a node in the graph, and the Monaco Editor scrolls instantly to that exact line.
- **Classic Mode**: Retention of the original JSONCrack visualization for high-quality, presentational data mapping.
- **Visualizer Studio**: A dedicated standalone environment (`/visualizer`) for focusing exclusively on data structures.

### 🔍 Surgical Diffing Suite
- **Side-by-Side & Unified View**: Switch between layouts depending on your review complexity.
- **Heuristic Line Mapping**: Our custom utility precisely maps JSON paths to physical line numbers, even in formatted strings.
- **Diff Resolution**: Mark specific changes as "Resolved" to keep track of progress during long sessions.
- **Collaborative Comments**: Add discussions directly to lines and persist them across sessions.

### 🏗️ Advanced Workbench UX
- **Solo Mode**: Immersion at your fingertips. Hover and click "Maximize" on any panel, or **Double-Click** its header button to enter full-screen focus.
- **Adaptive Workspace**: Collapsible Editor, Diff, and Visualizer panels that reflow dynamically.
- **Premium Aesthetics**: A custom dark-mode design system utilizing glassmorphism, subtle micro-animations, and Inter typography.

## 🚀 Technical Architecture

Split is built with a modern, high-performance stack:
- **Next.js 14**: Utilizing App Router and Server Actions for a lightning-fast SPA experience.
- **Monaco Editor**: The industry-standard editor powering VS Code, integrated for robust code manipulation.
- **React Flow + Dagre**: Driving our custom, layout-aware graph visualization engine.
- **Prisma + SQLite**: Local-first data persistence for history, users, and comments.
- **Jose JWT**: Secure, cookie-based authentication and session management.

## 🛠️ Setup & Installation

```bash
# 1. Clone & Install
git clone https://github.com/kalanjiyaVishnu/split.git
cd split
npm install

# 2. Database Initialization
npx prisma db push

# 3. Development Mode
npm run dev
```

The application will be available at `http://localhost:3001`.

## ⌨️ Key Workflows

- **Navigating the Graph**: Click a node in the Premium Visualizer to reveal its source line in the Editor.
- **Sharing Diffs**: Click "Share" to generate a unique ID. Teammates can view your diff by appending the ID to the workbench URL.
- **Solo Mode**: **Double-click** the "Editors", "Diff", or "Visualizer" buttons in the top header to maximize that section. Double-click again to restore.

---
Built with ❤️ by **Antigravity** for the Google Deepmind Team.
