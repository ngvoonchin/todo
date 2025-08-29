import { TodoRepository, CreateTodoRequest, UpdateTodoRequest } from "../../../src/domain/repositories/TodoRepository"
import { Todo } from "../../../src/domain/entities/Todo"

// Mock implementation for testing the interface contract
class MockTodoRepository implements TodoRepository {
	private todos: Map<string, Todo> = new Map()

	async create(request: CreateTodoRequest): Promise<Todo> {
		const todo = Todo.create(request)
		this.todos.set(todo.id, todo)
		return todo
	}

	async findById(id: string): Promise<Todo | null> {
		return this.todos.get(id) || null
	}

	async findByUserId(userId: string): Promise<Todo[]> {
		return Array.from(this.todos.values()).filter((todo) => todo.userId === userId)
	}

	async findByUserIdAndId(userId: string, todoId: string): Promise<Todo | null> {
		const todo = this.todos.get(todoId)
		return todo && todo.userId === userId ? todo : null
	}

	async update(id: string, updates: UpdateTodoRequest): Promise<Todo | null> {
		const todo = this.todos.get(id)
		if (!todo) return null

		todo.update(updates)
		return todo
	}

	async delete(id: string): Promise<boolean> {
		return this.todos.delete(id)
	}

	async findByUserIdAndCompleted(userId: string, completed: boolean): Promise<Todo[]> {
		return Array.from(this.todos.values()).filter((todo) => todo.userId === userId && todo.completed === completed)
	}

	async countByUserId(userId: string): Promise<number> {
		return Array.from(this.todos.values()).filter((todo) => todo.userId === userId).length
	}

	async countCompletedByUserId(userId: string): Promise<number> {
		return Array.from(this.todos.values()).filter((todo) => todo.userId === userId && todo.completed).length
	}
}

describe("TodoRepository Interface Contract", () => {
	let repository: TodoRepository
	const validUserId = "123e4567-e89b-12d3-a456-426614174000"
	const validTodoData: CreateTodoRequest = {
		userId: validUserId,
		title: "Test Todo",
		description: "This is a test todo"
	}

	beforeEach(() => {
		repository = new MockTodoRepository()
	})

	describe("create", () => {
		it("should create a new todo with valid data", async () => {
			const todo = await repository.create(validTodoData)

			expect(todo).toBeInstanceOf(Todo)
			expect(todo.userId).toBe(validTodoData.userId)
			expect(todo.title).toBe(validTodoData.title)
			expect(todo.description).toBe(validTodoData.description)
			expect(todo.completed).toBe(false)
		})

		it("should create todo without description", async () => {
			const todoData = {
				userId: validUserId,
				title: "Test Todo"
			}
			const todo = await repository.create(todoData)

			expect(todo.description).toBeNull()
		})
	})

	describe("findById", () => {
		it("should return todo when found", async () => {
			const createdTodo = await repository.create(validTodoData)
			const foundTodo = await repository.findById(createdTodo.id)

			expect(foundTodo).not.toBeNull()
			expect(foundTodo!.id).toBe(createdTodo.id)
			expect(foundTodo!.title).toBe(createdTodo.title)
		})

		it("should return null when todo not found", async () => {
			const foundTodo = await repository.findById("non-existent-id")

			expect(foundTodo).toBeNull()
		})
	})

	describe("findByUserId", () => {
		it("should return all todos for a user", async () => {
			const todo1 = await repository.create(validTodoData)
			const todo2 = await repository.create({
				...validTodoData,
				title: "Second Todo"
			})

			const todos = await repository.findByUserId(validUserId)

			expect(todos).toHaveLength(2)
			expect(todos.map((t) => t.id)).toContain(todo1.id)
			expect(todos.map((t) => t.id)).toContain(todo2.id)
		})

		it("should return empty array when user has no todos", async () => {
			const todos = await repository.findByUserId("different-user-id")

			expect(todos).toHaveLength(0)
		})

		it("should only return todos for the specified user", async () => {
			const differentUserId = "987fcdeb-51a2-43d1-9f12-345678901234"

			await repository.create(validTodoData)
			await repository.create({
				...validTodoData,
				userId: differentUserId,
				title: "Different User Todo"
			})

			const todos = await repository.findByUserId(validUserId)

			expect(todos).toHaveLength(1)
			expect(todos[0].userId).toBe(validUserId)
		})
	})

	describe("findByUserIdAndId", () => {
		it("should return todo when found and belongs to user", async () => {
			const createdTodo = await repository.create(validTodoData)
			const foundTodo = await repository.findByUserIdAndId(validUserId, createdTodo.id)

			expect(foundTodo).not.toBeNull()
			expect(foundTodo!.id).toBe(createdTodo.id)
			expect(foundTodo!.userId).toBe(validUserId)
		})

		it("should return null when todo not found", async () => {
			const foundTodo = await repository.findByUserIdAndId(validUserId, "non-existent-id")

			expect(foundTodo).toBeNull()
		})

		it("should return null when todo belongs to different user", async () => {
			const differentUserId = "987fcdeb-51a2-43d1-9f12-345678901234"
			const createdTodo = await repository.create({
				...validTodoData,
				userId: differentUserId
			})

			const foundTodo = await repository.findByUserIdAndId(validUserId, createdTodo.id)

			expect(foundTodo).toBeNull()
		})
	})

	describe("update", () => {
		it("should update todo with valid data", async () => {
			const createdTodo = await repository.create(validTodoData)
			const updates: UpdateTodoRequest = {
				title: "Updated Title",
				description: "Updated description",
				completed: true
			}

			const updatedTodo = await repository.update(createdTodo.id, updates)

			expect(updatedTodo).not.toBeNull()
			expect(updatedTodo!.title).toBe(updates.title)
			expect(updatedTodo!.description).toBe(updates.description)
			expect(updatedTodo!.completed).toBe(updates.completed)
		})

		it("should return null when todo not found", async () => {
			const updates: UpdateTodoRequest = {
				title: "Updated Title"
			}

			const updatedTodo = await repository.update("non-existent-id", updates)

			expect(updatedTodo).toBeNull()
		})

		it("should update only specified fields", async () => {
			const createdTodo = await repository.create(validTodoData)
			const originalTitle = createdTodo.title
			const updates: UpdateTodoRequest = {
				completed: true
			}

			const updatedTodo = await repository.update(createdTodo.id, updates)

			expect(updatedTodo!.title).toBe(originalTitle)
			expect(updatedTodo!.completed).toBe(true)
		})
	})

	describe("delete", () => {
		it("should delete existing todo", async () => {
			const createdTodo = await repository.create(validTodoData)
			const deleted = await repository.delete(createdTodo.id)

			expect(deleted).toBe(true)

			const foundTodo = await repository.findById(createdTodo.id)
			expect(foundTodo).toBeNull()
		})

		it("should return false when todo not found", async () => {
			const deleted = await repository.delete("non-existent-id")

			expect(deleted).toBe(false)
		})
	})

	describe("findByUserIdAndCompleted", () => {
		beforeEach(async () => {
			// Create completed todo
			const completedTodo = await repository.create({
				...validTodoData,
				title: "Completed Todo"
			})
			await repository.update(completedTodo.id, { completed: true })

			// Create pending todo
			await repository.create({
				...validTodoData,
				title: "Pending Todo"
			})
		})

		it("should return completed todos", async () => {
			const completedTodos = await repository.findByUserIdAndCompleted(validUserId, true)

			expect(completedTodos).toHaveLength(1)
			expect(completedTodos[0].completed).toBe(true)
			expect(completedTodos[0].title).toBe("Completed Todo")
		})

		it("should return pending todos", async () => {
			const pendingTodos = await repository.findByUserIdAndCompleted(validUserId, false)

			expect(pendingTodos).toHaveLength(1)
			expect(pendingTodos[0].completed).toBe(false)
			expect(pendingTodos[0].title).toBe("Pending Todo")
		})

		it("should only return todos for the specified user", async () => {
			const differentUserId = "987fcdeb-51a2-43d1-9f12-345678901234"
			await repository.create({
				userId: differentUserId,
				title: "Different User Todo"
			})

			const todos = await repository.findByUserIdAndCompleted(validUserId, false)

			expect(todos.every((todo) => todo.userId === validUserId)).toBe(true)
		})
	})

	describe("countByUserId", () => {
		it("should return correct count of todos for user", async () => {
			await repository.create(validTodoData)
			await repository.create({
				...validTodoData,
				title: "Second Todo"
			})

			const count = await repository.countByUserId(validUserId)

			expect(count).toBe(2)
		})

		it("should return 0 when user has no todos", async () => {
			const count = await repository.countByUserId("different-user-id")

			expect(count).toBe(0)
		})

		it("should only count todos for the specified user", async () => {
			const differentUserId = "987fcdeb-51a2-43d1-9f12-345678901234"

			await repository.create(validTodoData)
			await repository.create({
				...validTodoData,
				userId: differentUserId,
				title: "Different User Todo"
			})

			const count = await repository.countByUserId(validUserId)

			expect(count).toBe(1)
		})
	})

	describe("countCompletedByUserId", () => {
		beforeEach(async () => {
			// Create completed todo
			const completedTodo = await repository.create({
				...validTodoData,
				title: "Completed Todo"
			})
			await repository.update(completedTodo.id, { completed: true })

			// Create pending todo
			await repository.create({
				...validTodoData,
				title: "Pending Todo"
			})
		})

		it("should return correct count of completed todos for user", async () => {
			const count = await repository.countCompletedByUserId(validUserId)

			expect(count).toBe(1)
		})

		it("should return 0 when user has no completed todos", async () => {
			const differentUserId = "987fcdeb-51a2-43d1-9f12-345678901234"
			await repository.create({
				userId: differentUserId,
				title: "Pending Todo"
			})

			const count = await repository.countCompletedByUserId(differentUserId)

			expect(count).toBe(0)
		})

		it("should only count completed todos for the specified user", async () => {
			const differentUserId = "987fcdeb-51a2-43d1-9f12-345678901234"
			const differentUserTodo = await repository.create({
				userId: differentUserId,
				title: "Different User Completed Todo"
			})
			await repository.update(differentUserTodo.id, { completed: true })

			const count = await repository.countCompletedByUserId(validUserId)

			expect(count).toBe(1)
		})
	})
})
