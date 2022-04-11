import _ from "lodash"
import { ForbiddenError, AuthenticationError } from "apollo-server"

/** Move this to .env and environment variable or graph */
const SYSADMIN_TOKEN = "snmHP4AAnuYrLy7n"

// supported services
export enum Service {}
//ServiceName

export interface AuthContext {
  auth: Authorization
}

/** Handles authorization through tokens
 */
export class Authorization {
  constructor(public token: string = "") {}

  /** Fail with error if the token is not system administrator.
   * Request must have the right bearer token in authorization header.
   */
  mustBeSysAdmin() {
    if (!this.isSysAdmin()) throw new ForbiddenError("User not authorized.")
  }

  mustBeService(service: Service) {
    switch (
      service
      // case Service.ServiceName:
      //   if (this.token == SERVICE_TOKEN) return
    ) {
    }
    throw new ForbiddenError(`Service ${Service[service]} is not authorized.`)
  }

  isSysAdmin(): boolean {
    return this.token == SYSADMIN_TOKEN
  }
}
