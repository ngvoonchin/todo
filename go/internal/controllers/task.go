package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/ngvoonchin/todo/internal/logs"
)

type TaskController struct{}

func NewTaskController() *TaskController {
	return &TaskController{}
}

func (tc *TaskController) GetTasks(c *gin.Context) {
	// Use logs.WithCtx with the request context
	logger := logs.WithCtx(c.Request.Context())

	logger.Info("Getting all tasks")

	// Example of logging with additional fields
	logger.With("user_id", "123", "action", "get_tasks").Info("User requested tasks")

	// Simulate some work
	tasks := []map[string]interface{}{
		{"id": 1, "title": "Sample Task", "completed": false},
	}

	logger.Info("Successfully retrieved tasks", "count", len(tasks))

	c.JSON(http.StatusOK, gin.H{
		"tasks": tasks,
	})
}

func (tc *TaskController) CreateTask(c *gin.Context) {
	logger := logs.WithCtx(c.Request.Context())

	logger.Info("Creating new task")

	var task map[string]interface{}
	if err := c.ShouldBindJSON(&task); err != nil {
		logger.Error("Failed to bind JSON", "error", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	logger.With("task_title", task["title"]).Info("Task created successfully")

	c.JSON(http.StatusCreated, gin.H{
		"message": "Task created",
		"task":    task,
	})
}
