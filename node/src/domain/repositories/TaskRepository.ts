import { Task } from "../entities/Task"

export interface TaskRepository {
	create(title: string, description?: string): Promise<Task>
	findById(id: string): Promise<Task | null>
	findAll(): Promise<Task[]>
	update(id: string, updates: { title?: string; description?: string; completed?: boolean }): Promise<Task | null>
	delete(id: string): Promise<boolean>
}
