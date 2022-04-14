import lodash from "lodash"
import fs from "fs-extra"
import { Entry } from "../graph/Entry"
import Gverse from "gverse"
import { Universe } from "../universe/universe"

const SystemResolvers = {
  Query: {
    allEntries: async (root: any, args: any, { graph }: any) => {
      return await Entry.getAllEntries(graph)
    },
    entryBasedOnType: async (
      root: any,
      args: { entryType: string },
      { graph }: any
    ) => {
      const { entryType } = args
      return await Entry.getEntryBasedOnEntryType({ entryType }, graph)
    },
    totalOfAType: async (
      root: any,
      args: { entryType: string },
      { graph }: any
    ) => {
      const { entryType } = args
      return await Entry.getTotalOnEntryType({ entryType }, graph)
    },
    total: async (root: any, args: any, { graph }: any) => {
      return await Entry.getGrandTotal(graph)
    },
  },
  Mutation: {
    addEntry: async (
      root: any,
      {
        entryType,
        title,
        amount,
      }: { entryType: string; title?: string; amount: number },
      { graph }: { graph: Universe.Graph }
    ): Promise<any> => {
      return await Entry.addEntry({ title, amount, entryType }, graph)
    },
    updateEntry: async (
      root: any,
      { uid, title, amount }: { uid: string; title: string; amount: number },
      { graph }: { graph: Universe.Graph }
    ): Promise<any> => {
      return await Entry.updateEntry({ title, amount, uid }, graph)
    },
    deleteEntry: async (
      root: any,
      { bvid }: { bvid: string },
      { graph }: { graph: Universe.Graph }
    ): Promise<any> => {
      return await Entry.deleteEntries({ bvid }, graph)
    },
  },
}

// add additional resolvers here
const resolvers = lodash.merge(SystemResolvers)

export default resolvers
