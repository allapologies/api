'use strict'

const PORT = 8000
const fs = require('fs')
const path = require('path')
const url = require('url')
const { Server } = require('http')
const config = require('config')
const sendFile = require('./send-file')
const receiveFile = require('./receive-file')

const server = new Server((req, res) => {
    const pathname = decodeURI(url.parse(req.url).pathname)
    const filename = pathname.slice(1)

    if (filename.includes('/') || filename.includes('..')) {
        res.statusCode = 400
        res.end('Nested paths are not allowed');
        return
    }

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
        case 'POST':
            if (!filename) {
                res.statusCode = 404
                res.end('File not found')
            }

            receiveFile(path.join(config.get('filesRoot'), filename), req, res);

        default:
            res.statusCode = 502
            res.end('Not implemented')
    }})

server.listen(PORT)
