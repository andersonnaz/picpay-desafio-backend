import { HashGenerator } from "../../src/data/protocols/cryptography/hash-generator";
import { AddCustomerRepository } from "../../src/data/protocols/db/customer/add-customer-repository";
import { DbAddCustomer } from "../../src/data/use-cases/db-add-customer";
import { AddCustomer } from "../../src/domain/use-cases/add-customer";

const makeCustomerRepositoryStub = (): AddCustomerRepository => {
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

    return new CustomerRepositoryStub()
}

const makeHashGeneratorStub = (): HashGenerator => {
    class HashGeneratorStub implements HashGenerator {
        hash(value: HashGenerator.Params): Promise<string> {
            return new Promise(resolve => resolve('hashed_password'))
        }
    }
    return new HashGeneratorStub()
}

type SutTypes = {
    sut: DbAddCustomer
    hashServiceStub: HashGenerator
    customerRepositoryStub: AddCustomerRepository
}

const makeSut = (): SutTypes => {
    const hashServiceStub = makeHashGeneratorStub()
    const customerRepositoryStub = makeCustomerRepositoryStub()
    const dependencies: AddCustomer.Dependencies = {
        hashService: hashServiceStub,
        customerRepository: customerRepositoryStub
    }
    const sut = new DbAddCustomer(dependencies)
    return {
        sut,
        hashServiceStub,
        customerRepositoryStub
    }
}

describe('DbAddCustomer use case', () => {
    const params: AddCustomer.Params = {
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
        cpf: 'any_cpf',
        accessToken: 'any_token'
    }

    describe('HashService', () => {
        test('should call hash method with correct password', async () => {
            const { sut, hashServiceStub } = makeSut()
            const hashServiceSpy = jest.spyOn(hashServiceStub, 'hash')
            await sut.add(params)
            expect(hashServiceSpy).toHaveBeenCalledWith({ value: params.password })
        });

        test('should throw if hash method throws', async () => {
            const { sut, hashServiceStub } = makeSut()
            jest.spyOn(hashServiceStub, 'hash').mockRejectedValue(new Error())
            const promise = sut.add(params)
            await expect(promise).rejects.toThrow()
        });
    })
});
