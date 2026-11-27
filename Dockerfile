# Stage 1: Install dependencies and build the Next.js app
FROM node:20-alpine AS builder
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of your code and build
COPY . .
RUN npm run build

# Stage 2: Run the Next.js production server
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# Copy only what is needed to run the built app
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3000

CMD ["npm", "start"]
