import { formatJSONResponse } from '@/libs/apiGateway'
import { Controller } from '@/presentation/interfaces/controller'
import { HttpRequest, HttpResponse } from '@/presentation/interfaces/http'

export const lambdaAdapt = (controller: Controller) => {
	return async (data: any) => {
		const httpRequest: HttpRequest = {
			body: data
		}
		const httpResponse: HttpResponse = await controller.handle(httpRequest)
		return formatJSONResponse(httpResponse)
	}
}
