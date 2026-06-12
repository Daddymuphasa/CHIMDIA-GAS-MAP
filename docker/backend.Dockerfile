FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
COPY tsconfig.json ./
COPY apps/backend/package*.json ./apps/backend/
COPY packages/common/package*.json ./packages/common/
RUN npm ci
COPY . .
RUN npm run build -w apps/backend

FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
COPY apps/backend/package*.json ./apps/backend/
COPY packages/common/package*.json ./packages/common/
RUN npm ci --omit=dev
COPY --from=builder /app/apps/backend/dist ./apps/backend/dist
COPY --from=builder /app/packages/common/dist ./packages/common/dist
EXPOSE 3001
CMD ["npm", "run", "start:prod", "-w", "apps/backend"]
