import { UserId } from "../value-objects/UserId"

export interface CreateUserData {
	email: string
	username: string
	passwordHash: string
}

export interface UpdateUserData {
	email?: string
	username?: string
	passwordHash?: string
	isActive?: boolean
}

export class User {
	private constructor(
		private readonly _id: UserId,
		private _email: string,
		private _username: string,
		private _passwordHash: string,
		private _isActive: boolean,
		private readonly _createdAt: Date,
		private _updatedAt: Date
	) {}

	// Factory method for creating new users
	static create(data: CreateUserData): User {
		User.validateEmail(data.email)
		User.validateUsername(data.username)
		User.validatePasswordHash(data.passwordHash)

		const now = new Date()
		return new User(UserId.generate(), data.email.toLowerCase().trim(), data.username.trim(), data.passwordHash, true, now, now)
	}

	// Factory method for reconstructing users from persistence
	static fromPersistence(id: string, email: string, username: string, passwordHash: string, isActive: boolean, createdAt: Date, updatedAt: Date): User {
		return new User(UserId.fromString(id), email, username, passwordHash, isActive, createdAt, updatedAt)
	}

	// Getters
	get id(): string {
		return this._id.value
	}

	get email(): string {
		return this._email
	}

	get username(): string {
		return this._username
	}

	get passwordHash(): string {
		return this._passwordHash
	}

	get isActive(): boolean {
		return this._isActive
	}

	get createdAt(): Date {
		return new Date(this._createdAt)
	}

	get updatedAt(): Date {
		return new Date(this._updatedAt)
	}

	// Business methods
	update(data: UpdateUserData): void {
		if (data.email !== undefined) {
			User.validateEmail(data.email)
			this._email = data.email.toLowerCase().trim()
		}

		if (data.username !== undefined) {
			User.validateUsername(data.username)
			this._username = data.username.trim()
		}

		if (data.passwordHash !== undefined) {
			User.validatePasswordHash(data.passwordHash)
			this._passwordHash = data.passwordHash
		}

		if (data.isActive !== undefined) {
			this._isActive = data.isActive
		}

		this._updatedAt = new Date()
	}

	deactivate(): void {
		this._isActive = false
		this._updatedAt = new Date()
	}

	activate(): void {
		this._isActive = true
		this._updatedAt = new Date()
	}

	// Validation methods
	static validateEmail(email: string): void {
		if (typeof email !== "string") {
			throw new Error("Email is required and must be a string")
		}

		const trimmedEmail = email.trim()
		if (trimmedEmail.length === 0) {
			throw new Error("Email cannot be empty")
		}

		if (trimmedEmail.length > 255) {
			throw new Error("Email cannot exceed 255 characters")
		}

		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
		if (!emailRegex.test(trimmedEmail)) {
			throw new Error("Email must be a valid email format")
		}
	}

	static validateUsername(username: string): void {
		if (typeof username !== "string") {
			throw new Error("Username is required and must be a string")
		}

		const trimmedUsername = username.trim()
		if (trimmedUsername.length === 0) {
			throw new Error("Username cannot be empty")
		}

		if (trimmedUsername.length < 3) {
			throw new Error("Username must be at least 3 characters long")
		}

		if (trimmedUsername.length > 50) {
			throw new Error("Username cannot exceed 50 characters")
		}

		const usernameRegex = /^[a-zA-Z0-9_]+$/
		if (!usernameRegex.test(trimmedUsername)) {
			throw new Error("Username can only contain letters, numbers, and underscores")
		}
	}

	static validatePasswordHash(passwordHash: string): void {
		if (typeof passwordHash !== "string") {
			throw new Error("Password hash is required and must be a string")
		}

		if (passwordHash.trim().length === 0) {
			throw new Error("Password hash cannot be empty")
		}

		// Basic validation for bcrypt hash format
		if (!passwordHash.startsWith("$2") || passwordHash.length < 60) {
			throw new Error("Password hash must be a valid bcrypt hash")
		}
	}

	// Helper method to check if user owns a resource
	ownsResource(userId: string): boolean {
		return this._id.value === userId
	}

	// Convert to plain object for serialization
	toPlainObject(): {
		id: string
		email: string
		username: string
		isActive: boolean
		createdAt: Date
		updatedAt: Date
	} {
		return {
			id: this.id,
			email: this.email,
			username: this.username,
			isActive: this.isActive,
			createdAt: this.createdAt,
			updatedAt: this.updatedAt
		}
	}
}
