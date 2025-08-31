import express from "express"
import "reflect-metadata";

import { AppDataSource } from "./infrastructure/db/dataSource"
import taskRoutes from "./api/routes/TaskRoutes"

const app = express()

const PORT = process.env.PORT || 4000

app.use(express.json())

app.use('/tasks', taskRoutes)

AppDataSource.initialize()
  .then(() => {
    console.log("🟢 Data Source has been initialized!");
    app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error("❌ Error during Data Source initialization", err);
  });

app.listen(PORT, () => {
    console.log(`Todo app running on port ${PORT}`)
})