import { app } from './app'
import { ENV } from './env'

app
  .listen({
    host: '0.0.0.0',
    port: ENV.PORT,
  })
  .then((url) => console.log(`HTTP Server Running! url:${url}`))
