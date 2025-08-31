import { Request, Response } from "express";
import { ListTasks } from "../../application/usecases/Task";
import { TaskRepository } from "../../domain/repositories/TaskRepository";
// import { TaskService } from "../../domain/services/TaskService";

export class TaskController {
  constructor(
    private taskRepository: TaskRepository,
    // private taskService: TaskService
  ) {}

  getAllTasks = async (_req: Request, res: Response) => {
    try {
      const useCase = new ListTasks(this.taskRepository);
      const tasks = await useCase.execute();
      res.json(tasks);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  };
}
