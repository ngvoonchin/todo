import { Response } from "express"
import { ApiResponse } from "../../domain/entities/ApiResponse"

export class ResponseHelper {
	static sendSuccess<T>(res: Response, data: T, message: string = "Success"): void {
		const response = ApiResponse.success(data, message)
		res.status(response.code).json(response.toJSON())
	}

	static sendCreated<T>(res: Response, data: T, message: string = "Created successfully"): void {
		const response = ApiResponse.created(data, message)
		res.status(response.code).json(response.toJSON())
	}

	static sendNoContent(res: Response, message: string = "No content"): void {
		const response = ApiResponse.noContent(message)
		res.status(response.code).json(response.toJSON())
	}

	static sendBadRequest(res: Response, message: string = "Bad request"): void {
		const response = ApiResponse.badRequest(message)
		res.status(response.code).json(response.toJSON())
	}

	static sendNotFound(res: Response, message: string = "Resource not found"): void {
		const response = ApiResponse.notFound(message)
		res.status(response.code).json(response.toJSON())
	}

	static sendInternalError(res: Response, message: string = "Internal server error"): void {
		const response = ApiResponse.internalError(message)
		res.status(response.code).json(response.toJSON())
	}

	static sendCustom<T>(res: Response, code: number, message: string, data?: T): void {
		const response = ApiResponse.custom(code, message, data)
		res.status(response.code).json(response.toJSON())
	}
}
