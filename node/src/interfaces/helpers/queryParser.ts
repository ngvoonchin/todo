import { Request } from "express"
import { QueryOptions } from "../../domain/entities/Query"

export class QueryParser {
	static parseQueryOptions(req: Request): QueryOptions {
		const options: QueryOptions = {}

		// Debug logging
		console.log("Raw query params:", req.query)
		console.log("Query keys:", Object.keys(req.query))

		// Parse pagination
		if (req.query.page) {
			const page = parseInt(req.query.page as string, 10)
			if (!isNaN(page) && page > 0) {
				options.page = page
			}
		}

		if (req.query.limit) {
			const limit = parseInt(req.query.limit as string, 10)
			if (!isNaN(limit) && limit > 0) {
				options.limit = Math.min(limit, 100) // Cap at 100 items per page
			}
		}

		// Parse sorting
		if (req.query.sortBy) {
			const sortBy = req.query.sortBy as string
			const sortOrder = (req.query.sortOrder as string) || "asc"

			options.sort = {
				field: sortBy,
				order: sortOrder.toLowerCase() === "desc" ? "desc" : "asc"
			}
		}

		// Parse filters
		const filters = []

		// Handle individual filter parameters
		if (req.query.title) {
			filters.push({
				field: "title",
				operator: "like",
				value: req.query.title as string
			})
		}

		if (req.query.completed !== undefined) {
			const completed = req.query.completed === "true"
			filters.push({
				field: "completed",
				operator: "eq",
				value: completed
			})
		}

		if (req.query.description) {
			filters.push({
				field: "description",
				operator: "like",
				value: req.query.description as string
			})
		}

		// Handle generic filter format: filter[field][operator]=value
		Object.keys(req.query).forEach((key) => {
			const filterMatch = key.match(/^filter\[(\w+)\]\[(\w+)\]$/)
			if (filterMatch) {
				const [, field, operator] = filterMatch
				const value = req.query[key]

				filters.push({
					field,
					operator,
					value: this.parseFilterValue(value as string)
				})
			}
		})

		if (filters.length > 0) {
			options.filters = filters
		}

		return options
	}

	private static parseFilterValue(value: string): any {
		// Try to parse as boolean
		if (value === "true") return true
		if (value === "false") return false

		// Try to parse as number
		const numValue = Number(value)
		if (!isNaN(numValue)) return numValue

		// Try to parse as date
		const dateValue = new Date(value)
		if (!isNaN(dateValue.getTime()) && value.match(/^\d{4}-\d{2}-\d{2}/)) {
			return dateValue
		}

		// Return as string
		return value
	}
}
