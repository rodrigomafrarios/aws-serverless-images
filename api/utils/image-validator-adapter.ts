import { ImageValidator } from '@/presentation/interfaces/image-validator'

export class ImageValidatorAdapter implements ImageValidator {
  isValid (image: Buffer): boolean {
    const isBufferValid = Buffer.byteLength(image) > 0 && Buffer.byteLength(image) <= 1048576
    return isBufferValid
  }
}
