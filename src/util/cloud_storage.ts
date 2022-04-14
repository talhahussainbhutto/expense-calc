import { Storage, File } from "@google-cloud/storage"
import config from "./config"
import path from "path"
import { UniverseLogger } from "../universe/universe_logger"

const GCS_URL = "https://storage.googleapis.com/"

export class CloudStorage {
  storage: Storage
  bucketName: string = config.googleCloudStorage.bucketName
  constructor() {
    this.storage = new Storage({
      keyFilename: path.resolve(config.googleCloudStorage.keyFilename)
    })
  }
  async deleteImage(url: any) {
    const fileName = url.slice(GCS_URL.length + this.bucketName.length + 1)
    try {
      await this.storage.bucket(this.bucketName).file(fileName).delete()
    } catch (error) {
      throw new Error(error)
    }
  }

  removeRoot(pathName: string) {
    const uploadPath: string = pathName.replace(
      path.resolve(`${config.uploadPath}`) + "/",
      ""
    )
    return uploadPath as string
  }
  async upload(filename: any): Promise<string> {
    this.logMessage(
      `\nUploading ${filename} to ${this.bucketName}... -> ${this.removeRoot(
        filename
      )}`,
      "upload"
    )
    try {
      const response = await this.storage
        .bucket(this.bucketName)
        .upload(filename, {
          destination: this.removeRoot(filename),
          gzip: true,
          metadata: {
            cacheControl: "no-cache"
          },
          resumable: false
        })
      this.logMessage(`Upload complete  ✔︎`, "upload")

      const file = response[0] as File
      return `https://storage.googleapis.com/${this.bucketName}/${file.name}`
    } catch (error) {
      UniverseLogger.error({
        type: "Cloud-Upload",
        error,
        name: "upload",
        audit: false
      })
    }
  }

  async uploadFromBuffer(filename: string, data: string): Promise<string> {
    this.logMessage(
      `\nUploading ${filename} to ${this.bucketName}...`,
      "upload"
    )
    try {
      const file = this.storage
        .bucket(this.bucketName)
        .file(this.removeRoot(filename))
      const imageBuffer = Buffer.from(
        data.replace(/^data:image\/\w+;base64,/, ""),
        "base64"
      )
      await file.save(imageBuffer)
      this.logMessage(`Upload complete  ✔︎`, "upload")
      return `${GCS_URL}${this.bucketName}/${file.name}`
    } catch (error) {
      UniverseLogger.error({
        type: "CloudUpload",
        message: error.stack ? error.stack : error.toString(),
        name: "upload",
        audit: false
      })
    }
  }

  async download(file: string): Promise<any> {
    const filename: string = file.replace(
      `https://storage.googleapis.com/${this.bucketName}/`,
      ""
    )
    const expires = new Date()
    expires.setHours(expires.getHours() + 24)
    const config: any = {
      action: "read",
      expires
    }
    const [url] = await this.storage
      .bucket(this.bucketName)
      .file(filename)
      .getSignedUrl(config)

    return url
  }

  logMessage(message: string, name: string) {
    UniverseLogger.info({
      type: "CloudUpload",
      name,
      message,
      audit: false
    })
  }
}
