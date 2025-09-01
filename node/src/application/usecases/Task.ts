import { Task } from "../../domain/entities/Task"
import { TaskRepository } from "../../domain/repositories/TaskRepository"

export class ListTasks {
	constructor(private taskRepository: TaskRepository) {}

	async execute(): Promise<Task[]> {
		return this.taskRepository.findAll()
	}
}

export class CreateTask {
	constructor(private taskRepository: TaskRepository) {}

	async execute(title: string, description?: string): Promise<Task> {
		// Factory method ensures proper initialization
		const newTask = Task.create(title, description)

		return this.taskRepository.create(newTask.title, newTask.description)
	}
}

export class CompleteTask {
	constructor(private taskRepository: TaskRepository) {}

	async execute(taskId: string): Promise<Task | null> {
		const task = await this.taskRepository.findById(taskId)
		if (!task) return null

		// Business logic encapsulated in domain entity
		const completedTask = task.markAsCompleted()

		return this.taskRepository.update(taskId, {
			completed: completedTask.completed
		})
	}
}

export class UpdateTask {
	constructor(private taskRepository: TaskRepository) {}

	async execute(taskId: string, updates: { title?: string; description?: string }): Promise<Task | null> {
		const task = await this.taskRepository.findById(taskId)
		if (!task) return null

		let updatedTask = task

		if (updates.title) {
			updatedTask = updatedTask.updateTitle(updates.title)
		}

		if (updates.description !== undefined) {
			updatedTask = updatedTask.updateDescription(updates.description)
		}

		return this.taskRepository.update(taskId, {
			title: updatedTask.title,
			description: updatedTask.description
		})
	}
}

export class DeleteTask {
	constructor(private taskRepository: TaskRepository) {}

	async execute(taskId: string): Promise<boolean> {
		const task = await this.taskRepository.findById(taskId)
		if (!task) return false

		return this.taskRepository.delete(taskId)
	}
}

export class GetTaskById {
	constructor(private taskRepository: TaskRepository) {}

	async execute(taskId: string): Promise<Task | null> {
		return this.taskRepository.findById(taskId)
	}
}

export class GetOverdueTasks {
	constructor(private taskRepository: TaskRepository) {}

	async execute(dueDate: Date): Promise<Task[]> {
		const allTasks = await this.taskRepository.findAll()

		// Business logic method makes filtering clean
		return allTasks.filter((task) => task.isOverdue(dueDate))
	}
}

export class GetCompletedTasks {
	constructor(private taskRepository: TaskRepository) {}

	async execute(): Promise<Task[]> {
		const allTasks = await this.taskRepository.findAll()

		return allTasks.filter((task) => task.isCompleted())
	}
}

export class GetIncompleteTasks {
	constructor(private taskRepository: TaskRepository) {}

	async execute(): Promise<Task[]> {
		const allTasks = await this.taskRepository.findAll()

		return allTasks.filter((task) => !task.isCompleted())
	}
}
