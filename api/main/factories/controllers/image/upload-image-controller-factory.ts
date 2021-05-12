import { UploadImageController } from '@/presentation/controllers/image/upload-image-controller'
import { Controller } from '@/presentation/interfaces/controller'
import { makeStorageUploadImage } from '@/main/factories/usecases/storage-upload-image-factory'
import { ImageValidatorAdapter } from '@/utils/image-validator-adapter'
import { makeLogControllerDecorator } from '@/main/factories/controllers/log/log-controller-decorator-factory'

export const makeUploadImageController = (): Controller => {
  const imageValidator = new ImageValidatorAdapter()
  const controller = new UploadImageController(makeStorageUploadImage(), imageValidator)
  return makeLogControllerDecorator(controller)
}
