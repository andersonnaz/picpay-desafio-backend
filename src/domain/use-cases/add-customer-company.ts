import { HashGenerator } from "../../data/protocols/cryptography/hash-generator"
import { AddCustomerCompanyRepository } from "../../data/protocols/db/customer-company/add-customer-company-repository"

export interface AddCustomerCompany {
    add(customerData: AddCustomerCompany.Params): Promise<AddCustomerCompany.Result>
}

export namespace AddCustomerCompany {
    export type Params = {
        name: string
        email: string
        password: string
        cnpj: string
        accessToken: string
    }

    export type Result = {
        id: string
        name: string
        email: string
        cnpj: string
        accessToken: string
    } | undefined

    export type Dependencies = {
        customerCompanyRepository: AddCustomerCompanyRepository
        hashService: HashGenerator
    }
}
