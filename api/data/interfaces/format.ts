export interface FormatImage {
  createThumbnail: (image: any) => Promise<Buffer>
}
