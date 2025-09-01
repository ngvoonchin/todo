import { Router } from "express"
import taskRoutes from "./TaskRoutes"

const router = Router()

// register all module routes here
router.use("/tasks", taskRoutes)

export default router
