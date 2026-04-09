import dotenv from "dotenv";

dotenv.config();

/**
 * Constructs the database connection string from individual environment variables.
 * Format: postgresql://USER:PASSWORD@HOST:PORT/DATABASE
 */
export const getDatabaseUrl = (): string => {
  // If a full DATABASE_URL is already provided, use it as a priority
  if (process.env.DATABASE_URL) {
    return process.env.DATABASE_URL;
  }

  const user = process.env.DB_USER || "postgres";
  const password = process.env.DB_PASSWORD || "";
  const host = process.env.DB_HOST || "localhost";
  const port = process.env.DB_PORT || "5432";
  const name = process.env.DB_NAME || "smart_api_hub";

  // Encoding password in case it contains special characters
  const encodedPassword = encodeURIComponent(password);

  return `postgresql://${user}:${encodedPassword}@${host}:${port}/${name}`;
};

export const databaseConfig = {
  url: getDatabaseUrl(),
};
