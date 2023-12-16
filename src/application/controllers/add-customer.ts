import { AddCustomer } from "../../domain/use-cases/add-customer";
import { ConflictCustomerError } from "../errors/conflict-customer-error";
import { ServerError } from "../errors/server-error";
import { HttpRequest, HttpResponse, conflict, serverError } from "../helpers/http";
import { Controller } from "../protocols/controller";

export class AddCustomerController implements Controller {
    private readonly addCustomer: AddCustomer

    constructor({addCustomer}:AddCustomerController.Dependencies){
        this.addCustomer = addCustomer
    }

    async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
        try {
            const { name, email, cpf, password, accessToken } = httpRequest.body
            const customer = await this.addCustomer.add({
                name,
                email,
                password,
                cpf,
                accessToken
            })
            if(!customer) {
                return conflict(new ConflictCustomerError())
            }
        } catch (error) {
            return serverError(error as Error)
        }
    }
}

export namespace AddCustomerController {
    export type Dependencies = {
        addCustomer: AddCustomer
    }
}
