import { AddCustomerController } from "../../../../src/application/controllers/add-customer";
import { ConflictCustomerError } from "../../../../src/application/errors/conflict-customer-error";
import { ServerError } from "../../../../src/application/errors/server-error";
import { HttpRequest, conflict, create, serverError } from "../../../../src/application/helpers/http";
import { AddCustomer } from "../../../../src/domain/use-cases/add-customer";

const makeAddCustomer = (): AddCustomer => {
    class AddCustomerStub implements AddCustomer {
        async add(customer: AddCustomer.Params): Promise<AddCustomer.Result> {
            return {
                id: 'any_id',
                name: 'any_name',
                email: 'any_email',
                cpf: 'any_cpf',
                accessToken: 'any_token'
            }
        }
    }
    return new AddCustomerStub()
}

interface SutTypes {
    sut: AddCustomerController
    addCustomerStub: AddCustomer
}

const makeSut = (): SutTypes => {
    const addCustomerStub = makeAddCustomer()
    const dependencies: AddCustomerController.Dependencies = {
        addCustomer: addCustomerStub
    }
    const sut = new AddCustomerController(dependencies)
    return {
        sut,
        addCustomerStub
    }
}

describe('AddCustomer Controller', () => {
    const fakeBodyHttpRequest = {
        name: 'any_name',
        email: 'any_email',
        password: 'any_password',
        cpf: 'any_cpf',
        accessToken: 'any_token'
    }

    const fakeHttpRequest: HttpRequest = {
        body: fakeBodyHttpRequest
    }


    test('should return 409 (conflit) if addCustomer returns undefined', async () => {
        const { sut, addCustomerStub } = makeSut()
        jest.spyOn(addCustomerStub, 'add').mockReturnValueOnce(undefined)
        const result = await sut.handle(fakeHttpRequest)
        expect(result).toEqual(conflict(new ConflictCustomerError()))
    });

    test('should return 500 (serverError) if addCustomer throws', async () => {
        const { sut, addCustomerStub } = makeSut()
        jest.spyOn(addCustomerStub, 'add').mockRejectedValueOnce(new Error())
        const httpResponse = await sut.handle(fakeHttpRequest)
        expect(httpResponse).toEqual(serverError(new ServerError('any_stack')))
    });

    test('should call addCustomer with correct values', async () => {
        const { sut, addCustomerStub } = makeSut()
        const spyAddCustomer = jest.spyOn(addCustomerStub, 'add').mockRejectedValueOnce(new Error())
        await sut.handle(fakeHttpRequest)
        expect(spyAddCustomer).toHaveBeenCalledWith({
            name: fakeHttpRequest.body.name,
            email: fakeHttpRequest.body.email,
            password: fakeHttpRequest.body.password,
            cpf: fakeHttpRequest.body.cpf,
            accessToken: fakeHttpRequest.body.accessToken
        })
    });

    test('should return 201 (create) if a customer are created', async () => {
        const { sut } = makeSut()
        const httpResponse = await sut.handle(fakeHttpRequest)
        expect(httpResponse).toEqual(create({
            id: expect.any(String),
            name: fakeHttpRequest.body.name,
            email: fakeHttpRequest.body.email,
            cpf: fakeHttpRequest.body.cpf,
            accessToken: fakeHttpRequest.body.accessToken
        }))
    })

});
