import { FormatImage } from '@/data/interfaces/format'
import imageThumbnail from 'image-thumbnail'

export class FormatImageAdapter implements FormatImage {
  async createThumbnail (image: string): Promise<string> {
    const base64 = await imageThumbnail(image, { responseType: 'base64' })
    return base64
  }
}
