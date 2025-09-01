import { Router } from "express"
import { TaskController } from "../controllers/TaskController"
import { TaskRepositoryImpl } from "../../infrastructure/repositories/TaskRepositoryImpl"
import { requestLogger } from "../middleware/requestLogger"
// import { TaskService } from "../../domain/services/TaskService";

const router = Router()

// Apply request logging middleware
router.use(requestLogger)

// Dependencies (in a real app, move this to a DI container)
const taskRepository = new TaskRepositoryImpl()
// const taskService = new TaskService();
const taskController = new TaskController(taskRepository)

// Routes
// router.post("/", taskController.createTask);
router.get("/", taskController.getAllTasks)
router.get("/:id", taskController.getTaskById)

export default router
