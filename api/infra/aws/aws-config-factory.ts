import AWS from 'aws-sdk'

export const S3ClientFactory = (options: any) => {
  AWS.config.update({
    region: process.env.AWS_REGION
  })
  return new AWS.S3(options)
}
