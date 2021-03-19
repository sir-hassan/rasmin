import request from 'supertest'
import {apiRoot, conn, redisClient, server} from '../index'

describe('Test /auth', () => {
    it('should return invalid auth', async () => {
        const res = await request(server)
            .post(apiRoot + '/auth')
            .send({})
        expect(res.statusCode).toEqual(401)
        expect(typeof res.body).toBe('object')
        expect(typeof res.body.error).toBe('string')
    })
    it('should authenticate', async () => {
        const res = await request(server)
            .post(apiRoot + '/auth')
            .send({
                name: 'yassir',
                email: 'yassir@mikrogo.com',
            })
        expect(res.statusCode).toEqual(200)
        expect(typeof res.body).toBe('object')
        expect(typeof res.body.sid).toBe('string')
    })
})

afterAll((done) => {
    server.close(function(err) {
        if (err) console.log(err)
        conn.end(function(err) {
            if (err) console.log(err)
            redisClient.disconnect()
            done()
        })
    })
})
