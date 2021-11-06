const path = require('path')
const fs = require('fs')

const express = require("express")

// create an express app
const app = express()

// use the express-static middleware
app.use(express.static("public", { fallthrough: false }))

// define the first route
app.get("/", function (req, res) {})

// start the server listening for requests
app.listen(process.env.PORT || 80, 
	() => console.log("Server is running..."));