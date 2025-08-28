# ==============================
# Stage 1: Build
# ==============================
FROM node:21-alpine AS builder

# Diretório de trabalho
WORKDIR /home/node/app

# Copia apenas package.json e package-lock.json para cache do npm
COPY package*.json ./

# Instala dependências
RUN npm ci

# Copia todo o restante da aplicação
COPY --chown=node:node . .

# Build da aplicação
RUN npm run build && npm prune --omit=dev

# ==============================
# Stage 2: Production
# ==============================
FROM node:18-alpine

# Ambiente de produção
ENV NODE_ENV=production

# Diretório de trabalho
WORKDIR /home/node/app

# Copia package.json e node_modules do stage builder
COPY --from=builder /home/node/app/package*.json ./
COPY --from=builder /home/node/app/node_modules ./node_modules
COPY --from=builder /home/node/app/dist ./dist

# Porta da aplicação
EXPOSE 9000

# Comando para iniciar a aplicação
CMD ["node", "dist/server.js"]
