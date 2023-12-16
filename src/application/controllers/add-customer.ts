import { AddCustomer } from "../../domain/use-cases/add-customer";
import { ConflictCustomerError } from "../errors/conflict-customer-error";
import { HttpRequest, HttpResponse, conflict } from "../helpers/http";
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

        }
    }
}

export namespace AddCustomerController {
    export type Dependencies = {
        addCustomer: AddCustomer
    }
}
