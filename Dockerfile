FROM node:21-alpine AS builder

WORKDIR /home/node/app

COPY package*.json ./

RUN npm ci

COPY --chown=node:node . .

RUN npm run build && npm prune --omit=dev


FROM node:18-alpine

ENV NODE_ENV=production

WORKDIR /home/node/app

COPY --from=builder /home/node/app/package*.json ./
COPY --from=builder /home/node/app/node_modules ./node_modules
COPY --from=builder /home/node/app/dist ./dist

EXPOSE 9000

CMD ["node", "dist/server.js"]
