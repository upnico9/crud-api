# Étape 1 : base Node + pnpm
FROM node:20-alpine

# Activer PNPM
RUN corepack enable && corepack prepare pnpm@latest --activate

# Dossier de travail
WORKDIR /usr/src/app

# Installer les dépendances
COPY package.json pnpm-lock.yaml ./
RUN pnpm install

# Copier le reste de l’application
COPY . .

# Exposer le port
EXPOSE 4000

# Générer Prisma client
RUN pnpm prisma generate

# Compiler le projet TypeScript (y compris seeds.ts)
RUN pnpm build

# CMD : déployer la migration + lancer le seed + démarrer l’app
CMD pnpm prisma migrate deploy \
  && pnpm ts-node scripts/seeds.ts \
  && pnpm dev
