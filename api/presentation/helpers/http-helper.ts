import { HttpResponse } from '@/presentation/interfaces/http'
import { ServerError } from '../errors/server-error'

export const badRequest = (error: Error): HttpResponse => {
	return {
		statusCode: 400,
		body: error
	}
}

export const serverError = (error: Error): HttpResponse => {
	return {
		statusCode: 500,
		body: new ServerError(error.stack)
	}
}

export const noContent = (): HttpResponse => {
	return {
		statusCode: 204,
		body: null
	}
}

export const created = (): HttpResponse => {
	return {
		statusCode: 201,
		body: null
	}
}
