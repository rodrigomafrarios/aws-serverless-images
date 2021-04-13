import { ImageValidatorAdapter } from '@/utils/image-validator-adapter'
import * as path from 'path'
import * as fs from 'fs'

const image = fs.readFileSync(path.resolve(path.join(__dirname,'../presentation/mocks/image.png')))
const imageOutOfLimitSize = fs.readFileSync(path.resolve(path.join(__dirname,'../presentation/mocks/AsterNovi-belgii-flower-1mb.jpg')))
const factory = (): ImageValidatorAdapter => {
  return new ImageValidatorAdapter()
}

describe('ImageValidator - Adapter', () => {
  test('Should return false if validator returns false', () => {
    const sut = factory()
    const isValid = sut.isValid(imageOutOfLimitSize)
    expect(isValid).toBe(false)
  })

  test('Should return true if validator returns true', () => {
    const sut = factory()
    const isValid = sut.isValid(image)
    expect(isValid).toBe(true)
  })
})
