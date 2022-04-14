import { Mocks } from "../util/spec_helpers"
import { Universe } from "../universe/universe"
import { Entry } from "./Entry"

const graph = Universe.getGraph()

describe("Entry", () => {
  //   beforeAll(async () => {
  //     await graph.connect()
  //     await Fixtures.clear()
  //     await Fixtures.build()
  //   })
  //   afterAll(async () => {
  //     await graph.disconnect()
  //   })
  it("add Entry", async () => {
    const res = await Entry.addEntry(
      {
        title: "Cover for old bike",
        amount: 300,
        entryType: "expense",
      },
      graph
    )
    expect(res).toBeDefined()
    expect(res.title).toBe("Cover for old bike")
  })

  it("update Entry", async () => {
    const res = await Entry.addEntry(
      {
        title: "Cover for old bike",
        amount: 300,
        entryType: "expense",
      },
      graph
    )
    expect(res).toBeDefined()
    expect(res.title).toBe("Cover for old bike")
  })

  it("gets all entries", async () => {
    const res = await Entry.getAllEntries(graph)
    expect(res).toBeDefined()
    expect(res.length).toBe(3)
  })
})

const Fixtures: any = {
  clear: async () => {
    await Mocks.clearVertices(graph, [Entry.name])
  },
  build: async () => {
    const mutation = {
      "dgraph.type": Entry.name,
      bvid: "entry1",
      title: "entry1",
      amount: 100,
    }

    await graph.newTransaction(true).mutate(mutation)
    Fixtures.entry1 = await graph.first(Entry, {
      predicate: "bvid",
      value: "entry1",
    })
    ;[Fixtures.entry1, Fixtures.entry2, Fixtures.entry3] = await Promise.all([
      graph.first(Entry, {
        predicate: "bvid",
        value: "entry1",
      }),
      graph.first(Entry, {
        predicate: "bvid",
        value: "entry2",
      }),
      graph.first(Entry, {
        predicate: "bvid",
        value: "entry3",
      }),
    ])
  },
}
