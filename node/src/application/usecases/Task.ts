import { Task } from "../../domain/models/Task";
import { TaskRepository } from "../../domain/repositories/TaskRepository";

export class ListTasks {
    constructor(private taskRepository: TaskRepository) {}

  async execute(): Promise<Task[]> {
    return this.taskRepository.findAll();
  }
}