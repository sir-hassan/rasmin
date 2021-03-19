import * as errors from '../common/errors'

export class Session {
    constructor(token, data) {
        this.token = token
        this.data = data
    }

    requireAdminRole() {
        let isAdmin = false
        this.data.roles.forEach((role) => {
            if (role === 'ADMIN') {
                isAdmin = true
            }
        })
        if (!isAdmin) {
            throw new errors.UnauthorizedError('user is not admin')
        }
    }

    requireResourceUserId(userId) {
        if (this.data.user.id !== userId) {
            throw new errors.ResourceAccessDeniedError('resource access denied')
        }
    }

    getPixels() {
        return this.data.pixels.map((p) => {
            return {...p}
        })
    }

    setPixel(pixel) {
        let set = false
        this.data.pixels = this.data.pixels.map((p) => {
            if (!set && p.x === pixel.x && p.y === pixel.y) {
                set = true
                return pixel
            }
            return p
        })
        if (!set) {
            this.data.pixels.push(pixel)
        }
    }
}

export class RedisSessionStore {
    constructor(redis, uuid) {
        this.redis = redis
        this.uuid = uuid
    }

    async create(data) {
        const sid = this.uuid()
        const reply = await this.redis.set(sid, JSON.stringify(data))
        if (reply !== 'OK') {
            throw new errors.LogicError('redis reply is not ok')
        }
        return sid
    }

    // return null or object
    async get(sid) {
        if (!sid || typeof sid !== 'string' || sid.length < 10) {
            throw new errors.InvalidArgumentError(`invalid sid(${sid})`)
        }
        const reply = await this.redis.get(sid)
        if (reply === null) {
            throw new errors.NotFoundError(`session sid(${sid}) is not found`)
        }
        return JSON.parse(reply)
    }

    async set(sid, data) {
        if (typeof data !== 'object') {
            throw new errors.InvalidArgumentError('data is not object')
        }
        const session = JSON.stringify(data)
        const reply = await this.redis.set(sid, session)
        if (reply !== 'OK') {
            throw new errors.LogicError('redis reply is not ok')
        }
    }
}
