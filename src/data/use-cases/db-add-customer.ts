import { AddCustomer } from "../../domain/use-cases/add-customer";
import { HashGenerator } from "../protocols/cryptography/hash-generator";
import { AddCustomerRepository } from "../protocols/db/customer/add-customer-repository";

export class DbAddCustomer implements AddCustomer{
    private readonly customerRepository: AddCustomerRepository
    private readonly hashService: HashGenerator

    constructor({customerRepository, hashService}: AddCustomer.Dependencies){
        this.customerRepository = customerRepository
        this.hashService = hashService
    }

    async add(customerData: AddCustomer.Params): Promise<AddCustomer.Result> {
        await this.hashService.hash({ value: customerData.password })
        return new Promise(resolve => resolve(null))
    }
}