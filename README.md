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
const app = xprs()
```

…is equivalent to…

```js
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
