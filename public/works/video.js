const video = document.querySelector('iframe')
const aspect = video.width/video.height
let displayHeight = video.offsetHeight
video.height = displayHeight
video.width = displayHeight * aspect
console.log(displayHeight * aspect)