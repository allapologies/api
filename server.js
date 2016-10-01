'use strict'

const port= 8000
const { Server }= require('http')

const server= new Server((req, res) => {
    res.end('hello')
})

let emit = server.emit

server.emit = function (event) {
    console.log(event)
    return emit.apply(this, arguments)
}

console.log(`Server started at port ${port}`)
server.listen(port)
