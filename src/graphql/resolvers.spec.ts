import { Mocks } from "../util/spec_helper"
import resolvers from "./resolvers"

describe("resolvers", () => {
  it("ping", async () => {
    const ping = await resolvers.Query.ping({}, {}, Mocks.context())
    expect(ping.name).toBe(process.env.npm_package_name)
    expect(ping.uptime).toBeGreaterThan(0)
    expect(ping.location).toBe("localhost")
  })
})
