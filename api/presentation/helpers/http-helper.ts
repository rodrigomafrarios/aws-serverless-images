import { HttpResponse } from '@/presentation/interfaces/http'

export const badRequest = (error: Error): HttpResponse => {
	return {
		statusCode: 400,
		body: error
	}
}
