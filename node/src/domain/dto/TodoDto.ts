/**
 * Data Transfer Objects for Todo Operations
 */

export interface CreateTodoRequest {
	title: string
	description?: string
}

export interface UpdateTodoRequest {
	title?: string
	description?: string
	completed?: boolean
}

export interface TodoResponse {
	id: string
	userId: string
	title: string
	description: string | null
	completed: boolean
	createdAt: Date
	updatedAt: Date
}

export interface TodoListResponse {
	todos: TodoResponse[]
	total: number
	completed: number
	pending: number
}

export interface TodoFilterOptions {
	completed?: boolean
	limit?: number
	offset?: number
	sortBy?: "createdAt" | "updatedAt" | "title"
	sortOrder?: "asc" | "desc"
}

export interface TodoStatsResponse {
	total: number
	completed: number
	pending: number
	completionRate: number // percentage
}
