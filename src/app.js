import express from 'express'
import cookieParser from 'cookie-parser'
import * as errors from './common/errors'

function createExpressAdapter(controllers) {
    return (controllerIndex, method) => {
        return (req, res) => {
            const httpRequest = {
                ctx: res.locals,
                body: req.body,
                query: req.query,
                params: req.params,
                cookies: req.cookies,
                ip: req.ip,
                method: req.method,
                path: req.path,
                headers: {
                    'Content-Type': req.get('Content-Type'),
                    'Referer': req.get('referer'),
                    'User-Agent': req.get('User-Agent'),
                },
            }

            controllers[controllerIndex][method](httpRequest)
                .then((httpResponse) => {
                    if (!Number.isInteger(httpResponse.statusCode)) {
                        throw new Error('response status is not integer')
                    }
                    return httpResponse
                })
                .then((httpResponse) => {
                    if (httpResponse.cookie) {
                        res.cookie(
                            httpResponse.cookie[0],
                            httpResponse.cookie[1],
                            httpResponse.cookie[2])
                    }
                    return httpResponse
                })
                .then((httpResponse) => {
                    if (httpResponse.headers) {
                        res.set(httpResponse.headers)
                    }
                    res.type('json').status(httpResponse.statusCode).send(httpResponse.body || {})
                })
                .catch((e) => {
                    console.log(e)
                    res.status(500).send({
                        error: 'internal error',
                    })
                })
        }
    }
}

function authMiddleware(Session, sessionStore, apiRoot) {
    return async function(req, res, next) {
        if (req.originalUrl === apiRoot + '/auth') {
            return next()
        }
        try {
            let token = req.get('X-Auth-Token')
            if (!token) {
                console.log(req.cookies)
                token = req.cookies.SID
            }
            if (!token) {
                throw new errors.UnauthorizedError('token is not supplied')
            }
            const sessionData = await sessionStore.get(token)
            res.locals.session = new Session(token, sessionData)
            return next()
        } catch (e) {
            if (
                e instanceof errors.UnauthorizedError ||
                e instanceof errors.InvalidArgumentError ||
                e instanceof errors.NotFoundError
            ) {
                return res.type('json').status(401).send({error: 'unauthorized'})
            } else {
                console.log(e)
                return res.type('json').status(500).send({error: 'internal error'})
            }
        }
    }
}

export function createExpressApp(Session, sessionStore, controllers, root) {
    const expressAdapter = createExpressAdapter(controllers)
    const router = new express.Router()

    router.use(cookieParser())
    router.use(authMiddleware(Session, sessionStore, root))
    router.use(express.json())


    router.get('/users/:id', expressAdapter('user', 'get'))
    router.get('/users', expressAdapter('user', 'getAll'))
    router.post('/users', expressAdapter('user', 'post'))
    router.delete('/users/:id', expressAdapter('user', 'delete'))

    router.get('/todos/:id', expressAdapter('todo', 'get'))
    router.put('/todos/:id', expressAdapter('todo', 'put'))
    router.get('/todos', expressAdapter('todo', 'getAll'))
    router.post('/todos', expressAdapter('todo', 'post'))
    router.delete('/todos/:id', expressAdapter('todo', 'delete'))

    router.get('/pixels', expressAdapter('pixel', 'getAll'))
    router.post('/pixels', expressAdapter('pixel', 'post'))

    router.post('/auth', expressAdapter('auth', 'post'))
    router.use(expressAdapter('notFound', 'notFound'))

    const app = express()
    app.use(root, router)

    return app
}

