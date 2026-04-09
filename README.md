# Smart API Hub

Smart API Hub is a dynamic Node.js backend application designed to automatically generate a database schema and provide full CRUD (Create, Read, Update, Delete) endpoints based on a simple JSON configuration. It leverages the power of Express, TypeScript, and Prisma to provide a robust, scalable, and easy-to-use API starting point.

## 🚀 Key Features

- **Dynamic Schema Generation**: Define your database tables and fields in `schema.json`, and the app will automatically generate the corresponding Prisma schema.
- **Auto-Generated CRUD**: Once the schema is generated, the app provides standard RESTful endpoints for all your entities without writing a single line of additional controller code.
- **Authentication**: Built-in JWT-based authentication for secure access to your API.
- **API Documentation**: Interactive Swagger UI documentation available at `/api-docs`.
- **Validation**: Strict request data validation using Zod.
- **Logging & Monitoring**: Comprehensive logging with Winston and a `/health` endpoint for status checks.
- **Rate Limiting**: Protection against brute-force attacks and abuse.
- **Docker Ready**: Easy deployment and development environment setup using Docker and Docker Compose.

## 🛠 Tech Stack

- **Runtime**: Node.js (v20+)
- **Language**: TypeScript
- **Framework**: Express.js
- **ORM**: Prisma
- **Database**: PostgreSQL
- **Documentation**: Swagger/OpenAPI
- **Validation**: Zod
- **Security**: JWT, Bcrypt, CORS, Express Rate Limit
- **Logging**: Winston

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v20 or higher)
- [npm](https://www.npmjs.com/)
- [Docker](https://www.docker.com/) & [Docker Compose](https://docs.docker.com/compose/) (Recommended)
- [PostgreSQL](https://www.postgresql.org/) (Optional, if running natively)

## ⚙️ Setup & Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/DungHT39/DungHT39-Smart-API-Hub.git
   cd DungHT39-Smart-API-Hub
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Copy the example environment file and update it with your credentials:
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and set your `DATABASE_URL`, `PORT`, and `JWT_SECRET`.

## 🏃 Running the Application

### Method 1: Using Docker (Recommended)

The easiest way to get started is with Docker Compose. This will spin up both the PostgreSQL database and the API server.

```bash
docker-compose up --build
```

The API will be available at `http://localhost:3000`.

### Method 2: Local Development

If you prefer to run the application natively:

1. **Start your PostgreSQL database** and ensure the `DATABASE_URL` in `.env` is correct.
2. **First-time setup (Full Start)**:
   This command generates the schema, pushes migrations to the database, and starts the development server.
   ```bash
   npm run start:full
   ```
3. **Subsequent runs**:
   ```bash
   npm run dev
   ```

## 📂 Project Structure

```text
├── src/
│   ├── config/             # Configuration files (Database, Swagger, etc.)
│   ├── controllers/        # Express controllers (Auth, Dynamic CRUD)
│   ├── middlewares/        # Express middlewares (Auth, Error handling, Logging)
│   ├── routes/             # API route definitions
│   ├── schema/             # Zod validation schemas
│   ├── services/           # Business logic services
│   ├── utils/              # Utility functions (Schema generator, Logger, AppError)
│   └── server.ts           # Application entry point
├── prisma/                 # Prisma schema and migrations
├── schema.json             # Dynamic database definition file
├── docker-compose.yaml     # Docker orchestration
└── package.json            # Project dependencies and scripts
```

## 🔄 How to Use Dynamic Schema

1. Open `schema.json` in the root directory.
2. Define your tables and fields following the established format:
   ```json
   {
     "tables": {
       "Product": {
         "name": "string",
         "price": "number",
         "description": "string"
       }
     }
   }
   ```
3. Restart the server or run `npm run generate`. The app will:
   - Generate a new `prisma/schema.prisma`.
   - Update the database schema (if using `npm run start:full` or Prisma commands).
   - Automatically provide the following endpoints:
     - `GET /Product` - List all products
     - `GET /Product/:id` - Get a specific product
     - `POST /Product` - Create a new product
     - `PUT /Product/:id` - Update a product
     - `DELETE /Product/:id` - Delete a product

## 📖 API Documentation

Once the server is running, you can explore the API using Swagger UI:
- **URL**: `http://localhost:3000/api-docs`

## 🏥 Health Monitoring

Check the application and database status:
- **URL**: `http://localhost:3000/health`

---
Developed by [DungHT39](https://github.com/DungHT39)