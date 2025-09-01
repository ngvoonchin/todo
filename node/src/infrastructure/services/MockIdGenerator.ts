import { IdGenerator } from "../../domain/services/IdGenerator"

// Mock implementation for testing
export class MockIdGenerator implements IdGenerator {
	private counter = 1

	generate(): string {
		return `mock-id-${this.counter++}`
	}

	reset(): void {
		this.counter = 1
	}
}
