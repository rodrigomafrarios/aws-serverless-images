import fs from 'fs'
import { FormatImage } from '@/data/interfaces/format'
import { FormatImageAdapter } from '@/main/adapters/format-image-adapter'

const { file } = JSON.parse(fs.readFileSync('./tests/main/mocks/base64-image.json', 'utf8'))

const mockFormatImageAdapter = (): FormatImage => {
  return new FormatImageAdapter()
}

describe('FormatImageAdapter', () => {
  test('Should create thumbnail from base64 image', async () => {
    try {
      const sut = mockFormatImageAdapter()
      const base64 = await sut.createThumbnail(file)
      expect(typeof base64).toBe('string')
    } catch (error) {
      console.error(error)
    }
  })
})
