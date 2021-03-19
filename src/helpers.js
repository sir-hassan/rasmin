import request from 'supertest'
import Redis from 'ioredis'

export function tolerateDates(object, expected) {
    if (expected.createdOn && !(expected.createdOn instanceof Date)) {
        expected.createdOn = new Date(expected.createdOn)
    }
    if (expected.updatedOn && !(expected.updatedOn instanceof Date)) {
        expected.updatedOn = new Date(expected.updatedOn)
    }
    let diff = Math.abs(new Date(object.updatedOn) - expected.updatedOn)
    let seconds = Math.floor((diff / 1000))
    if (seconds < 2) {
        expected.updatedOn = object.updatedOn
    }
    diff = Math.abs(new Date(object.createdOn) - expected.createdOn)
    seconds = Math.floor((diff / 1000))
    if (seconds < 2) {
        expected.createdOn = object.createdOn
    }
}

export async function basicApiTest(expect, server, apiRoot, headers, reqBody, resBody) {
    let req = request(server)
    let firstHeader = headers.shift()

    firstHeader = firstHeader.split(' ')
    if (firstHeader.length !== 3) {
        throw new Error('invalid request header format')
    }

    let [method, url, statusCode] = firstHeader
    url = apiRoot + url
    switch (method) {
    case 'GET':
        req = req.get(url)
        break
    case 'POST':
        req = req.post(url)
        break
    case 'PUT':
        req = req.put(url)
        break
    case 'DELETE':
        req = req.delete(url)
        break
    default:
        throw new Error('invalid request header format')
    }

    for (let i = 0; i < headers.length; i++) {
        const header = headers[i].split(' ')
        if (header.length !== 2) {
            throw new Error(`invalid request header format(${header})`)
        }
        req = req.set(header[0], header[1])
    }

    const res = await req.send(reqBody)
    expect(res.statusCode.toString()).toEqual(statusCode.toString())

    if (resBody === undefined) {
        return
    }
    tolerateDates(res.body, resBody)
    expect(res.statusCode.toString()).toEqual(statusCode.toString())
    expect(res.body).toEqual(resBody)
}

export function statusCodeApiTest(expect, server, apiRoot, headers) {
    return basicApiTest(expect, server, apiRoot, headers, null)
}

export async function getSessionId(server, apiRoot, name, email) {
    const res = await request(server)
        .post(apiRoot + '/auth')
        .send({
            name,
            email,
        })
    return res.body.sid
}

export function tearDownSystem(server, conn, redisClient, done) {
    server.close(function(err) {
        if (err) console.log(err)
        conn.end(function(err) {
            if (err) console.log(err)
            redisClient.disconnect()
            done()
        })
    })
}

export function createRedisClientFromEnv() {
    return new Redis({
        port: process.env.MK_REDIS_PORT,
        host: process.env.MK_REDIS_HOST,
        family: 4, // 4 (IPv4) or 6 (IPv6)
    })
}
