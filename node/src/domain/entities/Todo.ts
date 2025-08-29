import { TodoId } from "../value-objects/TodoId"
import { UserId } from "../value-objects/UserId"

export interface CreateTodoData {
	userId: string
	title: string
	description?: string
}

export interface UpdateTodoData {
	title?: string
	description?: string
	completed?: boolean
}

export class Todo {
	private constructor(
		private readonly _id: TodoId,
		private readonly _userId: UserId,
		private _title: string,
		private _description: string | null,
		private _completed: boolean,
		private readonly _createdAt: Date,
		private _updatedAt: Date
	) {}

	// Factory method for creating new todos
	static create(data: CreateTodoData): Todo {
		Todo.validateTitle(data.title)
		if (data.description !== undefined) {
			Todo.validateDescription(data.description)
		}

		const now = new Date()
		return new Todo(TodoId.generate(), UserId.fromString(data.userId), data.title.trim(), data.description?.trim() || null, false, now, now)
	}

	// Factory method for reconstructing todos from persistence
	static fromPersistence(id: string, userId: string, title: string, description: string | null, completed: boolean, createdAt: Date, updatedAt: Date): Todo {
		return new Todo(TodoId.fromString(id), UserId.fromString(userId), title, description, completed, createdAt, updatedAt)
	}

	// Getters
	get id(): string {
		return this._id.value
	}

	get userId(): string {
		return this._userId.value
	}

	get title(): string {
		return this._title
	}

	get description(): string | null {
		return this._description
	}

	get completed(): boolean {
		return this._completed
	}

	get createdAt(): Date {
		return new Date(this._createdAt)
	}

	get updatedAt(): Date {
		return new Date(this._updatedAt)
	}

	// Business methods
	update(data: UpdateTodoData): void {
		if (data.title !== undefined) {
			Todo.validateTitle(data.title)
			this._title = data.title.trim()
		}

		if (data.description !== undefined) {
			Todo.validateDescription(data.description)
			this._description = data.description?.trim() || null
		}

		if (data.completed !== undefined) {
			this._completed = data.completed
		}

		this._updatedAt = new Date()
	}

	complete(): void {
		this._completed = true
		this._updatedAt = new Date()
	}

	uncomplete(): void {
		this._completed = false
		this._updatedAt = new Date()
	}

	// User ownership validation
	isOwnedBy(userId: string): boolean {
		return this._userId.value === userId
	}

	validateOwnership(userId: string): void {
		if (!this.isOwnedBy(userId)) {
			throw new Error("Todo does not belong to the specified user")
		}
	}

	// Validation methods
	static validateTitle(title: string): void {
		if (typeof title !== "string") {
			throw new Error("Title is required and must be a string")
		}

		const trimmedTitle = title.trim()
		if (trimmedTitle.length === 0) {
			throw new Error("Title cannot be empty")
		}

		if (trimmedTitle.length > 255) {
			throw new Error("Title cannot exceed 255 characters")
		}
	}

	static validateDescription(description: string): void {
		if (typeof description !== "string") {
			throw new Error("Description must be a string")
		}

		if (description.length > 1000) {
			throw new Error("Description cannot exceed 1000 characters")
		}
	}

	static validateUserId(userId: string): void {
		if (typeof userId !== "string") {
			throw new Error("User ID is required and must be a string")
		}

		const trimmedUserId = userId.trim()
		if (trimmedUserId.length === 0) {
			throw new Error("User ID cannot be empty")
		}

		// Basic UUID format validation for user ID
		const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
		if (!uuidRegex.test(trimmedUserId)) {
			throw new Error("User ID must be a valid UUID format")
		}
	}

	// Convert to plain object for serialization
	toPlainObject(): {
		id: string
		userId: string
		title: string
		description: string | null
		completed: boolean
		createdAt: Date
		updatedAt: Date
	} {
		return {
			id: this.id,
			userId: this.userId,
			title: this.title,
			description: this.description,
			completed: this.completed,
			createdAt: this.createdAt,
			updatedAt: this.updatedAt
		}
	}
}
