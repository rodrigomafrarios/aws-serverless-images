export interface ThumbnailValidator {
	isValid: (bucket: string, key: string) => boolean
}
