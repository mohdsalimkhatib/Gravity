# Stage 1: Build the React Application
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
# Add the CI environment variable here to ensure the build runs non-interactively
ENV CI=true 
RUN npm run build

# Stage 2: Serve the application with Nginx
FROM nginx:alpine as production

# This COPY command failed because the 'build' directory wasn't created in Stage 1
COPY --from=builder /app/dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]