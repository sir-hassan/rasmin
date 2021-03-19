import BaseController from './baseController'

export default class UserController extends BaseController {
    constructor(db, UserModel) {
        super()
        this.db = db
        this.UserModel = UserModel
    }

    async get(req) {
        try {
            const id = req.params.id
            const row = await this.db.getUser(id)

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
            req.ctx.session.requireAdminRole()
            const rows = await this.db.getAllUsers()
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
            req.ctx.session.requireAdminRole()
            const data = req.body
            this.UserModel.validate(data)

            const id = await this.db.addUser(data)
            const row = await this.db.getUser(id)

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
            await this.db.deleteUser(id)

            return {
                statusCode: 200,
            }
        } catch (e) {
            return this._catchError(e)
        }
    }
}
