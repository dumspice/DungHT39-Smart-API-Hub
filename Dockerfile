FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Environment variables setup
ENV PORT=3000

# Run the startup script
RUN chmod +x start.sh
CMD ["./start.sh"]
