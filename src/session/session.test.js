import {v4 as uuid} from 'uuid'
import {createRedisClientFromEnv as createRedisClient} from '../helpers'
import {RedisSessionStore} from './session'

const redisClient = createRedisClient()
const sessionStore = new RedisSessionStore(redisClient, uuid)

describe('Test basic SessionStoreRedis', () => {
    let sid
    it('should create a new session', async () => {
        sid = await sessionStore.create({})
        await expect(typeof sid).toBe('string')
    })
    it('should get the created session', async () => {
        const session = await sessionStore.get(sid)
        await expect(session).toEqual({})
    })
    it('should set the created session', async () => {
        await sessionStore.get(sid)
        await sessionStore.set(sid, {a: 'a'})
        let session = await sessionStore.get(sid)
        await expect(session).toEqual({a: 'a'})
        await sessionStore.set(sid, {b: 'b'})
        session = await sessionStore.get(sid)
        await expect(session).toEqual({b: 'b'})
    })
})

afterAll(async () => {
    redisClient.disconnect()
})
