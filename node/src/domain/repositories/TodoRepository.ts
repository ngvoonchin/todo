import { Todo } from "../entities/Todo"

export interface CreateTodoRequest {
	userId: string
	title: string
	description?: string
}

export interface UpdateTodoRequest {
	title?: string
	description?: string
	completed?: boolean
}

export interface TodoRepository {
	/**
	 * Create a new todo for a user
	 * @param request - Todo creation data
	 * @returns Promise resolving to the created todo
	 */
	create(request: CreateTodoRequest): Promise<Todo>

	/**
	 * Find a todo by its unique ID
	 * @param id - Todo ID
	 * @returns Promise resolving to the todo or null if not found
	 */
	findById(id: string): Promise<Todo | null>

	/**
	 * Find all todos belonging to a specific user
	 * @param userId - User ID
	 * @returns Promise resolving to array of todos
	 */
	findByUserId(userId: string): Promise<Todo[]>

	/**
	 * Find a specific todo belonging to a user
	 * @param userId - User ID
	 * @param todoId - Todo ID
	 * @returns Promise resolving to the todo or null if not found or doesn't belong to user
	 */
	findByUserIdAndId(userId: string, todoId: string): Promise<Todo | null>

	/**
	 * Update an existing todo
	 * @param id - Todo ID
	 * @param updates - Partial todo data to update
	 * @returns Promise resolving to the updated todo or null if not found
	 */
	update(id: string, updates: UpdateTodoRequest): Promise<Todo | null>

	/**
	 * Delete a todo by ID
	 * @param id - Todo ID
	 * @returns Promise resolving to true if deleted, false if not found
	 */
	delete(id: string): Promise<boolean>

	/**
	 * Find todos by completion status for a specific user
	 * @param userId - User ID
	 * @param completed - Completion status
	 * @returns Promise resolving to array of todos
	 */
	findByUserIdAndCompleted(userId: string, completed: boolean): Promise<Todo[]>

	/**
	 * Count total todos for a specific user
	 * @param userId - User ID
	 * @returns Promise resolving to the count of todos
	 */
	countByUserId(userId: string): Promise<number>

	/**
	 * Count completed todos for a specific user
	 * @param userId - User ID
	 * @returns Promise resolving to the count of completed todos
	 */
	countCompletedByUserId(userId: string): Promise<number>
}
