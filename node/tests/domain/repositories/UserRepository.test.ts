import { UserRepository, CreateUserRequest, UpdateUserRequest } from "../../../src/domain/repositories/UserRepository"
import { User } from "../../../src/domain/entities/User"

// Mock implementation for testing the interface contract
class MockUserRepository implements UserRepository {
	private users: Map<string, User> = new Map()
	private emailIndex: Map<string, string> = new Map()
	private usernameIndex: Map<string, string> = new Map()

	async create(request: CreateUserRequest): Promise<User> {
		if (await this.emailExists(request.email)) {
			throw new Error(`Email already exists: ${request.email}`)
		}
		if (await this.usernameExists(request.username)) {
			throw new Error(`Username already exists: ${request.username}`)
		}

		const user = User.create(request)
		this.users.set(user.id, user)
		this.emailIndex.set(request.email.toLowerCase(), user.id)
		this.usernameIndex.set(request.username.toLowerCase(), user.id)
		return user
	}

	async findById(id: string): Promise<User | null> {
		return this.users.get(id) || null
	}

	async findByEmail(email: string): Promise<User | null> {
		const userId = this.emailIndex.get(email.toLowerCase())
		return userId ? this.users.get(userId) || null : null
	}

	async findByUsername(username: string): Promise<User | null> {
		const userId = this.usernameIndex.get(username.toLowerCase())
		return userId ? this.users.get(userId) || null : null
	}

	async update(id: string, updates: UpdateUserRequest): Promise<User | null> {
		const user = this.users.get(id)
		if (!user) return null

		if (updates.email && (await this.emailExists(updates.email, id))) {
			throw new Error(`Email already exists: ${updates.email}`)
		}
		if (updates.username && (await this.usernameExists(updates.username, id))) {
			throw new Error(`Username already exists: ${updates.username}`)
		}

		// Update indexes if email or username changed
		if (updates.email && updates.email !== user.email) {
			this.emailIndex.delete(user.email.toLowerCase())
			this.emailIndex.set(updates.email.toLowerCase(), id)
		}
		if (updates.username && updates.username !== user.username) {
			this.usernameIndex.delete(user.username.toLowerCase())
			this.usernameIndex.set(updates.username.toLowerCase(), id)
		}

		user.update(updates)
		return user
	}

	async delete(id: string): Promise<boolean> {
		const user = this.users.get(id)
		if (!user) return false

		this.users.delete(id)
		this.emailIndex.delete(user.email.toLowerCase())
		this.usernameIndex.delete(user.username.toLowerCase())
		return true
	}

	async emailExists(email: string, excludeUserId?: string): Promise<boolean> {
		const userId = this.emailIndex.get(email.toLowerCase())
		return userId !== undefined && userId !== excludeUserId
	}

	async usernameExists(username: string, excludeUserId?: string): Promise<boolean> {
		const userId = this.usernameIndex.get(username.toLowerCase())
		return userId !== undefined && userId !== excludeUserId
	}
}

describe("UserRepository Interface Contract", () => {
	let repository: UserRepository
	const validUserData: CreateUserRequest = {
		email: "test@example.com",
		username: "testuser",
		passwordHash: "$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/RK.s5uO.G"
	}

	beforeEach(() => {
		repository = new MockUserRepository()
	})

	describe("create", () => {
		it("should create a new user with valid data", async () => {
			const user = await repository.create(validUserData)

			expect(user).toBeInstanceOf(User)
			expect(user.email).toBe(validUserData.email)
			expect(user.username).toBe(validUserData.username)
			expect(user.passwordHash).toBe(validUserData.passwordHash)
			expect(user.isActive).toBe(true)
		})

		it("should throw error for duplicate email", async () => {
			await repository.create(validUserData)

			const duplicateEmailData = {
				...validUserData,
				username: "differentuser"
			}

			await expect(repository.create(duplicateEmailData)).rejects.toThrow("Email already exists")
		})

		it("should throw error for duplicate username", async () => {
			await repository.create(validUserData)

			const duplicateUsernameData = {
				...validUserData,
				email: "different@example.com"
			}

			await expect(repository.create(duplicateUsernameData)).rejects.toThrow("Username already exists")
		})
	})

	describe("findById", () => {
		it("should return user when found", async () => {
			const createdUser = await repository.create(validUserData)
			const foundUser = await repository.findById(createdUser.id)

			expect(foundUser).not.toBeNull()
			expect(foundUser!.id).toBe(createdUser.id)
			expect(foundUser!.email).toBe(createdUser.email)
		})

		it("should return null when user not found", async () => {
			const foundUser = await repository.findById("non-existent-id")

			expect(foundUser).toBeNull()
		})
	})

	describe("findByEmail", () => {
		it("should return user when found", async () => {
			const createdUser = await repository.create(validUserData)
			const foundUser = await repository.findByEmail(validUserData.email)

			expect(foundUser).not.toBeNull()
			expect(foundUser!.id).toBe(createdUser.id)
			expect(foundUser!.email).toBe(validUserData.email)
		})

		it("should return null when user not found", async () => {
			const foundUser = await repository.findByEmail("nonexistent@example.com")

			expect(foundUser).toBeNull()
		})

		it("should be case insensitive", async () => {
			await repository.create(validUserData)
			const foundUser = await repository.findByEmail(validUserData.email.toUpperCase())

			expect(foundUser).not.toBeNull()
			expect(foundUser!.email).toBe(validUserData.email)
		})
	})

	describe("findByUsername", () => {
		it("should return user when found", async () => {
			const createdUser = await repository.create(validUserData)
			const foundUser = await repository.findByUsername(validUserData.username)

			expect(foundUser).not.toBeNull()
			expect(foundUser!.id).toBe(createdUser.id)
			expect(foundUser!.username).toBe(validUserData.username)
		})

		it("should return null when user not found", async () => {
			const foundUser = await repository.findByUsername("nonexistentuser")

			expect(foundUser).toBeNull()
		})

		it("should be case insensitive", async () => {
			await repository.create(validUserData)
			const foundUser = await repository.findByUsername(validUserData.username.toUpperCase())

			expect(foundUser).not.toBeNull()
			expect(foundUser!.username).toBe(validUserData.username)
		})
	})

	describe("update", () => {
		it("should update user with valid data", async () => {
			const createdUser = await repository.create(validUserData)
			const updates: UpdateUserRequest = {
				email: "updated@example.com",
				username: "updateduser"
			}

			const updatedUser = await repository.update(createdUser.id, updates)

			expect(updatedUser).not.toBeNull()
			expect(updatedUser!.email).toBe(updates.email)
			expect(updatedUser!.username).toBe(updates.username)
		})

		it("should return null when user not found", async () => {
			const updates: UpdateUserRequest = {
				email: "updated@example.com"
			}

			const updatedUser = await repository.update("non-existent-id", updates)

			expect(updatedUser).toBeNull()
		})

		it("should throw error when updating to existing email", async () => {
			const user1 = await repository.create(validUserData)
			const user2Data = {
				email: "user2@example.com",
				username: "user2",
				passwordHash: validUserData.passwordHash
			}
			await repository.create(user2Data)

			await expect(repository.update(user1.id, { email: user2Data.email })).rejects.toThrow("Email already exists")
		})

		it("should throw error when updating to existing username", async () => {
			const user1 = await repository.create(validUserData)
			const user2Data = {
				email: "user2@example.com",
				username: "user2",
				passwordHash: validUserData.passwordHash
			}
			await repository.create(user2Data)

			await expect(repository.update(user1.id, { username: user2Data.username })).rejects.toThrow("Username already exists")
		})
	})

	describe("delete", () => {
		it("should delete existing user", async () => {
			const createdUser = await repository.create(validUserData)
			const deleted = await repository.delete(createdUser.id)

			expect(deleted).toBe(true)

			const foundUser = await repository.findById(createdUser.id)
			expect(foundUser).toBeNull()
		})

		it("should return false when user not found", async () => {
			const deleted = await repository.delete("non-existent-id")

			expect(deleted).toBe(false)
		})
	})

	describe("emailExists", () => {
		it("should return true for existing email", async () => {
			await repository.create(validUserData)
			const exists = await repository.emailExists(validUserData.email)

			expect(exists).toBe(true)
		})

		it("should return false for non-existing email", async () => {
			const exists = await repository.emailExists("nonexistent@example.com")

			expect(exists).toBe(false)
		})

		it("should exclude specified user ID", async () => {
			const user = await repository.create(validUserData)
			const exists = await repository.emailExists(validUserData.email, user.id)

			expect(exists).toBe(false)
		})
	})

	describe("usernameExists", () => {
		it("should return true for existing username", async () => {
			await repository.create(validUserData)
			const exists = await repository.usernameExists(validUserData.username)

			expect(exists).toBe(true)
		})

		it("should return false for non-existing username", async () => {
			const exists = await repository.usernameExists("nonexistentuser")

			expect(exists).toBe(false)
		})

		it("should exclude specified user ID", async () => {
			const user = await repository.create(validUserData)
			const exists = await repository.usernameExists(validUserData.username, user.id)

			expect(exists).toBe(false)
		})
	})
})
