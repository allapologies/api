'use strict'

const fs = require('fs')
const mime = require('mime')

function sendFile (filePath, res) {
    const fileStream = new fs.ReadStream(filePath)
    fileStream.pipe(res)

    fileStream
        .on('error', (err) => {
            if (err.code === 'ENOENT') {
                res.statusCode = 404
                res.end('Not found')
            } else {
                console.error(err)
                if (!res.headersSent) {
                    res.statusCode = 500
                    res.end('Internal error')
                } else {
                    res.end()
                }

            }
        })
        .on('open', () => res.setHeader('Content-Type', mime.lookup(filePath)))

    res.on('close', () => fileStream.destroy())

}

module.exports = sendFile
