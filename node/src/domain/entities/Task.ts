export class Task {
	constructor(public readonly id: string, public title: string, public description: string, public completed: boolean, public readonly createdAt: Date, public readonly updatedAt: Date) {}

	static create(title: string, description: string = "", id?: string, createdAt?: Date, updatedAt?: Date): Task {
		const now = new Date()
		return new Task(id || crypto.randomUUID(), title, description, false, createdAt || now, updatedAt || now)
	}

	markAsCompleted(): Task {
		return new Task(this.id, this.title, this.description, true, this.createdAt, new Date())
	}

	markAsIncomplete(): Task {
		return new Task(this.id, this.title, this.description, false, this.createdAt, new Date())
	}

	updateTitle(newTitle: string): Task {
		return new Task(this.id, newTitle, this.description, this.completed, this.createdAt, new Date())
	}

	updateDescription(newDescription: string): Task {
		return new Task(this.id, this.title, newDescription, this.completed, this.createdAt, new Date())
	}

	isCompleted(): boolean {
		return this.completed
	}

	isOverdue(dueDate?: Date): boolean {
		if (!dueDate) return false
		return !this.completed && new Date() > dueDate
	}
}
