import { server } from '@hapi/hapi'
import router from 'hapi-router'
import dotenv from 'dotenv'
import { Database } from './models/db'

dotenv.config()

new Database()

const app = new server({
  host: process.env.HOST,
  port: process.env.PORT
})
app.validator(require('@hapi/joi'))
app.register({
  plugin: router,
  options: {
    routes: './routes/**/*.js'
  }
}).then(() => app.start())
  .then(() => console.log(`Server running on ${app.info.uri}`))
  .catch(console.error)

process.on('unhandledRejection', err => {
  console.log(err)
  process.exit(1)
})
