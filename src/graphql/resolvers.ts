import lodash from "lodash"
import config from "../util/config"
import fs from "fs-extra"
import { ServiceContext } from "../util/service_context"

const SystemResolvers = {
  Query: {
    ping: (root: any, args: any, context: ServiceContext) => {
      context.logger.info("Pinged")
      return {
        name: process.env.npm_package_name,
        location: config.apollo.hostname,
        version: process.env.npm_package_version,
        uptime: process.uptime()
      }
    },
    logs: (root: any, args: any, context: ServiceContext): any[] => {
      context.auth.mustBeSysAdmin()
      const logContents = fs.readFileSync("logs/service.log")
      // format logs for JSON response
      const json =
        "[" +
        logContents
          .toString()
          .trim()
          .split("\n")
          .join(",") +
        "]"
      return JSON.parse(json)
    }
  }
}

// add additional resolvers here
const resolvers = lodash.merge(SystemResolvers)

export default resolvers
