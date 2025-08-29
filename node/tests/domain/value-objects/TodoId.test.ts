import { TodoId } from "../../../src/domain/value-objects/TodoId"

describe("TodoId Value Object", () => {
	describe("TodoId.generate", () => {
		it("should generate a valid UUID", () => {
			const todoId = TodoId.generate()

			expect(todoId.value).toBeDefined()
			expect(typeof todoId.value).toBe("string")

			// Check UUID format
			const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
			expect(uuidRegex.test(todoId.value)).toBe(true)
		})

		it("should generate unique UUIDs", () => {
			const todoId1 = TodoId.generate()
			const todoId2 = TodoId.generate()

			expect(todoId1.value).not.toBe(todoId2.value)
		})
	})

	describe("TodoId.fromString", () => {
		it("should create TodoId from valid UUID string", () => {
			const validUuid = "123e4567-e89b-12d3-a456-426614174000"
			const todoId = TodoId.fromString(validUuid)

			expect(todoId.value).toBe(validUuid)
		})

		it("should throw error for invalid UUID format", () => {
			const invalidUuids = [
				"not-a-uuid",
				"123e4567-e89b-12d3-a456", // too short
				"123e4567-e89b-12d3-a456-426614174000-extra", // too long
				"123e4567-e89b-12d3-g456-426614174000", // invalid character
				"xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx" // invalid format
			]

			invalidUuids.forEach((invalidUuid) => {
				expect(() => TodoId.fromString(invalidUuid)).toThrow("TodoId must be a valid UUID format")
			})
		})

		it("should throw error for empty string", () => {
			expect(() => TodoId.fromString("")).toThrow("TodoId cannot be empty")
		})

		it("should throw error for whitespace-only string", () => {
			expect(() => TodoId.fromString("   ")).toThrow("TodoId cannot be empty")
		})

		it("should throw error for null value", () => {
			expect(() => TodoId.fromString(null as any)).toThrow("TodoId must be a non-empty string")
		})

		it("should throw error for undefined value", () => {
			expect(() => TodoId.fromString(undefined as any)).toThrow("TodoId must be a non-empty string")
		})

		it("should throw error for non-string value", () => {
			expect(() => TodoId.fromString(123 as any)).toThrow("TodoId must be a non-empty string")
		})
	})

	describe("TodoId.equals", () => {
		it("should return true for equal TodoIds", () => {
			const uuid = "123e4567-e89b-12d3-a456-426614174000"
			const todoId1 = TodoId.fromString(uuid)
			const todoId2 = TodoId.fromString(uuid)

			expect(todoId1.equals(todoId2)).toBe(true)
		})

		it("should return false for different TodoIds", () => {
			const todoId1 = TodoId.fromString("123e4567-e89b-12d3-a456-426614174000")
			const todoId2 = TodoId.fromString("987fcdeb-51a2-43d1-9f12-345678901234")

			expect(todoId1.equals(todoId2)).toBe(false)
		})

		it("should work with generated TodoIds", () => {
			const todoId1 = TodoId.generate()
			const todoId2 = TodoId.generate()
			const todoId3 = TodoId.fromString(todoId1.value)

			expect(todoId1.equals(todoId2)).toBe(false)
			expect(todoId1.equals(todoId3)).toBe(true)
		})
	})

	describe("TodoId.toString", () => {
		it("should return the UUID string value", () => {
			const uuid = "123e4567-e89b-12d3-a456-426614174000"
			const todoId = TodoId.fromString(uuid)

			expect(todoId.toString()).toBe(uuid)
		})

		it("should work with generated TodoIds", () => {
			const todoId = TodoId.generate()

			expect(todoId.toString()).toBe(todoId.value)
			expect(typeof todoId.toString()).toBe("string")
		})
	})

	describe("TodoId.value getter", () => {
		it("should return the internal UUID value", () => {
			const uuid = "123e4567-e89b-12d3-a456-426614174000"
			const todoId = TodoId.fromString(uuid)

			expect(todoId.value).toBe(uuid)
		})

		it("should be immutable", () => {
			const todoId = TodoId.generate()
			const originalValue = todoId.value

			// Attempt to modify (should not be possible due to readonly)
			// This is more of a TypeScript compile-time check
			expect(todoId.value).toBe(originalValue)
		})
	})

	describe("UUID format validation", () => {
		it("should accept various valid UUID versions", () => {
			const validUuids = [
				"123e4567-e89b-12d3-a456-426614174000", // version 1
				"123e4567-e89b-22d3-a456-426614174000", // version 2
				"123e4567-e89b-32d3-a456-426614174000", // version 3
				"123e4567-e89b-42d3-a456-426614174000", // version 4
				"123e4567-e89b-52d3-a456-426614174000", // version 5
				"123e4567-e89b-12d3-8456-426614174000", // variant 8
				"123e4567-e89b-12d3-9456-426614174000", // variant 9
				"123e4567-e89b-12d3-a456-426614174000", // variant a
				"123e4567-e89b-12d3-b456-426614174000" // variant b
			]

			validUuids.forEach((uuid) => {
				expect(() => TodoId.fromString(uuid)).not.toThrow()
			})
		})

		it("should handle case insensitivity", () => {
			const lowerCaseUuid = "123e4567-e89b-12d3-a456-426614174000"
			const upperCaseUuid = "123E4567-E89B-12D3-A456-426614174000"
			const mixedCaseUuid = "123e4567-E89B-12d3-A456-426614174000"

			expect(() => TodoId.fromString(lowerCaseUuid)).not.toThrow()
			expect(() => TodoId.fromString(upperCaseUuid)).not.toThrow()
			expect(() => TodoId.fromString(mixedCaseUuid)).not.toThrow()
		})

		it("should reject invalid UUID versions", () => {
			const invalidVersionUuids = [
				"123e4567-e89b-02d3-a456-426614174000", // version 0
				"123e4567-e89b-62d3-a456-426614174000", // version 6
				"123e4567-e89b-72d3-a456-426614174000", // version 7
				"123e4567-e89b-82d3-a456-426614174000", // version 8
				"123e4567-e89b-92d3-a456-426614174000", // version 9
				"123e4567-e89b-f2d3-a456-426614174000" // version f
			]

			invalidVersionUuids.forEach((uuid) => {
				expect(() => TodoId.fromString(uuid)).toThrow("TodoId must be a valid UUID format")
			})
		})

		it("should reject invalid UUID variants", () => {
			const invalidVariantUuids = [
				"123e4567-e89b-12d3-0456-426614174000", // variant 0
				"123e4567-e89b-12d3-1456-426614174000", // variant 1
				"123e4567-e89b-12d3-c456-426614174000", // variant c
				"123e4567-e89b-12d3-d456-426614174000", // variant d
				"123e4567-e89b-12d3-e456-426614174000", // variant e
				"123e4567-e89b-12d3-f456-426614174000" // variant f
			]

			invalidVariantUuids.forEach((uuid) => {
				expect(() => TodoId.fromString(uuid)).toThrow("TodoId must be a valid UUID format")
			})
		})
	})
})
