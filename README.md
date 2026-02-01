ARW Cosmetics — site e‑commerce

Description
----------
Petit projet e‑commerce composé d'un frontend statique (HTML/CSS/JS) et d'une API Node.js qui lit les données depuis un fichier Excel. Idéal pour prototyper une boutique sans base de données lourde.

Structure du projet
-------------------
- `Magasin/` : frontend (pages HTML, dossiers `CSS/`, `ImagesProd/`, scripts JS)
- `server/` : backend Node.js + Express
	- `server/src/index.js` : point d'entrée, middlewares et routes
	- `server/src/routes/` : routes API (`products`, `auth`, `cart`, `orders`, ...)
	- `server/src/utils/excel.js` : utilitaire pour lire/écrire l'Excel
	- `server/data/BDD1.xlsx` : données (produits, utilisateurs, panier, commandes)
- `START_SERVER.bat` : script Windows pour lancer le serveur local

Démarrer le projet localement (Node.js)
-------------------------------------
1. Installer Node.js (version LTS) depuis https://nodejs.org/
2. Copier le fichier d'exemple d'environnement si nécessaire :
	 - `server/.env.example` → `server/.env` et définir `JWT_SECRET`
3. Ouvrir un terminal dans le dossier `server` :

```bash
cd server
npm install
node src/index.js
```

4. Ouvrir le navigateur : `http://localhost:4000/home.html`

Si vous préférez le script Windows, double‑cliquez `START_SERVER.bat`.

Déploiement (tel que configuré ici)
----------------------------------
- Frontend hébergé sur Vercel : https://projetechwbarwcosmetic.vercel.app
- Backend hébergé sur Render (URL publique fournie lors du déploiement)

Notes importantes pour la production
- Définir `JWT_SECRET` dans les variables d'environnement sur Render.
- Les images peuvent être servies depuis le backend ou depuis GitHub Raw (utilisé ici pour éviter les problèmes de `localhost` en production).
- Les services cloud restent accessibles sans laisser votre machine allumée.

Comment le site a été construit
------------------------------
- Frontend : pages HTML/CSS et JavaScript vanilla. Le JS central (`Magasin/script.js`) :
	- récupère les produits via l'API,
	- rend les cartes produit, le slider et la page détail,
	- gère le panier en `localStorage` et les interactions utilisateur.
- API (backend) : Node.js + Express
	- routes principales : `/api/products`, `/api/auth`, `/api/cart`, `/api/orders`.
	- les routes lisent/écrivent dans `server/data/BDD1.xlsx` via `server/src/utils/excel.js`.
- Authentification :
	- inscription (`POST /api/auth/signup`) : mot de passe hashé avec `bcrypt`, nouvel utilisateur ajouté à l'Excel, JWT renvoyé au client.
	- connexion (`POST /api/auth/login`) : vérification du mot de passe et renvoi d'un JWT.
- Middleware :
	- `cors()` et `express.json()` pour gérer CORS et le parsing JSON.
	- middleware `auth` : récupère le token `Authorization: Bearer <token>`, vérifie le JWT (`jwt.verify`) et ajoute `req.user` (id) pour protéger les routes.
	- middleware statique pour servir `/images` depuis `Magasin/ImagesProd` en local.

Comment l'API fonctionne (en bref)
---------------------------------
- Les routes produit lisent la feuille `Produit` de l'Excel et retournent des objets JSON.
- Les routes auth manipulent la feuille `Utisers` (utilisateurs). Le JWT encapsule l'`id` utilisateur.
- Le panier et les commandes sont conservés partiellement dans l'Excel (pas de vraie base relationnelle).

Points à savoir / problèmes fréquents
------------------------------------
- Si la page est servie en HTTPS, n'utilisez pas d'URL `http://localhost:4000` pour les images ou l'API : navigateur bloque le contenu mixte.
- Après modifications locales, il faut pousser sur GitHub pour que Vercel/Render redéploient.
- Ne commitez jamais de secrets (`JWT_SECRET`) dans le repo ; utilisez les variables d'environnement de Render.

Raccourci des endpoints utiles
-----------------------------
- `GET  /api/products` — liste produits
- `GET  /api/products/:id` — détail produit
- `POST /api/auth/signup` — créer compte
- `POST /api/auth/login` — se connecter
- `GET  /api/auth/me` — profil connecté (JWT requis)
- `GET  /images/<file>` — images (local)

Si tu veux, je peux :
- ajouter un script pour exporter/importer la feuille Excel,
- automatiser l'hébergement des images sur un CDN,
- ou préparer un petit guide de déploiement pas à pas pour Render/Vercel.

Fin.
→ Check that it says "✅ Server running on http://localhost:4000"
