const express = require("express")
const path = require("path")
const http = require("http")

const port = process.env.PORT || 5000
const publicDirectoryPath = path.join(__dirname, "public")
const app = express();
const server = http.createServer(app)
const io = socketio(server);

let empires = [ 'AI', 'Memory', 'Plastic', 'Pop Culture', 'Conspiracy Theorists', 'Anti colonists', 'World Leaders', 'Slavery', 'Race', 'Space Conquerors' ]

app.use(express.static(publicDirectoryPath))

function formatMessage(user, text) {
    return {
        user, 
        text,
    }
}

io.on("connection", socket => {
    let empire = empires[Math.floor(Math.random()*empires.length)]
    console.log('New connection.', empire)
    
    socket.on("chatMessage", msg => {
        io.emit("message", formatMessage("user", msg))
    })

    socket.emit('message', formatMessage("sys", `You are a citizen of the ${empire} empire.`))

    socket.broadcast.emit('message', formatMessage("sys", `A new citizen of the ${empire} empire logged on.`))

    

})




//hello
server.listen(port, () => console.log("Hello, I'm listening on " + port))