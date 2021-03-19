import {createMysqlConnectionFromEnv as createConnection, MysqlDB as DB} from './db/db'
import {buildControllers} from './controllers/controllers'
import * as models from './models/models'
import {v4 as uuid} from 'uuid'
import {createExpressApp} from './app'
import {createRedisClientFromEnv as createRedisClient} from './helpers'
import {MessageBroker} from './broker/broker'
import {
    RedisSessionStore as SessionStore,
    Session,
} from './session/session'


const redisClient = createRedisClient()
const messageBroker = new MessageBroker(redisClient)
const sessionStore = new SessionStore(redisClient, uuid)
const conn = createConnection()
const db = new DB(conn)

const {authController, userController, todoController, pixelController, notFoundController} =
    buildControllers(db, sessionStore, messageBroker, models)

const apiRoot = process.env.MK_RASMIN_API_ROOT || ''


const app = createExpressApp(Session, sessionStore, {
    auth: authController,
    user: userController,
    todo: todoController,
    pixel: pixelController,
    notFound: notFoundController,
}, apiRoot)

const port = process.env.MK_RASMIN_PORT || 8080

// listen for requests
const server = app.listen(port, async () => {
    await conn.wait
    console.log(`Rasmin server is listening on port ${port}`)
})

export {conn, server, redisClient, apiRoot}
