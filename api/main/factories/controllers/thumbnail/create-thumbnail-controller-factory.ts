import { Controller } from '@/presentation/interfaces/controller'
import { makeLogControllerDecorator } from '../../../../main/factories/controllers/log/log-controller-decorator-factory'
import { CreateThumbnailController } from '@/presentation/controllers/thumbnail/create-thumbnail-controller'
import { makeStorageCreateThumbnail } from '../../usecases/storage-create-thumbnail-factory'

export const makeCreateThumbnailController = (): Controller => {
  const controller = new CreateThumbnailController(makeStorageCreateThumbnail())
  return makeLogControllerDecorator(controller)
}
