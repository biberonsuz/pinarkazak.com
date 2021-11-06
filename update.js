const path = require('path')
const fs = require('fs')

const worksPath = path.join(__dirname, 'public/works/')
const databasePath = path.join(__dirname, 'public/works/database.json')
const imagePath = path.join(__dirname, 'public/works/img/')
const template = path.join(__dirname, 'public/works/template.html')

function replaceAll(str,mapObj){
    console.log(mapObj)
    var re = new RegExp(Object.keys(mapObj).join("|"),"gi");
    //console.log(re)

    return str.replace(re, function(matched){
        return mapObj[matched.toLowerCase()];
        
    })

}

function createHTML(template, fileData, path, fileName) {
    console.log(fileData)
    fs.readFile(template, 'utf8', function (err,html) {
        if (err) {
          return console.log(err)
        }
        let newHTML = replaceAll(html, fileData)
        fs.writeFile(path + fileName, newHTML, (err) => { 
            if (err) { 
            console.log(err)
            } 
        })
    })
}

fs.readFile(databasePath, (err, data) => {
    if (err) throw err;
    let database = JSON.parse(data)
    fs.readdir(worksPath, (err, files) => {
        Object.keys(database).forEach(projectId => {
            let fileData = {}
            let fileId = projectId + ".html"
            if (files.includes(fileId) === false) {
                console.log('Creating file:', fileId)
                fileData['---footer title---'] =  database[projectId].title.toUpperCase()
                fileData['---header title---'] = database[projectId].title.toUpperCase()

                let anchortags = []
                database[projectId].tags.forEach(tag => {
                    let anchorTag = `<a href="/tags/${tag.replace(/\s+/g, '-')}.html">${tag.toUpperCase()}</a>`
                    anchortags.push(anchorTag)
                })
                let tagsElement = anchortags.join(', ') 
                
                fileData['---footer tags---'] = tagsElement

                let year
                if (isNaN(database[projectId].year) === true) {
                    year = database[projectId].year.toUpperCase()
                } else {
                    year = database[projectId].year    
                }      
                fileData['---footer year---'] = year     
                
                fileData['---description---'] = ''  

                fs.readdir(worksPath + 'img/', (err, folders) => {
                    //if there is no img directory, make img directory for project
                    if (folders.includes(projectId) === false) {
                        fs.mkdir(worksPath + 'img/' + projectId, function(err) { 
                            if (err) { 
                                console.log(err)
                            } 
                        })
                    } else {
                        //if there are images inside img directory, add them to HTML
                        fs.readdir(worksPath + 'img/' + projectId, (err, images) => {
                            if (images.length > 0) {
                                let imageElementsArray = []
                                images.forEach(image => {
                                    if (image !== '.DS_Store' && /^\d+\.png/.test(image) === true) {
                                        let imageElement = `<div class="single"><img src="img/${projectId}/${image}"></div>`
                                        imageElementsArray.push(imageElement)
                                    }
                                })
                                let imageElements = imageElementsArray.join('')
                                fileData['---images---'] = imageElements
                            }
                        })
                    }
                    createHTML(template, fileData, worksPath, fileId)
                }) 
            }
        })
    })
})