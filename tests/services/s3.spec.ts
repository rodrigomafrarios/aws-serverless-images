import * as AWSMock from 'aws-sdk-mock'
import * as AWS from 'aws-sdk'
import S3 from 'aws-sdk/clients/s3'
import path from 'path'
import fs from 'fs'

const s3ParamsMock = (): S3.Types.PutObjectRequest => ({
  Body: Buffer.from(fs.readFileSync(path.resolve(path.join(__dirname,'../presentation/mocks/image.png')))),
  Bucket: 'any-bucket',
  Key: 'any-image.png'
})

describe('S3 Service', () => {
  test('Should upload image on success', async () => {
    const { Body } = s3ParamsMock()
    AWSMock.mock('S3', 'putObject', Body)
    const client = new AWS.S3({ apiVersion: '2012-08-10' })
    const results = await client.putObject(s3ParamsMock()).promise()
    expect(results).toEqual(Body)
  })
})
