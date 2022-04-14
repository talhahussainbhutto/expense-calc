import { ValidationError } from "apollo-server"
const environment = process.env.NODE_ENV || "test"
// eslint-disable-next-line
const configurations = require(`../../environments/config.json`)
if (!configurations[environment])
  throw new ValidationError(
    `Configuration not found for environment: ${environment}`
  )
export default {
  ...configurations[environment],
  name: environment,
  path: `./environments/${environment}`
}
