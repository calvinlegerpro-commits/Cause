# Causer

**Causer** est une application de dictée vocale pour Mac et Windows.  
Appuie sur un raccourci clavier, parle, et ton texte apparaît directement là où tu écris.

> Fork personnel de https://github.com/Melvynx/Parler par Calvin Leger, lui meme étant un fork depuis [cjpais/Handy](https://github.com/cjpais/Handy).

---

## Comment ça marche

1. Lance **Causer** — une icône apparaît dans ta barre de menu
2. Appuie sur ton raccourci clavier (configurable) pour démarrer l'enregistrement
3. Parle normalement
4. Relâche — le texte est automatiquement collé dans l'application active

C'est tout. Aucun abonnement, aucune donnée envoyée sur internet, tout tourne en local sur ton Mac.

---

## Téléchargement

👉 [Dernière version sur GitHub Releases](https://github.com/calvinlegerpro-commits/Cause/releases/latest)

| Fichier | Pour qui |
|---|---|
| `Causer_x.x.x_aarch64.dmg` | Mac Apple Silicon (M1, M2, M3…) |
| `Causer_x.x.x_x64.dmg` | Mac Intel |
| `Causer_x.x.x_x64-setup.exe` | Windows |

---

## Installation sur Mac

1. Télécharge le fichier `.dmg` correspondant à ton Mac
2. Ouvre-le et glisse **Causer** dans ton dossier Applications
3. Lance l'app — accepte les permissions demandées (micro + accessibilité)
4. Configure ton raccourci dans les Préférences

> **Note :** À la première ouverture, macOS peut afficher un avertissement car l'app n'est pas signée par Apple. Va dans **Réglages Système → Confidentialité et sécurité** et clique sur "Ouvrir quand même".

---

## Modèles de transcription

Causer télécharge les modèles à la première utilisation. Deux options :

- **Parakeet V3** — rapide, tourne sur le CPU, détecte automatiquement la langue. Recommandé pour commencer.
- **Whisper** (Small / Medium / Turbo / Large) — plus précis sur certaines langues, utilise le GPU si disponible.

---

## Raccourcis utiles

| Raccourci | Action |
|---|---|
| Configurable | Démarrer / arrêter l'enregistrement |
| `Cmd+Shift+D` (Mac) | Mode debug |

---

## Licence

MIT — voir [LICENSE](LICENSE)

## Remerciements

- [cjpais/Handy](https://github.com/cjpais/Handy) — le projet original
- https://github.com/Melvynx/Parler - Projet du créateur Melvynx qui à amelioré le projet original et qui à donné la philosophie global de "Cause" qui en est un fork direct.
