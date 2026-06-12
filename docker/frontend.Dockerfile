FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
COPY tsconfig.json ./
COPY apps/frontend/package*.json ./apps/frontend/
COPY packages/common/package*.json ./packages/common/
RUN npm ci
COPY . .
RUN npm run build -w apps/frontend

FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
COPY apps/frontend/package*.json ./apps/frontend/
COPY packages/common/package*.json ./packages/common/
RUN npm ci --omit=dev
COPY --from=builder /app/apps/frontend/.next ./apps/frontend/.next
COPY --from=builder /app/apps/frontend/public ./apps/frontend/public
COPY --from=builder /app/packages/common/dist ./packages/common/dist
EXPOSE 3000
CMD ["npm", "run", "start", "-w", "apps/frontend"]
