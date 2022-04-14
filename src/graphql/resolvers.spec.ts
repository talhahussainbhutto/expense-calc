import { Mocks } from "../util/spec_helpers"
import { Universe } from "../universe/universe"
import resolvers from "./resolvers"
import { Entry } from "../graph/Entry"
import { reject } from "lodash"

jest.mock("../graph/Entry")
const graph = Universe.getGraph()
describe("resolvers", () => {
  beforeAll(() => {
    Fixtures.build()
  })
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("add Entry", async () => {
    const entry = await resolvers.Mutation.addEntry(
      {},
      {
        entryType: "income",
        title: "salary",
        amount: 122.5,
      },
      { graph }
    )
    expect(Entry.addEntry).toHaveBeenCalledTimes(1)
    expect(entry.bvid).toBe("Test1")
  })

  it("Update Entry", async () => {
    const entry = await resolvers.Mutation.updateEntry(
      {},
      {
        uid: "0x3",
        title: "salary",
        amount: 122.5,
      },
      { graph }
    )
    expect(Entry.updateEntry).toHaveBeenCalledTimes(1)
    expect(entry.bvid).toBe("Test4")
  })

  it("delete Entry", async () => {
    const entry = await resolvers.Mutation.deleteEntry(
      {},
      {
        bvid: "123abc",
      },
      { graph }
    )
    expect(Entry.deleteEntries).toHaveBeenCalledTimes(1)
    expect(entry.bvid).toBe("Test5")
  })

  it("Get all entries", async () => {
    const entry = await resolvers.Query.allEntries({}, {}, { graph })
    expect(Entry.getAllEntries).toHaveBeenCalledTimes(1)
    expect(entry[0].bvid).toBe("Test2")
  })

  it("Get entries by type", async () => {
    const entry = await resolvers.Query.entryBasedOnType(
      {},
      { entryType: "income" },
      { graph }
    )
    expect(Entry.getEntryBasedOnEntryType).toHaveBeenCalledTimes(1)
    expect(entry[0].bvid).toBe("Test3")
  })

  it("Get total by type", async () => {
    const entry = await resolvers.Query.totalOfAType(
      {},
      { entryType: "income" },
      { graph }
    )
    expect(Entry.getTotalOnEntryType).toHaveBeenCalledTimes(1)
    expect(entry.total).toBe(30000)
  })

  it("Get total", async () => {
    const entry = await resolvers.Query.total({}, {}, { graph })
    expect(Entry.getGrandTotal).toHaveBeenCalledTimes(1)
    expect(entry.total).toBe(50000)
  })
})

const Fixtures = {
  build: async () => {
    ;(Entry.addEntry = jest.fn(
      async () =>
        new Promise<Entry>((resolve, reject) => {
          const entry = new Entry()
          entry.bvid = "Test1"
          resolve(entry)
        })
    )),
      (Entry.updateEntry = jest.fn(
        async () =>
          new Promise<Entry>((resolve, reject) => {
            const entry = new Entry()
            entry.bvid = "Test4"
            resolve(entry)
          })
      )),
      (Entry.deleteEntries = jest.fn(
        async () =>
          new Promise<{ bvid: string }>((resolve, reject) => {
            resolve({ bvid: "Test5" })
          })
      )),
      (Entry.getAllEntries = jest.fn(
        async () =>
          new Promise<Entry[]>((resolve, reject) => {
            const entry = new Entry()
            entry.bvid = "Test2"
            resolve([entry])
          })
      )),
      (Entry.getEntryBasedOnEntryType = jest.fn(
        async () =>
          new Promise<Entry[]>((resolve, reject) => {
            const entry = new Entry()
            entry.bvid = "Test3"
            resolve([entry])
          })
      )),
      (Entry.getTotalOnEntryType = jest.fn(
        async () =>
          new Promise<{ total: number }>((resolve, reject) => {
            resolve({ total: 30000 })
          })
      )),
      (Entry.getGrandTotal = jest.fn(
        async () =>
          new Promise<{ total: number }>((resolve, reject) => {
            resolve({ total: 50000 })
          })
      ))
  },
}
