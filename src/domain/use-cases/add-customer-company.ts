import { HashGenerator } from "../../data/cryptography/hash-generator"
import { AddCustomerRepository } from "../../data/protocols/db/customer/add-customer-repository"

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
        password: string
        cnpj: string
        accessToken: string
    } | undefined

    export type Dependencies = {
        customerRepository: AddCustomerRepository
        hashService: HashGenerator
    }
}
