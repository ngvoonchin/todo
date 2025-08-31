import { Repository } from "typeorm";
import { TaskRepository } from "../../domain/repositories/TaskRepository";
import { Task } from "../../domain/models/Task";
import { TaskEntity } from "../entities/TaskEntity";
import { AppDataSource } from "../db/dataSource";

export class TaskRepositoryImpl implements TaskRepository {
  private repository: Repository<TaskEntity>;

  constructor() {
    this.repository = AppDataSource.getRepository(TaskEntity);
  }

  private mapEntityToDomain(entity: TaskEntity): Task {
    return {
      id: entity.id,
      title: entity.title,
      description: entity.description ?? "",
      completed: entity.completed,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }

  async create(task: Omit<Task, "id" | "createdAt" | "updatedAt">): Promise<Task> {
    const entity = this.repository.create(task);
    const saved = await this.repository.save(entity);
    return this.mapEntityToDomain(saved);
  }

  async findById(id: string): Promise<Task | null> {
    const entity = await this.repository.findOneBy({ id });
    return entity ? this.mapEntityToDomain(entity) : null;
  }

  async findAll(): Promise<Task[]> {
    const entities = await this.repository.find();
    return entities.map(this.mapEntityToDomain);
  }

  async update(id: string, updates: Partial<Task>): Promise<Task | null> {
    const entity = await this.repository.findOneBy({ id });
    if (!entity) return null;
    Object.assign(entity, updates);
    const updated = await this.repository.save(entity);
    return this.mapEntityToDomain(updated);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.repository.delete(id);
    return result.affected !== 0;
  }
}
