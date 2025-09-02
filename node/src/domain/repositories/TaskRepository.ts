import { Task } from "../entities/Task"
import { QueryOptions } from "../entities/Query"

export interface TaskRepository {
	create(title: string, description?: string): Promise<Task>
	findById(id: string): Promise<Task | null>
	findAll(options?: QueryOptions): Promise<Task[]>
	update(id: string, updates: { title?: string; description?: string; completed?: boolean }): Promise<Task | null>
	delete(id: string): Promise<boolean>
}
