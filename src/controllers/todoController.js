import BaseController from './baseController'

export default class TodoController extends BaseController {
    constructor(db, TodoModel) {
        super()
        this.db = db
        this.TodoModel = TodoModel
    }

    async get(req) {
        try {
            const id = req.params.id
            const row = await this.db.getTodo(id)
            req.ctx.session.requireResourceUserId(row.userId)

            return {
                body: row,
                statusCode: 200,
            }
        } catch (e) {
            return this._catchError(e)
        }
    }

    async getAll(req) {
        try {
            const rows = await this.db.getAllTodos(req.ctx.session.data.user.id)
            return {
                body: rows,
                statusCode: 200,
            }
        } catch (e) {
            return this._catchError(e)
        }
    }

    async post(req) {
        try {
            const data = req.body

            data.userId = req.ctx.session.data.user.id
            this.TodoModel.validate(data)

            const id = await this.db.addTodo(data)
            const row = await this.db.getTodo(id)

            return {
                body: row,
                statusCode: 200,
            }
        } catch (e) {
            return this._catchError(e)
        }
    }

    async put(req) {
        try {
            const id = req.params.id
            let row = await this.db.getTodo(id)
            req.ctx.session.requireResourceUserId(row.userId)

            const data = req.body

            data.userId = req.ctx.session.data.user.id
            this.TodoModel.validate(data)

            await this.db.updateTodo(data, id)
            row = await this.db.getTodo(id)

            return {
                body: row,
                statusCode: 200,
            }
        } catch (e) {
            return this._catchError(e)
        }
    }

    async delete(req) {
        try {
            const id = req.params.id
            const row = await this.db.getTodo(id)
            req.ctx.session.requireResourceUserId(row.userId)

            await this.db.deleteTodo(id, req.ctx.session.data.user.id)

            return {
                statusCode: 200,
            }
        } catch (e) {
            return this._catchError(e)
        }
    }
}
