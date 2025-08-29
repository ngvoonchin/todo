/**
 * Data Transfer Objects for Authentication Operations
 */

export interface RegisterUserRequest {
	email: string
	username: string
	password: string
}

export interface LoginRequest {
	email: string
	password: string
}

export interface RefreshTokenRequest {
	refreshToken: string
}

export interface AuthResponse {
	user: UserResponse
	tokens: TokenResponse
}

export interface UserResponse {
	id: string
	email: string
	username: string
	isActive: boolean
	createdAt: Date
}

export interface TokenResponse {
	accessToken: string
	refreshToken: string
	expiresIn: number // seconds
}

export interface UserProfileResponse {
	id: string
	email: string
	username: string
	isActive: boolean
	createdAt: Date
	updatedAt: Date
}

export interface UpdateUserProfileRequest {
	email?: string
	username?: string
}

export interface ChangePasswordRequest {
	currentPassword: string
	newPassword: string
}
