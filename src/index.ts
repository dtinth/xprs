import express from 'express'
import serveStatic, { ServeStaticOptions } from 'serve-static'
import bodyParser from 'body-parser'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import methodOverride from 'method-override'
import compression from 'compression'
import cors from 'cors'
import helmet from 'helmet'
import * as _httpProxyMiddleware from 'http-proxy-middleware'

function xprs(inOptions: xprs.Options = {}) {
  const app = express()
  xprs.install(app, inOptions)
  return app
}

namespace xprs {
  export const defaultOptions = {
    static: false as
      | false
      | string
      | { root: string; options?: ServeStaticOptions },

    json: true as boolean | bodyParser.OptionsJson,
    text: true as boolean | bodyParser.OptionsText,
    urlencoded: true as boolean | bodyParser.OptionsUrlencoded,
    raw: true as boolean | bodyParser.Options,

    morgan: true as
      | boolean
      | string
      | { format: morgan.FormatFn | string; options?: morgan.Options },

    cookie: true as
      | boolean
      | string
      | string[]
      | {
          secret?: string | string[]
          options?: cookieParser.CookieParseOptions
        },

    methodOverride: true as
      | boolean
      | string
      | ((req: express.Request, res: express.Response) => string)
      | {
          getter?:
            | string
            | ((req: express.Request, res: express.Response) => string)
          options?: methodOverride.MethodOverrideOptions
        },

    compression: true as boolean | compression.CompressionOptions,

    cors: false as boolean | cors.CorsOptions,

    helmet: true as boolean | helmet.IHelmetConfiguration,

    trustProxy: true as boolean,
  }

  export type Options = Partial<typeof defaultOptions>

  export function install(app: express.Express, inOptions: Options = {}) {
    const options = { ...defaultOptions, ...inOptions }

    if (options.trustProxy) {
      app.enable('trust proxy')
    }

    if (options.methodOverride === true) {
      app.use(methodOverride())
    } else if (typeof options.methodOverride === 'string') {
      app.use(methodOverride(options.methodOverride))
    } else if (typeof options.methodOverride === 'function') {
      app.use(methodOverride(options.methodOverride))
    } else if (options.methodOverride) {
      app.use(
        methodOverride(
          options.methodOverride.getter,
          options.methodOverride.options,
        ),
      )
    }

    if (options.morgan === true) {
      app.use(
        morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'),
      )
    } else if (typeof options.morgan === 'string') {
      app.use(morgan(options.morgan))
    } else if (options.morgan) {
      if (typeof options.morgan.format === 'string') {
        app.use(morgan(options.morgan.format, options.morgan.options))
      } else {
        app.use(morgan(options.morgan.format, options.morgan.options))
      }
    }

    if (options.cors === true) {
      app.use(cors())
    } else if (options.cors) {
      app.use(cors(options.cors))
    }

    if (options.compression === true) {
      app.use(compression())
    } else if (options.compression) {
      app.use(compression(options.compression))
    }

    if (options.helmet === true) {
      app.use(helmet())
    } else if (options.helmet) {
      app.use(helmet(options.helmet))
    }

    if (typeof options.static === 'string') {
      app.use(serveStatic(options.static))
    } else if (options.static && typeof options.static === 'object') {
      app.use(serveStatic(options.static.root, options.static.options))
    }

    if (options.json === true) {
      app.use(bodyParser.json({ limit: '10mb' }))
    } else if (options.json) {
      app.use(bodyParser.json(options.json))
    }

    if (options.text === true) {
      app.use(bodyParser.text({ limit: '10mb' }))
    } else if (options.text) {
      app.use(bodyParser.text(options.text))
    }

    if (options.urlencoded === true) {
      app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }))
    } else if (options.urlencoded) {
      app.use(bodyParser.urlencoded(options.urlencoded))
    }

    if (options.raw === true) {
      app.use(bodyParser.raw({ type: '*/*', limit: '10mb' }))
    } else if (options.raw) {
      app.use(bodyParser.raw(options.raw))
    }

    if (options.cookie === true) {
      app.use(cookieParser())
    } else if (typeof options.cookie === 'string') {
      app.use(cookieParser(options.cookie))
    } else if (Array.isArray(options.cookie)) {
      app.use(cookieParser(options.cookie))
    } else if (options.cookie) {
      app.use(cookieParser(options.cookie.secret, options.cookie.options))
    }

    return app
  }
}

xprs.static = express.static
xprs.express = express
xprs.serveStatic = serveStatic
xprs.bodyParser = bodyParser
xprs.morgan = morgan
xprs.cookieParser = cookieParser
xprs.methodOverride = methodOverride
xprs.compression = compression
xprs.cors = cors
xprs.helmet = helmet
xprs.httpProxyMiddleware = _httpProxyMiddleware
xprs.createProxyMiddleware = _httpProxyMiddleware.createProxyMiddleware

export = xprs
