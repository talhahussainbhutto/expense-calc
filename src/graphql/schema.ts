import { gql } from "apollo-server"

export default gql`
  enum EntryTypes {
    expense
    income
    asset
  }
  type Entry {
    title: String
    date_added: String
    bvid: String!
    amount: Float
    entryType: EntryTypes
    date_lastEdit: String
  }

  type TotalResult {
    total: Float
  }

  type BVID {
    bvid: String
  }

  type Query {
    allEntries: [Entry]
    entryBasedOnType(entryType: String): [Entry]
    totalOfAType(entryType: String): TotalResult
    total: TotalResult
  }
  type Mutation {
    addEntry(entryType: String, title: String, amount: Float): Entry
    updateEntry(uid: ID, title: String, amount: Float): Entry
    deleteEntry(bvid: String): BVID
  }
`
