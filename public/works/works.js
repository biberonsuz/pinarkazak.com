const body = document.querySelector('body')
const gallery = document.querySelector('#gallery')
const info = document.querySelector('.info')

const title = document.querySelector('#title')
//const title = document.querySelector('#tags')
const title = document.querySelector('#year')

let p = document.querySelector('#gallery .info p')

if (window.innerWidth < 700) {
    mobile()
}
function mobile() {
    info.style.width = '70vw'
}
//scroll left-right
window.addEventListener("wheel", function (e) {
    if (e.deltaY > 0) {
        body.scrollLeft += 20;
        body.scrollTop = 0;
    } 
    else if (e.deltaY < 0) {
        body.scrollLeft -= 20;
        body.scrollTop = 0;
    }
    if (e.deltaX > 0) {
        body.scrollLeft += 20;
        body.scrollTop = 0;
    } else if (e.deltaX < 0) {
        body.scrollLeft -= 20;
        body.scrollTop = 0;
    }
});
//get content

let path = window.location.pathname
let workId = path.split('/')[2].split('.')[0]

function ajax(a,b,c){//url,function,just a placeholder
    c=new XMLHttpRequest;
    c.open('GET',a);
    c.onload=b;
    c.send()
}
ajax('/works/database.json', function(){
    if (this.status === 200) {
        const database = JSON.parse(this.response)
        Object.keys(database).forEach(workId => {
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
        })
    }
})
