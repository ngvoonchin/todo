package logs

import (
	"context"
	"testing"
)

func TestWithCtx(t *testing.T) {
	ctx := context.Background()

	// Test basic logging
	logger := WithCtx(ctx)
	if logger == nil {
		t.Fatal("WithCtx returned nil logger")
	}

	// Test that we can call logging methods without panic
	logger.Info("Test info message")
	logger.Error("Test error message")
	logger.Warn("Test warning message")
	logger.Debug("Test debug message")

	// Test with additional fields
	logger.With("key", "value").Info("Test with fields")
}

func TestLoggerMethods(t *testing.T) {
	ctx := context.Background()
	logger := WithCtx(ctx)

	// Test all logging levels
	logger.Info("Info message", "field1", "value1")
	logger.Error("Error message", "field2", "value2")
	logger.Warn("Warning message", "field3", "value3")
	logger.Debug("Debug message", "field4", "value4")

	// Test chaining with With
	enrichedLogger := logger.With("service", "test", "version", "1.0")
	enrichedLogger.Info("Enriched log message")
}
