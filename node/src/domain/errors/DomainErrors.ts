/**
 * Domain-specific error classes for consistent error handling
 */

export abstract class DomainError extends Error {
	abstract readonly code: string
	abstract readonly statusCode: number

	constructor(message: string) {
		super(message)
		this.name = this.constructor.name
		Error.captureStackTrace(this, this.constructor)
	}
}

// Validation Errors (400)
export abstract class ValidationError extends DomainError {
	readonly statusCode = 400
}

export class InvalidEmailError extends ValidationError {
	readonly code = "INVALID_EMAIL"

	constructor(email: string) {
		super(`Invalid email format: ${email}`)
	}
}

export class InvalidUsernameError extends ValidationError {
	readonly code = "INVALID_USERNAME"

	constructor(username: string) {
		super(`Invalid username: ${username}`)
	}
}

export class InvalidPasswordError extends ValidationError {
	readonly code = "INVALID_PASSWORD"

	constructor(message: string = "Invalid password format") {
		super(message)
	}
}

export class InvalidTodoTitleError extends ValidationError {
	readonly code = "INVALID_TODO_TITLE"

	constructor(title: string) {
		super(`Invalid todo title: ${title}`)
	}
}

export class InvalidTodoDescriptionError extends ValidationError {
	readonly code = "INVALID_TODO_DESCRIPTION"

	constructor(message: string = "Invalid todo description") {
		super(message)
	}
}

// Authentication Errors (401)
export abstract class AuthenticationError extends DomainError {
	readonly statusCode = 401
}

export class InvalidCredentialsError extends AuthenticationError {
	readonly code = "INVALID_CREDENTIALS"

	constructor() {
		super("Invalid email or password")
	}
}

export class InvalidTokenError extends AuthenticationError {
	readonly code = "INVALID_TOKEN"

	constructor(message: string = "Invalid or expired token") {
		super(message)
	}
}

export class TokenExpiredError extends AuthenticationError {
	readonly code = "TOKEN_EXPIRED"

	constructor() {
		super("Token has expired")
	}
}

// Authorization Errors (403)
export abstract class AuthorizationError extends DomainError {
	readonly statusCode = 403
}

export class InsufficientPermissionsError extends AuthorizationError {
	readonly code = "INSUFFICIENT_PERMISSIONS"

	constructor(resource: string) {
		super(`Insufficient permissions to access ${resource}`)
	}
}

export class ResourceOwnershipError extends AuthorizationError {
	readonly code = "RESOURCE_OWNERSHIP_ERROR"

	constructor(resourceType: string, resourceId: string) {
		super(`You do not own this ${resourceType}: ${resourceId}`)
	}
}

export class InactiveUserError extends AuthorizationError {
	readonly code = "INACTIVE_USER"

	constructor() {
		super("User account is inactive")
	}
}

// Not Found Errors (404)
export abstract class NotFoundError extends DomainError {
	readonly statusCode = 404
}

export class UserNotFoundError extends NotFoundError {
	readonly code = "USER_NOT_FOUND"

	constructor(identifier: string) {
		super(`User not found: ${identifier}`)
	}
}

export class TodoNotFoundError extends NotFoundError {
	readonly code = "TODO_NOT_FOUND"

	constructor(todoId: string) {
		super(`Todo not found: ${todoId}`)
	}
}

// Conflict Errors (409)
export abstract class ConflictError extends DomainError {
	readonly statusCode = 409
}

export class EmailAlreadyExistsError extends ConflictError {
	readonly code = "EMAIL_ALREADY_EXISTS"

	constructor(email: string) {
		super(`Email already exists: ${email}`)
	}
}

export class UsernameAlreadyExistsError extends ConflictError {
	readonly code = "USERNAME_ALREADY_EXISTS"

	constructor(username: string) {
		super(`Username already exists: ${username}`)
	}
}

// Server Errors (500)
export abstract class InternalError extends DomainError {
	readonly statusCode = 500
}

export class DatabaseError extends InternalError {
	readonly code = "DATABASE_ERROR"

	constructor(message: string = "Database operation failed") {
		super(message)
	}
}

export class ExternalServiceError extends InternalError {
	readonly code = "EXTERNAL_SERVICE_ERROR"

	constructor(service: string, message: string = "External service unavailable") {
		super(`${service}: ${message}`)
	}
}
