const path = require('path')
const fs = require('fs')
const { create } = require('domain')

const worksPath = path.join(__dirname, 'works/')
const databasePath = path.join(__dirname, 'works/database.json')
const imagePath = path.join(__dirname, 'works/img/')
const emptyHTML = path.join(__dirname, 'works/template.html')

function replaceAll(str,mapObj){
    var re = new RegExp(Object.keys(mapObj).join("|"),"gi");

    return str.replace(re, function(matched){
        return mapObj[matched.toLowerCase()];
    })
}
fs.readFile(databasePath, (err, data) => {
    if (err) throw err;
    let database = JSON.parse(data)
    function createMissingHTML () {
        fs.readdir(worksPath, (err, files) => {
            Object.keys(database).forEach(projectId => {
                let fileId = projectId + ".html"
                if (files.includes(fileId) === false) {
                    fs.readFile(emptyHTML, 'utf8', function (err,html) {
                        if (err) {
                          return console.log(err)
                        }
                        let title = database[projectId].title
                        let tags = database[projectId].tags
                        let year
                    
                        if (isNaN(database[projectId].year) === true) {
                            year = database[projectId].year.toUpperCase()
                        } else {
                            year = database[projectId].year    
                        }                    
    
                        let anchortags = []
                        tags.forEach(tag => {
                            let anchorTag = `<a href="/tags/${tag.replace(/\s+/g, '-')}.html">${tag.toUpperCase()}</a>`
                            anchortags.push(anchorTag)
                        })
                        let tagsElement = anchortags.join(', ')
    
                        let replaceStrings = {'<span id="title"></span>': `<span id="title">${title.toUpperCase()}</span>`, '<span id="year"></span>': `<span id="year">${year}</span>`, '<span id="tags"></span>': `<span id="tags">${tagsElement}</span>`, '<title></title>': `<title>${title.toUpperCase()}—PINAR KAZAK</title>`}
                        let newHTML = replaceAll(html, replaceStrings)
    
                        fs.writeFile(worksPath + fileId, newHTML, (err) => { 
                            if (err) { 
                              console.log(err)
                            } 
                        })
                    })
                }
            })
        })
    }
    function addImages() {
        fs.readdir(worksPath + 'img/', (err, folders) => {
            Object.keys(database).forEach(projectId => {
                if (folders.includes(projectId) === false) {
                    fs.mkdir(worksPath + 'img/' + projectId, function(err) { 
                        if (err) { 
                            console.log(err)
                        } 
                    })
                } else {
                    fs.readdir(worksPath + 'img/' + projectId, (err, images) => {
                        if (images.length > 0) {
                            fs.readFile(worksPath + projectId + '.html', 'utf8', function (err, uneditHTML) {
                                if (err) {
                                  return console.log(err)
                                }
                                let imageElementsArray = []
                                images.forEach(image => {
                                    if (image !== '.DS_Store' && /^\d+\.png/.test(image) === true) {
                                        let imageElement = `<div class="single"><img src="img/${projectId}/${image}"></div>`
                                        imageElementsArray.push(imageElement)
                                    }
                                })
                                let imageElements = imageElementsArray.join('')
                                let addString = {'<div id="gallery"><div class="info"><p></p></div>' : `<div id="gallery"><div class="info"><p></p>${imageElements}</div>`}
                                let editedHTML = replaceAll(uneditHTML, addString)

                            })
                        }
                    })
                }
            })
        })
    }
})

function createImageDatabase() {
    fs.readdir(worksPath + 'img/', (err, folders)
}


const express = require("express")

// create an express app
const app = express()

// use the express-static middleware
app.use(express.static("public"))

// define the first route
app.get("/", function (req, res) {})

// start the server listening for requests
app.listen(process.env.PORT || 80, 
	() => console.log("Server is running..."));




