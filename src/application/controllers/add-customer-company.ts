import { AddCustomerCompany } from "../../domain/use-cases/add-customer-company";
import { ConflictCustomerError } from "../errors/conflict-customer-error";
import { HttpRequest, HttpResponse, conflict, serverError } from "../helpers/http";
import { Controller } from "../protocols/controller";

export class AddCustomerCompanyController implements Controller {
    private readonly addCustomerCompany: AddCustomerCompany

    constructor({addCustomerCompany}: AddCustomerCompanyController.Dependencies){
        this.addCustomerCompany = addCustomerCompany
    }

    async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
        try {
            const { name, email, password, cnpj, accessToken } = httpRequest.body
            const customerCompany = await this.addCustomerCompany.add({name, email, password, cnpj, accessToken})
            if(!customerCompany){
                return conflict(new ConflictCustomerError())
            }
        } catch (error) {
            return serverError(error as Error)
        }
    }
}

export namespace AddCustomerCompanyController {
    export type Dependencies = {
        addCustomerCompany: AddCustomerCompany
    }
}
