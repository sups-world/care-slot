FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY prisma ./prisma/
RUN npx prisma generate

COPY . .

# Optional: build for production
# RUN npm run build

EXPOSE 3000

# Development (with hot reload)
CMD ["npm", "run", "start:dev"]

# Production alternative:
# CMD ["sh", "-c", "npx prisma migrate deploy && node dist/main"]