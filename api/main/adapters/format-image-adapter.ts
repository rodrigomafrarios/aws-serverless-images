import { FormatImage } from '@/data/interfaces/format'
import imageThumbnail from 'image-thumbnail'

export class FormatImageAdapter implements FormatImage {
  async createThumbnail (base64: Buffer): Promise<Buffer> {
    const buffer = await imageThumbnail(base64)
    return buffer
  }
}
