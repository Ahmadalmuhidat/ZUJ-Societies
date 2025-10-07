# Stage 1: Build
FROM node:18-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm install --omit=dev

COPY . .

# Stage 2: Runtime
FROM node:18-alpine

WORKDIR /app

COPY --from=build /app /app

# Create non-root user and switch
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

EXPOSE 4000

CMD ["node", "src/server.js"]
