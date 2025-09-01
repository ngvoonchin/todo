import crypto from "node:crypto"
import { IdGenerator } from "../../domain/services/IdGenerator"

// Infrastructure implementation using Node.js crypto
export class UuidGenerator implements IdGenerator {
	generate(): string {
		return crypto.randomUUID()
	}
}
