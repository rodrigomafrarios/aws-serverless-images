export interface ThumbnailValidator {
	isValid: (bucket: string, key: string) => Promise<boolean>
}
