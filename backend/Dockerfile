# backend/Dockerfile
FROM node:20

WORKDIR /app

# Copy dependency files first for better caching
COPY package*.json ./
RUN npm install

# Copy rest of the backend code
COPY . .

# Expose backend port
EXPOSE 4000

# Use npm run dev for hot reload (if you're using nodemon)
CMD ["npm", "run", "dev"]
