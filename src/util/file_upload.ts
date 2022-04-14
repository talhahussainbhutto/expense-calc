import config from "./config"
import { createWriteStream } from "fs-extra"
import path from "path"
import { CloudStorage } from "./cloud_storage"
import fs, { mkdirSync } from "fs"
import { ValidationError } from "apollo-server"

export const MimeTypes = Object.freeze({
  image: ["image/jpeg", "image/png", "image/gif"],
  csv: ["text/csv", "application/vnd.ms-excel"]
})
export class FileUpload {
  cloudStorage: CloudStorage
  pathname: string
  constructor(folder: string) {
    this.cloudStorage = new CloudStorage()
    const pathList = folder.split("/")
    pathList[0] = `${pathList[0]}-${config.name}`
    const folderPath = pathList.join("/")
    this.pathname = path.resolve(`${config.uploadPath}/${folderPath}`)
    if (!fs.existsSync(this.pathname))
      mkdirSync(this.pathname, { recursive: true })
  }

  validateFile(mimeTypes: string[], mimeType: string) {
    if (!mimeTypes.includes(mimeType))
      throw new ValidationError("Invalid File Format")
  }
  async uploadFile(createReadStream: any, filename: any): Promise<string> {
    const paths = filename.split(".")
    const uploadName = `${Date.now()}.${paths[paths.length - 1]}`
    const uploadedPathname = `${this.pathname}/${uploadName}`

    await new Promise((res) =>
      createReadStream()
        .pipe(createWriteStream(`${this.pathname}/${uploadName}`))
        .on("close", res)
    )
    const url = await this.cloudStorage.upload(uploadedPathname)
    return url
  }
  async uploadImage(image: any, destinationFileName?: string) {
    const { createReadStream, filename, mimetype } = await image
    this.validateFile(MimeTypes.image, mimetype)
    if (destinationFileName)
      destinationFileName = `${destinationFileName}.${filename
        .split(".")
        .pop()}`
    return await this.uploadFile(
      createReadStream,
      destinationFileName || filename
    )
  }
}
