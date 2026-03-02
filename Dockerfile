FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
COPY prisma ./prisma/
RUN npm ci

FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_Y3VycmVudC1jYWltYW4tMjguY2xlcmsuYWNjb3VudHMuZGV2JA

ENV CLERK_SECRET_KEY="sk_test_placeholder"
ENV DATABASE_URL="postgresql://placeholder:5432/db"
ENV DIRECT_URL="postgresql://placeholder:5432/db"
ENV RESEND_API_KEY="re_placeholder_123"
ENV NEXT_PUBLIC_APP_URL="http://localhost:3000"

RUN npx prisma generate
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV HOSTNAME="0.0.0.0"
ENV PORT=3000

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000

CMD ["node", "server.js"]