# CRUD API

Cette API permet de gérer des utilisateurs avec rôles. 
Bonne lecture, hate de vos retours :)

## Fonctionnalités

- Authentification avec JWT (access + refresh)
- CRUD utilisateurs avec rôles et autorisations
- Envoi automatique d'un e-mail à la création d'un utilisateur
- Pagination, tri, recherche
- Documentation Swagger
- Tests d'intégration 

## Stack

- Fastify
- Prisma + PostgreSQL
- JWT
- Nodemailer + Mailhog
- Docker + Docker Compose
- TypeScript

## Installation

### 1. Lancer l'app entièrement avec Docker

```bash
cp .env.docker .env
docker compose up --build
```

- API disponible sur : http://localhost:4000
- Documentation Swagger : http://localhost:4000/docs
- Mailhog (emails) : http://localhost:8025

### 2. Lancer l'API en local, mais les services en Docker

Necessite Node.js et pnpm installés

#### 1. Lancer les services
```bash
cp .env.local .env
docker compose up --build
docker compose up postgres mailhog
```

#### 2. Set up la base de données
```bash
pnpm install
pnpm prisma generate
pnpm prisma migrate dev
pnpm ts-node scripts/seeds.ts
```
#### 3. Lancer l'app
```bash
pnpm dev
```

## Documentation API

Swagger disponible a :
http://localhost:4000/docs

## Structure du projet

```
src/
├── controllers/ 
├── models/      
├── routes/      
├── schemas/     
├── services/    
├── validators/  
└── ...
```

## Tests

```bash
pnpm test
```



# crud-api
API for users management with CRUD Operations, authentication and admin management


Framework : Fastify
Language : TypeScript
Authenthication : JWT
Documentation : Swagger
Tests : Jest
Dockerisation : Docker Compose
Database : PostgreSQL


Reste a faire : 

Check des inputs des users --> ok 
Erreur handling --> ok
Envoie email --> ok
Test integration --> ok
rendre la route post user propre  --> ok
Voir si la route post peut creer que des users ou pas --> ok 
un admin peut se supprimer lui meme pas cool --> ok 
check le sub sur la modification des user (sub ou user) --> ok
Reparer le password avec la route pour update + faire en sorte de bloquer les champs qu'on peut update. --> ok
Ajouter un service pour les users/auth ? --> nop pas utile
tests intergration ++ 


Pour creer la base de test dans le container docker : 
docker exec -it <nom_du_container_postgres> psql -U postgres
CREATE DATABASE crud_test;
\q

