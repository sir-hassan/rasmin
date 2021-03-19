import {apiRoot, conn, redisClient, server} from '../index'
import {basicApiTest, getSessionId, tearDownSystem} from '../helpers'

let adminSid

beforeAll(async () => {
    adminSid = await getSessionId(server, apiRoot, 'yassir', 'yassir@mikrogo.com')
})

describe('Basic Endpoints', () => {
    it('should have 400 on invalid post on /pixels', async () => {
        await basicApiTest(expect, server, apiRoot,
            [
                'POST /pixels 400',
                'X-Auth-Token ' + adminSid,
            ],
            {x: 1, z: 1, v: 1},
            {error: 'pixel must has numeric y field'},
        )
    })
    it('should have post on /pixels', async () => {
        await basicApiTest(expect, server, apiRoot,
            [
                'POST /pixels 200',
                'X-Auth-Token ' + adminSid,
            ],
            {x: 1, y: 1, v: 1},
            {},
        )
    })
    it('should have post on /pixels', async () => {
        await basicApiTest(expect, server, apiRoot,
            [
                'POST /pixels 200',
                'X-Auth-Token ' + adminSid,
            ],
            {x: 2, y: 2, v: 2},
            {},
        )
    })
    it('should have post on /pixels', async () => {
        await basicApiTest(expect, server, apiRoot,
            [
                'POST /pixels 200',
                'X-Auth-Token ' + adminSid,
            ],
            {x: 1, y: 1, v: 3},
            {},
        )
    })
    it('should have get on /pixels', async () => {
        await basicApiTest(expect, server, apiRoot,
            [
                'GET /pixels 200',
                'X-Auth-Token ' + adminSid,
            ],
            {},
            [{x: 1, y: 1, v: 3}, {x: 2, y: 2, v: 2}],
        )
    })
})

afterAll((done) => {
    tearDownSystem(server, conn, redisClient, done)
})
