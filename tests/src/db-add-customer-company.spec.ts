import { HashGenerator } from "../../src/data/protocols/cryptography/hash-generator";
import { AddCustomerCompany } from "../../src/domain/use-cases/add-customer-company";
import { AddCustomerCompanyRepository } from "../../src/data/protocols/db/customer-company/add-customer-company-repository";
import { DbAddCustomerCompany } from "../../src/data/use-cases/db-add-customer-company";

const makeCustomerCompanyRepositoryStub = (): AddCustomerCompanyRepository => {
    class CustomerCompanyRepositoryStub implements AddCustomerCompanyRepository {
        add(customer: AddCustomerCompanyRepository.Params): Promise<AddCustomerCompanyRepository.Result> {
            return new Promise(resolve => resolve({
                id: 'any_id',
                name: 'any_name',
                email: 'any_email@mail.com',
                cnpj: 'any_cnpj',
                accessToken: 'any_token'
            }))
        }
    }

    return new CustomerCompanyRepositoryStub()
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
    sut: DbAddCustomerCompany
    hashServiceStub: HashGenerator
    customerCompanyRepositoryStub: AddCustomerCompanyRepository
}

const makeSut = (): SutTypes => {
    const hashServiceStub = makeHashGeneratorStub()
    const customerCompanyRepositoryStub = makeCustomerCompanyRepositoryStub()
    const dependencies: AddCustomerCompany.Dependencies = {
        hashService: hashServiceStub,
        customerCompanyRepository: customerCompanyRepositoryStub
    }
    const sut = new DbAddCustomerCompany(dependencies)
    return {
        sut,
        hashServiceStub,
        customerCompanyRepositoryStub
    }
}

describe('DbAddCustomerCompany use case', () => {
    const params: AddCustomerCompany.Params = {
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
        cnpj: 'any_cnpj',
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

    describe('CustomerRepository', () => {
        test('should call add method with correct values and password hashed', async () => {
            const { sut, customerCompanyRepositoryStub } = makeSut()
            const hashedPassword = 'hashed_password'
            const customerCompanyRepositorySpy = jest.spyOn(customerCompanyRepositoryStub, 'add')
            await sut.add(params)
            expect(customerCompanyRepositorySpy).toHaveBeenCalledWith({
                name: params.name,
                email: params.email,
                password: hashedPassword,
                cnpj: params.cnpj,
                accessToken: params.accessToken
            })
        });

        test('should throw if add method throws', async () => {
            const { sut, customerCompanyRepositoryStub } = makeSut()
            jest.spyOn(customerCompanyRepositoryStub, 'add').mockRejectedValue(new Error())
            const promise = sut.add(params)
            await expect(promise).rejects.toThrow()
        });

        test('should return a customer on success', async () => {
            const { sut } = makeSut()
            const result = await sut.add(params)
            expect(result).toEqual({
                id: expect.any(String),
                name: params.name,
                email: params.email,
                cnpj: params.cnpj,
                accessToken: params.accessToken
            })
        });
    })
});
