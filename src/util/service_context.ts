import { Authorization } from "../util/authorization"
import winston from "winston"

export interface ServiceContext {
  auth: Authorization
  logger: winston.Logger
}
