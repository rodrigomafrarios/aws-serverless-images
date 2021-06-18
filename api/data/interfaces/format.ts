export interface FormatImage {
  createThumbnail: (base64: string) => Promise<string>
}
