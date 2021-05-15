const swagger_ui = require('swagger-ui-express')
const swagger_doc = require('./swagger.json')
const express = require('express')
const dotenv = require('dotenv')

dotenv.config()
const app = express()

app.use('/', swagger_ui.serve, swagger_ui.setup(swagger_doc))

app.listen(process.env.PORT, '0.0.0.0', () => {
    console.log(`XMeme swagger running on ${process.env.PORT} ...`)
})
