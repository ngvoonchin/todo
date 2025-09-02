package cmd

import (
	"context"
	"errors"
	"fmt"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/ngvoonchin/todo/internal/logs"
	"golang.org/x/sync/errgroup"
)

const (
	ReadTimeout     = 5 * time.Second
	WriteTimeout    = 10 * time.Second
	IdleTimeout     = 120 * time.Second
	ShutdownTimeout = 10 * time.Second
)

func InitServer(ctx context.Context, r *gin.Engine, httpPort string) error {
	logPrefix := "[server][InitServer]"

	// Configures Go’s built-in http.Server
	server := &http.Server{
		Addr:         fmt.Sprintf(":%s", httpPort), // Port binding
		Handler:      r,                            // Gin router
		ReadTimeout:  ReadTimeout,                  // Prevent slowloris-type attacks and enforce limits
		WriteTimeout: WriteTimeout,
		IdleTimeout:  IdleTimeout,
	}

	// Create errgroup tied to context
	// errgroup lets you run multiple goroutines and wait for them.
	// The returned ctx is cancellable when: any goroutine returns an error, or the parent ctx is cancelled (e.g., SIGINT).
	g, ctx := errgroup.WithContext(ctx)

	g.Go(func() error {
		// Start the server in a goroutine.
		// server.ListenAndServe() starts the HTTP server (blocking).
		// If it errors (like port already in use), that error is sent back to the errgroup.
		// Logs startup info.
		logs.WithCtx(ctx).Info("%s[Server starting on :%s]", logPrefix, httpPort)
		return server.ListenAndServe()
	})

	g.Go(func() error {
		<-ctx.Done()
		logs.WithCtx(ctx).Info("%s[Gracefully shutting down server...]", logPrefix)

		shutdownCtx, cancel := context.WithTimeout(ctx, ShutdownTimeout)
		defer cancel()
		return server.Shutdown(shutdownCtx)
	})

	if err := g.Wait(); err != nil && !errors.Is(err, http.ErrServerClosed) {
		logs.WithCtx(ctx).Error("%s[Server error: %v]", logPrefix, err)
		return err
	}
	return nil
}
