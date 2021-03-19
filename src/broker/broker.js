import * as errors from '../common/errors'

export class MessageBroker {
    constructor(redis) {
        this.redis = redis
    }

    async publish(channel, token, type, data) {
        if (!channel || typeof channel !== 'string') {
            throw new errors.InvalidArgumentError(`invalid channel(${channel})`)
        }
        if (!token || typeof token !== 'string' || token.length < 10) {
            throw new errors.InvalidArgumentError(`invalid token(${token})`)
        }
        if (!type || typeof type !== 'string') {
            throw new errors.InvalidArgumentError(`invalid type(${type})`)
        }
        if (typeof data !== 'object') {
            throw new errors.InvalidArgumentError('data is not object')
        }

        const payload = token + ' ' + JSON.stringify(data)
        const reply = await this.redis.publish(channel, payload)
        if (reply === 1) {
            throw new errors.NotFoundError(`broker channel(${channel}) is not exists`)
        }
        return JSON.parse(reply)
    }
}
