import { AddCustomerCompanyController } from "../../../../src/application/controllers/add-customer-company";
import { ConflictCustomerError } from "../../../../src/application/errors/conflict-customer-error";
import { ServerError } from "../../../../src/application/errors/server-error";
import { HttpRequest, conflict, serverError } from "../../../../src/application/helpers/http";
import { AddCustomerCompany } from "../../../../src/domain/use-cases/add-customer-company";

const makeAddCustomerCompany = (): AddCustomerCompany => {
    class AddCustomerCompanyStub implements AddCustomerCompany {
        async add(customerData: AddCustomerCompany.Params): Promise<AddCustomerCompany.Result> {
            return {
                id: 'any_id',
                name: 'any_name',
                email: 'any_email',
                cnpj: 'any_cnpj',
                accessToken: 'any_token'
            }
        }
    }
    return new AddCustomerCompanyStub()
}

interface SutTypes {
    sut: AddCustomerCompanyController
    addCustomerCompanyStub: AddCustomerCompany
}

const makeSut = (): SutTypes => {
    const addCustomerCompanyStub = makeAddCustomerCompany()
    const dependencies: AddCustomerCompanyController.Dependencies = {
        addCustomerCompany: addCustomerCompanyStub
    }
    const sut = new AddCustomerCompanyController(dependencies)
    return {
        sut,
        addCustomerCompanyStub
    }
}

describe('AddCustomerCompany Controller', () => {
    const fakeBodyHttpRequest = {
        name: 'any_name',
        email: 'any_email',
        password: 'any_password',
        cnpj: 'any_cnpj',
        accessToken: 'any_token'
    }

    const fakeHttpRequest: HttpRequest = {
        body: fakeBodyHttpRequest
    }

    test('should return 409 (conflit) if addCustomerCompany returns undefined', async () => {
        const { sut, addCustomerCompanyStub } = makeSut()
        jest.spyOn(addCustomerCompanyStub, 'add').mockReturnValueOnce(undefined)
        const httpResponse = await sut.handle(fakeHttpRequest)
        expect(httpResponse).toEqual(conflict(new ConflictCustomerError()))
    })

    test('should return 500 (serverError) if AddCustomerCompany throws', async () => {
        const { sut, addCustomerCompanyStub } = makeSut()
        jest.spyOn(addCustomerCompanyStub, 'add').mockRejectedValueOnce(new Error())
        const httpResponse = await sut.handle(fakeHttpRequest)
        expect(httpResponse).toEqual(serverError(new ServerError('any_stack')))
    })
});
