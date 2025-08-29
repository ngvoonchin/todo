import { Todo, CreateTodoData, UpdateTodoData } from "../../../src/domain/entities/Todo"
import { TodoId } from "../../../src/domain/value-objects/TodoId"
import { UserId } from "../../../src/domain/value-objects/UserId"

describe("Todo Entity", () => {
	const validUserId = "123e4567-e89b-12d3-a456-426614174000"
	const validTodoData: CreateTodoData = {
		userId: validUserId,
		title: "Test Todo",
		description: "This is a test todo"
	}

	describe("Todo.create", () => {
		it("should create a new todo with valid data", () => {
			const todo = Todo.create(validTodoData)

			expect(todo.userId).toBe(validUserId)
			expect(todo.title).toBe("Test Todo")
			expect(todo.description).toBe("This is a test todo")
			expect(todo.completed).toBe(false)
			expect(todo.id).toBeDefined()
			expect(todo.createdAt).toBeInstanceOf(Date)
			expect(todo.updatedAt).toBeInstanceOf(Date)
		})

		it("should create todo without description", () => {
			const todoData = {
				userId: validUserId,
				title: "Test Todo"
			}
			const todo = Todo.create(todoData)

			expect(todo.description).toBeNull()
		})

		it("should trim title and description whitespace", () => {
			const todoData = {
				userId: validUserId,
				title: "  Test Todo  ",
				description: "  This is a test todo  "
			}
			const todo = Todo.create(todoData)

			expect(todo.title).toBe("Test Todo")
			expect(todo.description).toBe("This is a test todo")
		})

		it("should throw error for invalid title", () => {
			const todoData = {
				...validTodoData,
				title: ""
			}

			expect(() => Todo.create(todoData)).toThrow("Title cannot be empty")
		})

		it("should throw error for invalid description", () => {
			const todoData = {
				...validTodoData,
				description: "a".repeat(1001) // too long
			}

			expect(() => Todo.create(todoData)).toThrow("Description cannot exceed 1000 characters")
		})
	})

	describe("Todo.fromPersistence", () => {
		it("should reconstruct todo from persistence data", () => {
			const id = "987fcdeb-51a2-43d1-9f12-345678901234"
			const createdAt = new Date("2023-01-01")
			const updatedAt = new Date("2023-01-02")

			const todo = Todo.fromPersistence(id, validUserId, "Test Todo", "Test description", true, createdAt, updatedAt)

			expect(todo.id).toBe(id)
			expect(todo.userId).toBe(validUserId)
			expect(todo.title).toBe("Test Todo")
			expect(todo.description).toBe("Test description")
			expect(todo.completed).toBe(true)
			expect(todo.createdAt).toEqual(createdAt)
			expect(todo.updatedAt).toEqual(updatedAt)
		})

		it("should handle null description", () => {
			const id = "987fcdeb-51a2-43d1-9f12-345678901234"
			const createdAt = new Date("2023-01-01")
			const updatedAt = new Date("2023-01-02")

			const todo = Todo.fromPersistence(id, validUserId, "Test Todo", null, false, createdAt, updatedAt)

			expect(todo.description).toBeNull()
		})
	})

	describe("Todo.update", () => {
		let todo: Todo

		beforeEach(() => {
			todo = Todo.create(validTodoData)
		})

		it("should update title", () => {
			const originalUpdatedAt = todo.updatedAt

			setTimeout(() => {
				todo.update({ title: "Updated Title" })

				expect(todo.title).toBe("Updated Title")
				expect(todo.updatedAt.getTime()).toBeGreaterThan(originalUpdatedAt.getTime())
			}, 1)
		})

		it("should update description", () => {
			todo.update({ description: "Updated description" })

			expect(todo.description).toBe("Updated description")
		})

		it("should update completed status", () => {
			todo.update({ completed: true })

			expect(todo.completed).toBe(true)
		})

		it("should clear description when set to empty string", () => {
			todo.update({ description: "" })

			expect(todo.description).toBeNull()
		})

		it("should validate title during update", () => {
			expect(() => todo.update({ title: "" })).toThrow("Title cannot be empty")
		})

		it("should validate description during update", () => {
			expect(() => todo.update({ description: "a".repeat(1001) })).toThrow("Description cannot exceed 1000 characters")
		})
	})

	describe("Todo.complete", () => {
		it("should mark todo as completed", () => {
			const todo = Todo.create(validTodoData)
			const originalUpdatedAt = todo.updatedAt

			setTimeout(() => {
				todo.complete()

				expect(todo.completed).toBe(true)
				expect(todo.updatedAt.getTime()).toBeGreaterThan(originalUpdatedAt.getTime())
			}, 1)
		})
	})

	describe("Todo.uncomplete", () => {
		it("should mark todo as not completed", () => {
			const todo = Todo.create(validTodoData)
			todo.complete()
			const originalUpdatedAt = todo.updatedAt

			setTimeout(() => {
				todo.uncomplete()

				expect(todo.completed).toBe(false)
				expect(todo.updatedAt.getTime()).toBeGreaterThan(originalUpdatedAt.getTime())
			}, 1)
		})
	})

	describe("Todo.isOwnedBy", () => {
		it("should return true for matching user ID", () => {
			const todo = Todo.create(validTodoData)

			expect(todo.isOwnedBy(validUserId)).toBe(true)
		})

		it("should return false for different user ID", () => {
			const todo = Todo.create(validTodoData)
			const differentUserId = "987fcdeb-51a2-43d1-9f12-345678901234"

			expect(todo.isOwnedBy(differentUserId)).toBe(false)
		})
	})

	describe("Todo.validateOwnership", () => {
		it("should not throw for matching user ID", () => {
			const todo = Todo.create(validTodoData)

			expect(() => todo.validateOwnership(validUserId)).not.toThrow()
		})

		it("should throw for different user ID", () => {
			const todo = Todo.create(validTodoData)
			const differentUserId = "987fcdeb-51a2-43d1-9f12-345678901234"

			expect(() => todo.validateOwnership(differentUserId)).toThrow("Todo does not belong to the specified user")
		})
	})

	describe("Todo.toPlainObject", () => {
		it("should return plain object with all properties", () => {
			const todo = Todo.create(validTodoData)
			const plainObject = todo.toPlainObject()

			expect(plainObject).toEqual({
				id: todo.id,
				userId: todo.userId,
				title: todo.title,
				description: todo.description,
				completed: todo.completed,
				createdAt: todo.createdAt,
				updatedAt: todo.updatedAt
			})
		})
	})

	describe("Title validation", () => {
		it("should reject empty title", () => {
			expect(() => Todo.validateTitle("")).toThrow("Title cannot be empty")
		})

		it("should reject null title", () => {
			expect(() => Todo.validateTitle(null as any)).toThrow("Title is required and must be a string")
		})

		it("should reject undefined title", () => {
			expect(() => Todo.validateTitle(undefined as any)).toThrow("Title is required and must be a string")
		})

		it("should reject title longer than 255 characters", () => {
			const longTitle = "a".repeat(256)
			expect(() => Todo.validateTitle(longTitle)).toThrow("Title cannot exceed 255 characters")
		})

		it("should accept valid titles", () => {
			const validTitles = [
				"Short title",
				"A".repeat(255), // max length
				"Title with special chars !@#$%^&*()",
				"Title with numbers 123"
			]

			validTitles.forEach((title) => {
				expect(() => Todo.validateTitle(title)).not.toThrow()
			})
		})
	})

	describe("Description validation", () => {
		it("should accept empty description", () => {
			expect(() => Todo.validateDescription("")).not.toThrow()
		})

		it("should reject null description", () => {
			expect(() => Todo.validateDescription(null as any)).toThrow("Description must be a string")
		})

		it("should reject undefined description", () => {
			expect(() => Todo.validateDescription(undefined as any)).toThrow("Description must be a string")
		})

		it("should reject description longer than 1000 characters", () => {
			const longDescription = "a".repeat(1001)
			expect(() => Todo.validateDescription(longDescription)).toThrow("Description cannot exceed 1000 characters")
		})

		it("should accept valid descriptions", () => {
			const validDescriptions = [
				"",
				"Short description",
				"a".repeat(1000), // max length
				"Description with special chars !@#$%^&*()",
				"Description with numbers 123",
				"Multi-line\ndescription\nwith\nbreaks"
			]

			validDescriptions.forEach((description) => {
				expect(() => Todo.validateDescription(description)).not.toThrow()
			})
		})
	})

	describe("User ID validation", () => {
		it("should reject empty user ID", () => {
			expect(() => Todo.validateUserId("")).toThrow("User ID cannot be empty")
		})

		it("should reject null user ID", () => {
			expect(() => Todo.validateUserId(null as any)).toThrow("User ID is required and must be a string")
		})

		it("should reject undefined user ID", () => {
			expect(() => Todo.validateUserId(undefined as any)).toThrow("User ID is required and must be a string")
		})

		it("should reject invalid UUID format", () => {
			const invalidUserIds = [
				"not-a-uuid",
				"123e4567-e89b-12d3-a456", // too short
				"123e4567-e89b-12d3-g456-426614174000" // invalid character
			]

			invalidUserIds.forEach((userId) => {
				expect(() => Todo.validateUserId(userId)).toThrow("User ID must be a valid UUID format")
			})
		})

		it("should accept valid user IDs", () => {
			const validUserIds = ["123e4567-e89b-12d3-a456-426614174000", "987fcdeb-51a2-43d1-9f12-345678901234", "aaaaaaaa-bbbb-1ccc-addd-eeeeeeeeeeee"]

			validUserIds.forEach((userId) => {
				expect(() => Todo.validateUserId(userId)).not.toThrow()
			})
		})
	})

	describe("User association", () => {
		it("should associate todo with correct user", () => {
			const todo = Todo.create(validTodoData)

			expect(todo.userId).toBe(validUserId)
			expect(todo.isOwnedBy(validUserId)).toBe(true)
		})

		it("should prevent access by different users", () => {
			const todo = Todo.create(validTodoData)
			const differentUserId = "987fcdeb-51a2-43d1-9f12-345678901234"

			expect(todo.isOwnedBy(differentUserId)).toBe(false)
			expect(() => todo.validateOwnership(differentUserId)).toThrow()
		})

		it("should maintain user association after updates", () => {
			const todo = Todo.create(validTodoData)

			todo.update({ title: "Updated title" })
			todo.complete()
			todo.uncomplete()

			expect(todo.userId).toBe(validUserId)
			expect(todo.isOwnedBy(validUserId)).toBe(true)
		})
	})
})
