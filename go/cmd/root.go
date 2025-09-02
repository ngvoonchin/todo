package cmd

// "context"
// "fmt"
// "os/signal"
// "syscall"

// "github.com/gin-gonic/gin"
// "github.com/ngvoonchin/todo/internal/config"
// "github.com/ngvoonchin/todo/internal/routers"
// "gitlab.aurums.sg/ems-team/robokeeper/backend/rk-base/custom"

// "gitlab.aurums.sg/ems-team/robokeeper/backend/rk-base/starter"

// "github.com/ngvoonchin/todo/internal/logs"

func Start() {
	// logPrefix := "[root][Start]"

	// ctx, cancel := signal.NotifyContext(context.Background(), syscall.SIGINT, syscall.SIGTERM)
	// ctx = custom.SetLogIdIfNotExist(ctx, custom.GenerateTraceId())
	// defer cancel()

	// cfg, err := config.InitConfig(ctx)
	// if err != nil {
	// 	logs.WithCtx(ctx).Error("%s[config.InitConfig][err:%v]", logPrefix, err)
	// 	return
	// }
	// starter.InitLog(cfg.Logs)
	// gormDB, sqlDB, err := starter.InitMysqlDB(ctx, cfg.MysqlConfig)
	// if err != nil {
	// 	logs.WithCtx(ctx).Error("%s[starter.InitMysqlDB][err:%v][MysqlConfig:%+v]", logPrefix, err, cfg.MysqlConfig)
	// 	return
	// }
	// defer func() {
	// 	if sqlDB != nil {
	// 		if err = sqlDB.Close(); err != nil {
	// 			logs.WithCtx(ctx).Error("%s[sqlDB.Close][err:%v]", logPrefix, err)
	// 		}
	// 	}
	// 	// no need close gormDB
	// }()

	// r := gin.Default()
	// routers.SetupRouter(r, gormDB)
	// if err = starter.InitHTTPServer(ctx, r, fmt.Sprintf(":%d", cfg.HttpPort)); err != nil {
	// 	logs.WithCtx(ctx).Emergency("%s[starter.InitHTTPServer][err:%v][port:%v]", logPrefix, err, fmt.Sprintf(":%d", cfg.HttpPort))
	// 	return
	// }
	// logs.WithCtx(ctx).Info("%s[ApplicationShutDownSuccessfully]", logPrefix)
}
