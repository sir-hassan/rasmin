import * as errors from './../common/errors'

export class UserModel {
    constructor(data) {
        UserModel.validate(data)

        const {
            id,
            name,
            email,
            createdOn,
            updatedOn,
        } = data

        this.id = id
        this.name = name
        this.email = email
        this.createdOn = createdOn
        this.updatedOn = updatedOn
    }

    static validate({
        id,
        name,
        email,
        createdOn,
        updatedOn,
    }) {
        if (!name) {
            throw new Error('user must has name')
        }
        if (!email) {
            throw new Error('user must has email')
        }
    }
}


export class TodoModel {
    constructor(data) {
        TodoModel.validate(data)

        const {
            id,
            userId,
            checked,
            text,
            createdOn,
            updatedOn,
        } = data

        this.id = id
        this.userId = userId
        this.checked = checked
        this.text = text
        this.createdOn = createdOn
        this.updatedOn = updatedOn
    }

    static validate({
        id,
        userId,
        checked,
        text,
        createdOn,
        updatedOn,
    }) {
        if (!text) {
            throw new Error('todo must has text')
        }
        if (isNaN(checked)) {
            throw new Error('todo must has numeric checked field')
        }
        if (!userId) {
            throw new Error('todo must has userId field')
        }
    }
}

export class PixelModel {
    constructor({x, y, v}) {
        TodoModel.validate({x, y, v})
        this.x = x
        this.y = y
        this.v = v
    }

    static validate({x, y, v}) {
        if (isNaN(x)) {
            throw new errors.InvalidArgumentError('pixel must has numeric x field')
        }
        if (isNaN(y)) {
            throw new errors.InvalidArgumentError('pixel must has numeric y field')
        }
        if (isNaN(v)) {
            throw new errors.InvalidArgumentError('pixel must has numeric v field')
        }
    }
}
