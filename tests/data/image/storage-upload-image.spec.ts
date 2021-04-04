import { UploadImageRepository } from '@/data/interfaces/storage/image/upload-image-repository'
import { StorageUploadImage } from '@/data/usecases/image/storage-upload-image'

type SutTypes = {
  sut: StorageUploadImage
  uploadImageRepositoryStub: UploadImageRepository
}

const mockUploadImageRepository = (): UploadImageRepository => {
  class UploadImageRepositoryStub implements UploadImageRepository {
    async upload (image: any): Promise<void> {}
  }
  return new UploadImageRepositoryStub()
}

const makeSut = (): SutTypes => {
  const uploadImageRepositoryStub = mockUploadImageRepository()
  const sut = new StorageUploadImage(uploadImageRepositoryStub)
  return {
    sut,
    uploadImageRepositoryStub
  }
}

describe('StorageUploadImage - Usecase', () => {
  test('Should call UploadImageRepository with correct values', async () => {
    const { sut, uploadImageRepositoryStub } = makeSut()
    const uploadImageSpy = jest.spyOn(uploadImageRepositoryStub, 'upload')
    await sut.upload({
      bucket: 'any-bucket',
      key: 'any-key',
      body: 'any-body'
    })
    expect(uploadImageSpy).toHaveBeenCalledWith({
      bucket: 'any-bucket',
      key: 'any-key',
      body: 'any-body'
    })
  })
})
