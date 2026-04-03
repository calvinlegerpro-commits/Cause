# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## ⚠️ RELEASE — CHECKLIST OBLIGATOIRE (LIRE EN PRIORITÉ ABSOLUE)

> **IMPÉRATIF** : Avant toute action liée à une release (tag, push, CI, correction CI), lire et appliquer cette section intégralement. Ces pièges ont coûté plusieurs heures de débogage. Ne pas les répéter.

### Étapes release

1. Bumper la version dans `package.json`, `src-tauri/Cargo.toml`, `src-tauri/tauri.conf.json`
2. Lancer `bun install` et committer `bun.lock` si modifié
3. Committer les changements de version
4. `git tag v0.x.0 && git push origin main && git push origin v0.x.0`
5. Attendre ~30 min que GitHub Actions compile (macOS ~10 min, Windows ~28 min)
6. Vérifier que la draft release contient TOUS les assets avant de publier
7. Publier : `gh release edit v0.x.0 --repo calvinlegerpro-commits/Cause --draft=false`

### Pièges connus — NE PAS IGNORER

**Piège 1 — Signature Apple manquante → build macOS échoue**
- Symptôme : step "import Apple Developer Certificate" échoue
- Fix : dans `main-build.yml`, vérifier que `sign-binaries: false` et `apple_signing: false` sont présents
- Dans `release.yml`, `apple_signing: false` est déjà dans chaque entrée de matrice

**Piège 2 — bun.lock désynchronisé → code quality échoue**
- Symptôme : `error: lockfile had changes, but lockfile is frozen`
- Fix : lancer `bun install` et committer `bun.lock` avant de pusher

**Piège 3 — Tag déjà existant → release ne se relance pas**
- Symptôme : `! [rejected] v0.x.0 -> v0.x.0 (already exists)`
- Fix : `git tag -d v0.x.0 && git tag v0.x.0 && git push origin v0.x.0 --force`
- ⚠️ Chaque force-push crée une NOUVELLE draft release — voir piège 7

**Piège 4 — Traductions zh/zh-TW avec clés en trop → code quality échoue**
- Symptôme : `Extra N keys (not in reference)` dans le check i18n
- Fix : supprimer les clés absentes de `en/translation.json` dans `zh/` et `zh-TW/`

**Piège 5 — signCommand Windows (trusted-signing-cli) hardcodé → build Windows échoue**
- Symptôme : `failed to bundle project 'failed to run trusted-signing-cli'`
- Cause : `src-tauri/tauri.conf.json` contient `bundle.windows.signCommand` pointant vers Azure
- Fix : supprimer la clé `signCommand` de la section `bundle.windows` dans `tauri.conf.json`
- ✅ Déjà appliqué sur ce repo — ne pas la réintroduire lors d'un merge upstream

**Piège 6 — sign-binaries: false vide TAURI_SIGNING_PRIVATE_KEY → build échoue**
- Symptôme : `failed to decode secret key: incorrect updater private key password`
- Cause : mettre `sign-binaries: false` force `TAURI_SIGNING_PRIVATE_KEY: ''`, Tauri échoue à signer
- Fix : garder `sign-binaries: true` pour TOUTES les plateformes dans `release.yml`
- Le contrôle du signing Azure Windows se fait via `tauri.conf.json` (piège 5), pas via ce flag

**Piège 7 — Multiples draft releases orphelines après force-push**
- Symptôme : `gh release list` montre plusieurs drafts v0.x.0 avec assets partiels
- Cause : chaque force-push du tag crée une nouvelle draft release
- Fix : `gh api repos/calvinlegerpro-commits/Cause/releases --jq '.[] | select(.tag_name == "v0.x.0") | {id, assets: [.assets[].name]}'` pour identifier la draft complète, la publier, supprimer les autres
- À éviter : utiliser `gh run rerun --failed <run-id>` plutôt que force-pusher le tag quand aucun changement de code n'est nécessaire

---

## Development Commands

**Prerequisites:** [Rust](https://rustup.rs/) (latest stable), [Bun](https://bun.sh/)

```bash
# Install dependencies
bun install

# Run in development mode
bun run tauri dev
# If cmake error on macOS:
CMAKE_POLICY_VERSION_MINIMUM=3.5 bun run tauri dev

# Build for production
bun run tauri build

# Linting and formatting (run before committing)
bun run lint              # ESLint for frontend
bun run lint:fix          # ESLint with auto-fix
bun run format            # Prettier + cargo fmt
bun run format:check      # Check formatting without changes
```

**Model Setup (Required for Development):**

```bash
mkdir -p src-tauri/resources/models
curl -o src-tauri/resources/models/silero_vad_v4.onnx https://blob.handy.computer/silero_vad_v4.onnx
```

## Architecture Overview

Handy is a cross-platform desktop speech-to-text app built with Tauri 2.x (Rust backend + React/TypeScript frontend).

### Backend Structure (src-tauri/src/)

- `lib.rs` - Main entry point, Tauri setup, manager initialization
- `managers/` - Core business logic:
  - `audio.rs` - Audio recording and device management
  - `model.rs` - Model downloading and management
  - `transcription.rs` - Speech-to-text processing pipeline
  - `history.rs` - Transcription history storage
- `audio_toolkit/` - Low-level audio processing:
  - `audio/` - Device enumeration, recording, resampling
  - `vad/` - Voice Activity Detection (Silero VAD)
- `commands/` - Tauri command handlers for frontend communication
- `shortcut.rs` - Global keyboard shortcut handling
- `settings.rs` - Application settings management

### Frontend Structure (src/)

- `App.tsx` - Main component with onboarding flow
- `components/settings/` - Settings UI (35+ files)
- `components/model-selector/` - Model management interface
- `components/onboarding/` - First-run experience
- `hooks/useSettings.ts`, `useModels.ts` - State management hooks
- `stores/settingsStore.ts` - Zustand store for settings
- `bindings.ts` - Auto-generated Tauri type bindings (via tauri-specta)
- `overlay/` - Recording overlay window code

### Key Patterns

**Manager Pattern:** Core functionality organized into managers (Audio, Model, Transcription) initialized at startup and managed via Tauri state.

**Command-Event Architecture:** Frontend → Backend via Tauri commands; Backend → Frontend via events.

**Pipeline Processing:** Audio → VAD → Whisper/Parakeet → Text output → Clipboard/Paste

**State Flow:** Zustand → Tauri Command → Rust State → Persistence (tauri-plugin-store)

## Internationalization (i18n)

All user-facing strings must use i18next translations. ESLint enforces this (no hardcoded strings in JSX).

**Adding new text:**

1. Add key to `src/i18n/locales/en/translation.json`
2. Use in component: `const { t } = useTranslation(); t('key.path')`

**File structure:**

```
src/i18n/
├── index.ts           # i18n setup
├── languages.ts       # Language metadata
└── locales/
    ├── en/translation.json  # English (source)
    ├── es/translation.json  # Spanish
    ├── fr/translation.json  # French
    └── vi/translation.json  # Vietnamese
```

## Code Style

**Rust:**

- Run `cargo fmt` and `cargo clippy` before committing
- Handle errors explicitly (avoid unwrap in production)
- Use descriptive names, add doc comments for public APIs

**TypeScript/React:**

- Strict TypeScript, avoid `any` types
- Functional components with hooks
- Tailwind CSS for styling
- Path aliases: `@/` → `./src/`

## Commit Guidelines

Use conventional commits:

- `feat:` new features
- `fix:` bug fixes
- `docs:` documentation
- `refactor:` code refactoring
- `chore:` maintenance

## CLI Parameters

Handy supports command-line parameters on all platforms for integration with scripts, window managers, and autostart configurations.

**Implementation files:**

- `src-tauri/src/cli.rs` - CLI argument definitions (clap derive)
- `src-tauri/src/main.rs` - Argument parsing before Tauri launch
- `src-tauri/src/lib.rs` - Applying CLI overrides (setup closure + single-instance callback)
- `src-tauri/src/signal_handle.rs` - `send_transcription_input()` reusable function

**Available flags:**

| Flag                     | Description                                                                        |
| ------------------------ | ---------------------------------------------------------------------------------- |
| `--toggle-transcription` | Toggle recording on/off on a running instance (via `tauri_plugin_single_instance`) |
| `--toggle-post-process`  | Toggle recording with post-processing on/off on a running instance                 |
| `--cancel`               | Cancel the current operation on a running instance                                 |
| `--start-hidden`         | Launch without showing the main window (tray icon still visible)                   |
| `--no-tray`              | Launch without the system tray icon (closing window quits the app)                 |
| `--debug`                | Enable debug mode with verbose (Trace) logging                                     |

**Key design decisions:**

- CLI flags are runtime-only overrides — they do NOT modify persisted settings
- Remote control flags (`--toggle-transcription`, `--toggle-post-process`, `--cancel`) work by launching a second instance that sends its args to the running instance via `tauri_plugin_single_instance`, then exits
- `send_transcription_input()` in `signal_handle.rs` is shared between signal handlers and CLI to avoid code duplication
- `CliArgs` is stored in Tauri managed state (`.manage()`) so it's accessible in `on_window_event` and other handlers

## Debug Mode

Access debug features: `Cmd+Shift+D` (macOS) or `Ctrl+Shift+D` (Windows/Linux)

## Platform Notes

- **macOS**: Metal acceleration, accessibility permissions required
- **Windows**: Vulkan acceleration, code signing
- **Linux**: OpenBLAS + Vulkan, limited Wayland support, overlay disabled by default
