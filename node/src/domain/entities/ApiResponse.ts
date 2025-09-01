export class ApiResponse<T = any> {
	constructor(public readonly code: number, public readonly message: string, public readonly data?: T) {}

	static success<T>(data: T, message: string = "Success"): ApiResponse<T> {
		return new ApiResponse(200, message, data)
	}

	static created<T>(data: T, message: string = "Created successfully"): ApiResponse<T> {
		return new ApiResponse(201, message, data)
	}

	static noContent(message: string = "No content"): ApiResponse<null> {
		return new ApiResponse(204, message, null)
	}

	static badRequest(message: string = "Bad request"): ApiResponse<null> {
		return new ApiResponse(400, message, null)
	}

	static notFound(message: string = "Resource not found"): ApiResponse<null> {
		return new ApiResponse(404, message, null)
	}

	static internalError(message: string = "Internal server error"): ApiResponse<null> {
		return new ApiResponse(500, message, null)
	}

	static custom<T>(code: number, message: string, data?: T): ApiResponse<T> {
		return new ApiResponse(code, message, data)
	}

	isSuccess(): boolean {
		return this.code >= 200 && this.code < 300
	}

	isError(): boolean {
		return this.code >= 400
	}

	toJSON() {
		return {
			code: this.code,
			message: this.message,
			data: this.data
		}
	}
}
