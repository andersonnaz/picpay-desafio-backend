import { AddCustomerController } from "../../../../src/application/controllers/add-customer";
import { ConflictCustomerError } from "../../../../src/application/errors/conflict-customer-error";
import { HttpRequest, conflict } from "../../../../src/application/helpers/http";
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
    test('should return 409 (conflit) if addCustomer returns undefined', async () => {
        const { sut, addCustomerStub } = makeSut()
        const fakeHttpRequest: HttpRequest = {
            userId: 'any_id',
            body: 'any_body',
            authorization: 'any_token'
        }
        jest.spyOn(addCustomerStub, 'add').mockReturnValueOnce(undefined)
        const result = await sut.handle(fakeHttpRequest)
        expect(result).toEqual(conflict(new ConflictCustomerError()))
    });
});
