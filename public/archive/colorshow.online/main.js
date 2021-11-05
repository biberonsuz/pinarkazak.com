const index = document.querySelector('#index')
const popup = document.querySelector("#popup")
const mapContainer = document.querySelector('#earth')
const gridPopup = document.querySelector(".grid-popup")
const body = document.querySelector('body')
const content = document.querySelector('.content')
const widthGallery = document.querySelector('.content img')
const legend = document.querySelector('.legend')
const showLink = document.querySelector('#show-web')
let color = "yellow"
let shape = 1
let box = document.querySelector('.box')
let map, center, x, y, lastItem, legendClicked
let time = true
let accent = '#ffff30'
let markers = []
let lines = []
let squares = []
let dots = []
let triangles = []

//select popup elements
let info = document.querySelector('.info')
let titlePopup = document.querySelector("#title")
let designerPopup = document.querySelector("#name")
let locationPopup = document.querySelector("#location")
let descriptionPopup = document.querySelector("#desc")
let mediumPopup = document.querySelector("#medium")
let buttonPopup = document.querySelector(".buttons")

for (let i = 0; i < data.length; i++) {
  let item = data[i]
  let row = document.createElement('div')
  row.className = "row"
  index.appendChild(row)

  let nameIndex = document.createElement('span')
  nameIndex.className = "name"
  nameIndex.innerHTML = item.name
  row.appendChild(nameIndex)
  let titleIndex = document.createElement('span')
  titleIndex.className = "title"
  titleIndex.innerHTML = item.title
  row.appendChild(titleIndex)
  let locationIndex = document.createElement('span')
  locationIndex.className = "location"
  locationIndex.innerHTML = item.location
  row.appendChild(locationIndex)

  row.addEventListener('click', function() {
    titlePopup.innerHTML = item.title
    designerPopup.innerHTML = item.name
    locationPopup.innerHTML = item.location
    mediumPopup.innerHTML = item.medium
    descriptionPopup.innerHTML = item.description
    lastItem = item
    showLink.style.display = 'none'
    if (item.link != null) {
      for (a = 0; a < item.link.length; a++) {
        let ifr = document.createElement('iframe')
        ifr.src = `${item.link[a]}`
        content.appendChild(ifr)
        if (window.innerWidth < 700) {
          ifr.style.margin = '0'
          ifr.style.marginBottom = '25px'
          ifr.style.width = '100%'
        }
        setSize(ifr)
        if (item.deliverable[1] == "website") {
          showLink.style.display="inline"
          showLink.innerHTML = '<a href="'+item.link+'" target="_blank">Go to Link</a>'
          window.addEventListener('resize', function (){ setSize(ifr)})
        }
      }
    }
    for (let b = 1; b < item.images+1; b++) {
      let img = document.createElement("img")
      if (i == "24") {
        img.src = `images/${i}/${b}.gif`
      } else if (i == "12"){
        img.src = `images/${i}/${b}.png`
      } else {
        img.src = `images/${i}/${b}.jpg`
      }

      if (item.images < 4) {
        img.style.maxWidth = 'calc(100% - 25px)'
      } else if (window.innerWidth < 700) {
        img.style.maxWidth = '100%'
        img.style.margin = '0'
        img.style.marginBottom = '25px'
      } else {
        img.style.maxWidth = 'calc(50% - 25px)'
      }

      content.appendChild(img)
    }
    togglePopup(true)
  })
}

function togglePopup(visible) {
  if (visible === false) {
    content.innerHTML = ""
    showLink.innerHTML = ""
    if (index.style.left === "0px") {
      body.style.overflowY = "scroll"
    } else {
      body.style.overflowY = "hidden"
    }
  } else if (visible === true) {
    body.style.overflowY = "hidden"
  }
  popup.style.left = visible ? "50%" : "-150%"
}

function toggleView(id) {
  // Hide
  togglePopup(false)
  const tabs = Array.from(document.querySelectorAll('.tab'))
  for (const tab of tabs) {
    tab.style.left = '-200%'
  }
  // Show
  const visibleMap = document.querySelector('#' + id)
  if (visibleMap) {
    visibleMap.style.left = '0'
  }
  if (id == 'index') {
    body.style.overflowY = "scroll"
    legend.style.left = '-2000px'
  } else if (id == 'earth') {
    body.style.overflow = "hidden"
    legend.style.left = '0'
  } else {
    body.style.overflow = "hidden"
    legend.style.left = '-2000px'
  }

}

function toggleLegend(id) {
  // Hide
  dots.forEach(marker => {
    marker.setVisible(false)
  })
  triangles.forEach(marker => {
    marker.setVisible(false)
  })
  squares.forEach(marker => {
    marker.setVisible(false)
  })
  lines.forEach(marker => {
    marker.setVisible(false)
  })

  if (id == "earth") {
    dots.forEach(marker => {
      marker.setVisible(true)
      legendClicked = "earth"
    })
  } else if (id == "internet") {
    triangles.forEach(marker => {
      marker.setVisible(true)
      legendClicked = "internet"
    })
  } else if (id == "other") {
    squares.forEach(marker => {
      marker.setVisible(true)
      legendClicked = "other"
    })
  } else if (id == "multi") {
    lines.forEach(marker => {
      marker.setVisible(true)
      console.log("marker")
      legendClicked = "multi"
    })
  } else if (id = "all") {
    dots.forEach(marker => {
      marker.setVisible(true)
    })
    triangles.forEach(marker => {
      marker.setVisible(true)
    })
    squares.forEach(marker => {
      marker.setVisible(true)
    })
    lines.forEach(marker => {
      marker.setVisible(true)
    })
  }

}

function showOnMap () {
  map.setZoom(12)
  center = new google.maps.LatLng(lastItem.coordinates[0])
  map.setCenter(center)
  toggleView('earth')
  content.innerHTML = ""
}

function initMap() {
    center = new google.maps.LatLng({lat: 30, lng: 0})
    map = new google.maps.Map(mapContainer, {
        zoom: 3,
        minZoom: 3,
        maxZoom: 15,
        draggableCursor:'default',
        center: center,
        zoomControl: false,
        mapTypeControl: false,
        scaleControl: false,
        streetViewControl: false,
        rotateControl: false,
        fullscreenControl: false,
        backgroundColor: 'none',
        restriction: {
          latLngBounds: {
            north: 85,
            south: -85,
            west: -200,
            east: 200
          },
          strictBounds: false,
        },
        styles: [
            {
              "elementType": "geometry",
              "stylers": [
                {
                  "color": "#000000"
                }
              ]
            },
            {
              "elementType": "labels.icon",
              "stylers": [
                {
                  "visibility": "off"
                }
              ]
            },
            {
              "elementType": "labels.text.fill",
              "stylers": [
                {
                  "visibility": "off"
                }
              ]
            },
            {
              "elementType": "labels.text.stroke",
              "stylers": [
                {
                  "visibility": "off"
                }
              ]
            },
            {
              "featureType": "administrative.land_parcel",
              "elementType": "labels.text.fill",
              "stylers": [
                {
                  "visibility": "off"
                }
              ]
            },
            {
              "featureType": "landscape.natural.terrain",
              "elementType": "geometry",
              "stylers": [
                {
                  "color": "#000000"
                }
              ]
            },
            {
              "featureType": "poi",
              "elementType": "geometry",
              "stylers": [
                {
                  "color": "#000000"
                }
              ]
            },
            {
              "featureType": "poi",
              "elementType": "labels.text.fill",
              "stylers": [
                {
                  "color": "#000000"
                }
              ]
            },
            {
              "featureType": "poi.park",
              "elementType": "geometry",
              "stylers": [
                {
                  "color": "#000000"
                }
              ]
            },
            {
              "featureType": "poi.park",
              "elementType": "labels.text.fill",
              "stylers": [
                {
                  "color": "#000000"
                }
              ]
            },
            {
              "featureType": "road",
              "elementType": "geometry",
              "stylers": [
                {
                  "color": "#ffffff"
                }
              ]
            },
            {
              "featureType": "road.arterial",
              "elementType": "labels.text.fill",
              "stylers": [
                {
                  "color": "#ffffff"
                }
              ]
            },
            {
              "featureType": "road.highway",
              "elementType": "geometry",
              "stylers": [
                {
                  "color": "#ffffff"
                }
              ]
            },
            {
              "featureType": "road.highway",
              "elementType": "labels.text.fill",
              "stylers": [
                {
                  "color": "#ffffff"
                }
              ]
            },
            {
              "featureType": "road.local",
              "elementType": "labels.text.fill",
              "stylers": [
                {
                  "color": "#ffffff"
                }
              ]
            },
            {
              "featureType": "transit.line",
              "elementType": "geometry",
              "stylers": [
                {
                  "color": "#ffffff"
                }
              ]
            },
            {
              "featureType": "transit.station",
              "elementType": "geometry",
              "stylers": [
                {
                  "color": "#ffffff"
                }
              ]
            },
            {
              "featureType": "water",
              "elementType": "geometry",
              "stylers": [
                {
                  "color": "#dadada"
                }
              ]
            },
            {
              "featureType": "water",
              "elementType": "labels.text.fill",
              "stylers": [
                {
                  "color": "#bdbdbd"
                }
              ]
            }
          ]
    })
    var africaCoords = [
      {lat: 10, lng: 50},
      {lat: 30, lng: 30},
      {lat: 34.5, lng: 8},
      {lat: 35, lng: -5},
      {lat: 25, lng: -15},
      
      {lat: 10, lng: -15},
      {lat: 5, lng: 10},
      {lat: -35, lng: 20},
      {lat: -35, lng: 30}
    ]
    var greenlandCoords = [
      {lat: 90, lng: -80},
      {lat: 90, lng: -10},
      {lat: 60, lng: -10},
      {lat: 60, lng: -80}
    ]
    var greenland = new google.maps.Polygon({
      paths: greenlandCoords,
      strokeOpacity: 0,
      strokeWeight: 2,
      fillOpacity: 0
    })
    greenland.setMap(map);
    // Construct the polygon.
    var africa = new google.maps.Polygon({
      paths: africaCoords,
      strokeOpacity: 0,
      strokeWeight: 2,
      fillOpacity: 0
    })
    africa.setMap(map);
    google.maps.event.addListener(africa, 'click', function () {
      window.open('https://www.youtube.com/watch?v=FTQbiNvZqaY','_blank')
    })
    google.maps.event.addListener(greenland, 'click', function () {
      changeColor('red')
    })
    loadMarkers()    
  }
  
  function loadMarkers() {
    let legendNodes = document.querySelectorAll('.legend div')
    legendNodes[0].innerHTML = '<span>Show All</span>'
    legendNodes[1].innerHTML = '<img src="markers/'+color+'_1.png"><span>Earth</span>'
    legendNodes[2].innerHTML = '<img src="markers/'+color+'_2.png"><span>Internet</span>'
    legendNodes[3].innerHTML = '<img src="markers/'+color+'_3.png"><span>Other</span>'
    legendNodes[4].innerHTML = '<img src="markers/'+color+'_4.png"><span>Multi</span>'

    for (let i = 0; i < data.length; i++) {
      let item = data[i]
      shape = item.locationType
      if (item.coordinates.length === 1) {
        let marker = new google.maps.Marker({
          position: item.coordinates[0],
          map: map,
          icon: {url: `markers/${color}_${shape}.png`, scaledSize: new google.maps.Size(10, 10)}
        })
        if (shape =='1') {
          dots.push(marker)
        } else if (shape =='2') {
          triangles.push(marker)
        } else if (shape =='3') {
          squares.push(marker)
        }
        interactive(i, item, marker)
      } else if (item.coordinates.length > 1) {
        let marker = new google.maps.Polyline({
          path: item.coordinates,
          geodesic: false,
          strokeColor: accent,
          strokeOpacity: 0.75,
          strokeWeight: 1.5
        })
        marker.setMap(map)
        lines.push(marker)
        interactive(i, item, marker)
      }
    }
    function interactive(i, item, marker) {
      google.maps.event.addListener(marker, 'click', function () {
        titlePopup.innerHTML = item.title
        designerPopup.innerHTML = item.name
        locationPopup.innerHTML = item.location
        mediumPopup.innerHTML = item.medium
        descriptionPopup.innerHTML = item.description
        lastItem = item

        if (item.link != null) {
          for (a = 0; a < item.link.length; a++) {
            let ifr = document.createElement('iframe')
            ifr.src = `${item.link[a]}`
            content.appendChild(ifr)
            if (window.innerWidth < 700) {
              ifr.style.margin = '0'
              ifr.style.marginBottom = '25px'
              ifr.style.width = '100%'
            }
            setSize(ifr)
            if (item.deliverable[1] == "website") {
              showLink.style.display="inline"
              showLink.innerHTML = '<a href="'+item.link+'" target="_blank">Go to Link</a>'
              window.addEventListener('resize', function (){ setSize(ifr)})
            }
          }
        }
        for (let b = 1; b < item.images+1; b++) {
          let img = document.createElement("img")
          if (i == "24") {
            img.src = `images/${i}/${b}.gif`
          } else if (i == "12"){
            img.src = `images/${i}/${b}.png`
          } else {
            img.src = `images/${i}/${b}.jpg`
          }

          if (item.images < 4) {
            img.style.maxWidth = 'calc(100% - 25px)'
          } else if (window.innerWidth < 700) {
            img.style.maxWidth = '100%'
            img.style.margin = '0'
            img.style.marginBottom = '25px'
          } else {
            img.style.maxWidth = 'calc(50% - 25px)'
          }

          content.appendChild(img)
        }
        togglePopup(true)
      })
      google.maps.event.addListener(marker, 'mouseover', function () {
        x=event.clientX;
        y=event.clientY;
        box.style.left = x + 5 + "px"
        box.style.top = y + 5 + "px"
        box.innerHTML = item.name + ", " + item.title
      })
      google.maps.event.addListener(marker, 'mouseout', function () {
        box.style.left = "-50%"
        box.innerHTML = ""
      })
    }
  }

  function formatLocation(item) {
    num = []
    num.push(/\w+\s(\w+)\s\w+/.replace('eins zwei drei'))
    num.push(/\w+\s(\w+)\s\w+/.replace('eins zwei drei'))
    return num
  }

  var countDownDate = new Date("June 5 2020 17:00:00 GMT+0200").getTime()

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

  let launchTime = setInterval(function () {
      distance = distance - 1000
      if (distance < 0) {
        time = true
      } else {
        time = false
      }
  }, 1000)

  function showWeb() {
    document.querySelector("#overlay").style.display = "none"
    clearInterval(launchTime)
    initMap()
  }

  function toggleShow() {
    const showDate = document.querySelector('#show')
    const explore = document.querySelector('#explore')
    if (showDate.style.display === "flex" && time === false) {
      showDate.style.display = "none"
      explore.style.display = "flex"
      explore.style.animation = "fadein 3s normal"
    } else if (time === true) {
      showWeb()
    } else {
      showDate.style.display = "flex"
      showDate.style.animation = "fadein 3s normal"
      explore.style.display = "none"
    }
  }
  function setSize(div) {
    let divWidth = div.offsetWidth
    let divHeight = divWidth * 0.5625
    div.style.height = divHeight+"px"
  }
  function mobile(){
    if (window.innerWidth < 700) {
      const back = document.querySelector('.back')
      back.style.fontSize = "25px"
      back.style.width = "10px"
      back.style.flexGrow = "0"
      popup.style.paddingTop = "100px"
      info.insertBefore(content, info.childNodes[3])
      popup.style.overflowY = "scroll"
      info.insertBefore(buttonPopup, info.childNodes[3])
      info.style.paddingRight = '0'
      info.style.paddingBottom = '0'
      content.style.paddingTop = "30px"
      let nameResize = document.querySelectorAll('.row .name')
      Array.from(nameResize).forEach(name => {
        name.style.maxWidth = '100px'
        name.style.minWidth = '100px'
      })
      index.style.paddingTop = '15px'
      body.style.fontSize = '12px'
      let navItems = document.querySelectorAll('nav span')
      Array.from(navItems).forEach(item => {
        item.style.flexGrow = '1'
        item.style.margin = '5px 5px'
      })
      document.querySelector('#loader').style.top = '50px'
      document.querySelector("#overlay").style.fontSize = "20px"
      legend.style.padding = '5px'
    }
    
  }
  mobile()

  function easter(img) {
    if (img == "fuckshitup") {
      Array.from(body.children).forEach(child => {
        let ifrcolor = document.createElement('iframe')
        ifrcolor.src = 'http://colorshow.online'
        ifrcolor.style.width = "100vw"
        ifrcolor.style.height = "100vh"
        ifrcolor.style.position = "absolute"
        ifrcolor.style.zIndex = "1"
        child.appendChild(ifrcolor)
      })
    } else {
      Array.from(body.children).forEach(child => {
        child.style.backgroundImage = `url(images/${img}.png)`
        console.log(child)
      })
    }
  }
  

  function changeColor(clr) {
    color = clr
    if (clr == 'red') {
      box.style.color = 'var(--accent)'
      box.style.backgroundColor = 'rgba(245,245,255,0.9)'
      const all = document.querySelectorAll('*')
      accent = '#ff3030'
      Array.from(all).forEach(item => {
        item.style.borderRadius = '0'
        item.style.boxShadow = 'none'
      })
      const tabs = document.querySelectorAll('.tab')
      Array.from(tabs).forEach(tab => {
        tab.style.paddingTop = '30px'
      })
      const nav = document.querySelector('nav')
      nav.style.backgroundColor = 'var(--high)'
      nav.style.display = 'flex'
      nav.style.flexBasis = '20vw'
      nav.style.justifyContent = 'flex-start'
      document.querySelector('#map-view').style.flexGrow = '1'
      document.querySelector('#map-view').style.minWidth = '180px'
      document.querySelector('#colophon-view').style.flexGrow = '2'
      document.querySelector('#index-view').style.flexGrow = '3'
      let navItems = document.querySelectorAll('nav span')
      Array.from(navItems).forEach(item => {
        item.style.justifyContent = 'flex-start'
        item.style.flexBasis = '20vw'
        item.style.background = 'none'
      })


      body.style.cssText = "--main: #f5f5ff ;--high:   #fefefe  ; --text:   #909aac  ; --accent:   #ff3030  ;"
      map.setOptions({styles: [
        {
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#f5f5ff"
            }
          ]
        },
        {
          "elementType": "labels.icon",
          "stylers": [
            {
              "visibility": "off"
            }
          ]
        },
        {
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "visibility": "off"
            }
          ]
        },
        {
          "elementType": "labels.text.stroke",
          "stylers": [
            {
              "visibility": "off"
            }
          ]
        },
        {
          "featureType": "administrative.land_parcel",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "visibility": "off"
            }
          ]
        },
        {
          "featureType": "landscape.natural.terrain",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#ffffff"
            }
          ]
        },
        {
          "featureType": "poi",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#eeeeee"
            }
          ]
        },
        {
          "featureType": "poi",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#ff3030"
            }
          ]
        },
        {
          "featureType": "poi.park",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#fffafa"
            }
          ]
        },
        {
          "featureType": "poi.park",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#9e9e9e"
            }
          ]
        },
        {
          "featureType": "road",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#fefefe"
            }
          ]
        },
        {
          "featureType": "road.arterial",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#757575"
            }
          ]
        },
        {
          "featureType": "road.highway",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#eeeeee"
            }
          ]
        },
        {
          "featureType": "road.highway",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#616161"
            }
          ]
        },
        {
          "featureType": "road.local",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#9e9e9e"
            }
          ]
        },
        {
          "featureType": "transit.line",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#e5e5e5"
            }
          ]
        },
        {
          "featureType": "transit.station",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#eeeeee"
            }
          ]
        },
        {
          "featureType": "water",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#d3d3d3"
            }
          ]
        },
        {
          "featureType": "water",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#909090"
            }
          ]
        }
      ]})
    } else if (clr == 'white') {
      body.style.cssText = "--accent: #ffffff"
    }
    loadMarkers()
    
  }
  srvTime()
