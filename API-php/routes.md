# Routes API - Sacha Appreciation Posts

## Endpoints disponibles

### Health Check
`GET /health`

Vérifie l'état du serveur API et de la base de données.

**Paramètres :** Aucun

**Code de réponse :** 200

---

### Lister tous les posts
`GET /sacha`

Récupère tous les posts d'appréciation avec pagination (maximum 10 par page).

**Paramètres :**
- `page` (optionnel) - Numéro de la page (défaut: 1)

**Code de réponse :** 200

---

### Créer un post
`POST /sacha/create`

Crée un nouveau post d'appréciation pour Sacha.

**Paramètres :**
- `author` (requis) - Nom de l'auteur du post
- `text` (requis) - Contenu du message d'appréciation

**Code de réponse :** 201

---

### Récupérer un post spécifique
`GET /sacha/{id}`

Récupère un post d'appréciation spécifique par son ID.

**Paramètres :**
- `id` (requis) - ID du post à récupérer

**Code de réponse :** 200, 404 (si non trouvé)

---

### Mettre à jour un post
`PUT /sacha/update/{id}`

Met à jour un post d'appréciation existant.

**Paramètres :**
- `id` (requis) - ID du post à modifier
- `author` (optionnel) - Nouveau nom de l'auteur
- `text` (optionnel) - Nouveau contenu du message

**Code de réponse :** 200, 404 (si non trouvé), 400 (données invalides)

---

### Supprimer un post
`DELETE /sacha/delete/{id}`

Supprime un post d'appréciation spécifique.

**Paramètres :**
- `id` (requis) - ID du post à supprimer

**Code de réponse :** 204, 404 (si non trouvé)

---

### Page de maintenance
`GET /maintenance`

Page affichée quand le mode maintenance est activé.

**Paramètres :** Aucun

---

### Page d'accueil
`GET /`

Page d'accueil du projet (nécessite maintenance désactivée).

**Paramètres :** Aucun

---

## Codes de réponse HTTP

- **200** - Succès (GET, PUT)
- **201** - Créé avec succès (POST)
- **204** - Supprimé avec succès, pas de contenu (DELETE)
- **400** - Erreur de validation des données
- **404** - Ressource non trouvée
- **500** - Erreur interne du serveur

## Format des réponses

### Réponse de succès
```json
{
    "status": "succès",
    "code": 200,
    "message": "Description du succès",
    "timestamp": "2025-11-09 10:42:30",
    "data": {...}
}
```

### Réponse d'erreur
```json
{
    "status": "erreur",
    "code": 404,
    "message": "Description de l'erreur",
    "timestamp": "2025-11-09 10:42:30"
}
```

## Exemples d'utilisation

### Créer un post
```bash
curl -X POST "http://localhost:8000/sacha/create" \
  -d "author=Claude&text=Sacha est un développeur exceptionnel!"
```

### Récupérer tous les posts (page 1)
```bash
curl -X GET "http://localhost:8000/sacha?page=1"
```

### Mettre à jour un post
```bash
curl -X PUT "http://localhost:8000/sacha/update/1" \
  -d "author=Claude&text=Nouveau texte mis à jour"
```

### Supprimer un post
```bash
curl -X DELETE "http://localhost:8000/sacha/delete/1"
```