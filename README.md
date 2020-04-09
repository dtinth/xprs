# xprs middleware stack

**A bundle of most-commonly-used middlewares for express, based on analyzing over 80,000 public GitHub repos on BigQuery.**

I am tired of having to install various common Express middlewares such as `body-parser`, `cors`, … every time I start a new API project with Express.
I think, some middlewares are just used so often they could have been in the core.
So I ran some numbers on Google BigQuery to find out which are the most commonly used Express middleware

## Middleware list

Having looked at 126,822 files from 80,151 repositories, I came up with a list of top Express middlewares.

| Middleware              | Popularity (number of repos, █ = 1k repos) |
| ----------------------- | ------------------------------------------ |
| `serve-static`          | ██████████████████████████████████████     |
| `body-parser`           | ████████████████████████████               |
| `morgan`                | ██████████████████████████                 |
| `cookie-parser`         | █████████████████                          |
| `method-override`       | ██████████                                 |
| `compression`           | ████████                                   |
| `cors`                  | ███                                        |
| `helmet`                | ██                                         |
| `http-proxy-middleware` | █                                          |

## Synopsis

```js
const xprs = require('xprs')
const app = xprs()
```

…is equivalent to…

```js
const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cookieParser = require('cookie-parser')
const methodOverride = require('method-override')
const compression = require('compression')
const helmet = require('helmet')

const app = express()
app.enable('trust proxy')
app.use(methodOverride())
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'))
app.use(compression())
app.use(helmet())
app.use(bodyParser.json({ limit: '10mb' }))
app.use(bodyParser.text({ limit: '10mb' }))
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }))
app.use(bodyParser.raw({ type: '*/*', limit: '10mb' }))
app.use(cookieParser())
```

### Bundled type definitions

TypeScript definitions are bundled along with this package, so you don't have to…

```json
{
  "devDependencies": {
    "@types/compression": "^1.7.0",
    "@types/cookie-parser": "^1.4.2",
    "@types/cors": "^2.8.6",
    "@types/express": "^4.17.5",
    "@types/helmet": "^0.0.45",
    "@types/http-proxy-middleware": "^0.19.3",
    "@types/method-override": "^0.0.31",
    "@types/morgan": "^1.9.0",
    "@types/serve-static": "^1.13.3"
  }
}
```

### Configuration: turning features off

Don’t need or don’t want some features? You can turn any of them off… in fact, you can turn all of them off!

```js
const xprs = require('xprs')
const app = xprs({
  trustProxy: false,
  methodOverride: false,
  morgan: false,
  compression: false,
  helmet: false,
  json: false,
  text: false,
  urlencoded: false,
  raw: false,
  cookie: false,
})
```

…is equivalent to…

```js
const express = require('express')
const app = express()
```

### Re-exported modules

You can access all the bundled modules:

```js
xprs.express
xprs.static
xprs.serveStatic
xprs.bodyParser
xprs.morgan
xprs.cookieParser
xprs.methodOverride
xprs.compression
xprs.cors
xprs.helmet
xprs.httpProxyMiddleware
xprs.createProxyMiddleware
```

### Manually-enabled features

Some features have to be manually enabled.

- **`cors`**

  ```js
  const app = xprs({ cors: true })
  ```

- **`serve-static`**

  ```js
  const app = xprs({ static: `${__dirname}/public` })
  ```

- **`http-proxy-middleware`**

  ```js
  const app = xprs()
  app.use(
    '/api',
    xprs.createProxyMiddleware({
      target: 'http://www.example.org',
      changeOrigin: true,
    }),
  )
  ```
