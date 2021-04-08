import { ImageValidator } from '@/presentation/interfaces/image-validator'

export class ImageValidatorAdapter implements ImageValidator {
  isValid (image: any): boolean {
    return false
  }
}
