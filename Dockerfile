# Use your Node version (v22) for consistency
FROM node:22

# Install Poppler
RUN apt-get update && apt-get install -y poppler-utils

# Set working directory
WORKDIR /app

# Copy dependency files & install
COPY package*.json ./
RUN npm install

# Copy remaining source code
COPY . .

# Expose port - match your backend!
EXPOSE 5000

# Start command
CMD ["npm", "start"]
