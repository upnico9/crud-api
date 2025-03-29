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

