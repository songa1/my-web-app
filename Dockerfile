FROM node:20-alpine

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install --omit=dev

# Copy the rest of your app code
COPY . .

# Expose the port your app listens on
EXPOSE 3000

# Start the application
CMD ["node", "index.js"]
