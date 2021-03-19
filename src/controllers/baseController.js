import * as errors from '../common/errors'

export default class BaseController {
    _catchError(e) {
        if (e instanceof errors.InvalidArgumentError) {
            return {
                body: {error: e.message},
                statusCode: 400,
            }
        } else if (e instanceof errors.UnauthorizedError) {
            return {
                body: {error: e.message},
                statusCode: 401,
            }
        } else if (e instanceof errors.NotFoundError) {
            return {
                body: {error: e.message},
                statusCode: 404,
            }
        } else {
            console.log(e)
            return {
                body: {error: 'internal error'},
                statusCode: 500,
            }
        }
    }
}
