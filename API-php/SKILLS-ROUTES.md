# Documentation des Routes Skills

## Vue d'ensemble

Cette API permet de gérer les compétences techniques (skills) en développement avec des opérations CRUD complètes.

## Structure des données

Un skill contient les champs suivants :

```json
{
  "id": 1,
  "name": "PHP",
  "level": "Avancé",
  "category": "Backend",
  "created_at": "2025-11-13 12:49:13",
  "updated_at": "2025-11-13 12:49:13"
}
```

### Niveaux valides
- `Débutant`
- `Intermédiaire`
- `Avancé`
- `Expert`

### Catégories valides
- `Backend`
- `Frontend`
- `Database`
- `DevOps`
- `Mobile`
- `Autre`

---

## Routes disponibles

### 1. Récupérer tous les skills

**Endpoint :** `GET /skills`

**Paramètres de query (optionnels) :**
- `page` : Numéro de la page (par défaut : 1)

**Réponse :**
```json
{
  "status": "succès",
  "code": 200,
  "message": "Skills récupérés avec succès",
  "timestamp": "2025-11-13 12:49:33",
  "data": {
    "skills": [
      {
        "id": 1,
        "name": "PHP",
        "level": "Avancé",
        "category": "Backend",
        "created_at": "2025-11-13 12:49:13",
        "updated_at": "2025-11-13 12:49:13"
      }
    ],
    "pagination": {
      "page_actuelle": 1,
      "total_pages": 1,
      "total_skills": 1,
      "limite_par_page": 10,
      "page_suivante": 2,
      "page_precedente": null
    }
  }
}
```

**Exemple de requête :**
```bash
curl -X GET http://localhost:8000/skills
```

---

### 2. Récupérer un skill spécifique

**Endpoint :** `GET /skills/{id}`

**Paramètres :**
- `id` : ID du skill (dans l'URL)

**Réponse (200) :**
```json
{
  "status": "succès",
  "code": 200,
  "message": "Skill récupéré avec succès",
  "data": {
    "id": 2,
    "name": "React",
    "level": "Intermédiaire",
    "category": "Frontend",
    "created_at": "2025-11-13 12:49:52",
    "updated_at": "2025-11-13 12:49:52"
  }
}
```

**Réponse d'erreur (404) :**
```json
{
  "status": "erreur",
  "code": 404,
  "message": "Skill non trouvé"
}
```

**Exemple de requête :**
```bash
curl -X GET http://localhost:8000/skills/2
```

---

### 3. Créer un nouveau skill

**Endpoint :** `POST /skills/create`

**Body (JSON) :**
```json
{
  "name": "PHP",
  "level": "Avancé",
  "category": "Backend"
}
```

**Champs requis :**
- `name` : Nom du skill (string)
- `level` : Niveau (Débutant, Intermédiaire, Avancé, Expert)
- `category` : Catégorie (Backend, Frontend, Database, DevOps, Mobile, Autre)

**Réponse (201) :**
```json
{
  "status": "succès",
  "code": 201,
  "message": "Skill créé avec succès",
  "data": {
    "id": 1,
    "name": "PHP",
    "level": "Avancé",
    "category": "Backend",
    "created_at": "2025-11-13 12:49:13",
    "updated_at": "2025-11-13 12:49:13"
  }
}
```

**Réponse d'erreur (400) :**
```json
{
  "status": "erreur",
  "code": 400,
  "message": "Les champs name, level et category sont obligatoires"
}
```

**Exemple de requête :**
```bash
curl -X POST http://localhost:8000/skills/create \
  -H "Content-Type: application/json" \
  -d '{"name":"PHP","level":"Avancé","category":"Backend"}'
```

---

### 4. Mettre à jour un skill

**Endpoint :** `PUT /skills/update/{id}`

**Paramètres :**
- `id` : ID du skill (dans l'URL)

**Body (JSON) :**
```json
{
  "name": "PHP",
  "level": "Expert",
  "category": "Backend"
}
```

**Note :** Tous les champs sont optionnels. Seuls les champs fournis seront mis à jour.

**Réponse (200) :**
```json
{
  "status": "succès",
  "code": 200,
  "message": "Skill mis à jour avec succès",
  "data": {
    "id": 1,
    "name": "PHP",
    "level": "Expert",
    "category": "Backend",
    "created_at": "2025-11-13 12:49:13",
    "updated_at": "2025-11-13 12:50:28"
  }
}
```

**Réponse d'erreur (404) :**
```json
{
  "status": "erreur",
  "code": 404,
  "message": "Skill non trouvé"
}
```

**Exemple de requête :**
```bash
curl -X PUT http://localhost:8000/skills/update/1 \
  -H "Content-Type: application/json" \
  -d '{"level":"Expert"}'
```

---

### 5. Supprimer un skill

**Endpoint :** `DELETE /skills/delete/{id}`

**Paramètres :**
- `id` : ID du skill (dans l'URL)

**Réponse (204) :**
```json
{
  "status": "succès",
  "code": 204,
  "message": "Skill supprimé avec succès",
  "data": null
}
```

**Réponse d'erreur (404) :**
```json
{
  "status": "erreur",
  "code": 404,
  "message": "Skill non trouvé"
}
```

**Exemple de requête :**
```bash
curl -X DELETE http://localhost:8000/skills/delete/1
```

---

## Exemples d'utilisation avec PowerShell

### Créer un skill
```powershell
Invoke-WebRequest -Uri http://localhost:8000/skills/create `
  -Method POST `
  -ContentType "application/json" `
  -Body '{"name":"React","level":"Intermédiaire","category":"Frontend"}' `
  | Select-Object -ExpandProperty Content
```

### Récupérer tous les skills
```powershell
Invoke-WebRequest -Uri http://localhost:8000/skills `
  -Method GET `
  | Select-Object -ExpandProperty Content
```

### Récupérer un skill spécifique
```powershell
Invoke-WebRequest -Uri http://localhost:8000/skills/1 `
  -Method GET `
  | Select-Object -ExpandProperty Content
```

### Mettre à jour un skill
```powershell
Invoke-WebRequest -Uri http://localhost:8000/skills/update/1 `
  -Method PUT `
  -ContentType "application/json" `
  -Body '{"level":"Expert"}' `
  | Select-Object -ExpandProperty Content
```

### Supprimer un skill
```powershell
Invoke-WebRequest -Uri http://localhost:8000/skills/delete/1 `
  -Method DELETE
```

---

## Codes de statut HTTP

- `200` - Succès (GET, PUT)
- `201` - Créé avec succès (POST)
- `204` - Supprimé avec succès (DELETE)
- `400` - Erreur de validation (champs manquants ou invalides)
- `404` - Ressource non trouvée
- `500` - Erreur serveur

---

## Tests effectués

✅ Tous les endpoints ont été testés et fonctionnent correctement :

1. **GET /skills** - Récupération de tous les skills avec pagination
2. **POST /skills/create** - Création de skills (PHP, React, Docker)
3. **GET /skills/{id}** - Récupération d'un skill spécifique
4. **PUT /skills/update/{id}** - Mise à jour du niveau d'un skill
5. **DELETE /skills/delete/{id}** - Suppression d'un skill

---

## Base de données

La table `skills` a été créée automatiquement avec la structure suivante :

```sql
CREATE TABLE IF NOT EXISTS skills (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(255) NOT NULL,
    level VARCHAR(50) NOT NULL,
    category VARCHAR(100) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
```

---

**Auteur :** Zayd  
**Branche :** `Ajout-CRUD-skills`  
**Date :** 13 novembre 2025

