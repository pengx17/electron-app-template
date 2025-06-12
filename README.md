# Electron App Template

A minimal yet opinionated template for building cross-platform desktop applications with **Electron**, **React**, **TypeScript**, and **Vite**.

---

## ✨ Features

- ⚡️ Rapid renderer powered by Vite + React + TypeScript.
- 🦾 Strongly-typed Electron **main** process written in modern TS with NestJS.
- 🔄 Hot-reload for both renderer & main during development.
- 💉 Modular backend architecture powered by NestJS dependency-injection & modules.
- 🧩 Monorepo managed by Yarn 4 (Berry) workspaces.
- 📚 Shared `electron-api` package for type-safe IPC contracts.
- 📦 Packaging & distribution via Electron Forge (zip, dmg, AppImage, NSIS exe …).

## 📋 Requirements

- Node.js ≥ 18
- Yarn 4 (`corepack enable && corepack prepare yarn@stable`)

## 🚀 Getting Started

```bash
# 1. Install dependencies (root)
yarn

# 2. Launch the app in development mode (hot-reload)
yarn dev
```

The command above concurrently starts:

- Vite dev server for the React renderer (`http://localhost:5173`).
- Electron main process that automatically reloads on changes.

## 🏗 Production Build & Packaging

```bash
# compile main process & copy renderer assets
yarn --cwd electron build

# create platform-specific installers (zip, dmg, exe …)
yarn --cwd electron make
```

Generated artifacts can be found under `electron/out/make`.

## 🗂 Project Structure

```text
electron-app-template/
├─ electron/        # Electron main process (TypeScript)
│  ├─ src/
│  └─ scripts/      # build & packaging helpers
├─ renderer/        # React + Vite frontend
│  ├─ src/
│  └─ public/
├─ electron-api/    # Shared IPC & type definitions
└─ package.json     # Root workspace configuration
```

## 📜 Useful Scripts

Root level:

- `yarn dev` – starts dev mode (renderer + main).
- `yarn typecheck` – run TypeScript project references.

Electron (`cd electron` or `yarn --cwd electron <cmd>`):

- `yarn dev` – start Electron with hot reload.
- `yarn build` – compile main process.
- `yarn make` – build distributable installers.

Renderer (`yarn workspace renderer <cmd>`):

- `dev` – start Vite dev server.
- `build` – create production bundle.

## 📝 License

MIT

## 🧬 NestJS in the Main Process

The Electron **main** process is built as a [NestJS](https://nestjs.com/) application (entry files located in `electron/src/entries/main`). This brings the familiar server-side architecture—modules, dependency injection, lifecycle hooks, and testing utilities—into your desktop app, letting you structure complex background logic just like a backend service.

Key advantages:

- Clear separation of concerns through NestJS modules (e.g., `WindowsModule`, `HelperProcessModule`).
- Unified logging and graceful shutdown via Nest lifecycle.
- Easy unit testing of services without spinning up Electron.
