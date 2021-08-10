import { Controller } from '@/presentation/interfaces/controller'
import { CreateThumbnailController } from '@/presentation/controllers/thumbnail/create-thumbnail-controller'
import { makeLogControllerDecorator } from '../log/log-controller-decorator-factory'
import { makeStorageCreateThumbnail } from '../../usecases/storage-create-thumbnail-factory'

export const makeCreateThumbnailController = (): Controller => {
  const controller = new CreateThumbnailController(makeStorageCreateThumbnail())
  return makeLogControllerDecorator(controller)
}
