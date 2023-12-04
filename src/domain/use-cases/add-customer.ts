import { HashGenerator } from "../../data/protocols/cryptography/hash-generator"
import { AddCustomerRepository } from "../../data/protocols/db/customer/add-customer-repository"

export interface AddCustomer {
    add(customerData: AddCustomer.Params): Promise<AddCustomer.Result>
}

export namespace AddCustomer {
    export type Params = {
        name: string
        email: string
        password: string
        cpf: string
        accessToken: string
    }

    export type Result = {
        id: string
        name: string
        email: string
        password: string
        cpf: string
        accessToken: string
    } | undefined

    export type Dependencies = {
        customerRepository: AddCustomerRepository
        hashService: HashGenerator
    }
}
