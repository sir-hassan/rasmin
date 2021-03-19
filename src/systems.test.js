import Redis from 'ioredis'

const redis = new Redis({
    port: process.env.MK_REDIS_PORT,
    host: process.env.MK_REDIS_HOST,
    family: 4, // 4 (IPv4) or 6 (IPv6)
})

beforeAll(async () => {
    await redis.del('foo')
})

describe('Test redis', () => {
    it('should delete foo return 0', async () => {
        await expect(redis.del('foo')).resolves.toEqual(0)
    })
    it('should set foo to bar', async () => {
        await expect(redis.set('foo', 'bar')).resolves.toEqual('OK')
    })
    it('should get bar from fo', async () => {
        await expect(redis.get('foo')).resolves.toEqual('bar')
    })
    it('should delete foo return 1', async () => {
        await expect(redis.del('foo')).resolves.toEqual(1)
    })
})

afterAll(async () => {
    redis.disconnect()
})
