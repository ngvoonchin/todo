# Logging Package

This package provides context-aware structured logging using Go's standard `log/slog` package.

## Usage

### Basic Usage

```go
import (
    "context"
    "github.com/ngvoonchin/todo/internal/logs"
)

func someFunction(ctx context.Context) {
    logger := logs.WithCtx(ctx)

    logger.Info("This is an info message")
    logger.Error("This is an error message")
    logger.Warn("This is a warning message")
    logger.Debug("This is a debug message")
}
```

### Adding Structured Fields

```go
logger := logs.WithCtx(ctx)

// Add fields to a single log message
logger.Info("User action", "user_id", "123", "action", "login")

// Create a logger with persistent fields
enrichedLogger := logger.With("service", "auth", "version", "1.0")
enrichedLogger.Info("Authentication successful")
enrichedLogger.Error("Authentication failed", "reason", "invalid_password")
```

### In Gin Handlers

```go
func (c *gin.Context) {
    logger := logs.WithCtx(c.Request.Context())

    logger.Info("Processing request", "method", c.Request.Method, "path", c.Request.URL.Path)

    // Your handler logic here

    logger.Info("Request completed", "status", 200)
}
```

## Features

- **Context-aware**: Automatically includes context information in logs
- **Structured logging**: Uses JSON format for easy parsing and analysis
- **Multiple log levels**: Info, Error, Warn, Debug
- **Field enrichment**: Add key-value pairs to log messages
- **Standard library**: Built on Go's standard `log/slog` package

## Log Format

Logs are output in JSON format:

```json
{ "time": "2025-09-02T16:22:16.0067564+08:00", "level": "INFO", "msg": "User action", "user_id": "123", "action": "login" }
```
