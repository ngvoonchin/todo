import { Request, Response, NextFunction } from "express"
import { logger } from "../../infrastructure/logging/logger"

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
	const start = Date.now()

	// Log incoming request
	logger.info("Incoming request", {
		method: req.method,
		url: req.url,
		// userAgent: req.get("User-Agent"),
		ip: req.ip,
		timestamp: new Date().toISOString()
	})

	// Use res.on('finish') to log when response is sent
	res.on("finish", () => {
		const duration = Date.now() - start

		logger.info("Request completed", {
			method: req.method,
			url: req.url,
			statusCode: res.statusCode,
			duration: `${duration}ms`,
			timestamp: new Date().toISOString()
		})
	})

	next()
}
