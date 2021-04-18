export class ParseBody {
  async toBase64 (image: any): Promise<Buffer> {
    const base64Image = Buffer.from(image.replace(/^image\/\w+;base64,/, ''), 'base64')
    return base64Image
  }
}
