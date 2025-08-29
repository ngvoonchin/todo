import { User } from "../entities/User"

export interface CreateUserRequest {
	email: string
	username: string
	passwordHash: string
}

export interface UpdateUserRequest {
	email?: string
	username?: string
	passwordHash?: string
	isActive?: boolean
}

export interface UserRepository {
	/**
	 * Create a new user
	 * @param request - User creation data
	 * @returns Promise resolving to the created user
	 * @throws Error if email or username already exists
	 */
	create(request: CreateUserRequest): Promise<User>

	/**
	 * Find a user by their unique ID
	 * @param id - User ID
	 * @returns Promise resolving to the user or null if not found
	 */
	findById(id: string): Promise<User | null>

	/**
	 * Find a user by their email address
	 * @param email - User email address
	 * @returns Promise resolving to the user or null if not found
	 */
	findByEmail(email: string): Promise<User | null>

	/**
	 * Find a user by their username
	 * @param username - Username
	 * @returns Promise resolving to the user or null if not found
	 */
	findByUsername(username: string): Promise<User | null>

	/**
	 * Update an existing user
	 * @param id - User ID
	 * @param updates - Partial user data to update
	 * @returns Promise resolving to the updated user or null if not found
	 * @throws Error if email or username conflicts with existing user
	 */
	update(id: string, updates: UpdateUserRequest): Promise<User | null>

	/**
	 * Delete a user by ID
	 * @param id - User ID
	 * @returns Promise resolving to true if deleted, false if not found
	 */
	delete(id: string): Promise<boolean>

	/**
	 * Check if an email address is already in use
	 * @param email - Email address to check
	 * @param excludeUserId - Optional user ID to exclude from the check (for updates)
	 * @returns Promise resolving to true if email exists, false otherwise
	 */
	emailExists(email: string, excludeUserId?: string): Promise<boolean>

	/**
	 * Check if a username is already in use
	 * @param username - Username to check
	 * @param excludeUserId - Optional user ID to exclude from the check (for updates)
	 * @returns Promise resolving to true if username exists, false otherwise
	 */
	usernameExists(username: string, excludeUserId?: string): Promise<boolean>
}
