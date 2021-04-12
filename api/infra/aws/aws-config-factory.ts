import AWS from 'aws-sdk'

export const S3ClientFactory = (options: any) => {
  return new AWS.S3(options)
}
