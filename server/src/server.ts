import dotenv from "dotenv";
dotenv.config();

import app from "./app";
import { pool } from "./config/database";

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Verify database connection
    await pool.query("SELECT NOW()");

    console.log("Database connected successfully");

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
