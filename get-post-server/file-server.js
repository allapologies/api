'use strict'

const PORT = 8000
const fs = require('fs')
const url = require('url')
const { Server } = require('http')
const sendFile = require('./send-file')

const server = new Server((req, res) => {
    const pathname = decodeURI(url.parse(req.url).pathname)

    switch(req.method) {
        case 'GET':
            if (pathname == '/') {
                fs.readFile(__dirname + '/public/index.html', (err, content) => {
                    if (err) {
                        throw err
                    }
                    res.setHeader('Content-Type', 'text/html;charset=utf-8')
                    res.end(content)
                })
                return
            } else {
                const filePath = `${__dirname}/files${pathname}`
                sendFile(filePath, res)
                return
            }


        default:
            res.statusCode = 502
            res.end('Not implemented')
    }})

server.listen(PORT)
