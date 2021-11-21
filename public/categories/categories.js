const tagId = window.location.pathname.split('/')[2].split('.')[0]
const tag = tagId.replace(/-/g, ' ')

let lastClicked = null
let mobile = false
const gallery = document.querySelector('#background')
const body = document.querySelector('body')
const main = document.querySelector('main')

const pageTitle = document.querySelector('footer #title')

pageTitle.innerHTML = tag.toUpperCase()

function ajax(a,b,c){//url,function,just a placeholder
    c=new XMLHttpRequest;
    c.open('GET',a);
    c.onload=b;
    c.send()
}

function groupByTags(arr) {
    let response = {}
    for(let i of Object.keys(arr)){
        for(let j of arr[i].tags){
            let tags =[...arr[i].tags]
            if(response[j]){
                response[j].push({id:i , tags: tags})
            } else {
                response[j] = [{id:i, tags: tags}]
            }
        }
    }
    return response
}

if (window.innerWidth < 700) {
    mobile = true
}

ajax('/works/database.json', function(){
    if (this.status === 200) {
        const database = JSON.parse(this.response)
        let tags = groupByTags(database)
        console.log(tags[tag])
        tags[tag].forEach(workObj => {
            let workId = workObj.id

            let work = document.createElement('div')
            work.className ='work'
            work.id = workId   

            let title = document.createElement('div')
            title.className = 'title'
            title.innerHTML = database[workId].title.toUpperCase() 
            work.appendChild(title)

            let year = document.createElement('div')
            year.className = 'year'
            if (isNaN(database[workId].year)) {
                year.innerHTML = database[workId].year.toUpperCase()
            } else {
                year.innerHTML = database[workId].year
            }
            work.appendChild(year)

            main.appendChild(work)
            
            if (mobile == false) {
                work.addEventListener('click', () => {
                    location.href=`/works/${workId}.html`
                })
                work.addEventListener('mouseover', () => {
                    gallery.style.backgroundImage = `url(/background/${workId}.png)`
                    if (workId == "colorshow" || workId == "pagefound" || workId == "teargas-archive") {
                        gallery.style.backgroundSize = `auto 100%`
                        gallery.style.backgroundPosition = 'center'
                        console.log(workId);
                    } else if (workId == "untitled-mountain" || workId == "experiments" || workId == "guggen-sans" || workId == "shah-sans" || workId == "cumhuriyet-display"){
                        gallery.style.backgroundSize = `17.8664vh`
                    } else {
                        gallery.style.backgroundSize = `20vw`
                    }
                })
                work.addEventListener('mouseout', () => {
                    gallery.style.background = 'none'
                })
            } else if (mobile == true) {
                work.addEventListener('touch', () => {
                    if (lastClicked == workId) {
                        location.href=`/works/${workId}`
                    } else {
                        gallery.style.backgroundImage = `url(/background/${workId}.png)`
                        if (workId == "grotesk") {
                            gallery.style.backgroundSize = `auto 100%`
                            console.log(workId);
                        } else {
                            gallery.style.backgroundSize = `50vw`
                        }
                        lastClicked = workId
                    }  
                })
                body.addEventListener('touch', () => {
                    gallery.style.background = 'none'
                })
            }
        })
    }
})