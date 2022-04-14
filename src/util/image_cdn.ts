import { UniverseLogger } from "./../universe/universe_logger"
import ImgixClient from "@imgix/js-core"
import configurations from "../util/config"
import {
  ImageSize,
  Image
} from "../engines/product_storage/product_storage_attributes"

const imgixClient = new ImgixClient({
  domain: configurations.imgix.domain,
  secureURLToken: configurations.imgix.secureURLToken
})

export const DEFAULT_IMAGE_SIZE: ImageSize = {
  width: 300,
  dpi: 300
}

export const CHIKOO_LOGO: string =
  "https://storage.googleapis.com/flare-images/logos/Chikoo-01-white.png"
export class ImageCDN {
  static signImage(
    image: Image,
    imageSize: ImageSize = DEFAULT_IMAGE_SIZE,
    shouldWatermark: boolean = true
  ): Image {
    const width = imageSize.width
    const dpi = imageSize.dpi
    try {
      let url = image.url.split("brandverse/").pop()
      const markConfig = shouldWatermark
        ? {
            mark: "https://storage.googleapis.com/flare-images/logos/chikooWatermark.png",
            "mark-align": "bottom,right",
            "mark-w": 50
          }
        : {}
      const thumbnailConfig = {
        w: width,
        dpi: dpi,
        ...markConfig
      }

      const thumbnailUrl = imgixClient.buildURL(url, thumbnailConfig)
      url = imgixClient.buildURL(url, markConfig)

      return {
        thumbnailUrl,
        url,
        isHero: image.isHero,
        imageType: image.imageType
      }
    } catch (error) {
      UniverseLogger.error({
        type: "ProductStorage",
        name: "CDN build failed",
        message: error
      })
    }
  }
  static signImages(
    images: Image[],
    imageSize: ImageSize = DEFAULT_IMAGE_SIZE,
    filter_hero: boolean = false,
    shouldWatermark: boolean = true
  ) {
    const imagesOnly: Image[] = images.filter(
      (image) => !["video", "360"].includes(image.imageType)
    )
    let imagesToSign: Image[] = filter_hero
      ? images.filter((image) => image.isHero)
      : images
    imagesToSign =
      imagesToSign.length === 0 && filter_hero
        ? [imagesOnly.pop()]
        : imagesToSign

    return imagesToSign.map((image: Image) =>
      this.signImage(image, imageSize, shouldWatermark)
    )
  }
}
