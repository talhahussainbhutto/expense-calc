import express from "express"
import { ApolloServer } from "apollo-server-express"
import * as fs from "fs"
import * as https from "https"
import * as http from "http"
import chalk from "chalk"
import configurations from "./util/config"
import winston from "winston"

/** Load the environment specific configuration */
const configPath = configurations.path
const config = configurations.apollo

import typeDefs from "./graphql/schema"
import resolvers from "./graphql/resolvers"
import { Authorization } from "./util/authorization"

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
    winston.format.colorize()
  ),
  defaultMeta: { service: process.env.npm_package_name },
  transports: [
    new winston.transports.File({
      filename: "logs/error.log",
      level: "error"
    }),
    new winston.transports.File({ filename: "logs/service.log" }),
    new winston.transports.Console({
      format: winston.format.simple()
    })
  ]
})

const apollo = new ApolloServer({
  typeDefs,
  resolvers,
  playground: config.playground,
  introspection: config.introspection,
  tracing: config.tracing,
  debug: config.debug,
  context: async ({ req }) => {
    const token = ((req && req.headers.authorization) || "").replace(
      "Bearer ",
      ""
    )
    const auth = new Authorization(token)
    return { auth, logger }
  }
})

const app = express()

apollo.applyMiddleware({
  app,
  path: "/",
  bodyParserConfig: { limit: "50mb" },
  cors: { origin: "*" }
})

var server

if (config.ssl) {
  server = https.createServer(
    {
      key: fs.readFileSync(`${configPath}/ssl/server.key`),
      cert: fs.readFileSync(`${configPath}/ssl/server.crt`),
      ca: fs.readFileSync(`${configPath}/ssl/bundle.crt`)
    },
    app
  )
  apollo.installSubscriptionHandlers((server as any) as http.Server)
} else {
  server = http.createServer(app)
  apollo.installSubscriptionHandlers(server)
}

server.listen({ port: config.port }, () => {
  console.log(
    `\n\n${chalk.red.bold(logo)}
    \n🆕 New Project ${chalk.yellow.bold(
      configurations.name
    )} server ready at:\n `,
    chalk.blue.bold.underline(
      `http${config.ssl ? "s" : ""}://${config.hostname}:${config.port}${
        apollo.graphqlPath
      }`
    ),
    "and",
    chalk.blue.bold.underline(
      `ws${config.ssl ? "s" : ""}://${config.hostname}:${config.port}${
        apollo.subscriptionsPath
      }`
    ),
    "\n"
  )
  logger.info("Service started")
})

const logo: string = "New Project"
