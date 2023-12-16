import { HttpRequest, HttpResponse } from "../helpers/http";

export interface Controller {
    handle(httpRequest: HttpRequest): Promise<HttpResponse>
}
