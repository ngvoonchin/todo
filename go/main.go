package main

import (
	"context"
	"log"

	"github.com/gin-gonic/gin"
	"github.com/ngvoonchin/todo/cmd"
	"github.com/ngvoonchin/todo/internal/logs"
)

func main() {
	ctx := context.Background()

	router := gin.Default()
	router.GET("/ping", func(c *gin.Context) {
		logs.WithCtx(c.Request.Context()).Info("Ping endpoint called")
		c.JSON(200, gin.H{
			"message": "pong",
		})
	})

	// Start server with graceful shutdown
	if err := cmd.InitServer(ctx, router, "8080"); err != nil {
		log.Fatal("Failed to start server:", err)
	}
}
