import { Authorization } from "../util/authorization"
import winston = require("winston")
import { Universe } from "../universe/universe"
import Gverse from "gverse"

export interface ServiceContext {
  auth: Authorization
  logger?: winston.Logger
  graph: Universe.Graph
}

export namespace Mocks {
  export enum Role {
    SysAdmin,
    Service,
    User
  }

  export function auth(role: Role): Authorization {
    const mockAuth: any = {}
    switch (role) {
      case Role.SysAdmin:
        mockAuth.additionalHeaders = {
          clientBvid: "",
          merchantSlug: "",
          verificationToken: ""
        }
        mockAuth.isSysAdmin = jest.fn(() => true)
        mockAuth.isValid = jest.fn(() => true)
        mockAuth.hasMerchantSlug = jest.fn(() => true)
        mockAuth.mustBeLoggedIn = jest.fn(() => true)
        mockAuth.mustBeSysAdmin = jest.fn(() => true)
        mockAuth.mustBeServiceOrAdmin = jest.fn()
        break
      case Role.Service:
        mockAuth.additionalHeaders = {
          clientBvid: "",
          merchantSlug: "",
          verificationToken: ""
        }
        mockAuth.mustBeServiceOrAdmin = jest.fn(() => true)
        break
      case Role.User:
        mockAuth.additionalHeaders = {
          clientBvid: "",
          merchantSlug: "",
          verificationToken: ""
        }
        mockAuth.isService = jest.fn(() => true)
        mockAuth.validate = jest.fn(() => true)
        mockAuth.isUserType = jest.fn(() => true)
        mockAuth.user = { bvid: "1234" }
        mockAuth.hasMerchantSlug = jest.fn(() => true)
        mockAuth.isSysAdmin = jest.fn(() => true)
        mockAuth.mustBeLoggedIn = jest.fn(() => true)
        mockAuth.isManagerOrOwner = jest.fn()
        mockAuth.isMerchant = jest.fn()
        break
    }
    return mockAuth
  }

  export function logger(): winston.Logger {
    const mockLogger: any = {}
    mockLogger.info = jest.fn(() => undefined)
    mockLogger.log = jest.fn(() => undefined)
    mockLogger.debug = jest.fn(() => undefined)
    mockLogger.warn = jest.fn(() => undefined)
    return mockLogger
  }

  export function serviceContext(): ServiceContext {
    return {
      auth: auth(Role.Service),
      logger: logger(),
      graph: Universe.getGraph()
    }
  }

  export function userContext(): ServiceContext {
    return {
      auth: auth(Role.User),
      logger: logger(),
      graph: Universe.getGraph()
    }
  }
  export function sysAdminContext(): ServiceContext {
    return {
      auth: auth(Role.SysAdmin),
      logger: logger(),
      graph: Universe.getGraph()
    }
  }

  export function context(): ServiceContext {
    return {
      auth: {} as Authorization,
      logger: logger(),
      graph: Universe.getGraph()
    }
  }

  const SpecSpacing: number =
    (process.env["SPEC_SPACING"] &&
      parseInt(process.env["SPEC_SPACING"] || "10")) ||
    100

  export async function clearVertices(graph: Gverse.Graph, vertices: string[]) {
    for (const vertex of vertices) {
      await graph.clear(vertex)
    }
    await new Promise((r) => setTimeout(r, SpecSpacing))
  }
}
