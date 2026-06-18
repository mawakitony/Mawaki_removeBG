# Mawaki_removeBG — Suppression d'arrière-plan IA

Application web moderne pour supprimer automatiquement l'arrière-plan de vos images, avec remplacement par couleur ou image personnalisée.

## Fonctionnalités

- **Téléversement** par glisser-déposer ou sélection de fichier
- **Détourage IA** via `@imgly/background-removal` (traitement 100% dans le navigateur)
- **Remplacement de fond** : transparent, couleur unie ou image
- **Aperçu en temps réel** avant téléchargement
- **Export PNG** transparent ou avec fond appliqué
- **Confidentialité** : aucune base de données, aucun stockage permanent

## Démarrage

```bash
npm install
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000).

## Build production

```bash
npm run build
npm start
```

## Déploiement

Compatible Vercel, Netlify ou tout hébergeur Node.js.

```bash
# Vercel
npx vercel
```

## Confidentialité

Toutes les images sont traitées localement dans le navigateur de l'utilisateur. Aucune donnée n'est envoyée à un serveur ni stockée de manière permanente. Les données en mémoire sont automatiquement effacées à la fermeture ou au rafraîchissement de l'onglet.

## Technologies

- Next.js 16 · React 19 · TypeScript
- Tailwind CSS 4 · Framer Motion
- @imgly/background-removal (WASM/WebGPU)
