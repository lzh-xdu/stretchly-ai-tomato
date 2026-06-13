# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Is

Stretchly is a cross-platform Electron break-reminder app that prompts users to take microbreaks and longer breaks on a schedule. It lives in the system tray and spawns fullscreen break windows across all monitors.

## Commands

```bash
npm start                # Launch the app
npm run dev              # Launch with remote debugging on port 9222
npm test                 # Run all tests (Vitest)
npm run test-single -- test/scheduler.js   # Run one test file
npm run tdd              # Watch mode for tests
npm run lint             # StandardJS style check (also runs on pre-commit via Husky)
npm run pack             # Build to directory (no installer)
npm run dist             # Build release packages (NSIS/7z/appx/portable on Windows)
```

## Stack

- **Node.js 24** (see `.nvmrc`), **Electron 41**, **ESM** (`"type": "module"`)
- **Vitest** for tests, **StandardJS** for linting
- Key deps: `electron-store` (settings), `i18next` (i18n, 45 locales), `luxon` (datetime), `electron-log`, `dompurify`, `ps-list`, `node-desktop-idle-v2`

## Architecture

### Main Process (`app/main.js`)

The single main process owns the tray icon, settings store, and the `BreaksPlanner` scheduler. It spawns renderer windows on demand and communicates via IPC.

### BreaksPlanner (`app/breaksPlanner.js`)

The scheduling core — an `EventEmitter` that orchestrates the cycle: `start → microbreakStarted → finishMicrobreak → (every N cycles) breakStarted → finishBreak`. It composes:

- `NaturalBreaksManager` — pauses the timer when the user is idle (desktop idle detection)
- `DndManager` — auto-pauses when OS Do Not Disturb is active
- `AppExclusionsManager` — pauses when excluded apps are in focus

### Window Triplet Pattern

Every window (break, microbreak, preferences, welcome, contributor-preferences, process) follows the same three-file structure:

| File | Role |
|------|------|
| `<name>.html` | Page structure |
| `<name>-preload.mjs` | `contextBridge` API exposure (runs in isolated world) |
| `<name>-renderer.js` | Renderer process logic (loaded by the HTML) |

Preload scripts use `app/utils/context-bridge-exposers.js` to expose a consistent set of APIs (`window.electronApi`, `window.breaks`, `window.i18next`, `window.settings`, `window.stretchly`, `window.utils`). When adding a new window, follow this pattern and expose only what the renderer needs.

### DisplayManager (`app/utils/displayManager.js`)

Handles multi-monitor break windows — creates one `BrowserWindow` per screen when `allScreens` is enabled, and coordinates lifecycle across them.

## Code Style

- **StandardJS**: no semicolons, 2-space indent, single quotes, ES6+ throughout
- **No comments** — prefer self-explanatory code (per project convention)
- **ESM imports** only — no `require()`
- File names: `camelCase.js` (modules), `PascalCase` (classes)
- Maintain cross-platform compatibility (Windows, macOS, Linux)
- Consider Chrome compatibility only (Electron = Chromium)

## Key Directories

- `app/utils/` — 26 utility modules (default settings, scheduler, i18n helpers, image resolver, etc.)
- `app/locales/` — i18n JSON files (45 languages)
- `app/images/app-icons/` — 900+ tray icon variants (numbered + progress indicators)
- `app/css/` — stylesheets per window + shared `commons.css` and `color-scheme.css`
- `test/` — Vitest test files (mirror utils structure)

## User Data Locations

- Windows: `%APPDATA%\Stretchly\` (config.json, logs)
- macOS: `~/Library/Application Support/Stretchly/`
- Linux: `~/.config/Stretchly/`
- Portable (Windows): `<app-dir>\Data\`

## Command-Line Flags

`--reset`, `--mini`, `--long`, `--pause`, `--resume`, `--toggle`, `--preferences` — handled in `app/utils/commands.js`.
