import Gverse from "gverse"
import configuration from "../util/config"
import debug from "debug"
import { indices } from "./dgraph_indices"
import { types } from "./dgraph_types/dgraph_types"
import _ from "lodash"

const log = debug("Universe")

export namespace Universe {
  /** This represents the Brandverse universe */
  export class Graph extends Gverse.Graph {
    /** Indices needed across all vertices */
    indices = indices
    types = types
  }
  export interface LinkIdentity {
    type: string
    uid: string
  }

  export class Vertex extends Gverse.Vertex {
    type = Vertex.name
    createdAt: number = 0
    updatedAt: number = 0

    constructor(graph: Graph = defaultGraph) {
      super()
      this._graph = graph
    }

    async beforeCreate(): Promise<any> {
      this.createdAt = (Date.now() / 1000) | 0
    }
    async beforeUpdate(): Promise<any> {
      this.updatedAt = (Date.now() / 1000) | 0
    }

    // /** Get the UID for given bvid */
    // static async uidFor(bvid: string, graph: Universe.Graph) {
    //   const result = await graph
    //     .newTransaction(true)
    //     .query(
    //       `{ uidMap(func:eq(bvid, "${bvid}")) @filter(type(${this.name})) { uid } }`
    //     )
    //   return result?.uidMap?.pop()?.uid || undefined
    // }

    /** Get the type and UID of the vertex for shallow linking */
    linkIdentity(): LinkIdentity {
      return { type: this.type, uid: this.uid }
    }
  }

  export enum ActivityAction {
    Created,
    Updated,
    Deleted,
  }

  export function newConnection() {
    return new Gverse.Connection({
      host: "localhost",
      port: 9130,
      debug: false,
    })
  }

  export const defaultConnection = newConnection()
  export const defaultGraph = new Graph(defaultConnection)

  export function getGraph(connection?: Gverse.Connection) {
    return new Graph(connection || newConnection())
    // uncomment below to reuse graph
    // return defaultGraph
  }
}

export interface Uid {
  uid: string
}
