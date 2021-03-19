import {createMysqlConnectionFromEnv as createConnection, MysqlDB as DB} from './db'
import {tolerateDates} from '../helpers'
import * as errors from '../common/errors'


let conn
let db

beforeAll(async () => {
    conn = createConnection()
    await conn.wait
    db = new DB(conn)
    await db.query('BEGIN;')
})

afterAll(async () => {
    await db.query('ROLLBACK;')
    return new Promise((res) => {
        conn.end(() => {
            setTimeout(() => {
                res()
            }, 100)
        })
    })
})

describe('Test getUser', () => {
    it('should get user 1', async () => {
        const user = await db.getUser(1)
        expect(user).toEqual({
            id: 1,
            createdOn: new Date('2020-01-01 01:01:01'),
            updatedOn: new Date('2020-01-01 01:01:01'),
            name: 'yassir',
            email: 'yassir@mikrogo.com',
        })
    })
    it('should get user 2', async () => {
        const user = await db.getUser(2)
        expect(user).toEqual({
            id: 2,
            createdOn: new Date('2020-01-01 01:01:01'),
            updatedOn: new Date('2020-01-01 01:01:01'),
            name: 'meis',
            email: 'meis@mikrogo.com',
        })
    })
    it('should get user 3', async () => {
        const user = await db.getUser(3)
        expect(user).toEqual({
            id: 3,
            createdOn: new Date('2020-01-01 01:01:01'),
            updatedOn: new Date('2020-01-01 01:01:01'),
            name: 'ban',
            email: 'ban@mikrogo.com',
        })
    })
    it('should not get user 10', async () => {
        await expect(db.getUser(10)).rejects.toEqual(
            new errors.NotFoundError('selected id(10) not exists'),
        )
    })
})

describe('Test getAllUsers', () => {
    it('should return all', async () => {
        const users = await db.getAllUsers()
        expect(users).toEqual([
            {
                id: 1,
                createdOn: new Date('2020-01-01 01:01:01'),
                updatedOn: new Date('2020-01-01 01:01:01'),
                name: 'yassir',
                email: 'yassir@mikrogo.com',
            },
            {
                id: 2,
                createdOn: new Date('2020-01-01 01:01:01'),
                updatedOn: new Date('2020-01-01 01:01:01'),
                name: 'meis',
                email: 'meis@mikrogo.com',
            },
            {
                id: 3,
                createdOn: new Date('2020-01-01 01:01:01'),
                updatedOn: new Date('2020-01-01 01:01:01'),
                name: 'ban',
                email: 'ban@mikrogo.com',
            },
            {
                id: 4,
                createdOn: new Date('2020-01-01 01:01:01'),
                updatedOn: new Date('2020-01-01 01:01:01'),
                name: 'saif',
                email: 'saif@mikrogo.com',
            },
        ],
        )
    })
})

describe('Test deleteUser', () => {
    it('should deleteUser', async () => {
        let users = await db.getAllUsers()
        expect(users.length).toEqual(4)
        await db.deleteUser(1)
        await expect(db.getUser(1)).rejects.toEqual(
            new errors.NotFoundError('selected id(1) not exists'),
        )
        users = await db.getAllUsers()
        expect(users.length).toEqual(3)
    })
})


describe('Test updateUser', () => {
    it('should not update user 10', async () => {
        await expect(db.updateUser({
            name: 'new.yassir',
            email: 'new.yassir@mikrogo.com',
        }, 10)).rejects.toEqual(
            new Error('updated length not 1'),
        )
    })

    it('should update user 2', async () => {
        await expect(db.updateUser({
            name: 'new.yassir',
            email: 'new.yassir@mikrogo.com',
        }, 2)).resolves.toEqual(undefined)
    })

    it('should get updated user 2', async () => {
        const user = await db.getUser(2)
        const expectedUser = {
            id: 2,
            createdOn: new Date('2020-01-01 01:01:01'),
            updatedOn: new Date(Date.now()),
            name: 'new.yassir',
            email: 'new.yassir@mikrogo.com',
        }
        tolerateDates(user, expectedUser)
        expect(user).toEqual(expectedUser)
    })
})

describe('Test addUser', () => {
    it('should add user 1', async () => {
        await expect(db.addUser({
            id: 1,
            name: 'new.yassir',
            email: 'new.yassir@mikrogo.com',
        })).resolves.toEqual(1)
    })
    it('should get added user 1', async () => {
        const user = await db.getUser(1)
        const expectedUser = {
            id: 1,
            createdOn: new Date(Date.now()),
            updatedOn: new Date(Date.now()),
            name: 'new.yassir',
            email: 'new.yassir@mikrogo.com',
        }
        tolerateDates(user, expectedUser)
        expect(user).toEqual(expectedUser)
    })
})


describe('Test isAdmin', () => {
    it('should be true on user 1', async () => {
        await expect(db.isUserAdmin(1)).resolves.toEqual(true)
    })
    it('should be true on other users', async () => {
        await expect(db.isUserAdmin(2)).resolves.toEqual(false)
        await expect(db.isUserAdmin(3)).resolves.toEqual(false)
        await expect(db.isUserAdmin(4)).resolves.toEqual(false)
    })
})

describe('Test getRoles', () => {
    it('should only admin on user 1', async () => {
        await expect(db.getRoles(1)).resolves.toEqual(['ADMIN'])
        await expect(db.getRoles(2)).resolves.toEqual(['USER', 'OTHER'])
        await expect(db.getRoles(3)).resolves.toEqual([])
        await expect(db.getRoles(4)).resolves.toEqual([])
    })
})

