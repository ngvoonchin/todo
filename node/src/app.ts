import express from "express"
import routes from "./interfaces/routes"
import { AppDataSource } from "./infrastructure/db/dataSource"

const PORT = process.env.PORT || 4000

const app = express()

app.use(express.json())

// all routes handled in one place
app.use("/api", routes)

AppDataSource.initialize()
	.then(() => {
		console.log("🟢 Data Source has been initialized!")
		app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`))
	})
	.catch((err) => {
		console.error("❌ Error during Data Source initialization", err)
	})

export default app
