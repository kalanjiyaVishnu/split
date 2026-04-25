# ⚡ Split Premium
### The Surgical Precision Diffing Suite for Modern Teams

Split Premium is a high-performance workbench designed for developers who demand excellence in code reviews and data analysis. It combines traditional diffing tools with state-of-the-art graph visualizations to provide a comprehensive understanding of changes.

![Split Premium Hero](/home/vishnu/.gemini/antigravity/brain/02f6bea4-88a6-4077-bd1a-aa78ddc24aa8/media__1777088564104.png)

## ✨ Features

### 🔍 Precision Diffing
- **Side-by-Side & Unified Views**: Toggle between layout modes for maximum clarity.
- **Line-Level Commentary**: Add discussions directly to any line in the diff.
- **Resolution Tracking**: Mark specific changes as resolved to streamline reviews.

### 🌐 Dual-Engine Visualization
- **Premium Interactive Graph**: A custom-built, native React Flow engine with **Deep Path Navigation**. Click any node to instantly jump to the editor.
- **Classic JSONCrack**: Integration with the industry-standard JSONCrack engine for beautiful 3D-style graphs.
- **Visualizer Studio**: A dedicated standalone environment (`/visualizer`) for focused data analysis.

### 💎 Elite Workbench UX
- **Solo Focus Mode**: Double-click any panel header to maximize it instantly.
- **Adaptive Layout**: Hide or show the Editors, Diff, and Visualizer with seamless transitions.
- **Glassmorphism Design**: A premium dark-mode aesthetic built for focus and craftsmanship.

### 🔐 Secure & Collaborative
- **Full Auth System**: Personal user accounts with persistent history.
- **Saved Diffs**: Archive your work and share it with teammates via unique IDs.
- **Local-First Reliability**: Your data remains in your control, backed by a local SQLite database.

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm / yarn / pnpm

### Installation
```bash
# Clone the repository
git clone <your-repo-url>

# Install dependencies
npm install

# Setup database
npx prisma db push

# Start the development server
npm run dev
```

### Navigation
- `/`: Premium Landing Page
- `/workbench`: The Main Diffing Studio
- `/visualizer`: Standalone Visualization Studio
- `/saved`: Your Diff Archive
- `/about`: Project Mission & Architecture

## 🛠️ Technology Stack
- **Framework**: Next.js 14 (App Router)
- **UI Components**: Tailwind CSS + Shadcn/UI
- **Icons**: Lucide React
- **Database**: Prisma + SQLite
- **Visualization**: React Flow, Dagre, JSONCrack
- **Editor**: Monaco Editor

---

> [!TIP]
> Use **Double-Click** on any header tile in the Workbench to enter Solo Mode. Double-click again to restore your previous layout.

---
Built with craftsmanship by **Antigravity**.
