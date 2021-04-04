export interface UploadImageRepository {
  upload: (image: any) => Promise<void>
}
