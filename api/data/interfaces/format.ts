export interface FormatImage {
  createThumbnail: (image: string) => Promise<string>
}
