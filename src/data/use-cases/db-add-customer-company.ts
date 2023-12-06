import { AddCustomerCompany } from "../../domain/use-cases/add-customer-company";
import { HashGenerator } from "../protocols/cryptography/hash-generator";
import { AddCustomerCompanyRepository } from "../protocols/db/customer-company/add-customer-company-repository";

export class DbAddCustomerCompany implements AddCustomerCompany {
    private readonly customerCompanyRepository: AddCustomerCompanyRepository
    private readonly hashService: HashGenerator

    constructor({customerCompanyRepository, hashService}: AddCustomerCompany.Dependencies){
        this.customerCompanyRepository = customerCompanyRepository
        this.hashService = hashService
    }

    async add(customerData: AddCustomerCompany.Params): Promise<AddCustomerCompany.Result> {
        const hashedPassword = await this.hashService.hash({ value: customerData.password })
        return await this.customerCompanyRepository.add(Object.assign({}, customerData, { password: hashedPassword } ))
    }
}
