import * as errors from '../common/errors'
import mysql from 'mysql'

export function createMysqlConnectionFromEnv() {
    const conn = mysql.createConnection({
        host: process.env.MK_DB_HOST,
        user: process.env.MK_DB_USER,
        password: process.env.MK_DB_PASSWORD,
        database: process.env.MK_DB_DATABASE,
        multipleStatements: process.env.NODE_ENV === 'test',
    })
    conn.wait = new Promise((res) => {
        conn.connect(function(err) {
            if (err) throw err
            res()
        })
    })

    return conn
}

export class MysqlDB {
    constructor(conn) {
        this.conn = conn

        this.usersTable = 'Users'
        this.rolesTable = 'Roles'
        this.todosTable = 'Todos'
    }

    _query(statement) {
        return new Promise((res, rej) => {
            this.conn.query(statement, (err, result) => {
                if (err) rej(err)
                else res(result)
            })
        })
    }

    _preparedQuery(statement, values) {
        return new Promise((res, rej) => {
            this.conn.query(statement, values, (err, result) => {
                if (err) rej(err)
                else res(result)
            })
        })
    }

    _select(table, columns, filter) {
        let columnsString = null
        if (Array.isArray(columns) && columns.length === 0) {
            columnsString = '*'
        } else if (Array.isArray(columns)) {
            columnsString = columns.map((column) => mysql.escapeId(column))
                .join(', ')
        } else {
            throw new errors.LogicError('invalid columns argument')
        }

        let whereClause = 'WHERE 1=1 '

        const values = []
        for (const field in filter) {
            if (!Object.prototype.hasOwnProperty.call(filter, field)) continue
            whereClause += ` AND ${mysql.escapeId(field)} = ? `
            values.push(filter[field])
        }

        return this._preparedQuery(
            `SELECT ${columnsString} FROM ${mysql.escapeId(table)} ${whereClause};`,
            values,
        )
    }

    async _selectById(table, columns, id) {
        const result = await this._select(table, columns, {id: id})

        if (result.length === 1) {
            return result[0]
        }
        if (result.length === 0) {
            throw new errors.NotFoundError(`selected id(${id}) not exists`)
        }
        // logic error.
        throw new errors.LogicError(`selected length not 1`)
    }

    async _deleteById(table, id) {
        const result = await this._preparedQuery(
            `DELETE FROM ${mysql.escapeId(table)} WHERE id = ?`,
            [id],
        )

        if (result.affectedRows !== 1) {
            throw new errors.LogicError(`deleted length not 1`)
        }
    }

    async _insertUpdate(table, row, updateId) {
        let sql = `UPDATE ${mysql.escapeId(table)} SET `
        if (updateId === undefined) {
            sql = `INSERT INTO ${mysql.escapeId(table)} SET `
        }

        const values = []

        for (const field in row) {
            if (!Object.prototype.hasOwnProperty.call(row, field)) continue
            if (
                ['createdon', 'updatedon'].includes(
                    field.trim().toLocaleLowerCase(),
                )
            ) {
                continue
            }
            sql += `${mysql.escapeId(field)} = ?, `
            values.push(row[field])
        }

        if (updateId === undefined) {
            sql += `createdOn = NOW(), updatedOn = NOW();`
        } else {
            sql += `updatedOn = NOW() WHERE id = ?;`
            values.push(updateId)
        }

        const result = await this._preparedQuery(sql, values)

        if (updateId !== undefined && result.affectedRows !== 1) {
            throw new errors.LogicError(`updated length not 1`)
        }

        if (updateId === undefined) {
            return result.insertId
        }
    }

    _insert(table, row) {
        return this._insertUpdate(table, row)
    }

    _update(table, row, id) {
        if (id === undefined) {
            throw new errors.InvalidArgumentError(`undefined update id`)
        }
        return this._insertUpdate(table, row, id)
    }

    // public functions ----------------------------------------------------------- //

    query(statement) {
        return this._query(statement)
    }

    getUser(id) {
        return this._selectById(this.usersTable, [], id)
    }

    getAllUsers() {
        return this._select(this.usersTable, [], {})
    }

    addUser(row) {
        return this._insert(this.usersTable, row)
    }

    updateUser(row, id) {
        return this._update(this.usersTable, row, id)
    }

    deleteUser(id) {
        return this._deleteById(this.usersTable, id)
    }

    getTodo(id) {
        return this._selectById(this.todosTable, [], id)
    }

    getAllTodos() {
        return this._select(this.todosTable, [], {})
    }

    addTodo(row) {
        return this._insert(this.todosTable, row)
    }

    updateTodo(row, id) {
        return this._update(this.todosTable, row, id)
    }

    deleteTodo(id) {
        return this._deleteById(this.todosTable, id)
    }

    async isUserAdmin(id) {
        const roles = await this._select(this.rolesTable, [], {id})
        let isAdmin = false

        roles.forEach((role) => {
            if (role.role === 'ADMIN') {
                isAdmin = true
            }
        })

        return isAdmin
    }

    async authUser(name, email) {
        const result = await this._select(this.usersTable, [], {name, email})

        if (result.length === 1) {
            return result[0]
        }
        if (result.length === 0) {
            throw new errors.UnauthorizedError('invalid credentials')
        }
        throw new errors.LogicError(`selected length not 1`)
    }


    async getRoles(userId) {
        const roles = await this._select(this.rolesTable, [], {userId})
        return roles.map((role) => role.role)
    }
}
