'use strict'
const { createServer } = require('http')
const enableDestroy = require('server-destroy')

const server = createServer(function (req, res) {

    switch (req.url) {

        case '/shutdown':
            res.end('shutting down')

            server.destroy()

            break

        default:
            res.end('up and running!')
    }

})

server.timeout = 2000

server.listen(8000)
enableDestroy(server)

// Checking for memory leakages

const timer = setInterval(() => {
    console.log(process.memoryUsage())
}, 5000)

timer.unref()
