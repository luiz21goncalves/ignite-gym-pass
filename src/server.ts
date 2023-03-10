import { app } from "./app";

app.listen({
  host: '0.0.0.0',
  port: 3333,
}).then(url => console.log(`HTTP Server Running! url:${url}`))
