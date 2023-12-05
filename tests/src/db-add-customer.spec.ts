import { HashGenerator } from "../../src/data/protocols/cryptography/hash-generator";
import { AddCustomerRepository } from "../../src/data/protocols/db/customer/add-customer-repository";
import { DbAddCustomer } from "../../src/data/use-cases/db-add-customer";
import { AddCustomer } from "../../src/domain/use-cases/add-customer";

describe('DbAddCustomer use case', () => {
    describe('HashService', () => {
        test('should call hash method with correct password', async () => {
            class HashGeneratorStub implements HashGenerator {
                hash(value: HashGenerator.Params): Promise<string> {
                    return new Promise(resolve => resolve('hashed_password'))
                }
            }

            class CustomerRepositoryStub implements AddCustomerRepository {
                add(customer: AddCustomerRepository.Params): Promise<AddCustomerRepository.Result> {
                    return new Promise(resolve => resolve({
                        id: 'any_id',
                        name: 'any_name',
                        email: 'any_email@mail.com',
                        password: 'hashed_password',
                        cpf: 'any_cpf'
                    }))
                }
            }

            const hashServiceStub = new HashGeneratorStub()
            const customerRepositoryStub = new CustomerRepositoryStub()
            const dependencies: AddCustomer.Dependencies = {
                hashService: hashServiceStub,
                customerRepository: customerRepositoryStub
            }
            const sut = new DbAddCustomer(dependencies)

            const hashServiceSpy = jest.spyOn(hashServiceStub, 'hash')
            await sut.add({
                name: 'any_name',
                email: 'any_email@mail.com',
                password: 'any_password',
                cpf: 'any_cpf',
                accessToken: 'any_token'
            })
            expect(hashServiceSpy).toHaveBeenCalledWith({ value: 'any_password' })
        });
    })
});
