import { ParseBody } from '@/utils/parse-body'

const factory = (): ParseBody => {
  return new ParseBody()
}

describe('ParseBody', () => {
  test('Should parse form-data body image to base64', async () => {
    const sut = factory()
    const base64Image = Buffer.from('teste image'.replace(/^image\/\w+;base64,/, ''), 'base64')
    const results = await sut.toBase64('teste image')
    expect(results).toEqual(base64Image)
  })
})
