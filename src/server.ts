import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { generatePrismaSchema } from "./utils/schema-generator";
import { checkDatabaseConnection, prisma } from "./config/prisma";
import crudRouter from "./routes/dynamic-crud.router";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Step 1: Generate schema and synchronize database
// For a production-ready app, this would be a separate command or check.
// Here we'll ensure the schema exists on startup.
generatePrismaSchema();

// Simple health check endpoint
app.get("/health", async (req, res) => {
  const dbConnected = await checkDatabaseConnection();
  res.status(dbConnected ? 200 : 503).json({
    status: dbConnected ? "UP" : "DOWN",
    database: dbConnected ? "Connected" : "Disconnected",
    timestamp: new Date().toISOString()
  });
});

// Dynamic CRUD endpoints
app.use("/", crudRouter);

const startServer = async () => {
    try {
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error("Failed to start server:", error);
    }
};

startServer();
