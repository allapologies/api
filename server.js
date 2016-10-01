'use strict'

const port= 8000
const { Server }= require('http')

const server= new Server((req, res) => {
    res.end('hello')
})

console.log(`Server started at port ${port}`)
server.listen(port)
