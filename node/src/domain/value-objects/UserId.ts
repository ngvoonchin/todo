import { randomUUID } from "node:crypto"

export class UserId {
	private constructor(private readonly _value: string) {
		this.validate(_value)
	}

	static generate(): UserId {
		return new UserId(randomUUID())
	}

	static fromString(value: string): UserId {
		return new UserId(value)
	}

	get value(): string {
		return this._value
	}

	equals(other: UserId): boolean {
		return this._value === other._value
	}

	toString(): string {
		return this._value
	}

	private validate(value: string): void {
		if (typeof value !== "string") {
			throw new Error("UserId must be a non-empty string")
		}

		const trimmedValue = value.trim()
		if (trimmedValue.length === 0) {
			throw new Error("UserId cannot be empty")
		}

		// Basic UUID format validation
		const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
		if (!uuidRegex.test(trimmedValue)) {
			throw new Error("UserId must be a valid UUID format")
		}
	}
}
