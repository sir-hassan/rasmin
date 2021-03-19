import UserController from './userController'
import AuthController from './authController'
import TodoController from './todoController'
import PixelController from './pixelController'

export class NotFoundController {
    async notFound() {
        return {
            headers: {
                'Content-Type': 'application/json',
            },
            body: {error: 'not found'},
            statusCode: 404,
        }
    }
}

export function buildControllers(db, sessionStore, messageBroker, models) {
    const userController = new UserController(db, models.UserModel)
    const todoController = new TodoController(db, models.TodoModel)
    const authController = new AuthController(db, sessionStore)
    const pixelController = new PixelController(sessionStore, messageBroker, models.PixelModel)
    const notFoundController = new NotFoundController()

    return Object.freeze({
        authController,
        userController,
        todoController,
        pixelController,
        notFoundController,
    })
}

