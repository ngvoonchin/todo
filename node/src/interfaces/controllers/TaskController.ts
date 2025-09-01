import { Request, Response } from "express"
import { ListTasks, CreateTask, CompleteTask, GetOverdueTasks } from "../../application/usecases/Task"
import { TaskRepository } from "../../domain/repositories/TaskRepository"
import { logger } from "../../infrastructure/logging/logger"
// import { TaskService } from "../../domain/services/TaskService";

export class TaskController {
	constructor(
		private taskRepository: TaskRepository // private taskService: TaskService
	) {}

	getAllTasks = async (req: Request, res: Response) => {
		try {
			logger.info("Getting all tasks", {
				method: req.method,
				url: req.url,
				userAgent: req.get("User-Agent")
			})

			const useCase = new ListTasks(this.taskRepository)
			const tasks = await useCase.execute()

			logger.info("Successfully retrieved tasks", {
				taskCount: tasks.length,
				method: req.method,
				url: req.url
			})

			res.json(tasks)
		} catch (err: any) {
			logger.error("Error getting tasks", {
				error: err.message,
				stack: err.stack,
				method: req.method,
				url: req.url
			})

			res.status(500).json({ error: err.message })
		}
	}

	getTaskById = async (req: Request, res: Response) => {
		try {
			const taskId = req.params.id
			if (!taskId) {
				res.status(400).json({ error: "Task ID is required" })
				return
			}
			const task = await this.taskRepository.findById(taskId)

			if (!task) {
				return res.status(404).json({ error: "Task not found" })
			}

			res.json(task)
		} catch (err: any) {
			logger.error("Error getting task by ID", {
				error: err.message,
				stack: err.stack,
				method: req.method,
				url: req.url
			})

			res.status(500).json({ error: err.message })
		}
	}

	createTask = async (req: Request, res: Response) => {
		try {
			const { title, description } = req.body

			const useCase = new CreateTask(this.taskRepository)
			const task = await useCase.execute(title, description)

			logger.info("Task created", { taskId: task.id, title: task.title })
			res.status(201).json(task)
		} catch (err: any) {
			logger.error("Error creating task", { error: err.message })
			res.status(500).json({ error: err.message })
		}
	}

	completeTask = async (req: Request, res: Response) => {
		try {
			const { id } = req.params

			if (!id) {
				res.status(400).json({ error: "Task ID is required" })
				return
			}

			const useCase = new CompleteTask(this.taskRepository)
			const task = await useCase.execute(id)

			if (!task) {
				return res.status(404).json({ error: "Task not found" })
			}

			logger.info("Task completed", { taskId: task.id })
			res.json(task)
		} catch (err: any) {
			logger.error("Error completing task", { error: err.message })
			res.status(500).json({ error: err.message })
		}
	}

	getOverdueTasks = async (req: Request, res: Response) => {
		try {
			const { dueDate } = req.query

			if (!dueDate) {
				return res.status(400).json({ error: "dueDate query parameter required" })
			}

			const useCase = new GetOverdueTasks(this.taskRepository)
			const overdueTasks = await useCase.execute(new Date(dueDate as string))

			logger.info("Retrieved overdue tasks", { count: overdueTasks.length })
			res.json(overdueTasks)
		} catch (err: any) {
			logger.error("Error getting overdue tasks", { error: err.message })
			res.status(500).json({ error: err.message })
		}
	}
}
