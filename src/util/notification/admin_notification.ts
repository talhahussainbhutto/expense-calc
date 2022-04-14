import { Transponder } from "./../../engines/transponder"
import { AdminTemplate } from "./email_templates/admin_template"
import config from "../config"
import { Merchant } from "../../models/merchant"

export class AdminNotification {
  async failedProducts({
    products,
    merchant
  }: {
    products: any
    merchant: Merchant
  }): Promise<boolean> {
    if (products.length === 0) return false
    const adminEmailTemplate = new AdminTemplate("Chikoo Admin")
    const body: string[] = products.map(
      (fail: any) => `<tr>
          <td style="border: 1px solid black;border-collapse: collapse; padding: 5px;">${fail.gtin}</td>
          <td style="border: 1px solid black;border-collapse: collapse; padding: 5px;">${fail.price}</td>
          </tr>`
    )

    const template = adminEmailTemplate.getProductFailed({
      body: body.join(" "),
      merchant: merchant.storeName
    })
    void new Transponder().sendEmail({
      emails: config.emails,
      template,
      subject: "Failed Products"
    })
    return true
  }
}
