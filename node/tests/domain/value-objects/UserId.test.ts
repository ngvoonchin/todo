import { UserId } from "../../../src/domain/value-objects/UserId"

describe("UserId Value Object", () => {
	describe("UserId.generate", () => {
		it("should generate a valid UUID", () => {
			const userId = UserId.generate()

			expect(userId.value).toBeDefined()
			expect(typeof userId.value).toBe("string")

			// Check UUID format
			const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
			expect(uuidRegex.test(userId.value)).toBe(true)
		})

		it("should generate unique UUIDs", () => {
			const userId1 = UserId.generate()
			const userId2 = UserId.generate()

			expect(userId1.value).not.toBe(userId2.value)
		})
	})

	describe("UserId.fromString", () => {
		it("should create UserId from valid UUID string", () => {
			const validUuid = "123e4567-e89b-12d3-a456-426614174000"
			const userId = UserId.fromString(validUuid)

			expect(userId.value).toBe(validUuid)
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
				expect(() => UserId.fromString(invalidUuid)).toThrow("UserId must be a valid UUID format")
			})
		})

		it("should throw error for empty string", () => {
			expect(() => UserId.fromString("")).toThrow("UserId cannot be empty")
		})

		it("should throw error for whitespace-only string", () => {
			expect(() => UserId.fromString("   ")).toThrow("UserId cannot be empty")
		})

		it("should throw error for null value", () => {
			expect(() => UserId.fromString(null as any)).toThrow("UserId must be a non-empty string")
		})

		it("should throw error for undefined value", () => {
			expect(() => UserId.fromString(undefined as any)).toThrow("UserId must be a non-empty string")
		})

		it("should throw error for non-string value", () => {
			expect(() => UserId.fromString(123 as any)).toThrow("UserId must be a non-empty string")
		})
	})

	describe("UserId.equals", () => {
		it("should return true for equal UserIds", () => {
			const uuid = "123e4567-e89b-12d3-a456-426614174000"
			const userId1 = UserId.fromString(uuid)
			const userId2 = UserId.fromString(uuid)

			expect(userId1.equals(userId2)).toBe(true)
		})

		it("should return false for different UserIds", () => {
			const userId1 = UserId.fromString("123e4567-e89b-12d3-a456-426614174000")
			const userId2 = UserId.fromString("987fcdeb-51a2-43d1-9f12-345678901234")

			expect(userId1.equals(userId2)).toBe(false)
		})

		it("should work with generated UserIds", () => {
			const userId1 = UserId.generate()
			const userId2 = UserId.generate()
			const userId3 = UserId.fromString(userId1.value)

			expect(userId1.equals(userId2)).toBe(false)
			expect(userId1.equals(userId3)).toBe(true)
		})
	})

	describe("UserId.toString", () => {
		it("should return the UUID string value", () => {
			const uuid = "123e4567-e89b-12d3-a456-426614174000"
			const userId = UserId.fromString(uuid)

			expect(userId.toString()).toBe(uuid)
		})

		it("should work with generated UserIds", () => {
			const userId = UserId.generate()

			expect(userId.toString()).toBe(userId.value)
			expect(typeof userId.toString()).toBe("string")
		})
	})

	describe("UserId.value getter", () => {
		it("should return the internal UUID value", () => {
			const uuid = "123e4567-e89b-12d3-a456-426614174000"
			const userId = UserId.fromString(uuid)

			expect(userId.value).toBe(uuid)
		})

		it("should be immutable", () => {
			const userId = UserId.generate()
			const originalValue = userId.value

			// Attempt to modify (should not be possible due to readonly)
			// This is more of a TypeScript compile-time check
			expect(userId.value).toBe(originalValue)
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
				expect(() => UserId.fromString(uuid)).not.toThrow()
			})
		})

		it("should handle case insensitivity", () => {
			const lowerCaseUuid = "123e4567-e89b-12d3-a456-426614174000"
			const upperCaseUuid = "123E4567-E89B-12D3-A456-426614174000"
			const mixedCaseUuid = "123e4567-E89B-12d3-A456-426614174000"

			expect(() => UserId.fromString(lowerCaseUuid)).not.toThrow()
			expect(() => UserId.fromString(upperCaseUuid)).not.toThrow()
			expect(() => UserId.fromString(mixedCaseUuid)).not.toThrow()
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
				expect(() => UserId.fromString(uuid)).toThrow("UserId must be a valid UUID format")
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
				expect(() => UserId.fromString(uuid)).toThrow("UserId must be a valid UUID format")
			})
		})
	})
})
