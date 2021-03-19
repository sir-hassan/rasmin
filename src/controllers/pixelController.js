import BaseController from './baseController'

export default class PixelController extends BaseController {
    constructor(sessionStore, messageBroker, PixelModel) {
        super()
        this.sessionStore = sessionStore
        this.messageBroker = messageBroker
        this.PixelModel = PixelModel
    }

    async getAll(req) {
        const pixels = req.ctx.session.getPixels()

        return {
            body: pixels,
            statusCode: 200,
        }
    }

    async post(req) {
        try {
            const data = req.body
            this.PixelModel.validate(data)

            req.ctx.session.setPixel(data)
            this.sessionStore.set(req.ctx.session.token, req.ctx.session.data)
            this.messageBroker
                .publish('GOLLNER_CHANNEL', req.ctx.session.token, 'PIXEL_CHANGE', data)

            return {
                statusCode: 200,
            }
        } catch (e) {
            return this._catchError(e)
        }
    }
}
