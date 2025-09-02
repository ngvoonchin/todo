package logs

import (
	"context"
	"log/slog"
	"os"
)

// Logger wraps slog.Logger with context support
type Logger struct {
	logger *slog.Logger
	ctx    context.Context
}

var defaultLogger *slog.Logger

func init() {
	// Initialize default structured logger
	defaultLogger = slog.New(slog.NewJSONHandler(os.Stdout, &slog.HandlerOptions{
		Level: slog.LevelInfo,
	}))
}

// WithCtx returns a new Logger instance with the given context
func WithCtx(ctx context.Context) *Logger {
	return &Logger{
		logger: defaultLogger,
		ctx:    ctx,
	}
}

// Info logs an info level message
func (l *Logger) Info(msg string, args ...any) {
	l.logger.InfoContext(l.ctx, msg, args...)
}

// Error logs an error level message
func (l *Logger) Error(msg string, args ...any) {
	l.logger.ErrorContext(l.ctx, msg, args...)
}

// Warn logs a warning level message
func (l *Logger) Warn(msg string, args ...any) {
	l.logger.WarnContext(l.ctx, msg, args...)
}

// Debug logs a debug level message
func (l *Logger) Debug(msg string, args ...any) {
	l.logger.DebugContext(l.ctx, msg, args...)
}

// With adds key-value pairs to the logger
func (l *Logger) With(args ...any) *Logger {
	return &Logger{
		logger: l.logger.With(args...),
		ctx:    l.ctx,
	}
}