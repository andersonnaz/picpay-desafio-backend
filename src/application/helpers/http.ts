export interface HttpRequest {
    userId?: string
    body?: any
    authorization?: any
}

export interface HttpResponse {
    statusCode: number
    body?: any
}
