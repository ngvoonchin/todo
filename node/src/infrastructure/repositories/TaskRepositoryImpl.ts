import { Repository } from "typeorm"
import { TaskRepository } from "../../domain/repositories/TaskRepository"
import { Task } from "../../domain/entities/Task"
import { TaskEntity } from "../entities/TaskEntity"
import { AppDataSource } from "../db/dataSource"

export class TaskRepositoryImpl implements TaskRepository {
	private repository: Repository<TaskEntity>

	constructor() {
		this.repository = AppDataSource.getRepository(TaskEntity)
	}

	private mapEntityToDomain(entity: TaskEntity): Task {
		return new Task(entity.id, entity.title, entity.description ?? "", entity.completed, entity.createdAt, entity.updatedAt)
	}

	async create(title: string, description: string = ""): Promise<Task> {
		const entity = this.repository.create({ title, description })
		const saved = await this.repository.save(entity)
		return this.mapEntityToDomain(saved)
	}

	async findById(id: string): Promise<Task | null> {
		const entity = await this.repository.findOneBy({ id })
		return entity ? this.mapEntityToDomain(entity) : null
	}

	async findAll(): Promise<Task[]> {
		const entities = await this.repository.find()
		return entities.map(this.mapEntityToDomain)
	}

	async update(id: string, updates: { title?: string; description?: string; completed?: boolean }): Promise<Task | null> {
		const entity = await this.repository.findOneBy({ id })
		if (!entity) return null

		if (updates.title !== undefined) entity.title = updates.title
		if (updates.description !== undefined) entity.description = updates.description
		if (updates.completed !== undefined) entity.completed = updates.completed

		const updated = await this.repository.save(entity)
		return this.mapEntityToDomain(updated)
	}

	async delete(id: string): Promise<boolean> {
		const result = await this.repository.delete(id)
		return result.affected !== 0
	}
}
