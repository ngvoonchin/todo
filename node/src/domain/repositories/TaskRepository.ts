import { Task } from "../models/Task"

export interface TaskRepository {
  create(task: Omit<Task, "id" | "createdAt" | "updatedAt">): Promise<Task>
  findById(id: string): Promise<Task | null>
  findAll(): Promise<Task[]>
  update(id: string, updates: Partial<Task>): Promise<Task | null>
  delete(id: string): Promise<boolean>
}