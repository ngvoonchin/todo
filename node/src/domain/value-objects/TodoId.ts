import { randomUUID } from "node:crypto"

export class TodoId {
	private constructor(private readonly _value: string) {
		this.validate(_value)
	}

	static generate(): TodoId {
		return new TodoId(randomUUID())
	}

	static fromString(value: string): TodoId {
		return new TodoId(value)
	}

	get value(): string {
		return this._value
	}

	equals(other: TodoId): boolean {
		return this._value === other._value
	}

	toString(): string {
		return this._value
	}

	private validate(value: string): void {
		if (typeof value !== "string") {
			throw new Error("TodoId must be a non-empty string")
		}

		const trimmedValue = value.trim()
		if (trimmedValue.length === 0) {
			throw new Error("TodoId cannot be empty")
		}

		// Basic UUID format validation
		const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
		if (!uuidRegex.test(trimmedValue)) {
			throw new Error("TodoId must be a valid UUID format")
		}
	}
}
