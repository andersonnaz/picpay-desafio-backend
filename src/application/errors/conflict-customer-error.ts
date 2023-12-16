export class ConflictCustomerError extends Error {
    constructor() {
        super('cpf or email already exists')
        this.name = 'ConflictCustomerError'
    }
}
