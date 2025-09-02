import { Request, Response } from "express"
import { ListTasks, CreateTask, CompleteTask, GetOverdueTasks, UpdateTask, DeleteTask } from "../../application/usecases/Task"
import { TaskRepository } from "../../domain/repositories/TaskRepository"
import { IdGenerator } from "../../domain/services/IdGenerator"
import { ApiResponse } from "../../domain/entities/ApiResponse"
import { QueryParser } from "../helpers/queryParser"
import { logger } from "../../infrastructure/logging/logger"
// import { TaskService } from "../../domain/services/TaskService";

export class TaskController {
	constructor(
		private taskRepository: TaskRepository,
		private idGenerator: IdGenerator // private taskService: TaskService
	) {}

	getAllTasks = async (req: Request, res: Response) => {
		try {
			logger.info("Getting all tasks", {
				method: req.method,
				url: req.url,
				query: req.query,
				userAgent: req.get("User-Agent")
			})

			// Parse query options from request
			const queryOptions = QueryParser.parseQueryOptions(req)
			console.log("Parsed queryOptions:", JSON.stringify(queryOptions, null, 2))

			const useCase = new ListTasks(this.taskRepository)
			const tasks = await useCase.execute(queryOptions)

			logger.info("Successfully retrieved tasks", {
				taskCount: tasks.length,
				queryOptions,
				method: req.method,
				url: req.url
			})

			const response = ApiResponse.success(tasks, "Tasks retrieved successfully")
			res.status(response.code).json(response.toJSON())
		} catch (err: any) {
			logger.error("Error getting tasks", {
				error: err.message,
				stack: err.stack,
				method: req.method,
				url: req.url
			})

			const response = ApiResponse.internalError("Failed to retrieve tasks")
			res.status(response.code).json(response.toJSON())
		}
	}

	getTaskById = async (req: Request, res: Response) => {
		try {
			const taskId = req.params.id
			if (!taskId) {
				const response = ApiResponse.badRequest("Task ID is required")
				return res.status(response.code).json(response.toJSON())
			}

			const task = await this.taskRepository.findById(taskId)

			if (!task) {
				const response = ApiResponse.notFound("Task not found")
				return res.status(response.code).json(response.toJSON())
			}

			const response = ApiResponse.success(task, "Task retrieved successfully")
			res.status(response.code).json(response.toJSON())
		} catch (err: any) {
			logger.error("Error getting task by ID", {
				error: err.message,
				stack: err.stack,
				method: req.method,
				url: req.url
			})

			const response = ApiResponse.internalError("Failed to retrieve task")
			res.status(response.code).json(response.toJSON())
		}
	}

	createTask = async (req: Request, res: Response) => {
		try {
			const { title, description } = req.body

			if (!title) {
				const response = ApiResponse.badRequest("Title is required")
				return res.status(response.code).json(response.toJSON())
			}

			const useCase = new CreateTask(this.taskRepository, this.idGenerator)
			const task = await useCase.execute(title, description)

			logger.info("Task created", { taskId: task.id, title: task.title })

			const response = ApiResponse.created(task, "Task created successfully")
			res.status(response.code).json(response.toJSON())
		} catch (err: any) {
			logger.error("Error creating task", { error: err.message })

			const response = ApiResponse.internalError("Failed to create task")
			res.status(response.code).json(response.toJSON())
		}
	}

	updateTask = async (req: Request, res: Response) => {
		try {
			const { id } = req.params
			const { title, description } = req.body

			if (!id) {
				const response = ApiResponse.badRequest("Task ID is required")
				return res.status(response.code).json(response.toJSON())
			}

			const useCase = new UpdateTask(this.taskRepository)
			const task = await useCase.execute(id, { title, description })

			if (!task) {
				const response = ApiResponse.notFound("Task not found")
				return res.status(response.code).json(response.toJSON())
			}

			logger.info("Task updated", { taskId: task.id, title: task.title })

			const response = ApiResponse.success(task, "Task updated successfully")
			res.status(response.code).json(response.toJSON())
		} catch (err: any) {
			logger.error("Error updating task", { error: err.message })

			const response = ApiResponse.internalError("Failed to update task")
			res.status(response.code).json(response.toJSON())
		}
	}

	completeTask = async (req: Request, res: Response) => {
		try {
			const { id } = req.params

			if (!id) {
				const response = ApiResponse.badRequest("Task ID is required")
				return res.status(response.code).json(response.toJSON())
			}

			const useCase = new CompleteTask(this.taskRepository)
			const task = await useCase.execute(id)

			if (!task) {
				const response = ApiResponse.notFound("Task not found")
				return res.status(response.code).json(response.toJSON())
			}

			logger.info("Task completed", { taskId: task.id })

			const response = ApiResponse.success(task, "Task completed successfully")
			res.status(response.code).json(response.toJSON())
		} catch (err: any) {
			logger.error("Error completing task", { error: err.message })

			const response = ApiResponse.internalError("Failed to complete task")
			res.status(response.code).json(response.toJSON())
		}
	}

	getOverdueTasks = async (req: Request, res: Response) => {
		try {
			const { dueDate } = req.query

			if (!dueDate) {
				const response = ApiResponse.badRequest("dueDate query parameter is required")
				return res.status(response.code).json(response.toJSON())
			}

			const useCase = new GetOverdueTasks(this.taskRepository)
			const overdueTasks = await useCase.execute(new Date(dueDate as string))

			logger.info("Retrieved overdue tasks", { count: overdueTasks.length })

			const response = ApiResponse.success(overdueTasks, "Overdue tasks retrieved successfully")
			res.status(response.code).json(response.toJSON())
		} catch (err: any) {
			logger.error("Error getting overdue tasks", { error: err.message })

			const response = ApiResponse.internalError("Failed to retrieve overdue tasks")
			res.status(response.code).json(response.toJSON())
		}
	}
}
