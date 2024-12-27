import createStore from "connect-redis"
import cookieParser from "cookie-parser"
import express, { Express } from "express"
import session from "express-session"
import Redis from "ioredis"
import morgan from "morgan"
import path from "path"
import { logger } from "../logger"
import { configManager } from "../config"
import { MedusaRequest, MedusaResponse } from "./types"

const NOISY_ENDPOINTS_CHUNKS = ["@fs", "@id", "@vite", "@react", "node_modules"]

export async function expressLoader({ app }: { app: Express }): Promise<{
  app: Express
  shutdown: () => Promise<void>
}> {
  const baseDir = configManager.baseDir
  const configModule = configManager.config
  const isProduction = configManager.isProduction
  const NODE_ENV = process.env.NODE_ENV || "development"
  const IS_DEV = NODE_ENV.startsWith("dev")
  const isStaging = NODE_ENV === "staging"
  const isTest = NODE_ENV === "test"

  let sameSite: string | boolean = false
  let secure = false
  if (isProduction || isStaging) {
    secure = true
    sameSite = "none"
  }

  const { http, sessionOptions } = configModule.projectConfig
  const sessionOpts = {
    name: sessionOptions?.name ?? "connect.sid",
    resave: sessionOptions?.resave ?? true,
    rolling: sessionOptions?.rolling ?? false,
    saveUninitialized: sessionOptions?.saveUninitialized ?? true,
    proxy: true,
    secret: sessionOptions?.secret ?? http?.cookieSecret,
    cookie: {
      sameSite,
      secure,
      maxAge: sessionOptions?.ttl ?? 10 * 60 * 60 * 1000,
    },
    store: null,
  }

  let redisClient: Redis

  if (configModule?.projectConfig?.redisUrl) {
    const RedisStore = createStore(session)
    redisClient = new Redis(
      configModule.projectConfig.redisUrl,
      configModule.projectConfig.redisOptions ?? {}
    )
    sessionOpts.store = new RedisStore({
      client: redisClient,
      prefix: `${configModule?.projectConfig?.redisPrefix ?? ""}sess:`,
    })
  }

  app.set("trust proxy", 1)

  /**
   * Method to skip logging HTTP requests. We skip in test environment
   * and also exclude files served by vite during development
   */
  function shouldSkipHttpLog(req: MedusaRequest, res: MedusaResponse) {
    return (
      isTest || NOISY_ENDPOINTS_CHUNKS.some((chunk) => req.url.includes(chunk))
    )
  }

  /**
   * The middleware to use for logging. We write the log messages
   * using winston, but rely on morgan to hook into HTTP requests
   */
  const loggingMiddleware = morgan(
    IS_DEV
      ? ":method :url ← :referrer (:status) - :response-time ms"
      : "combined",
    {
      skip: shouldSkipHttpLog,
      stream: {
        write: (message: string) => logger.http(message.trim()),
      },
    }
  )

  app.use(loggingMiddleware)
  app.use(cookieParser())
  app.use(session(sessionOpts))

  // Currently we don't allow configuration of static files, but this can be revisited as needed.
  app.use("/static", express.static(path.join(baseDir, "static")))

  app.get("/health", (req, res) => {
    res.status(200).send("OK")
  })

  const shutdown = async () => {
    redisClient?.disconnect()
  }

  return { app, shutdown }
}
