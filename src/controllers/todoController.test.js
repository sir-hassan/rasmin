import {apiRoot, conn, redisClient, server} from '../index'
import {basicApiTest, getSessionId, statusCodeApiTest, tearDownSystem} from '../helpers'

let adminSid

beforeAll(async () => {
    adminSid = await getSessionId(server, apiRoot, 'yassir', 'yassir@mikrogo.com')
})

describe('Basic Endpoints', () => {
    it('should have get on /todos', async () => {
        await basicApiTest(expect, server, apiRoot,
            [
                'GET /todos/1 200',
                'X-Auth-Token ' + adminSid,
            ],
            null,
            {
                id: 1,
                createdOn: '2020-01-01T01:01:01',
                updatedOn: '2020-01-01T01:01:01',
                userId: 1,
                checked: 1,
                text: 'todo yassir',
            },
        )
    })

    it('should have post on /todos', async () => {
        await basicApiTest(expect, server, apiRoot,
            [
                'POST /todos 200',
                'X-Auth-Token ' + adminSid,
            ],
            {
                text: 'my second todo',
                checked: 1,
            },
            {
                id: 5,
                createdOn: Date.now(),
                updatedOn: Date.now(),
                userId: 1,
                checked: 1,
                text: 'my second todo',
            },
        )
    })

    it('should have put on /todos', async () => {
        await basicApiTest(expect, server, apiRoot,
            [
                'PUT /todos/5 200',
                'X-Auth-Token ' + adminSid,
            ],
            {
                text: 'my second todo modified',
                checked: 0,
            },
            {
                id: 5,
                createdOn: Date.now(),
                updatedOn: Date.now(),
                userId: 1,
                checked: 0,
                text: 'my second todo modified',
            },
        )
    })
    it('should have delete on /todos', async () => {
        await statusCodeApiTest(expect, server, apiRoot,
            [
                'DELETE /todos/5 200',
                'X-Auth-Token ' + adminSid,
            ],
        )
        await statusCodeApiTest(expect, server, apiRoot,
            [
                'GET /todos/5 404',
                'X-Auth-Token ' + adminSid,
            ],
        )
    })
})

afterAll((done) => {
    tearDownSystem(server, conn, redisClient, done)
})
