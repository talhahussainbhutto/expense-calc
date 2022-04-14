import sharp from "sharp"
import { CloudStorage } from "./cloud_storage"

interface ImageSize {
  width: any
}

const THUMBNAIL_SIZE: ImageSize = Object.freeze({
  width: 300
})

export class ImageResizer {
  image: any
  filename: string
  constructor(url: any, filename: string) {
    this.image = url
    this.filename = filename
  }

  async streamToBuffer(stream: any) {
    return new Promise((resolve: any, reject: any) => {
      let buffer = Buffer.from([])
      stream.on("data", (buf: any) => {
        buffer = Buffer.concat([buffer, buf])
      })
      stream.on("end", () => resolve(buffer))
      stream.on("error", (error: any) => reject(error))
    })
  }

  async generateThumbnail(): Promise<string> {
    const { createReadStream, filename } = await this.image
    const data = await sharp(await this.streamToBuffer(createReadStream()))
      .resize(THUMBNAIL_SIZE.width)
      .toBuffer()

    const paths = filename.split(".")
    const uploadName = `${Date.now()}.${paths[paths.length - 1]}`

    const cloudstorage = new CloudStorage()
    return cloudstorage.uploadFromBuffer(
      `${this.filename}/thumbnails/${uploadName}`,
      data.toString("base64")
    )
  }
}
