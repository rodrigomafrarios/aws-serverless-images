import { ImageValidatorAdapter } from '@/utils/image-validator-adapter'

const factory = (): ImageValidatorAdapter => {
  return new ImageValidatorAdapter()
}

describe('ImageValidator - Adapter', () => {
  test('Should return false if validator returns false', async () => {
    const sut = factory()
    const isValid = sut.isValid('')
    expect(isValid).toBe(false)
  })
})
