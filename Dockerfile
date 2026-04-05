FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Environment variables setup
ENV PORT=3000
ENV DATABASE_URL=postgresql://postgres:Tiendung11%40@db:5433/smart_api_hub

# Run the startup script
RUN chmod +x start.sh
CMD ["./start.sh"]
