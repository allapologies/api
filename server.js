'use strict'

const port = 8000
const { Server } = require('http')
const handler = require('./utils/handler')

const server= new Server((req, res) => handler(req, res))

console.log(`Server started at port ${port}`)
server.listen(port)
