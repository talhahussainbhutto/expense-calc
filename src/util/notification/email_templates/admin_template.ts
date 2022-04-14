import { readFileSync } from "fs-extra"
import path from "path"
export class AdminTemplate {
  constructor(private from_name: string) {}
  private variableMapper: any = {
    $FROM_NAME: this.from_name
  }

  private mapVariables(incomingFile: string) {
    Object.keys(this.variableMapper).forEach(
      (key: any) =>
        (incomingFile = incomingFile.replace(key, this.variableMapper[key]))
    )
    return incomingFile
  }
  private getTemplate(template: string) {
    return readFileSync(path.resolve(__dirname, template), { encoding: "utf8" })
  }
  getProductFailed({ body, merchant }: { body: string; merchant: string }) {
    const file: string = this.getTemplate("./html_templates/products.html")
    this.variableMapper["$BODY"] = body
    this.variableMapper["$MERCHANT"] = merchant
    return this.mapVariables(file)
  }
}
