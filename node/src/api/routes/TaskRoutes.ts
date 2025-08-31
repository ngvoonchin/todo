import { Router } from "express";
import { TaskController } from "../controllers/TaskController";
import { TaskRepositoryImpl } from "../../infrastructure/repositories/TaskRepositoryImpl";
// import { TaskService } from "../../domain/services/TaskService";

const router = Router();

// Dependencies (in a real app, move this to a DI container)
const taskRepository = new TaskRepositoryImpl();
// const taskService = new TaskService();
const taskController = new TaskController(taskRepository);

// Routes
// router.post("/", taskController.createTask);
router.get("/", taskController.getAllTasks);

export default router;
