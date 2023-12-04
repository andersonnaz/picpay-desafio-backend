export interface HashGenerator {
    hash(value: HashGenerator.Params): Promise<HashGenerator.Result>
}

export namespace HashGenerator {
    export type Params = {
        value: string
    }

    export type Result = string
}
