# Design — Causer

**Date :** 2026-03-29
**Statut :** Approuvé
**Projet source :** [Melvynx/Parler](https://github.com/Melvynx/Parler) (fork de cjpais/Handy)

---

## Résumé

Causer est un fork léger de Parler — application desktop de speech-to-text locale utilisant Whisper et Parakeet. L'objectif est de rebrandir l'app en français avec une UX simplifiée, et d'y ajouter une distribution soignée pour permettre une installation facile chez des amis ou clients non-techniques.

---

## Architecture & périmètre

### Stack technique (inchangée)
- **Frontend :** React + TypeScript + Tailwind CSS
- **Backend :** Rust (whisper-rs, transcription-rs, cpal, rdev)
- **Framework desktop :** Tauri
- **Plateformes :** macOS (Intel + Apple Silicon) + Windows (x64)

### Ce qu'on ne touche pas
- Moteur de transcription Rust (Whisper, Parakeet V3, VAD)
- Providers IA de post-traitement (OpenAI, Groq, Anthropic, etc.)
- Système de raccourcis globaux
- Historique des transcriptions
- Pipeline de builds GitHub Actions (adapté, pas réécrit)

### Changements d'identité
| Avant | Après |
|-------|-------|
| `com.melvynx.parler` | `com.calvinleger.causer` |
| Parler | Causer |
| Interface anglaise | Interface française |

### Relation avec l'upstream
Le fork reste proche de Melvynx/Parler pour pouvoir merger les mises à jour futures. Les changements sont concentrés sur le frontend et la config Tauri — pas sur le moteur Rust.

---

## UX simplifiée

### Paramètres à deux niveaux
Les settings sont réorganisés :

**Basique** (visible par défaut) :
- Choix du modèle de transcription (avec badge "Recommandé")
- Raccourci clavier
- Langue de transcription

**Avancé** (section repliable, cachée par défaut) :
- Providers IA et actions post-traitement (1-9)
- Options audio
- Réglages VAD (Voice Activity Detection)
- Autres paramètres techniques existants

### Wizard de premier lancement
Déclenché uniquement lors de la toute première ouverture de l'app. 3 étapes :

1. **Bienvenue** — présentation de Causer, bouton "Commencer"
2. **Choisir un modèle** — 3 options présentées simplement :
   - *Turbo* — Recommandé, rapide, bon pour FR/EN
   - *Parakeet V3* — Sans GPU, fonctionne sur tous les Mac/PC
   - *Large V3* — Précis, lent, usage professionnel
   - Le modèle sélectionné se télécharge en arrière-plan avec une barre de progression
3. **Configurer** — raccourci clavier + instructions visuelles pour accorder les permissions micro et accessibilité (adaptées macOS / Windows)

Après le wizard : l'app est prête, aucune manipulation supplémentaire.

---

## Distribution

### Builds automatiques
Le workflow GitHub Actions existant est adapté pour produire à chaque tag `vX.X.X` :
- `Causer_x.x.x_aarch64.dmg` (macOS Apple Silicon)
- `Causer_x.x.x_x64.dmg` (macOS Intel)
- `Causer_x.x.x_x64-setup.exe` (Windows)

Les artefacts sont publiés automatiquement comme GitHub Release.

### Page de distribution
Hébergée sur GitHub Pages (`calvinleger.github.io/cause`). Page statique HTML/CSS, pas de backend ni tracking. Contenu :
- Nom "Causer" + phrase d'accroche courte
- Bouton de téléchargement unique détectant automatiquement macOS ou Windows
- Instructions en 3 lignes pour accorder les permissions système
- Lien vers les releases GitHub pour les versions précédentes

---

## Ce qui n'est pas dans le scope
- Refonte visuelle complète
- Suppression des providers IA existants
- Support Linux (présent dans Parler mais non maintenu activement ici)
- Système de mise à jour automatique (Tauri Updater) — à envisager plus tard
