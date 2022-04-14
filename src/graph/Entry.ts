import { EPERM } from "constants"
import Gverse from "gverse"
import { Universe } from "../universe/universe"
import { v4 } from "uuid"

export class Entry extends Gverse.Vertex {
  type: string = Entry.name
  amount: number
  bvid: string = v4()
  title: string
  date_added: number
  date_lastEdit: number
  entryType: string

  // ADD an entry
  static async addEntry(
    {
      title,
      amount,
      entryType,
    }: {
      title: string
      amount: number
      entryType: string
    },
    graph: Universe.Graph
  ) {
    const entry = new Entry()
    entry.title = title
    entry.amount = amount
    entry.date_added = Date.now()
    entry.date_lastEdit = Date.now()
    entry.entryType = entryType
    return (await graph.create(entry)) as Entry
  }

  // UPDATE
  // ENTRY
  static async updateEntry(
    {
      title,
      amount,
      uid,
    }: {
      title: string
      amount: number
      uid: string
    },
    graph: Universe.Graph
  ): Promise<Entry> {
    const entry = new Entry()
    entry.title = title
    entry.amount = amount
    entry.uid = uid
    entry.date_lastEdit = Date.now()
    const records = await graph.set(uid, {
      title: title,
      amount: amount,
      date_lastEdit: Date.now(),
    })
    return entry
  }
  // GET
  // ALL
  // ENTRIES
  static async getAllEntries(graph: Universe.Graph): Promise<Entry[]> {
    const query = `{
      vertices(func:type(Entry)) {
        bvid
        title
        amount
        date_added
        date_lastEdit
        entryType
        }
      }`
    const records = await graph.query(Entry, query)
    return records as Entry[]
  }

  // GET
  //ENTRIES
  //BELONGING
  //TO
  //A
  //SPICIFIC TYPE
  static async getEntryBasedOnEntryType(
    {
      entryType,
    }: {
      entryType: string
    },
    graph: Universe.Graph
  ): Promise<Entry[]> {
    const query = `{
      vertices(func:type(Entry)) @filter(eq(entryType,"${entryType}")){
        bvid
        title
        amount
        date_added
        date_lastEdit
        entryType
        }
      }`
    const records = (await graph.query(Entry, query)) as Entry[]
    return records as Entry[]
  }

  // GET
  //ENTRIES
  //BELONGING
  //TO
  //A
  //SPICIFIC TYPE
  static async getTotalOnEntryType(
    {
      entryType,
    }: {
      entryType: string
    },
    graph: Universe.Graph
  ): Promise<{ total: number }> {
    const query = `{
      vertices(func:type(Entry)) @filter(eq(entryType,"${entryType}")){
        bvid
        title
        amount
        date_added
        date_lastEdit
        entryType
        }
      }`
    const records = (await graph.query(Entry, query)) as Entry[]
    let total = 0
    records.forEach((entry) => (total = total + entry.amount))
    // console.log(total)
    return { total }
  }

  // GET
  // TOTAL
  // OF
  // ALL
  // ENTRIES
  static async getGrandTotal(
    graph: Universe.Graph
  ): Promise<{ total: number }> {
    const query = `{
      vertices(func:type(Entry)) {
        bvid
        title
        amount
        date_added
        date_lastEdit
        entryType
        }
      }`
    const records = (await graph.query(Entry, query)) as Entry[]
    let total = 0
    records.forEach((entry) => {
      if (entry.entryType) {
        if (entry.entryType == "expense") {
          total = total - entry.amount
        } else {
          total = total + entry.amount
        }
      }
    })
    console.log(total)
    return { total }
  }

  // DELETE
  // ENTRIES
  static async deleteEntries(
    { bvid }: { bvid: string },
    graph: Universe.Graph
  ): Promise<{ bvid: string }> {
    const query = `{
  vertices(func:eq(bvid,"${bvid}")) {
    uid
    bvid
    title
    amount
    date_added
    date_lastEdit
    entryType
    }
  }`
    const instance = (await graph.query(Entry, query)) as Entry[]

    const records = await instance[0].deleteFrom(graph)
    console.log(records)
    return { bvid }
  }
}
