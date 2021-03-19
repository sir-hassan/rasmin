export class NotFoundError extends Error {
    constructor(message) {
        super(message)
        this.name = 'NotFoundError'
    }
}

export class InvalidArgumentError extends Error {
    constructor(message) {
        super(message)
        this.name = 'InvalidArgumentError'
    }
}

export class LogicError extends Error {
    constructor(message) {
        super(message)
        this.name = 'LogicError'
    }
}

export class UnauthorizedError extends Error {
    constructor(message) {
        super(message)
        this.name = 'UnauthorizedError'
    }
}

export class ResourceAccessDeniedError extends Error {
    constructor(message) {
        super(message)
        this.name = 'ResourceAccessDeniedError'
    }
}
