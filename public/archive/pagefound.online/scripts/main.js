//-----------------------------------------Three.JS-----------------------------------------//

let camera, scene, renderer, cube, cubes, lastClicked
let main = document.querySelector("#main")
cubes = []
let click = 0

function init() {
    scene = new THREE.Scene()
    //scene.background = new THREE.Color( 0xe9e9e9 );

    camera = new THREE.PerspectiveCamera(45, window.innerWidth / (window.innerHeight), 0.1, 1000)

    renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha:true
    })

    // Set canvas height same as content height
    const content = document.querySelector('#content')
    renderer.setSize(content.offsetWidth, content.offsetHeight)

    main.appendChild(renderer.domElement)

    const loader = new THREE.TextureLoader()

    const domEvents = new THREEx.DomEvents(camera, renderer.domElement)
    var maxAnisotropy = renderer.capabilities.getMaxAnisotropy();

    controls = new THREE.OrbitControls(camera, renderer.domElement)
    controls.minDistance = 1
    controls.maxDistance = 1000
    controls.keyPanSpeed = 100.0

    document.querySelector('h1').innerHTML += 'Drag to rotate, scroll to zoom, arrows to pan, click to focus.'

    for (let i = 0; i < books.length; i++) {
        let book = books[i]
        let cubeHeight = book.height
        let cubeWidth = book.width
        let cubeDepth = book.depth

        let geometry = new THREE.BoxBufferGeometry(cubeWidth, cubeHeight, cubeDepth)

        const materials = [
	    	new THREE.MeshBasicMaterial({
                map: loader.load('textures/' + i + '-1.jpg')
            }),
   		 	new THREE.MeshBasicMaterial({
                map: loader.load('textures/' + i + '-2.jpg')
            }),
    		new THREE.MeshBasicMaterial({
                map: loader.load('textures/' + i + '-3.jpg')
            }),
	    	new THREE.MeshBasicMaterial({
                map: loader.load('textures/' + i + '-4.jpg')
            }),
	    	new THREE.MeshBasicMaterial({
                map: loader.load('textures/' + i + '-5.jpg')
            }),
	    	new THREE.MeshBasicMaterial({
                map: loader.load('textures/' + i + '-6.jpg')
            }),
		]

        cube = new THREE.Mesh(geometry, materials)
        cubes.push(cube)
        scene.add(cube)
        cubes[i].position.x = Math.floor(Math.random() * 20) - 10
        cubes[i].rotation.y = Math.floor(Math.random() * 6.28)
        cubes[i].position.y = Math.floor(Math.random() * 20) - 10
        cubes[i].position.z = Math.floor(Math.random() * 20) - 10

        materials[0].map.anisotropy = maxAnisotropy;
        materials[1].map.anisotropy = maxAnisotropy;
        materials[2].map.anisotropy = maxAnisotropy;
        materials[3].map.anisotropy = maxAnisotropy;
        materials[4].map.anisotropy = maxAnisotropy;
        materials[5].map.anisotropy = maxAnisotropy;

        domEvents.addEventListener(cube, 'mouseover', e => {
            cubes[i].scale.set(1.5, 1.5, 1.5)
            document.querySelector('.bookInfo').innerHTML += '' + book.title + ' by ' + book.author + ', designed by ' + book.designer + '.'
        })

        domEvents.addEventListener(cube, 'mouseout', e => {
            cubes[i].scale.set(1, 1, 1)
            document.querySelector('.bookInfo').innerHTML = ''
        })

        domEvents.addEventListener(cube, 'click', e => {
            if (click === 1 && lastClicked == i) {
                document.querySelector('h1').innerHTML = 'Drag to rotate, scroll to zoom, arrows to pan, click to focus.'
                showBook(book)
                click = 0
            } else {
                camera.position.set(cubes[i].position.x+5, cubes[i].position.y+0.5, cubes[i].position.z+5)
                controls.target = new THREE.Vector3(cubes[i].position.x, cubes[i].position.y, cubes[i].position.z, 5)
                document.querySelector('h1').innerHTML = 'Drag to rotate, scroll to zoom, arrows to pan, click to focus.<br>Click again for preview.'
                lastClicked = i
                click = 1
            }
        })
        domEvents.addEventListener(cube, 'touchstart', e => {
            if (click === 1 && lastClicked == i) {
                document.querySelector('h1').innerHTML = 'Drag to rotate, scroll to zoom, arrows to pan, click to focus.'
                showBook(book)
                click = 0
                e.preventDefault();
            } else {
                camera.position.set(cubes[i].position.x+5, cubes[i].position.y+0.5, cubes[i].position.z+5)
                controls.target = new THREE.Vector3(cubes[i].position.x, cubes[i].position.y, cubes[i].position.z, 5)
                document.querySelector('h1').innerHTML = 'Drag to rotate, scroll to zoom, arrows to pan, click to focus.<br>Click again for preview.'
                lastClicked = i
                click = 1
            }
        })
    }
    camera.position.z = 15

    animate()
}

// Currently displayed book
let currentBook = null

// Displays book details in a popup
function showBook(book) {
    // Remember the current book, needed later for paging
    currentBook = book

    // insert book details into the popup
    const popup = document.querySelector('.popup')

    popup.querySelector('.designer').innerHTML = book.designer
    popup.querySelector('.title').innerHTML = book.title
    popup.querySelector('.author').innerHTML = book.author
    popup.querySelector('.publisher').innerHTML = book.publisher
    popup.querySelector('.colophon').innerHTML = book.colophon

    // Show the first page
    showPage(book, 1)

    // reveal the popup
    togglePopup(true)
}

// Displays the specified page of the book
function showPage(book, page) {
    if (isValidPage(book, page)) {
        book.page = page
        const spreads = document.querySelector('.spreads')
        spreads.style.backgroundImage = `url(books/`+book.id+`/${page}.jpg)`
    }
}

// Returns true if the specified page number
// is within the allowed range for the given book
function isValidPage(book, page) {
    if (page > 0 && page <= book.pages) {
        return true
    }
}

// Moves to the next page of the currently displayed book
function nextPage() {
    if (currentBook) {
        let page = currentBook.page
        showPage(currentBook, page + 1)
    }
}

// Moves to the previous page of the currently displayed book
function previousPage() {
    if (currentBook) {
        let page = currentBook.page
        showPage(currentBook, page - 1)
    }
}

// Hides/shows the popup window
function togglePopup(visible) {
    const popup = document.querySelector('.popup')
    const popupOverlay = document.querySelector('.popup-overlay')

    popup.style.display = visible ? 'flex' : 'none'
    popupOverlay.style.display = visible ? 'flex' : 'none'
}

//-----------------------------------------PosterGallery-----------------------------------------//

function posters() {
    // Pick a random book, get its cover and description
    let i = Math.floor(Math.random() * books.length)

    const imageUrl = `posters/${i}.jpg`

    //const imageUrl = `posters/${i}.jpg`
    const imageDescription = books[i].designer

    // Locate the poster and poster info elements
    const poster = document.querySelector('.gallery')
    const posterInfo = document.querySelector('.posterInfo')

    // Assign image as poster element's background,
    // show poster description
    poster.style.backgroundImage = `url(${imageUrl})`
    posterInfo.innerHTML = imageDescription
    posterReady = true
}

function animate() {
    requestAnimationFrame(animate)
    controls.update()
    renderer.render(scene, camera)
}

function onWindowResize() {
    camera.aspect = window.innerWidth / (window.innerHeight)
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
}


//-----------------------------------------FlexFont-----------------------------------------//

window.addEventListener('resize', onWindowResize, false)

function flexFont() {
    let divs = document.querySelectorAll('.gallery, .row')
    for (let i = 0; i < divs.length; i++) {
        let relFontsize = divs[i].offsetWidth * 0.06
        divs[i].style.fontSize = relFontsize + 'px'
    }
}

// Toggling views inside the container
function toggleView(id) {
    // Hide a currently visible view
    const views = Array.from(document.querySelectorAll('.view'))
    for (const view of views) {
        view.style.display = 'none'
    }

    // Show the specified view
    const visibleView = document.querySelector('#' + id)
    if (visibleView) {
        visibleView.style.display = 'flex'
    }
}

//-----------------------------------------......-----------------------------------------//

// Wait, until the page has completely loaded...
window.addEventListener('load', function () {
    // ...then initialize the 3d view, posters etc.
    init()
    posters()
    posterCounter = setInterval(posters,5000)
})

/* var countDownDate = new Date("April 17 2020 16:00:00 GMT+0200").getTime()

var xmlHttp
function srvTime(){
    try {
        //FF, Opera, Safari, Chrome
        xmlHttp = new XMLHttpRequest()
    }
    catch (err1) {
        //IE
        try {
            xmlHttp = new ActiveXObject('Msxml2.XMLHTTP')
        }
        catch (err2) {
            try {
                xmlHttp = new ActiveXObject('Microsoft.XMLHTTP')
            }
            catch (eerr3) {
                //AJAX not supported, use CPU time.
                alert("AJAX not supported")
            }
        }
    }
    xmlHttp.open('HEAD',window.location.href.toString(),false)
    xmlHttp.setRequestHeader("Content-Type", "text/html")
    xmlHttp.send('')
    var st = xmlHttp.getResponseHeader("Date")
    var date = new Date(st)
    var distance = countDownDate - date
    return distance
}
let distance = srvTime()

let launchCounter = setInterval(function () {
    distance = distance - 1000

    let days = Math.floor(distance / (1000 * 60 * 60 * 24))
    let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
    let seconds = Math.floor((distance % (1000 * 60)) / 1000)

    document.querySelector(".time").innerHTML = "Second Year Book Buffet<br>"+ days + "d " + hours + "h "
  + minutes + "m " + seconds + "s "
    if (distance < 0) {
        document.querySelector(".counter").style.display = "none"
        clearInterval(launchCounter)
        document.body.style.cursor = 'auto'
    }
}, 1000) */

srvTime()

const all = document.querySelector('body').children[1]
function easter(image, color) {
    Array.from(all.children).forEach(child => {
        console.log(child)
        child.style.backgroundImage = `url(images/${image}.gif)`
        document.querySelector('#colophon').style.color = color
        document.querySelector('.posterInfo').style.color = color

    })
}
