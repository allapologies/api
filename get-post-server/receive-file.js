'use strict'

const fs = require('fs')
const config = require('config')

function receiveFile ( filepath, req, res) {

    if (req.headers['content-length'] > config.get('limitFileSize')) {
        res.statusCode = 413
        res.end('File is too big!')
        return
    }

    let size = 0
    let writeStream = new fs.WriteStream(filepath, { flags: 'wx' })
    
    req
        .on('data', (chunk) => {
            size += chunk.length

            if (size > config.get('limitFileSize')) {
                res.statusCode = 413
                res.setHeader('Connection', 'close')
                res.end('File is too big!')
                res.destroy()
                writeStream.destroy()
                fs.unlink(filepath, err => {})
            }
        })
        .on('close', () => {
            writeStream.destroy()
            fs.unlink(filepath, err => {
                /* ignore error */
            })
        })
        .pipe(writeStream)

    writeStream
        .on('error', (err) => {
            if (err.code === 'EEXIST') {
                res.statusCode = 409
                res.end('File exists')
            } else {
                console.error(err)
                if (!res.headersSent) {
                    res.writeHead(500, { 'Connection': 'close' })
                    res.end('Internal error')
                } else {
                    res.end()
                }
                fs.unlink(filepath, (err) => {})
            }

        })
        .on('close', () => {
            res.end('OK')
        })
}

module.exports = receiveFile
