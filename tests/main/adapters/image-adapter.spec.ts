import { imageAdapt } from '@/main/adapters/image-adapter'
import fs from 'fs'
import MockDate from 'mockdate'

const { file } = JSON.parse(fs.readFileSync('./tests/main/mocks/base64-image.json', 'utf8'))

describe('Image Adapter', () => {
  beforeAll(async () => {
    MockDate.set(new Date())
  })
  afterAll(async () => {
    MockDate.reset()
  })
  test('Should get buffer from base64 image', () => {
    const buffer = Buffer.from(file.replace(/^data:image\/\w+;base64,/, ''), 'base64')
    const type = file.split(';')[0].split('/')[1]
    const fileName = `image-${new Date().getTime()}`
    const results = imageAdapt(file)
    expect(results).toEqual({
      image: {
        Bucket: process.env.IMAGE_BUCKET,
        Key: `${fileName}.${type}`,
        ContentType: `image/${type}`,
        ContentEncoding: 'base64',
        Body: buffer
      }
    })
  })
})
