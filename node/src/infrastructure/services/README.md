# Infrastructure Services

## ID Generation Service

### Problem

The original `Task.create()` method violated Clean Architecture by directly calling `crypto.randomUUID()`, which:

- Created a dependency from domain layer to Node.js infrastructure
- Made testing difficult (couldn't mock UUID generation)
- Violated the Dependency Inversion Principle

### Solution

Implemented the **Dependency Inversion Principle** with:

1. **Domain Interface** (`domain/services/IdGenerator.ts`)

   - Abstract interface defining the contract
   - No implementation details
   - Part of the domain layer

2. **Infrastructure Implementation** (`infrastructure/services/UuidGenerator.ts`)

   - Concrete implementation using Node.js crypto
   - Implements the domain interface
   - Part of the infrastructure layer

3. **Mock Implementation** (`infrastructure/services/MockIdGenerator.ts`)
   - Predictable IDs for testing
   - Implements the same interface
   - Useful for unit tests

### Usage

```typescript
// Production
const idGenerator = new UuidGenerator()
const useCase = new CreateTask(taskRepository, idGenerator)

// Testing
const mockIdGenerator = new MockIdGenerator()
const useCase = new CreateTask(taskRepository, mockIdGenerator)
```

### Benefits

- ✅ Clean Architecture compliance
- ✅ Testable (can inject mock)
- ✅ Flexible (can swap implementations)
- ✅ Domain layer stays pure
- ✅ Infrastructure concerns isolated
