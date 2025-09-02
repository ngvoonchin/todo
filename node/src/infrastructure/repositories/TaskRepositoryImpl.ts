import { Repository, SelectQueryBuilder } from "typeorm"
import { TaskRepository } from "../../domain/repositories/TaskRepository"
import { Task } from "../../domain/entities/Task"
import { QueryOptions } from "../../domain/entities/Query"
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

	async findAll(options?: QueryOptions): Promise<Task[]> {
		let queryBuilder = this.repository.createQueryBuilder("task")

		// Apply filters
		if (options?.filters) {
			options.filters.forEach((filter, index) => {
				const paramName = `filter_${index}`
				let condition = ""

				switch (filter.operator.toLowerCase()) {
					case "eq":
					case "equals":
						condition = `task.${filter.field} = :${paramName}`
						break
					case "ne":
					case "not_equals":
						condition = `task.${filter.field} != :${paramName}`
						break
					case "like":
					case "contains":
						condition = `task.${filter.field} LIKE :${paramName}`
						queryBuilder.setParameter(paramName, `%${filter.value}%`)
						return
					case "gt":
					case "greater_than":
						condition = `task.${filter.field} > :${paramName}`
						break
					case "gte":
					case "greater_than_equals":
						condition = `task.${filter.field} >= :${paramName}`
						break
					case "lt":
					case "less_than":
						condition = `task.${filter.field} < :${paramName}`
						break
					case "lte":
					case "less_than_equals":
						condition = `task.${filter.field} <= :${paramName}`
						break
					default:
						condition = `task.${filter.field} = :${paramName}`
				}

				if (index === 0) {
					queryBuilder.where(condition, { [paramName]: filter.value })
				} else {
					queryBuilder.andWhere(condition, { [paramName]: filter.value })
				}
			})
		}

		// Apply sorting
		if (options?.sort) {
			const order = options.sort.order.toLowerCase() === "desc" ? "DESC" : "ASC"
			queryBuilder.orderBy(`task.${options.sort.field}`, order)
		}

		// Apply pagination
		if (options?.limit) {
			queryBuilder.limit(options.limit)
		}
		if (options?.page && options?.limit) {
			const offset = (options.page - 1) * options.limit
			queryBuilder.offset(offset)
		}

		const entities = await queryBuilder.getMany()
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
