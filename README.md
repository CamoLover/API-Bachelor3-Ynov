# API Bachelor 3 Ynov

[![PHP](https://img.shields.io/badge/PHP-Native-777BB4?style=for-the-badge&logo=php&logoColor=white)](https://www.php.net/)
[![Next.js](https://img.shields.io/badge/Next.js-14+-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](LICENSE)
[![Status](https://img.shields.io/badge/Status-En_Développement-yellow?style=for-the-badge)](https://github.com/CamoLover/API-Bachelor3-Ynov)

> Projet de groupe pour le Bachelor 3 Ynov - Architecture Client-Serveur avec API RESTful

## 📋 Table des matières

- [À propos](#-à-propos)
- [Architecture](#-architecture)
- [Prérequis](#-prérequis)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Utilisation](#-utilisation)
- [Structure du projet](#-structure-du-projet)
- [Contribution](#-contribution)
- [Auteurs](#-auteurs)

## 🎯 À propos

Ce projet est un travail de groupe réalisé dans le cadre du Bachelor 3 à Ynov. Il consiste en une architecture client-serveur complète avec :

- **Serveur API** : Backend en PHP natif exposant des routes RESTful
- **Client Web** : Interface utilisateur développée avec Next.js

L'objectif est de créer une application full-stack permettant d'interagir avec une API REST via une interface web moderne.

## 🏗️ Architecture

Le projet est divisé en deux parties principales :

```
API-Bachelor3-Ynov/
├── API-php/          # Serveur API en PHP natif
└── CLIENT-NextJS/    # Application cliente Next.js
```

### Serveur API (PHP)

Le serveur API utilise SQLite comme base de données et expose les routes suivantes :

#### Routes générales
- `GET /health` - Statut de l'API
- `GET /` - Page d'accueil de l'API

#### Routes CRUD pour les posts Sacha
- `GET /sacha` - Récupération de tous les posts
- `POST /sacha/create` - Création d'un nouveau post
- `GET /sacha/{id}` - Récupération d'un post spécifique
- `PUT /sacha/update/{id}` - Mise à jour d'un post
- `DELETE /sacha/delete/{id}` - Suppression d'un post

**Fonctionnalités :**
- Base de données SQLite automatiquement créée
- Headers CORS configurés pour le développement
- Architecture MVC avec controllers et services
- Mode maintenance configurable

### Client (Next.js)

Interface web permettant d'interagir avec l'API de manière intuitive et conviviale.

## 🔧 Prérequis

Avant de commencer, assurez-vous d'avoir installé :

- [PHP](https://www.php.net/downloads) >= 8.0 avec les extensions SQLite3
- [Composer](https://getcomposer.org/) pour la gestion des dépendances PHP
- [Node.js](https://nodejs.org/) >= 18.0
- [npm](https://www.npmjs.com/) ou [yarn](https://yarnpkg.com/)
- [Git](https://git-scm.com/)

## 📦 Installation

### 1. Cloner le repository

```bash
git clone https://github.com/CamoLover/API-Bachelor3-Ynov.git
cd API-Bachelor3-Ynov
```

### 2. Installation du serveur API

```bash
cd API-php
composer install
```

### 3. Installation du client Next.js

```bash
cd CLIENT-NextJS
npm install
# ou
yarn install
```

## ⚙️ Configuration

### Configuration du client Next.js

Créez un fichier `.env` dans le dossier `CLIENT-NextJS` :

```env
API_SERVER_URL=http://localhost:8000
```

> **Note** : Vous pouvez modifier l'URL du serveur API selon votre environnement (par défaut : `http://localhost:8000`)

## 🚀 Utilisation

### Démarrer le serveur API

```bash
cd API-php
php -S localhost:8000
```

Le serveur API sera accessible sur `http://localhost:8000`

### Démarrer le client Next.js

Dans un nouveau terminal :

```bash
cd CLIENT-NextJS
npm run dev
# ou
yarn dev
```

L'application cliente sera accessible sur `http://localhost:3000`

## 📁 Structure du projet

```
API-Bachelor3-Ynov/
│
├── API-php/                    # Backend PHP
│   ├── src/
│   │   ├── Controllers/       # Contrôleurs API (HealthController, SachaController)
│   │   ├── Database/          # Gestion de la base de données SQLite
│   │   └── Services/          # Services (ResponseService)
│   ├── data/                  # Base de données SQLite
│   ├── public/                # Fonctions publiques
│   ├── vendor/                # Dépendances Composer
│   ├── routes.php             # Définition des routes API
│   ├── index.php              # Point d'entrée
│   ├── composer.json          # Configuration Composer
│   └── routes.md              # Documentation des routes
│
├── CLIENT-NextJS/              # Frontend Next.js
│   ├── src/
│   │   ├── app/               # Pages et routes Next.js
│   │   ├── components/        # Composants React réutilisables
│   │   └── services/          # Services API
│   ├── public/                # Ressources statiques
│   ├── .env                   # Variables d'environnement
│   └── package.json
│
└── README.md                  # Ce fichier
```

## 🤝 Contribution

Nous utilisons un workflow Git avec plusieurs branches pour organiser le développement.

### Structure des branches

```
main           → Code de production (stable)
  ↑
In-Dev         → Code de pré-production (basée sur main)
  ↑
feature-xxx    → Branches de fonctionnalités (basées sur In-Dev)
```

### Workflow de contribution

1. **Créer une nouvelle branche** pour votre fonctionnalité à partir de `In-Dev` :

   ```bash
   git checkout In-Dev
   git pull origin In-Dev
   git checkout -b nom-de-votre-feature
   ```

   **Exemples de noms de branches :**
   - `add-readme.md` - Ajout du README
   - `fix-api-routes` - Correction des routes API
   - `feature-user-auth` - Ajout de l'authentification

2. **Développer votre fonctionnalité** et commiter régulièrement :

   ```bash
   git add .
   git commit -m "Description claire de vos modifications"
   ```

3. **Pousser votre branche** sur le repository :

   ```bash
   git push origin nom-de-votre-feature
   ```

4. **Créer une Pull Request** vers `In-Dev` :
   - Allez sur GitHub
   - Cliquez sur "Pull Request"
   - Sélectionnez `In-Dev` comme branche de destination
   - Décrivez vos modifications
   - Demandez une review

5. **Après validation**, votre branche sera mergée dans `In-Dev`

6. **Périodiquement**, `In-Dev` sera mergée dans `main` après validation complète

### Bonnes pratiques

- ✅ Toujours créer une nouvelle branche pour chaque fonctionnalité/correction
- ✅ Utiliser des noms de branches descriptifs et en kebab-case
- ✅ Faire des commits atomiques avec des messages clairs
- ✅ Tester votre code avant de créer une Pull Request
- ✅ Garder votre branche à jour avec `In-Dev`
- ❌ Ne jamais commiter directement sur `main` ou `In-Dev`

### Mettre à jour votre branche

```bash
git checkout In-Dev
git pull origin In-Dev
git checkout votre-branche
git merge In-Dev
```

## 👥 Auteurs

Projet réalisé par les étudiants du Bachelor 3 Ynov.

---

<div align="center">
  <p>Fait avec ❤️ pour Ynov</p>
  <p>
    <a href="https://github.com/CamoLover/API-Bachelor3-Ynov/issues">Signaler un bug</a>
    ·
    <a href="https://github.com/CamoLover/API-Bachelor3-Ynov/issues">Demander une fonctionnalité</a>
  </p>
</div>
