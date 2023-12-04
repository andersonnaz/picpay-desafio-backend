export interface AddCustomerRepository {
    add(customer: AddCustomerRepository.Params): Promise<AddCustomerRepository.Result>
}

export namespace AddCustomerRepository {
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
    } | undefined
}
