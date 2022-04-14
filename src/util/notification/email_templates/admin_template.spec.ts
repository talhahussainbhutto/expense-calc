import { AdminTemplate } from "./admin_template"

describe(AdminTemplate.name, () => {
  it("gets failed products template", () => {
    const emailTemplate: AdminTemplate = new AdminTemplate("Chikoo Admin")
    const email: string = emailTemplate.getProductFailed({
      body: "body",
      merchant: "merchant"
    })
    expect(email.indexOf("body")).toBeGreaterThan(-1)
    expect(email.indexOf("merchant")).toBeGreaterThan(-1)
  })
})
