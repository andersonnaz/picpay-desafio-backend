export interface AddCustomerCompanyRepository {
    add(params: AddCustomerCompanyRepository.Params): Promise<AddCustomerCompanyRepository.Result>
}

export namespace AddCustomerCompanyRepository {
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
    } | undefined
}
