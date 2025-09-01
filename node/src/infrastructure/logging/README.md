# Winston Logger Usage

## Basic Usage

```typescript
import { logger } from "./logger"

// Info level logging
logger.info("User action completed", { userId: "123", action: "login" })

// Error level logging
logger.error("Database connection failed", {
	error: err.message,
	stack: err.stack
})

// Warning level logging
logger.warn("Rate limit approaching", {
	userId: "123",
	requestCount: 95
})

// Debug level logging (only in development)
logger.debug("Processing request", { requestId: "abc-123" })
```

## Log Levels

- `error`: Error messages and exceptions
- `warn`: Warning messages
- `info`: General information (default level)
- `debug`: Debug information (development only)

## Log Files

- `logs/error.log`: Contains only error level logs
- `logs/combined.log`: Contains all log levels
- Console: Development environment only

## Request Logging

The `requestLogger` middleware automatically logs:

- Incoming HTTP requests with method, URL, user agent, and IP
- Completed requests with status code and duration
