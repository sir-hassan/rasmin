import fs from 'fs'
import util from 'util'
import {createMysqlConnectionFromEnv as createConnection, MysqlDB as DB} from './db/db'

let conn
let db
(async function() {
    conn = createConnection()
    await conn.wait
    db = new DB(conn)
    const readFile = util.promisify(fs.readFile)
    const data = await readFile('./misc/db-dump.sql')
    await db.query(data.toString('utf8'))
})().finally(() => {
    conn.end()
}).then(() => {
    console.log('Script succeeded')
}).catch((e) => {
    console.log('Script', e)
    process.exit(1)
})
