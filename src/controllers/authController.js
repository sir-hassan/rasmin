import BaseController from './baseController'

export default class AuthController extends BaseController {
    constructor(db, sessionStore) {
        super()
        this.db = db
        this.sessionStore = sessionStore
    }

    async post(req) {
        try {
            const name = req.body.name
            const email = req.body.email
            const user = await this.db.authUser(name, email)
            const roles = await this.db.getRoles(user.id)
            const sid = await this.sessionStore.create({user, roles, pixels: []})

            return {
                body: {sid},
                statusCode: 200,
                cookie: ['SID', sid, {
                    expires: new Date(Date.now() + 900000),
                    httpOnly: true, secure: false,
                }],
            }
        } catch (e) {
            return this._catchError(e)
        }
    }
}
