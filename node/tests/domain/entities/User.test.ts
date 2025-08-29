import { User, CreateUserData, UpdateUserData } from "../../../src/domain/entities/User"
import { UserId } from "../../../src/domain/value-objects/UserId"

describe("User Entity", () => {
	const validUserData: CreateUserData = {
		email: "test@example.com",
		username: "testuser",
		passwordHash: "$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/RK.s5uO.G" // bcrypt hash for "password"
	}

	describe("User.create", () => {
		it("should create a new user with valid data", () => {
			const user = User.create(validUserData)

			expect(user.email).toBe("test@example.com")
			expect(user.username).toBe("testuser")
			expect(user.passwordHash).toBe(validUserData.passwordHash)
			expect(user.isActive).toBe(true)
			expect(user.id).toBeDefined()
			expect(user.createdAt).toBeInstanceOf(Date)
			expect(user.updatedAt).toBeInstanceOf(Date)
		})

		it("should normalize email to lowercase and trim whitespace", () => {
			const userData = {
				...validUserData,
				email: "  TEST@EXAMPLE.COM  "
			}
			const user = User.create(userData)

			expect(user.email).toBe("test@example.com")
		})

		it("should trim username whitespace", () => {
			const userData = {
				...validUserData,
				username: "  testuser  "
			}
			const user = User.create(userData)

			expect(user.username).toBe("testuser")
		})

		it("should throw error for invalid email", () => {
			const userData = {
				...validUserData,
				email: "invalid-email"
			}

			expect(() => User.create(userData)).toThrow("Email must be a valid email format")
		})

		it("should throw error for invalid username", () => {
			const userData = {
				...validUserData,
				username: "ab" // too short
			}

			expect(() => User.create(userData)).toThrow("Username must be at least 3 characters long")
		})

		it("should throw error for invalid password hash", () => {
			const userData = {
				...validUserData,
				passwordHash: "invalid-hash"
			}

			expect(() => User.create(userData)).toThrow("Password hash must be a valid bcrypt hash")
		})
	})

	describe("User.fromPersistence", () => {
		it("should reconstruct user from persistence data", () => {
			const id = "123e4567-e89b-12d3-a456-426614174000"
			const createdAt = new Date("2023-01-01")
			const updatedAt = new Date("2023-01-02")

			const user = User.fromPersistence(id, "test@example.com", "testuser", validUserData.passwordHash, true, createdAt, updatedAt)

			expect(user.id).toBe(id)
			expect(user.email).toBe("test@example.com")
			expect(user.username).toBe("testuser")
			expect(user.passwordHash).toBe(validUserData.passwordHash)
			expect(user.isActive).toBe(true)
			expect(user.createdAt).toEqual(createdAt)
			expect(user.updatedAt).toEqual(updatedAt)
		})
	})

	describe("User.update", () => {
		let user: User

		beforeEach(() => {
			user = User.create(validUserData)
		})

		it("should update email", () => {
			const originalUpdatedAt = user.updatedAt

			// Wait a bit to ensure timestamp difference
			setTimeout(() => {
				user.update({ email: "newemail@example.com" })

				expect(user.email).toBe("newemail@example.com")
				expect(user.updatedAt.getTime()).toBeGreaterThan(originalUpdatedAt.getTime())
			}, 1)
		})

		it("should update username", () => {
			user.update({ username: "newusername" })

			expect(user.username).toBe("newusername")
		})

		it("should update password hash", () => {
			const newHash = "$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/RK.s5uO.H"
			user.update({ passwordHash: newHash })

			expect(user.passwordHash).toBe(newHash)
		})

		it("should update isActive status", () => {
			user.update({ isActive: false })

			expect(user.isActive).toBe(false)
		})

		it("should validate email during update", () => {
			expect(() => user.update({ email: "invalid-email" })).toThrow("Email must be a valid email format")
		})

		it("should validate username during update", () => {
			expect(() => user.update({ username: "ab" })).toThrow("Username must be at least 3 characters long")
		})

		it("should validate password hash during update", () => {
			expect(() => user.update({ passwordHash: "invalid-hash" })).toThrow("Password hash must be a valid bcrypt hash")
		})
	})

	describe("User.deactivate", () => {
		it("should deactivate user", () => {
			const user = User.create(validUserData)
			const originalUpdatedAt = user.updatedAt

			setTimeout(() => {
				user.deactivate()

				expect(user.isActive).toBe(false)
				expect(user.updatedAt.getTime()).toBeGreaterThan(originalUpdatedAt.getTime())
			}, 1)
		})
	})

	describe("User.activate", () => {
		it("should activate user", () => {
			const user = User.create(validUserData)
			user.deactivate()
			const originalUpdatedAt = user.updatedAt

			setTimeout(() => {
				user.activate()

				expect(user.isActive).toBe(true)
				expect(user.updatedAt.getTime()).toBeGreaterThan(originalUpdatedAt.getTime())
			}, 1)
		})
	})

	describe("User.ownsResource", () => {
		it("should return true for matching user ID", () => {
			const user = User.create(validUserData)

			expect(user.ownsResource(user.id)).toBe(true)
		})

		it("should return false for different user ID", () => {
			const user = User.create(validUserData)

			expect(user.ownsResource("different-id")).toBe(false)
		})
	})

	describe("User.toPlainObject", () => {
		it("should return plain object without sensitive data", () => {
			const user = User.create(validUserData)
			const plainObject = user.toPlainObject()

			expect(plainObject).toEqual({
				id: user.id,
				email: user.email,
				username: user.username,
				isActive: user.isActive,
				createdAt: user.createdAt,
				updatedAt: user.updatedAt
			})

			// Should not include password hash
			expect(plainObject).not.toHaveProperty("passwordHash")
		})
	})

	describe("Email validation", () => {
		it("should reject empty email", () => {
			expect(() => User.validateEmail("")).toThrow("Email cannot be empty")
		})

		it("should reject null email", () => {
			expect(() => User.validateEmail(null as any)).toThrow("Email is required and must be a string")
		})

		it("should reject undefined email", () => {
			expect(() => User.validateEmail(undefined as any)).toThrow("Email is required and must be a string")
		})

		it("should reject email longer than 255 characters", () => {
			const longEmail = "a".repeat(250) + "@example.com"
			expect(() => User.validateEmail(longEmail)).toThrow("Email cannot exceed 255 characters")
		})

		it("should accept valid email formats", () => {
			const validEmails = ["test@example.com", "user.name@domain.co.uk", "user+tag@example.org", "user123@test-domain.com"]

			validEmails.forEach((email) => {
				expect(() => User.validateEmail(email)).not.toThrow()
			})
		})

		it("should reject invalid email formats", () => {
			const invalidEmails = ["plainaddress", "@missingdomain.com", "missing@.com", "missing@domain", "spaces @domain.com", "double@@domain.com"]

			invalidEmails.forEach((email) => {
				expect(() => User.validateEmail(email)).toThrow("Email must be a valid email format")
			})
		})
	})

	describe("Username validation", () => {
		it("should reject empty username", () => {
			expect(() => User.validateUsername("")).toThrow("Username cannot be empty")
		})

		it("should reject null username", () => {
			expect(() => User.validateUsername(null as any)).toThrow("Username is required and must be a string")
		})

		it("should reject username shorter than 3 characters", () => {
			expect(() => User.validateUsername("ab")).toThrow("Username must be at least 3 characters long")
		})

		it("should reject username longer than 50 characters", () => {
			const longUsername = "a".repeat(51)
			expect(() => User.validateUsername(longUsername)).toThrow("Username cannot exceed 50 characters")
		})

		it("should accept valid usernames", () => {
			const validUsernames = ["user123", "test_user", "User_Name_123", "abc", "a".repeat(50)]

			validUsernames.forEach((username) => {
				expect(() => User.validateUsername(username)).not.toThrow()
			})
		})

		it("should reject usernames with invalid characters", () => {
			const invalidUsernames = ["user-name", "user.name", "user name", "user@name", "user#name", "user!name"]

			invalidUsernames.forEach((username) => {
				expect(() => User.validateUsername(username)).toThrow("Username can only contain letters, numbers, and underscores")
			})
		})
	})

	describe("Password hash validation", () => {
		it("should reject empty password hash", () => {
			expect(() => User.validatePasswordHash("")).toThrow("Password hash cannot be empty")
		})

		it("should reject null password hash", () => {
			expect(() => User.validatePasswordHash(null as any)).toThrow("Password hash is required and must be a string")
		})

		it("should accept valid bcrypt hashes", () => {
			const validHashes = [
				"$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/RK.s5uO.G",
				"$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy",
				"$2y$12$Dwt1BjwzLx0ZJnDf.VLFO.QwqvtqoqHi2XjSMPLkxS0P1rE7TtHPi"
			]

			validHashes.forEach((hash) => {
				expect(() => User.validatePasswordHash(hash)).not.toThrow()
			})
		})

		it("should reject invalid password hashes", () => {
			const invalidHashes = ["plaintext", "md5hash", "$1$invalid", "$2b$12$short", "not-a-hash-at-all"]

			invalidHashes.forEach((hash) => {
				expect(() => User.validatePasswordHash(hash)).toThrow("Password hash must be a valid bcrypt hash")
			})
		})
	})
})
