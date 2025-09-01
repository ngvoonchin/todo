import { Request, Response } from "express"
import { ListTasks, CreateTask, CompleteTask, GetOverdueTasks } from "../../application/usecases/Task"
import { TaskRepository } from "../../domain/repositories/TaskRepository"
import { ResponseHelper } from "../utils/ResponseHelper"
import { logger } from "../../infrastructure/logging/logger"
import { IdGenerator } from "../../domain/services/IdGenerator"

export class TaskControllerWithHelper {
	constructor(private taskRepository: TaskRepository, private idGenerator: IdGenerator) {}

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

			ResponseHelper.sendSuccess(res, tasks, "Tasks retrieved successfully")
		} catch (err: any) {
			logger.error("Error getting tasks", {
				error: err.message,
				stack: err.stack,
				method: req.method,
				url: req.url
			})

			ResponseHelper.sendInternalError(res, "Failed to retrieve tasks")
		}
	}

	createTask = async (req: Request, res: Response) => {
		try {
			const { title, description } = req.body

			if (!title) {
				return ResponseHelper.sendBadRequest(res, "Title is required")
			}

			const useCase = new CreateTask(this.taskRepository, this.idGenerator)
			const task = await useCase.execute(title, description)

			logger.info("Task created", { taskId: task.id, title: task.title })

			ResponseHelper.sendCreated(res, task, "Task created successfully")
		} catch (err: any) {
			logger.error("Error creating task", { error: err.message })

			ResponseHelper.sendInternalError(res, "Failed to create task")
		}
	}

	getTaskById = async (req: Request, res: Response) => {
		try {
			const taskId = req.params.id

			if (!taskId) {
				return ResponseHelper.sendBadRequest(res, "Task ID is required")
			}

			const task = await this.taskRepository.findById(taskId)

			if (!task) {
				return ResponseHelper.sendNotFound(res, "Task not found")
			}

			ResponseHelper.sendSuccess(res, task, "Task retrieved successfully")
		} catch (err: any) {
			logger.error("Error getting task by ID", {
				error: err.message,
				stack: err.stack,
				method: req.method,
				url: req.url
			})

			ResponseHelper.sendInternalError(res, "Failed to retrieve task")
		}
	}

	completeTask = async (req: Request, res: Response) => {
		try {
			const { id } = req.params

			if (!id) {
				return ResponseHelper.sendBadRequest(res, "Task ID is required")
			}

			const useCase = new CompleteTask(this.taskRepository)
			const task = await useCase.execute(id)

			if (!task) {
				return ResponseHelper.sendNotFound(res, "Task not found")
			}

			logger.info("Task completed", { taskId: task.id })

			ResponseHelper.sendSuccess(res, task, "Task completed successfully")
		} catch (err: any) {
			logger.error("Error completing task", { error: err.message })

			ResponseHelper.sendInternalError(res, "Failed to complete task")
		}
	}
}
